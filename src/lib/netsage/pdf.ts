import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { severityCounts, type AnalysisResult } from "./engine";

const NAVY = [16, 32, 60] as const;
const BLUE = [22, 100, 190] as const;

export function generateReport(analysis: AnalysisResult, resolved: string[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 56;

  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("NETSAGE Security & Compliance Assessment", 40, 46);
  doc.setFontSize(10);
  doc.text("Multi-Vendor Configuration Assessment Platform — Prototype Report", 40, 66);
  y = 120;

  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.setFontSize(13);
  doc.text("Executive Summary", 40, y);
  y += 16;
  doc.setFontSize(10);
  doc.setTextColor(60, 70, 90);
  const counts = severityCounts(analysis.findings);
  const summary = doc.splitTextToSize(
    `Device ${analysis.deviceName} (${analysis.detection.vendorLabel}) was assessed against deterministic security rules and four compliance frameworks. The assessment produced ${analysis.findings.length} findings (${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low) and an overall security score of ${analysis.securityScore}/100 with an aggregate compliance score of ${analysis.complianceScore}%. Remediation guidance is advisory and requires administrator review before deployment. Sample assessment data — hackathon prototype.`,
    W - 80,
  );
  doc.text(summary, 40, y);
  y += summary.length * 13 + 14;

  autoTable(doc, {
    startY: y,
    head: [["Configuration Overview", ""]],
    body: [
      ["Device", analysis.deviceName],
      ["Vendor", `${analysis.detection.vendorLabel} (${analysis.detection.confidence}% confidence)`],
      ["Source file", analysis.fileName],
      ["Security score", `${analysis.securityScore} / 100`],
      ["Compliance score", `${analysis.complianceScore}%`],
      ["Assessment timestamp", new Date(analysis.timestamp).toUTCString()],
    ],
    theme: "grid",
    headStyles: { fillColor: [BLUE[0], BLUE[1], BLUE[2]] },
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [["Framework", "Passed", "Failed", "N/A", "Compliance %"]],
    body: analysis.compliance.map((c) => [
      c.framework,
      String(c.passed),
      String(c.failed),
      String(c.notApplicable),
      `${c.percentage}%`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [BLUE[0], BLUE[1], BLUE[2]] },
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [["Severity Distribution", "Count"]],
    body: [
      ["Critical", String(counts.critical)],
      ["High", String(counts.high)],
      ["Medium", String(counts.medium)],
      ["Low", String(counts.low)],
      ["Resolved (marked by administrator)", String(resolved.length)],
    ],
    theme: "grid",
    headStyles: { fillColor: [NAVY[0], NAVY[1], NAVY[2]] },
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [["ID", "Severity", "Control", "Finding", "Frameworks", "Status"]],
    body: analysis.findings.map((f) => [
      f.id,
      f.severity.toUpperCase(),
      f.control,
      f.description,
      f.frameworks.join(", "),
      resolved.includes(f.id) ? "Resolved" : "Open",
    ]),
    theme: "striped",
    headStyles: { fillColor: [BLUE[0], BLUE[1], BLUE[2]] },
    styles: { fontSize: 8, cellWidth: "wrap" },
    columnStyles: { 3: { cellWidth: 170 } },
  });

  autoTable(doc, {
    head: [["Failed Controls (normalized model)"]],
    body: analysis.normalized.controls
      .filter((c) => c.status !== "valid")
      .map((c) => [`${c.label}: ${c.value}`]),
    theme: "grid",
    headStyles: { fillColor: [180, 60, 40] },
    styles: { fontSize: 9 },
  });

  doc.addPage();
  doc.setFontSize(13);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text("Remediation Recommendations", 40, 50);
  autoTable(doc, {
    startY: 66,
    head: [["ID", "Recommended fix (before → after)"]],
    body: analysis.findings.map((f) => [
      f.id,
      `BEFORE:\n${f.remediation.before}\n\nAFTER:\n${f.remediation.after}`,
    ]),
    theme: "grid",
    headStyles: { fillColor: [110, 70, 200] },
    styles: { fontSize: 8, cellWidth: "wrap" },
    columnStyles: { 1: { cellWidth: 430 } },
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 160);
    doc.text(
      `NETSAGE prototype report — advisory only, not applied to live devices — page ${i}/${pages}`,
      40,
      doc.internal.pageSize.getHeight() - 24,
    );
  }

  doc.save(`NETSAGE-Report-${analysis.deviceName}.pdf`);
}
