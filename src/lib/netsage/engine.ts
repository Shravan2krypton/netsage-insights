import { VENDOR_LABELS, type Vendor } from "./demo-configs";

/**
 * NETSAGE analysis engine (prototype).
 *
 * This module is intentionally deterministic and dependency-free so the
 * demo runs offline. Each stage is a pure function so a real vendor parser,
 * an LLM interpretation service or an external rule database can replace the
 * corresponding function without touching the UI layer.
 */

export type ControlStatus = "valid" | "review" | "failed";
export type Severity = "critical" | "high" | "medium" | "low";
export type Framework = "CIS" | "NIST SP 800-53" | "STIG" | "ISO 27001";

export const FRAMEWORKS: Framework[] = ["CIS", "NIST SP 800-53", "STIG", "ISO 27001"];

export interface VendorDetection {
  vendor: Vendor;
  vendorLabel: string;
  confidence: number;
  signals: string[];
}

export interface NormalizedControl {
  key: string;
  label: string;
  value: string;
  status: ControlStatus;
  evidence?: string;
  aiNote: string;
}

export interface NormalizedModel {
  hostname: string;
  vendor: Vendor;
  controls: NormalizedControl[];
  flags: Record<string, boolean>;
}

export interface Remediation {
  vendor: Vendor;
  before: string;
  after: string;
  explanation: string;
}

export interface Finding {
  id: string;
  severity: Severity;
  control: string;
  description: string;
  frameworks: Framework[];
  frameworkRefs: string[];
  risk: string;
  affectedConfig: string;
  securityImpact: string;
  complianceImpact: string;
  remediation: Remediation;
}

export interface ComplianceResult {
  framework: Framework;
  passed: number;
  failed: number;
  notApplicable: number;
  percentage: number;
  failedControls: string[];
}

export interface AnalysisResult {
  id: string;
  deviceName: string;
  fileName: string;
  detection: VendorDetection;
  raw: string;
  normalized: NormalizedModel;
  findings: Finding[];
  securityScore: number;
  compliance: ComplianceResult[];
  complianceScore: number;
  timestamp: string;
}

/* ------------------------------------------------------------------ */
/* Stage 1 — vendor detection                                          */
/* ------------------------------------------------------------------ */

const VENDOR_SIGNATURES: { vendor: Vendor; patterns: RegExp[]; label: string }[] = [
  {
    vendor: "cisco",
    label: "Cisco IOS",
    patterns: [/^\s*hostname\s+\S+/m, /line vty/i, /transport input/i, /service timestamps/i],
  },
  {
    vendor: "fortinet",
    label: "Fortinet FortiOS",
    patterns: [/config system global/i, /set hostname/i, /config firewall policy/i, /next\s*$/m],
  },
  {
    vendor: "juniper",
    label: "Juniper Junos",
    patterns: [/host-name\s+\S+;/i, /root-authentication/i, /family inet/i, /term\s+\S+\s*\{/i],
  },
  {
    vendor: "paloalto",
    label: "Palo Alto PAN-OS",
    patterns: [/deviceconfig/i, /rulebase/i, /vsys/i, /permitted-ip/i],
  },
];

export function detectVendor(config: string): VendorDetection {
  let best: VendorDetection = {
    vendor: "generic",
    vendorLabel: VENDOR_LABELS.generic,
    confidence: 40,
    signals: ["No vendor-specific syntax markers matched with high confidence"],
  };

  for (const sig of VENDOR_SIGNATURES) {
    const hits = sig.patterns.filter((p) => p.test(config));
    if (hits.length === 0) continue;
    const confidence = Math.min(99, 55 + hits.length * 11);
    if (confidence > best.confidence) {
      best = {
        vendor: sig.vendor,
        vendorLabel: sig.label,
        confidence,
        signals: hits.map((h) => `Matched syntax pattern ${h.source}`),
      };
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Stage 2 — normalization (vendor syntax -> common security model)    */
/* ------------------------------------------------------------------ */

function extractHostname(config: string): string {
  const patterns = [
    /^\s*hostname\s+([\w.-]+)/mi,
    /set hostname\s+"?([\w.-]+)"?/i,
    /host-name\s+([\w.-]+);/i,
    /"hostname"\s*:\s*"([\w.-]+)"/i,
  ];
  for (const p of patterns) {
    const m = config.match(p);
    if (m && m[1]) return m[1];
  }
  return "unknown-device";
}

function firstLine(config: string, re: RegExp): string {
  const m = config.match(re);
  return m ? m[0].trim() : "";
}

export function normalizeConfig(config: string, vendor: Vendor): NormalizedModel {
  const lower = config.toLowerCase();

  const telnetEnabled =
    /transport input .*telnet/i.test(config) ||
    /admin-telnet enable/i.test(config) ||
    /allowaccess[^\n]*telnet/i.test(config) ||
    /^\s*telnet;/m.test(config) ||
    /"disable-telnet"\s*:\s*"no"/i.test(config);

  const sshEnabled =
    /transport input .*ssh/i.test(config) ||
    /allowaccess[^\n]*ssh/i.test(config) ||
    /ssh\s*\{/i.test(config) ||
    /"disable-ssh"\s*:\s*"no"/i.test(config);

  const httpEnabled =
    /ip http server/i.test(config) ||
    /allowaccess[^\n]*\bhttp\b/i.test(config) ||
    /web-management\s*\{[^}]*http;/is.test(config) ||
    /"disable-http"\s*:\s*"no"/i.test(config);

  const loggingConfigured =
    (/logging host/i.test(config) && !/no logging host/i.test(config)) ||
    (/syslog/i.test(config) && !/config log syslogd setting\s*\n\s*set status disable/i.test(config) &&
      !/"syslog"\s*:\s*\{\s*\}/.test(config));

  const ntpConfigured =
    (/ntp server/i.test(config) && !/no ntp server/i.test(config)) ||
    (/ntpsync enable/i.test(config)) ||
    (/"ntp-servers"\s*:\s*\{\s*\}/.test(config) ? false : /ntp-servers/i.test(config) === false ? false : true);

  const permissiveRule =
    /permit ip any any/i.test(config) ||
    (/set srcaddr "all"/i.test(config) && /set action accept/i.test(config)) ||
    /then accept;/i.test(config) ||
    /"action"\s*:\s*"allow"/i.test(lower);

  const weakAuth =
    /no aaa new-model/i.test(config) ||
    /password 0 /i.test(config) ||
    /enable password/i.test(config) ||
    /plain-text-password/i.test(config) ||
    /root-login allow/i.test(config) ||
    /no service password-encryption/i.test(config);

  const weakPasswordPolicy =
    /config system password-policy\s*\n\s*set status disable/i.test(config) ||
    /"password-complexity"\s*:\s*\{\s*"enabled"\s*:\s*"no"\s*\}/i.test(config) ||
    !/password-policy|password-complexity|min-length|security passwords/i.test(config);

  const unusedServices =
    /snmp-server community public/i.test(config) ||
    /community public/i.test(config) ||
    httpEnabled;

  const unrestrictedAdmin =
    /trusthost1 0\.0\.0\.0 0\.0\.0\.0/i.test(config) ||
    /"permitted-ip"\s*:\s*\{\s*\}/.test(config) ||
    (/line vty/i.test(config) && !/access-class/i.test(config)) ||
    /root-login allow/i.test(config);

  const flags = {
    telnetEnabled,
    sshEnabled,
    httpEnabled,
    loggingConfigured,
    ntpConfigured,
    permissiveRule,
    weakAuth,
    weakPasswordPolicy,
    unusedServices,
    unrestrictedAdmin,
  };

  const controls: NormalizedControl[] = [
    {
      key: "hostname",
      label: "Hostname",
      value: extractHostname(config),
      status: "valid",
      evidence: firstLine(config, /^.*host-?name.*$/mi),
      aiNote: "Device identity extracted from vendor syntax.",
    },
    {
      key: "management",
      label: "Management Access",
      value: [telnetEnabled && "telnet", sshEnabled && "ssh", httpEnabled && "http"]
        .filter(Boolean)
        .join(", ") || "none detected",
      status: telnetEnabled || httpEnabled ? "failed" : "valid",
      evidence: firstLine(config, /^.*(transport input|allowaccess|web-management|disable-telnet).*$/mi),
      aiNote: "Mapped vendor management-plane commands to the common access control.",
    },
    {
      key: "authentication",
      label: "Authentication",
      value: weakAuth ? "local, unencrypted / no AAA" : "centralised AAA",
      status: weakAuth ? "failed" : "valid",
      evidence: firstLine(config, /^.*(aaa new-model|plain-text-password|enable password|password 0).*$/mi),
      aiNote: "Authentication intent derived from credential and AAA directives.",
    },
    {
      key: "passwordPolicy",
      label: "Password Policy",
      value: weakPasswordPolicy ? "not enforced" : "enforced",
      status: weakPasswordPolicy ? "failed" : "valid",
      evidence: firstLine(config, /^.*(password-policy|password-complexity).*$/mi),
      aiNote: "Complexity/aging directives normalised to a single policy control.",
    },
    {
      key: "ssh",
      label: "SSH",
      value: sshEnabled ? "enabled" : "disabled",
      status: sshEnabled ? "valid" : "review",
      aiNote: "Secure management transport availability.",
    },
    {
      key: "telnet",
      label: "Telnet",
      value: telnetEnabled ? "enabled" : "disabled",
      status: telnetEnabled ? "failed" : "valid",
      evidence: firstLine(config, /^.*telnet.*$/mi),
      aiNote: "Cleartext management transport detection.",
    },
    {
      key: "logging",
      label: "Logging",
      value: loggingConfigured ? "syslog target configured" : "no remote logging",
      status: loggingConfigured ? "valid" : "failed",
      evidence: firstLine(config, /^.*(logging|syslog).*$/mi),
      aiNote: "Audit logging destination normalised across vendors.",
    },
    {
      key: "ntp",
      label: "NTP",
      value: ntpConfigured ? "time source configured" : "no time synchronisation",
      status: ntpConfigured ? "valid" : "failed",
      evidence: firstLine(config, /^.*ntp.*$/mi),
      aiNote: "Time synchronisation is required for reliable audit trails.",
    },
    {
      key: "acl",
      label: "ACL / Firewall Rules",
      value: permissiveRule ? "overly permissive any/any rule present" : "scoped rules",
      status: permissiveRule ? "failed" : "valid",
      evidence: firstLine(config, /^.*(permit ip any any|set action accept|then accept|"action").*$/mi),
      aiNote: "Vendor rule sets normalised into allow/deny intent.",
    },
    {
      key: "unusedServices",
      label: "Unused Services",
      value: unusedServices ? "http / snmp default community enabled" : "none enabled",
      status: unusedServices ? "review" : "valid",
      evidence: firstLine(config, /^.*(snmp|community public|http server).*$/mi),
      aiNote: "Non-essential services increase the attack surface.",
    },
    {
      key: "adminAccess",
      label: "Administrative Access",
      value: unrestrictedAdmin ? "unrestricted source addresses" : "restricted to trusted hosts",
      status: unrestrictedAdmin ? "failed" : "valid",
      evidence: firstLine(config, /^.*(trusthost|permitted-ip|access-class|root-login).*$/mi),
      aiNote: "Administrative source restriction normalised into one control.",
    },
  ];

  return { hostname: extractHostname(config), vendor, controls, flags };
}

/* ------------------------------------------------------------------ */
/* Stage 3 — deterministic security rules                              */
/* ------------------------------------------------------------------ */

export interface RawFlags {
  telnetEnabled?: boolean;
  weakAuth?: boolean;
  loggingConfigured?: boolean;
  ntpConfigured?: boolean;
  httpEnabled?: boolean;
  permissiveRule?: boolean;
  unusedServices?: boolean;
  unrestrictedAdmin?: boolean;
  weakPasswordPolicy?: boolean;
  sshEnabled?: boolean;
  [key: string]: boolean | undefined;
}

interface Rule {
  id: string;
  when: (f: RawFlags) => boolean;
  severity: Severity;
  control: string;
  description: string;
  frameworks: Framework[];
  frameworkRefs: string[];
  risk: string;
  securityImpact: string;
  complianceImpact: string;
  remediation: Record<Vendor, { before: string; after: string }>;
  evidenceKey: string;
}

const RULES: Rule[] = [
  {
    id: "CFG-001",
    when: (f) => Boolean(f.telnetEnabled),
    severity: "critical",
    control: "Management Access",
    description: "Telnet service enabled on the management plane",
    frameworks: ["CIS", "NIST SP 800-53", "STIG"],
    frameworkRefs: ["CIS 2.1.2", "NIST AC-17(2)", "STIG V-3012"],
    risk: "Telnet transmits credentials and session data in cleartext, allowing trivial interception on any shared network path.",
    securityImpact: "Full administrative takeover of the device following a single passive capture.",
    complianceImpact: "Fails encrypted-remote-access requirements in CIS, NIST AC-17(2) and DISA STIG.",
    evidenceKey: "telnet",
    remediation: {
      cisco: { before: "line vty 0 4\n transport input telnet", after: "line vty 0 4\n transport input ssh" },
      fortinet: { before: "set admin-telnet enable", after: "set admin-telnet disable" },
      juniper: { before: "system services {\n    telnet;\n}", after: "system services {\n    ssh {\n        protocol-version v2;\n    }\n}" },
      paloalto: { before: '"disable-telnet": "no"', after: '"disable-telnet": "yes"' },
      generic: { before: "telnet enabled", after: "telnet disabled; use SSHv2" },
    },
  },
  {
    id: "CFG-002",
    when: (f) => Boolean(f.weakAuth),
    severity: "high",
    control: "Authentication",
    description: "Weak or unencrypted local authentication without centralised AAA",
    frameworks: ["CIS", "NIST SP 800-53", "ISO 27001"],
    frameworkRefs: ["CIS 1.1.1", "NIST IA-5", "ISO A.9.4.3"],
    risk: "Locally stored, unencrypted or shared credentials cannot be rotated or audited centrally.",
    securityImpact: "Credential reuse and offline recovery of device passwords.",
    complianceImpact: "Fails identity and credential management controls (NIST IA-5, ISO A.9.4.3).",
    evidenceKey: "authentication",
    remediation: {
      cisco: { before: "no aaa new-model\nenable password cisco123", after: "aaa new-model\naaa authentication login default group tacacs+ local\nservice password-encryption\nenable secret <STRONG-SECRET>" },
      fortinet: { before: 'set password ENC 1234abcd', after: 'config user radius\n    edit "AAA"\n        set server "10.0.0.10"\n    next\nend' },
      juniper: { before: 'plain-text-password "juniper";', after: "encrypted-password \"$6$<hash>\";\nsystem authentication-order [ tacplus password ];" },
      paloalto: { before: '"authentication-profile": ""', after: '"authentication-profile": "CORP-RADIUS"' },
      generic: { before: "local plaintext credentials", after: "centralised AAA with encrypted credentials" },
    },
  },
  {
    id: "CFG-003",
    when: (f) => !Boolean(f.loggingConfigured),
    severity: "high",
    control: "Logging",
    description: "No remote syslog destination configured",
    frameworks: ["CIS", "NIST SP 800-53", "ISO 27001", "STIG"],
    frameworkRefs: ["CIS 8.2", "NIST AU-6", "ISO A.12.4.1"],
    risk: "Without off-box logging, an attacker can erase local evidence of compromise.",
    securityImpact: "Loss of forensic visibility and detection capability.",
    complianceImpact: "Fails audit record generation and retention requirements.",
    evidenceKey: "logging",
    remediation: {
      cisco: { before: "no logging host", after: "logging host 10.10.20.5\nlogging trap informational" },
      fortinet: { before: "config log syslogd setting\n    set status disable\nend", after: 'config log syslogd setting\n    set status enable\n    set server "10.10.20.5"\nend' },
      juniper: { before: "syslog {\n    file interactive-commands any;\n}", after: "syslog {\n    host 10.10.20.5 {\n        any notice;\n    }\n}" },
      paloalto: { before: '"log-settings": { "syslog": {} }', after: '"log-settings": { "syslog": { "entry": { "@name": "SOC", "server": "10.10.20.5" } } }' },
      generic: { before: "logging disabled", after: "remote syslog target configured" },
    },
  },
  {
    id: "CFG-004",
    when: (f) => !Boolean(f.ntpConfigured),
    severity: "medium",
    control: "Time Synchronisation",
    description: "No NTP time source configured",
    frameworks: ["CIS", "NIST SP 800-53", "STIG"],
    frameworkRefs: ["CIS 2.3", "NIST AU-8", "STIG V-3convert"],
    risk: "Unsynchronised clocks make log correlation across devices unreliable.",
    securityImpact: "Incident timelines cannot be reconstructed accurately.",
    complianceImpact: "Fails time-stamp integrity requirements (NIST AU-8).",
    evidenceKey: "ntp",
    remediation: {
      cisco: { before: "no ntp server", after: "ntp server 10.10.20.10\nntp server 10.10.20.11 prefer" },
      fortinet: { before: "set ntpsync disable", after: "set ntpsync enable\nset server-mode enable" },
      juniper: { before: "# no ntp stanza", after: "system {\n    ntp {\n        server 10.10.20.10;\n    }\n}" },
      paloalto: { before: '"ntp-servers": {}', after: '"ntp-servers": { "primary-ntp-server": { "ntp-server-address": "10.10.20.10" } }' },
      generic: { before: "no time source", after: "two authenticated NTP servers" },
    },
  },
  {
    id: "CFG-005",
    when: (f) => Boolean(f.httpEnabled),
    severity: "high",
    control: "Management Access",
    description: "Unencrypted HTTP management interface enabled",
    frameworks: ["CIS", "STIG", "ISO 27001"],
    frameworkRefs: ["CIS 2.1.1", "STIG V-3014", "ISO A.13.1.1"],
    risk: "The web management plane is reachable over cleartext HTTP.",
    securityImpact: "Session hijacking and credential theft on the management network.",
    complianceImpact: "Fails encrypted management channel requirements.",
    evidenceKey: "management",
    remediation: {
      cisco: { before: "ip http server", after: "no ip http server\nip http secure-server" },
      fortinet: { before: "set allowaccess ping https http ssh telnet", after: "set allowaccess ping https ssh" },
      juniper: { before: "web-management {\n    http;\n}", after: "web-management {\n    https {\n        system-generated-certificate;\n    }\n}" },
      paloalto: { before: '"disable-http": "no"', after: '"disable-http": "yes"' },
      generic: { before: "http management enabled", after: "https only" },
    },
  },
  {
    id: "CFG-006",
    when: (f) => Boolean(f.permissiveRule),
    severity: "critical",
    control: "Access Control",
    description: "Overly permissive any/any allow rule in the policy set",
    frameworks: ["CIS", "NIST SP 800-53", "STIG", "ISO 27001"],
    frameworkRefs: ["CIS 3.1", "NIST SC-7", "ISO A.13.1.3"],
    risk: "A blanket allow rule defeats segmentation and exposes internal services to untrusted networks.",
    securityImpact: "Unrestricted lateral movement and external reachability of internal assets.",
    complianceImpact: "Fails boundary protection controls (NIST SC-7).",
    evidenceKey: "acl",
    remediation: {
      cisco: { before: "ip access-list extended OUTSIDE-IN\n permit ip any any", after: "ip access-list extended OUTSIDE-IN\n permit tcp any host 10.10.10.20 eq 443\n deny ip any any log" },
      fortinet: { before: 'set srcaddr "all"\nset dstaddr "all"\nset service "ALL"', after: 'set srcaddr "TRUSTED-NET"\nset dstaddr "DMZ-WEB"\nset service "HTTPS"' },
      juniper: { before: "term allow-all {\n    then accept;\n}", after: "term allow-mgmt {\n    from { source-address 10.10.20.0/24; }\n    then accept;\n}\nterm default-deny {\n    then { discard; log; }\n}" },
      paloalto: { before: '"action": "allow", "source": ["any"], "destination": ["any"]', after: '"action": "allow", "source": ["TRUSTED-NET"], "destination": ["DMZ-WEB"], "application": ["ssl"]' },
      generic: { before: "allow any any", after: "least-privilege scoped rules + default deny" },
    },
  },
  {
    id: "CFG-007",
    when: (f) => Boolean(f.unusedServices),
    severity: "medium",
    control: "Unused Services",
    description: "Non-essential services enabled (SNMP default community / HTTP)",
    frameworks: ["CIS", "STIG"],
    frameworkRefs: ["CIS 2.2", "STIG V-3210"],
    risk: "Default SNMP communities and unused daemons are commonly abused for reconnaissance.",
    securityImpact: "Device inventory, routing and interface data disclosure.",
    complianceImpact: "Fails least-functionality requirements (NIST CM-7).",
    evidenceKey: "unusedServices",
    remediation: {
      cisco: { before: "snmp-server community public RO", after: "no snmp-server community public RO\nsnmp-server group NETSAGE v3 priv" },
      fortinet: { before: "set allowaccess ping https http ssh telnet", after: "set allowaccess ping https ssh" },
      juniper: { before: "snmp {\n    community public {\n        authorization read-only;\n    }\n}", after: "snmp {\n    v3 {\n        usm { local-engine { user netsage { authentication-sha { ... } } } }\n    }\n}" },
      paloalto: { before: '"snmp-setting": { "version": "v2c", "community": "public" }', after: '"snmp-setting": { "version": "v3" }' },
      generic: { before: "default community / unused daemons", after: "SNMPv3 only, unused services disabled" },
    },
  },
  {
    id: "CFG-008",
    when: (f) => Boolean(f.unrestrictedAdmin),
    severity: "high",
    control: "Administrative Access",
    description: "Administrative access not restricted to trusted source networks",
    frameworks: ["CIS", "NIST SP 800-53", "STIG"],
    frameworkRefs: ["CIS 1.2", "NIST AC-3", "STIG V-3969"],
    risk: "Management sessions can be initiated from any source address, including the internet-facing interface.",
    securityImpact: "Brute-force and credential-stuffing exposure of privileged accounts.",
    complianceImpact: "Fails access enforcement controls (NIST AC-3).",
    evidenceKey: "adminAccess",
    remediation: {
      cisco: { before: "line vty 0 4\n login", after: "ip access-list standard MGMT\n permit 10.10.20.0 0.0.0.255\nline vty 0 4\n access-class MGMT in" },
      fortinet: { before: "set trusthost1 0.0.0.0 0.0.0.0", after: "set trusthost1 10.10.20.0 255.255.255.0" },
      juniper: { before: "ssh {\n    root-login allow;\n}", after: "ssh {\n    root-login deny;\n    connection-limit 5;\n}" },
      paloalto: { before: '"permitted-ip": {}', after: '"permitted-ip": { "entry": [{ "@name": "10.10.20.0/24" }] }' },
      generic: { before: "admin access from any source", after: "management ACL restricted to jump hosts" },
    },
  },
  {
    id: "CFG-009",
    when: (f) => Boolean(f.weakPasswordPolicy),
    severity: "medium",
    control: "Password Policy",
    description: "Password complexity / aging policy not enforced",
    frameworks: ["CIS", "NIST SP 800-53", "ISO 27001"],
    frameworkRefs: ["CIS 1.3", "NIST IA-5(1)", "ISO A.9.4.3"],
    risk: "Short or reused administrative passwords survive indefinitely.",
    securityImpact: "Increased likelihood of successful credential guessing.",
    complianceImpact: "Fails authenticator management (NIST IA-5(1)).",
    evidenceKey: "passwordPolicy",
    remediation: {
      cisco: { before: "! no password policy", after: "security passwords min-length 14\nlogin block-for 300 attempts 3 within 60" },
      fortinet: { before: "config system password-policy\n    set status disable\nend", after: "config system password-policy\n    set status enable\n    set minimum-length 14\n    set expire-day 90\nend" },
      juniper: { before: "# no password stanza", after: "system {\n    login {\n        password { minimum-length 14; change-type character-sets; }\n    }\n}" },
      paloalto: { before: '"password-complexity": { "enabled": "no" }', after: '"password-complexity": { "enabled": "yes", "minimum-length": "14" }' },
      generic: { before: "no password policy", after: "min length 14, rotation, lockout" },
    },
  },
  {
    id: "CFG-010",
    when: (f) => !Boolean(f.sshEnabled),
    severity: "low",
    control: "Management Access",
    description: "No secure SSH management transport detected",
    frameworks: ["CIS", "STIG"],
    frameworkRefs: ["CIS 2.1.3", "STIG V-3013"],
    risk: "Without SSH there is no approved encrypted administration path.",
    securityImpact: "Administrators fall back to insecure transports.",
    complianceImpact: "Fails encrypted remote access requirements.",
    evidenceKey: "ssh",
    remediation: {
      cisco: { before: "! ssh not configured", after: "crypto key generate rsa modulus 2048\nip ssh version 2\nline vty 0 4\n transport input ssh" },
      fortinet: { before: "set allowaccess ping https", after: "set allowaccess ping https ssh" },
      juniper: { before: "# no ssh stanza", after: "system services {\n    ssh { protocol-version v2; }\n}" },
      paloalto: { before: '"disable-ssh": "yes"', after: '"disable-ssh": "no"' },
      generic: { before: "ssh not configured", after: "SSHv2 enabled on management lines" },
    },
  },
];

const SEVERITY_WEIGHT: Record<Severity, number> = { critical: 18, high: 11, medium: 6, low: 3 };

export function computeSecurityScore(findings: Finding[]): number {
  const penalty = findings.reduce((sum, f) => sum + SEVERITY_WEIGHT[f.severity], 0);
  return Math.max(5, 100 - penalty);
}

export function runSecurityRules(model: NormalizedModel): Finding[] {
  return RULES.filter((r) => r.when(model.flags)).map((r) => {
    const control = model.controls.find((c) => c.key === r.evidenceKey);
    const rem = r.remediation[model.vendor] ?? r.remediation.generic;
    return {
      id: r.id,
      severity: r.severity,
      control: r.control,
      description: r.description,
      frameworks: r.frameworks,
      frameworkRefs: r.frameworkRefs,
      risk: r.risk,
      affectedConfig: control?.evidence || `${control?.label ?? r.control}: ${control?.value ?? "n/a"}`,
      securityImpact: r.securityImpact,
      complianceImpact: r.complianceImpact,
      remediation: {
        vendor: model.vendor,
        before: rem.before,
        after: rem.after,
        explanation: r.risk,
      },
    };
  });
}

/* ------------------------------------------------------------------ */
/* Stage 4 — Multi-framework compliance assessment                     */
/* ------------------------------------------------------------------ */

const FRAMEWORK_TOTALS: Record<Framework, number> = {
  CIS: 24,
  "NIST SP 800-53": 38,
  STIG: 32,
  "ISO 27001": 28,
};

const FRAMEWORK_NA: Record<Framework, number> = {
  CIS: 4,
  "NIST SP 800-53": 10,
  STIG: 8,
  "ISO 27001": 6,
};

export function assessCompliance(findings: Finding[]): ComplianceResult[] {
  return FRAMEWORKS.map((framework) => {
    const relevant = findings.filter((f) => f.frameworks.includes(framework));
    const total = FRAMEWORK_TOTALS[framework];
    const notApplicable = FRAMEWORK_NA[framework];
    const applicable = total - notApplicable;
    const failed = relevant.length;
    const passed = Math.max(0, applicable - failed);
    return {
      framework,
      passed,
      failed,
      notApplicable,
      percentage: Math.round((passed / applicable) * 100),
      failedControls: relevant.map(
        (f) => `${f.frameworkRefs.find((r) => framework.startsWith(r.split(" ")[0] ?? "")) ?? f.frameworkRefs[0]} — ${f.description}`,
      ),
    };
  });
}

/* ------------------------------------------------------------------ */
/* Orchestration                                                       */
/* ------------------------------------------------------------------ */

export function analyzeConfiguration(input: {
  raw: string;
  fileName: string;
  vendorHint?: Vendor;
}): AnalysisResult {
  const detection =
    input.vendorHint && input.vendorHint !== "generic"
      ? { ...detectVendor(input.raw), vendor: input.vendorHint, vendorLabel: VENDOR_LABELS[input.vendorHint] }
      : detectVendor(input.raw);
  const normalized = normalizeConfig(input.raw, detection.vendor);
  const findings = runSecurityRules(normalized);
  const compliance = assessCompliance(findings);
  return {
    id: `AN-${Date.now().toString(36).toUpperCase()}`,
    deviceName: normalized.hostname,
    fileName: input.fileName,
    detection,
    raw: input.raw,
    normalized,
    findings,
    securityScore: computeSecurityScore(findings),
    compliance,
    complianceScore: Math.round(compliance.reduce((s, c) => s + c.percentage, 0) / compliance.length),
    timestamp: new Date().toISOString(),
  };
}

export function severityCounts(findings: Finding[]) {
  return {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };
}

export function analyzeConfig(config: string, vendor: Vendor, framework: Framework): AnalysisResult {
  return analyzeConfiguration({
    raw: config,
    fileName: "config.cfg",
    vendorHint: vendor,
  });
}
