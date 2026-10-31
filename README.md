# CISO Executive Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A free, open-source **single-page security dashboard for executive and board reporting**: eight headline KPIs,
NIST CSF 2.0 maturity radar, risk-register trend, incident trend and categories, vulnerability SLA, compliance
programme progress (ISO 27001, ISO 42001, SOC 2, CIS v8, NIST CSF), top risks, roadmap and budget.

No build step, no backend, no tracking: one HTML file, one CSS file, one JS file and **one data file you edit**.
Works from a local folder, GitHub Pages or any static host. Prints cleanly to PDF for the board pack.

> 🇫🇷 Résumé en français en bas de page.

**All figures in the sample are fictional** ("Northwind Logistics"). No real company data is included.

## Live demo

Enable GitHub Pages on this repository (Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`) and the
dashboard is served at `https://<user>.github.io/ciso-executive-dashboard/`.

## Quick start

```bash
git clone https://github.com/bizidwassim-design/ciso-executive-dashboard.git
cd ciso-executive-dashboard
# open index.html in a browser — that's it
```

Then edit **`data/metrics.js`**. Every chart, tile and table is generated from that object; keep the keys and the
arrays' lengths consistent and the page adapts. Nothing else needs to change.

| Section | Data key | What to put there |
|---------|----------|-------------------|
| KPI tiles | `kpis[]` | value, target, quarter-on-quarter trend; set `invert: true` when lower is better |
| CSF maturity radar | `csfMaturity` | 0–4 score per function: current, target, last year |
| Risk register trend | `riskRegister` | open risks per severity at each quarter end |
| Incidents | `incidents` | monthly totals, P1/P2 subset, 12-month split by category |
| Vulnerability SLA | `vulnerabilities` | within SLA / overdue / risk accepted, critical open, mean days to patch |
| Compliance | `compliance[]` | % of controls implemented and evidenced per framework, with a status line |
| Top risks | `topRisks[]` | ID, title, owner, 5×5 score, trend, treatment, due date |
| Roadmap | `initiatives[]` | name, owner, status (`Done` / `On track` / `At risk` / `Behind`), % progress, target quarter |
| Budget | `budget` | planned vs year-to-date spend per category |

Scores use the same Likelihood × Impact bands as the
[Application Risk Assessment Template](https://github.com/bizidwassim-design/application-risk-assessment-template):
Low 1–4, Medium 5–9, High 10–16, Critical 17–25.

## Features

* Light and dark themes (follows the OS, with a manual toggle remembered per browser).
* Responsive from phone to boardroom screen; `Print / PDF` button with print styles.
* Accessible: semantic sections, labelled charts, keyboard-visible focus.
* Only dependency is [Chart.js 4](https://www.chartjs.org/) loaded from cdnjs; fonts from Google Fonts.
  To run fully offline, download `chart.umd.min.js` into `assets/` and change the `<script>` tag.

## Why these metrics

They are the ones an executive committee can act on: *are we getting better (trend), are we where we said we
would be (target), and where do we need a decision (risks, roadmap status, budget)*. Technical volume metrics
(blocked emails, scanned hosts) are deliberately left out.

## Contributing

Ideas for new tiles, better chart defaults, translations and accessibility fixes are welcome — see
[CONTRIBUTING.md](CONTRIBUTING.md). Please keep sample data fictional.

## License

[MIT](LICENSE).

---

## 🇫🇷 Résumé

Tableau de bord **RSSI / direction** open source en une seule page : 8 indicateurs clés, radar de maturité NIST CSF 2.0,
tendance du registre des risques, incidents, SLA de correction des vulnérabilités, avancement des programmes de conformité
(ISO 27001, ISO 42001, SOC 2, CIS v8), risques majeurs, feuille de route et budget. Aucune installation : ouvrez `index.html`,
modifiez `data/metrics.js` avec vos chiffres, publiez sur GitHub Pages. Thèmes clair/sombre, impression PDF.
Toutes les données d'exemple sont fictives. Licence MIT.
