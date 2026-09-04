# NetSage Insights

Build a functional web prototype for an AI-powered Multi-Vendor Network Configuration Security & Compliance Assessment Platform.

The application should demonstrate the complete working journey from configuration upload to security analysis, compliance assessment, remediation recommendations and PDF report generation.

PRODUCT

Name the application:

NETSAGE — Multi-Vendor Configuration Security & Compliance Platform

Build it as a professional enterprise/government cybersecurity dashboard.

1. LOGIN / DASHBOARD

Create a clean authentication screen with:

 Email

 Password

 Login

After login, show the main dashboard.

Dashboard cards:

 Devices Analyzed

 Configurations Processed

 Security Findings

 Compliance Score

 Critical Issues

Add a recent analysis table.

2. CONFIGURATION INGESTION

Create an Upload Configuration page.

Support:

 Cisco

 Fortinet

 Juniper

 Palo Alto

 Generic configuration

Allow upload of:

.txt
.cfg
.conf
.json
.yaml

Also provide Demo Configuration buttons so judges can run the prototype without uploading anything.

Example buttons:

Load Cisco Demo
Load Fortinet Demo
Load Juniper Demo
Load Palo Alto Demo

Show the uploaded configuration in a syntax-highlighted editor/viewer.

3. AI INTERPRETATION

After upload, create an analysis screen.

Show:

Vendor Detection

Configuration Parsing

AI Interpretation

Security Intent Extraction

Animate these steps progressing from pending → processing → completed.

Display a small explanation:

"Vendor-specific commands are being mapped to common security controls."

For the prototype, use deterministic mock data if a real LLM API is unavailable.

Structure the application so a real LLM API can later replace the mock AI layer.

4. NORMALIZATION

Display:

Original Vendor Configuration

→

Normalized Security Model

Show normalized fields such as:

 Hostname

 Management Access

 Authentication

 Password Policy

 SSH

 Telnet

 Logging

 NTP

 ACL / Firewall Rules

 Unused Services

 Administrative Access

Show each normalized control with status:

✓ Valid
⚠ Needs Review
✕ Failed

5. SECURITY ANALYSIS

Create a security analysis page.

Run deterministic security rules against the normalized configuration.

Example rules:

 Telnet enabled

 Weak authentication configuration

 Missing logging

 Missing NTP

 Insecure management access

 Overly permissive access rule

 Unused service enabled

 Missing access-control restriction

Assign severity:

Low
Medium
High
Critical

Show a security score from 0–100.

6. COMPLIANCE ENGINE

Create a compliance page.

Framework tabs:

CIS
NIST SP 800-53
STIG
ISO 27001

Display:

Passed Controls
Failed Controls
Not Applicable
Compliance Percentage

Include a visual compliance score.

Example:

CIS — 82%

NIST — 76%

STIG — 71%

ISO 27001 — 88%

These are demo values and should be clearly treated as prototype/sample assessment results.

7. CURRENT CONFIGURATION OVERVIEW

Create a security posture dashboard containing:

 Overall Security Score

 Compliance Score

 Critical Findings

 High Findings

 Medium Findings

 Low Findings

 Passed Controls

 Failed Controls

Include charts and clean visual indicators.

8. FINDINGS

Create a findings table.

Columns:

Finding ID | Severity | Control | Description | Framework | Status

Example:

CFG-001 | Critical | Management Access | Telnet service enabled | CIS | Open

Clicking a finding opens a detailed panel.

Show:

 Why it is risky

 Affected configuration

 Security impact

 Compliance impact

 Recommended remediation

9. AI-ASSISTED REMEDIATION

For each finding provide:

Recommended Fix

Vendor

Before

After

Example:

Before:

transport input telnet

After:

transport input ssh

Include:

Copy Remediation

Mark as Resolved

The remediation should be presented as a recommendation requiring administrator review rather than automatically modifying a real device.

10. REPORT GENERATION

Create a Generate Security Report button.

Generate a professional PDF containing:

 Executive Summary

 Configuration Overview

 Security Score

 Compliance Scores

 Findings

 Severity Distribution

 Failed Controls

 Remediation Recommendations

 Assessment Timestamp

Add:

Download PDF Report

11. AUDIT TRAIL

Add an Audit Log page showing:

 User

 Action

 Timestamp

 Configuration

 Result

Example:

Admin | Configuration Uploaded | Cisco-Router-01 | 10:42

Admin | Security Scan Completed | Cisco-Router-01 | 10:43

Admin | Report Generated | Cisco-Router-01 | 10:45

DESIGN

Use a polished enterprise cybersecurity interface.

Visual language:

 clean light background

 dark navy typography

 blue/cyan primary accents

 purple for AI

 green for passed controls

 amber for warnings

 red for critical findings

Use a persistent left sidebar:

Dashboard

Configurations

AI Analysis

Security

Compliance

Findings

Remediation

Reports

Audit Logs

MOST IMPORTANT DEMO FLOW

Make this complete workflow work end-to-end:

Load Demo Configuration

↓

Detect Vendor

↓

AI Interpretation

↓

Normalize

↓

Security Validation

↓

Compliance Assessment

↓

Current Security Posture

↓

Findings

↓

Remediation

↓

Generate PDF Report

Every stage must visibly produce an output that is consumed by the next stage.

PROTOTYPE REQUIREMENT

This is a hackathon demonstration prototype, not a production network-management system.

Do NOT connect to or modify real routers/firewalls.

Use realistic sample configuration files and deterministic demo analysis data.

Keep the architecture modular so real vendor configuration parsers, LLM APIs and security rule databases can be integrated later.

The prototype must prioritize:

functional workflow + believable cybersecurity analysis + strong visual presentation + working demo interactions

over unnecessary enterprise complexity.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/38090b27-9a25-467d-bd54-418fb04dbdb0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
