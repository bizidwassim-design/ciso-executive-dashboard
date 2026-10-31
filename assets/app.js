/* CISO Executive Dashboard — rendering logic. Reads window.DASHBOARD_DATA (data/metrics.js). */
(function () {
  "use strict";
  const D = window.DASHBOARD_DATA;
  if (!D) { document.body.innerHTML = "<p style='padding:2rem'>data/metrics.js not loaded.</p>"; return; }

  // ---------- theme ----------
  const root = document.documentElement;
  const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
  const themeBtn = document.getElementById("themeToggle");
  function currentTheme() {
    const explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("ciso-dash-theme", next); } catch (_) {}
    renderAll();
  });
  try { const saved = localStorage.getItem("ciso-dash-theme"); if (saved) root.setAttribute("data-theme", saved); } catch (_) {}
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { maximumFractionDigits: 1 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const band = (score) => score >= 17 ? "critical" : score >= 10 ? "high" : score >= 5 ? "medium" : "low";
  const statusClass = (s) => ({ "Done": "good", "On track": "good", "At risk": "warn", "Behind": "bad" }[s] || "accent");

  // ---------- header ----------
  $("org").textContent = D.organisation;
  $("period").textContent = `${D.period} · reported ${D.reportDate} · ${D.preparedBy}`;

  // ---------- KPIs ----------
  function kpiColor(k) {
    const good = k.invert ? k.value <= k.target : k.value >= k.target;
    const near = k.invert ? k.value <= k.target * 1.5 : k.value >= k.target * 0.85;
    return good ? css("--good") : near ? css("--warn") : css("--bad");
  }
  function renderKpis() {
    $("kpis").innerHTML = D.kpis.map((k) => {
      const improving = k.invert ? k.trend <= 0 : k.trend >= 0;
      const pct = k.invert ? Math.max(0, Math.min(100, (k.target / Math.max(k.value, 0.01)) * 100))
                           : Math.max(0, Math.min(100, (k.value / k.target) * 100));
      const sign = k.trend > 0 ? "+" : "";
      return `<div class="kpi" style="--kpi-color:${kpiColor(k)}">
        <div class="label">${esc(k.label)}</div>
        <div class="value">${fmt(k.value)}<small>${esc(k.unit)}</small></div>
        <div class="bar"><span style="width:${pct.toFixed(0)}%"></span></div>
        <div class="foot"><span>Target ${fmt(k.target)}${esc(k.unit)}</span><span class="delta ${improving ? "up" : "down"}">${sign}${fmt(k.trend)}${esc(k.unit)} vs last qtr</span></div>
        <div class="note">${esc(k.note)}</div>
      </div>`;
    }).join("");
  }

  // ---------- charts ----------
  const charts = {};
  function mk(id, config) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart($(id).getContext("2d"), config);
  }
  function baseOpts(extra) {
    Chart.defaults.color = css("--chart-text");
    Chart.defaults.borderColor = css("--chart-grid");
    Chart.defaults.font.family = css("--font-body");
    return Object.assign({ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { boxWidth: 12, usePointStyle: true } } } }, extra || {});
  }
  function renderCharts() {
    const accent = css("--accent"), good = css("--good"), warn = css("--warn"), bad = css("--bad"), muted = css("--muted");

    mk("csfChart", {
      type: "radar",
      data: {
        labels: D.csfMaturity.functions,
        datasets: [
          { label: "Current", data: D.csfMaturity.current, borderColor: accent, backgroundColor: accent + "33", pointBackgroundColor: accent, borderWidth: 2 },
          { label: "Target", data: D.csfMaturity.target, borderColor: good, backgroundColor: "transparent", borderDash: [6, 4], pointBackgroundColor: good, borderWidth: 2 },
          { label: "Last year", data: D.csfMaturity.lastYear, borderColor: muted, backgroundColor: "transparent", pointBackgroundColor: muted, borderWidth: 1 },
        ],
      },
      options: baseOpts({ scales: { r: { min: 0, max: 4, ticks: { stepSize: 1, backdropColor: "transparent" }, grid: { color: css("--chart-grid") }, angleLines: { color: css("--chart-grid") }, pointLabels: { font: { weight: "600" } } } } }),
    });

    mk("riskChart", {
      type: "bar",
      data: {
        labels: D.riskRegister.quarters,
        datasets: [
          { label: "Critical", data: D.riskRegister.critical, backgroundColor: "#b42323" },
          { label: "High", data: D.riskRegister.high, backgroundColor: "#d9731a" },
          { label: "Medium", data: D.riskRegister.medium, backgroundColor: "#c9a227" },
          { label: "Low", data: D.riskRegister.low, backgroundColor: "#3a8f5c" },
        ],
      },
      options: baseOpts({ scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, title: { display: true, text: "Open risks" } } } }),
    });

    mk("incidentChart", {
      type: "line",
      data: {
        labels: D.incidents.months,
        datasets: [
          { label: "All incidents", data: D.incidents.total, borderColor: accent, backgroundColor: accent + "22", fill: true, tension: 0.3, pointRadius: 3 },
          { label: "P1 / P2", data: D.incidents.major, borderColor: bad, backgroundColor: "transparent", tension: 0.3, pointRadius: 3 },
        ],
      },
      options: baseOpts({ scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } } }),
    });

    const cats = Object.keys(D.incidents.byCategory);
    mk("categoryChart", {
      type: "doughnut",
      data: { labels: cats, datasets: [{ data: cats.map((c) => D.incidents.byCategory[c]), backgroundColor: [accent, bad, warn, "#7a5fb0", "#2a9d8f", muted], borderColor: css("--surface"), borderWidth: 2 }] },
      options: baseOpts({ cutout: "58%", plugins: { legend: { position: "right", labels: { boxWidth: 10, usePointStyle: true } } } }),
    });

    const v = D.vulnerabilities;
    mk("vulnChart", {
      type: "doughnut",
      data: { labels: ["Within SLA", "Overdue", "Risk accepted"], datasets: [{ data: [v.withinSla, v.overdue, v.riskAccepted], backgroundColor: [good, bad, muted], borderColor: css("--surface"), borderWidth: 2 }] },
      options: baseOpts({ cutout: "62%", plugins: { legend: { position: "bottom" } } }),
    });
    $("vulnCenter").innerHTML = `<strong>${fmt(v.withinSla + v.overdue + v.riskAccepted)}</strong><span>open findings</span>`;
    $("vulnFacts").innerHTML = `<li><strong>${v.criticalOpen}</strong> critical findings open</li><li><strong>${v.meanDaysToPatchCritical} days</strong> mean time to patch critical (SLA 14)</li><li><strong>${Math.round(100 * v.withinSla / (v.withinSla + v.overdue))}%</strong> of findings within SLA</li>`;

    mk("complianceChart", {
      type: "bar",
      data: {
        labels: D.compliance.map((c) => c.framework),
        datasets: [{ label: "Controls implemented & evidenced", data: D.compliance.map((c) => c.progress), backgroundColor: D.compliance.map((c) => c.progress >= 80 ? good : c.progress >= 60 ? accent : warn), borderRadius: 4 }],
      },
      options: baseOpts({ indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x}% — ${D.compliance[ctx.dataIndex].status}` } } }, scales: { x: { min: 0, max: 100, ticks: { callback: (val) => val + "%" } }, y: { grid: { display: false } } } }),
    });

    mk("budgetChart", {
      type: "bar",
      data: {
        labels: D.budget.categories,
        datasets: [
          { label: "Planned", data: D.budget.planned, backgroundColor: css("--surface-2"), borderColor: muted, borderWidth: 1, borderRadius: 4 },
          { label: "Spent (YTD)", data: D.budget.spent, backgroundColor: accent, borderRadius: 4 },
        ],
      },
      options: baseOpts({ scales: { x: { grid: { display: false } }, y: { beginAtZero: true, title: { display: true, text: "k" } } } }),
    });
    $("budgetNote").textContent = `${D.budget.note} · ${Math.round(100 * D.budget.spent.reduce((a, b) => a + b, 0) / D.budget.planned.reduce((a, b) => a + b, 0))}% of annual plan consumed`;
  }

  // ---------- tables ----------
  function renderTables() {
    $("riskRows").innerHTML = D.topRisks.map((r) => `<tr>
      <td class="num">${esc(r.id)}</td>
      <td>${esc(r.title)}</td>
      <td>${esc(r.owner)}</td>
      <td class="num"><span class="score ${band(r.score)}">${r.score}</span></td>
      <td class="trend ${esc(r.trend)}">${r.trend === "up" ? "▲ rising" : r.trend === "down" ? "▼ falling" : "■ stable"}</td>
      <td>${esc(r.treatment)}</td>
      <td class="num">${esc(r.due)}</td>
    </tr>`).join("");

    $("initRows").innerHTML = D.initiatives.map((i) => `<tr>
      <td>${esc(i.name)}</td>
      <td>${esc(i.owner)}</td>
      <td><span class="pill ${statusClass(i.status)}">${esc(i.status)}</span></td>
      <td><div class="progress" title="${i.progress}%"><span style="width:${i.progress}%"></span></div></td>
      <td class="num">${i.progress}%</td>
      <td class="num">${esc(i.quarter)}</td>
    </tr>`).join("");
  }

  function renderAll() { renderKpis(); renderCharts(); renderTables(); }
  renderAll();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!root.getAttribute("data-theme")) renderAll(); });
})();
