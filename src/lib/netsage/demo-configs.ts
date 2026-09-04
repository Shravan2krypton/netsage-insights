export type Vendor = "cisco" | "fortinet" | "juniper" | "paloalto" | "generic";

export const VENDOR_LABELS: Record<Vendor, string> = {
  cisco: "Cisco IOS",
  fortinet: "Fortinet FortiOS",
  juniper: "Juniper Junos",
  paloalto: "Palo Alto PAN-OS",
  generic: "Generic Device",
};

export interface DemoConfig {
  vendor: Vendor;
  deviceName: string;
  fileName: string;
  content: string;
}

export const DEMO_CONFIGS: Record<Exclude<Vendor, "generic">, DemoConfig> = {
  cisco: {
    vendor: "cisco",
    deviceName: "Cisco-Router-01",
    fileName: "cisco-router-01.cfg",
    content: `!
! Last configuration change at 09:12:44 UTC
version 15.2
service timestamps debug datetime msec
no service password-encryption
!
hostname Cisco-Router-01
!
enable password cisco123
!
username admin privilege 15 password 0 admin
!
no aaa new-model
!
ip domain-name corp.local
ip http server
ip http secure-server
!
interface GigabitEthernet0/0
 description WAN-UPLINK
 ip address 203.0.113.4 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/1
 description LAN-CORE
 ip address 10.10.10.1 255.255.255.0
 no shutdown
!
ip access-list extended OUTSIDE-IN
 permit ip any any
!
snmp-server community public RO
!
line con 0
 password cisco
 login
line vty 0 4
 password cisco
 login
 transport input telnet
!
no logging host
no ntp server
!
end`,
  },
  fortinet: {
    vendor: "fortinet",
    deviceName: "FortiGate-Edge-02",
    fileName: "fortigate-edge-02.conf",
    content: `#config-version=FGT60E-6.4.8
config system global
    set hostname "FortiGate-Edge-02"
    set admin-https-redirect disable
    set admintimeout 480
    set admin-telnet enable
end
config system admin
    edit "admin"
        set accprofile "super_admin"
        set password ENC 1234abcd
        set trusthost1 0.0.0.0 0.0.0.0
    next
end
config system password-policy
    set status disable
end
config system interface
    edit "wan1"
        set ip 198.51.100.9 255.255.255.0
        set allowaccess ping https http ssh telnet
    next
end
config firewall policy
    edit 1
        set name "ANY-ANY"
        set srcintf "wan1"
        set dstintf "internal"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set service "ALL"
        set logtraffic disable
    next
end
config log syslogd setting
    set status disable
end
config system ntp
    set ntpsync disable
end`,
  },
  juniper: {
    vendor: "juniper",
    deviceName: "Juniper-MX-03",
    fileName: "juniper-mx-03.conf",
    content: `system {
    host-name Juniper-MX-03;
    root-authentication {
        encrypted-password "$1$demoHash";
    }
    login {
        user netadmin {
            class super-user;
            authentication {
                plain-text-password "juniper";
            }
        }
    }
    services {
        ssh {
            root-login allow;
        }
        telnet;
        web-management {
            http;
        }
    }
    syslog {
        file interactive-commands any;
    }
}
interfaces {
    ge-0/0/0 {
        unit 0 {
            family inet {
                address 192.0.2.10/24;
            }
        }
    }
}
firewall {
    filter PROTECT-RE {
        term allow-all {
            then accept;
        }
    }
}
snmp {
    community public {
        authorization read-only;
    }
}`,
  },
  paloalto: {
    vendor: "paloalto",
    deviceName: "PaloAlto-PA850-04",
    fileName: "paloalto-pa850-04.json",
    content: `{
  "devices": {
    "entry": {
      "deviceconfig": {
        "system": {
          "hostname": "PaloAlto-PA850-04",
          "ip-address": "10.20.30.5",
          "service": {
            "disable-telnet": "no",
            "disable-http": "no",
            "disable-ssh": "no"
          },
          "permitted-ip": {},
          "login-banner": "",
          "ntp-servers": {}
        },
        "password-complexity": { "enabled": "no" }
      },
      "vsys": {
        "entry": {
          "rulebase": {
            "security": {
              "rules": {
                "entry": [
                  {
                    "@name": "allow-any",
                    "from": ["any"],
                    "to": ["any"],
                    "source": ["any"],
                    "destination": ["any"],
                    "application": ["any"],
                    "service": ["any"],
                    "action": "allow",
                    "log-end": "no"
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  "shared": { "log-settings": { "syslog": {} } }
}`,
  },
};
