/*
 * CISO Executive Dashboard — data file.
 *
 * ALL FIGURES BELOW ARE FICTIONAL and describe an imaginary mid-sized company ("Northwind Logistics").
 * Replace them with your own numbers: this is the only file you need to edit to reuse the dashboard.
 * Keep the structure (keys and array lengths) and the charts will adapt automatically.
 */
window.DASHBOARD_DATA = {
  organisation: "Northwind Logistics (fictional)",
  period: "Q3 2026",
  reportDate: "2026-10-31",
  preparedBy: "Office of the CISO",

  // Headline KPIs. `trend` is the change versus the previous quarter (positive = improving unless `invert` is set).
  kpis: [
    { id: "posture", label: "Security posture score", value: 71, unit: "/100", target: 80, trend: +4, note: "Weighted NIST CSF 2.0 self-assessment" },
    { id: "critical", label: "Open critical risks", value: 3, unit: "", target: 0, trend: -2, invert: true, note: "Risk register, score ≥ 17" },
    { id: "mttd", label: "Mean time to detect", value: 6.5, unit: "h", target: 4, trend: -2.1, invert: true, note: "SOC-confirmed incidents" },
    { id: "mttr", label: "Mean time to respond", value: 19, unit: "h", target: 12, trend: -5, invert: true, note: "Containment, P1/P2" },
    { id: "patch", label: "Critical patches in SLA", value: 88, unit: "%", target: 95, trend: +6, note: "CVSS ≥ 9 patched within 14 days" },
    { id: "mfa", label: "MFA coverage", value: 96, unit: "%", target: 100, trend: +3, note: "All workforce accounts" },
    { id: "phish", label: "Phishing click rate", value: 4.2, unit: "%", target: 3, trend: -1.3, invert: true, note: "Quarterly simulation, 1 240 users" },
    { id: "vendors", label: "High-risk vendors assessed", value: 82, unit: "%", target: 100, trend: +12, note: "Tier-1 suppliers with a current review" },
  ],

  // NIST CSF 2.0 maturity, 0–4 scale (0 = not performed, 4 = optimised).
  csfMaturity: {
    functions: ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"],
    current: [2.4, 2.8, 3.1, 2.6, 2.3, 1.9],
    target: [3.5, 3.5, 3.5, 3.5, 3.0, 3.0],
    lastYear: [1.8, 2.3, 2.7, 2.0, 1.9, 1.5],
  },

  // Open risks by severity at the end of each quarter.
  riskRegister: {
    quarters: ["Q4 25", "Q1 26", "Q2 26", "Q3 26"],
    critical: [7, 6, 5, 3],
    high: [14, 15, 12, 11],
    medium: [22, 24, 25, 23],
    low: [9, 11, 13, 15],
  },

  // Security incidents per month (confirmed, all severities) and the subset rated P1/P2.
  incidents: {
    months: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    total: [9, 7, 11, 8, 10, 6, 9, 12, 7, 8, 5, 6],
    major: [2, 1, 3, 1, 2, 0, 1, 3, 1, 1, 0, 1],
    byCategory: { "Phishing / BEC": 38, "Malware": 17, "Lost or stolen device": 12, "Misconfiguration": 15, "Third-party": 9, "Insider / policy": 7 },
  },

  // Vulnerability management: open findings by SLA status.
  vulnerabilities: {
    withinSla: 412,
    overdue: 57,
    riskAccepted: 23,
    criticalOpen: 4,
    meanDaysToPatchCritical: 11,
  },

  // Compliance programme progress (% of controls implemented and evidenced).
  compliance: [
    { framework: "ISO/IEC 27001:2022", progress: 84, controls: 93, status: "Surveillance audit Dec 2026" },
    { framework: "ISO/IEC 42001:2023 (AI)", progress: 46, controls: 38, status: "Gap assessment done, implementation in progress" },
    { framework: "SOC 2 Type II", progress: 72, controls: 61, status: "Observation period started" },
    { framework: "CIS Controls v8 (IG2)", progress: 79, controls: 74, status: "Self-assessed" },
    { framework: "NIST CSF 2.0", progress: 68, controls: 106, status: "Target profile defined" },
  ],

  // Top risks presented to the executive committee.
  topRisks: [
    { id: "R-07", title: "Ransomware via unpatched edge VPN appliance", owner: "Head of Infrastructure", score: 20, trend: "down", treatment: "Mitigate — patch cadence 7 days, MFA on VPN, EDR on servers", due: "2026-11-30" },
    { id: "R-12", title: "Business email compromise of finance staff", owner: "CFO", score: 16, trend: "flat", treatment: "Mitigate — payment call-back procedure, DMARC reject, awareness", due: "2026-12-15" },
    { id: "R-19", title: "Sensitive data pasted into public generative-AI tools", owner: "CIO", score: 15, trend: "up", treatment: "Mitigate — approved AI platform, DLP policy, ISO 42001 controls", due: "2027-01-31" },
    { id: "R-03", title: "Single logistics SaaS provider with no exit plan", owner: "COO", score: 12, trend: "flat", treatment: "Transfer / mitigate — contract review, data export tested", due: "2027-02-28" },
    { id: "R-22", title: "Shadow OT devices on warehouse network", owner: "Head of Operations", score: 12, trend: "down", treatment: "Mitigate — network segmentation, asset discovery", due: "2026-12-31" },
  ],

  // Programme roadmap presented to the board.
  initiatives: [
    { name: "Zero-trust remote access (replace VPN)", owner: "Infrastructure", status: "On track", progress: 65, quarter: "Q4 2026" },
    { name: "ISO 42001 AI management system", owner: "CISO / Legal", status: "At risk", progress: 40, quarter: "Q2 2027" },
    { name: "24×7 managed detection & response", owner: "SOC", status: "Done", progress: 100, quarter: "Q3 2026" },
    { name: "Backup immutability & recovery drills", owner: "Infrastructure", status: "On track", progress: 80, quarter: "Q4 2026" },
    { name: "Third-party risk programme (tier-1 vendors)", owner: "Procurement / GRC", status: "Behind", progress: 35, quarter: "Q1 2027" },
    { name: "Security awareness — role-based training", owner: "HR / GRC", status: "On track", progress: 55, quarter: "Q1 2027" },
  ],

  // Budget, in thousands (any currency).
  budget: {
    categories: ["People", "Tooling", "Managed services", "Audit & compliance", "Training"],
    planned: [820, 460, 390, 120, 60],
    spent: [610, 395, 310, 95, 32],
    note: "Year-to-date spend versus annual plan (k)",
  },
};
