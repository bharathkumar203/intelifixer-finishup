const patterns = [
  {
    category: "Missing configuration",
    severity: "high",
    confidence: 92,
    tests: [/file not found/i, /config file .*not found/i, /no such file/i],
    action: "Check the generated workspace, mounted config path, and run input. Re-run after confirming the referenced file exists."
  },
  {
    category: "Provisioning or lab reservation",
    severity: "high",
    confidence: 88,
    tests: [/could not find console details/i, /reservation/i, /provision stage failed/i, /device .*not found/i],
    action: "Verify inventory, console mapping, reservation health, and lab ownership before retrying."
  },
  {
    category: "Timeout",
    severity: "medium",
    confidence: 80,
    tests: [/timed out/i, /timeout/i, /health check timed out/i],
    action: "Compare runtime with recent passing runs, inspect service readiness, and increase timeout only after checking startup regressions."
  },
  {
    category: "Script failure",
    severity: "medium",
    confidence: 72,
    tests: [/script returned exit code/i, /runtimeerror/i, /valueerror/i, /traceback/i],
    action: "Open the failing script section, reproduce with the same input, and check recent changes around the failing stack."
  },
  {
    category: "Permission or lock issue",
    severity: "medium",
    confidence: 78,
    tests: [/permission denied/i, /lock/i, /access denied/i],
    action: "Check stale locks, filesystem ownership, and whether another run is using the same workspace."
  },
  {
    category: "Network or disconnect",
    severity: "medium",
    confidence: 74,
    tests: [/connection closed/i, /broken pipe/i, /could not resolve/i, /dns/i],
    action: "Check resolver, route, and remote endpoint reachability, then retry only after confirming the path is stable."
  }
];

const elements = {
  analyze: document.querySelector("#analyze"),
  batchInput: document.querySelector("#batchInput"),
  clear: document.querySelector("#clear"),
  copyReport: document.querySelector("#copyReport"),
  emptyState: document.querySelector("#emptyState"),
  highCount: document.querySelector("#highCount"),
  loadSample: document.querySelector("#loadSample"),
  logInput: document.querySelector("#logInput"),
  report: document.querySelector("#report"),
  reportPanel: document.querySelector("#reportPanel"),
  results: document.querySelector("#results"),
  runCount: document.querySelector("#runCount"),
  segments: [...document.querySelectorAll(".segment")],
  stageInput: document.querySelector("#stageInput"),
  topCategory: document.querySelector("#topCategory"),
  template: document.querySelector("#resultTemplate")
};

let mode = "single";
let lastResults = [];

elements.segments.forEach((segment) => {
  segment.addEventListener("click", () => setMode(segment.dataset.mode));
});

elements.analyze.addEventListener("click", () => {
  const runs = mode === "single" ? getSingleRun() : getBatchRuns();
  renderResults(runs.map(analyzeRun));
});

elements.loadSample.addEventListener("click", loadSampleRuns);

if (new URLSearchParams(window.location.search).get("demo") === "sample") {
  loadSampleRuns();
}

async function loadSampleRuns() {
  const response = await fetch("data/sample-runs.json");
  const runs = await response.json();
  if (mode === "single") {
    elements.logInput.value = runs[0].log;
    elements.stageInput.value = JSON.stringify(runs[0].stageStatus, null, 2);
  } else {
    elements.batchInput.value = JSON.stringify(runs, null, 2);
  }
  renderResults(runs.map(analyzeRun));
}

elements.clear.addEventListener("click", () => {
  elements.logInput.value = "";
  elements.stageInput.value = "";
  elements.batchInput.value = "";
  renderResults([]);
});

elements.copyReport.addEventListener("click", async () => {
  await navigator.clipboard.writeText(elements.report.textContent);
  elements.copyReport.textContent = "Copied";
  window.setTimeout(() => {
    elements.copyReport.textContent = "Copy";
  }, 1200);
});

function setMode(nextMode) {
  mode = nextMode;
  elements.segments.forEach((segment) => {
    segment.classList.toggle("active", segment.dataset.mode === mode);
  });
  const isBatch = mode === "batch";
  elements.logInput.hidden = isBatch;
  elements.stageInput.hidden = isBatch;
  elements.batchInput.hidden = !isBatch;
  document.querySelector('label[for="logInput"]').hidden = isBatch;
  document.querySelector('label[for="stageInput"]').hidden = isBatch;
  document.querySelector('label[for="batchInput"]').hidden = !isBatch;
  renderResults([]);
}

function getSingleRun() {
  return [
    {
      id: "manual-run",
      name: "Manual run",
      log: elements.logInput.value.trim(),
      stageStatus: parseJson(elements.stageInput.value.trim(), {})
    }
  ].filter((run) => run.log || Object.keys(run.stageStatus).length > 0);
}

function getBatchRuns() {
  const parsed = parseJson(elements.batchInput.value.trim(), []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.map((run, index) => ({
    id: run.id || `batch-${index + 1}`,
    name: run.name || run.id || `Batch run ${index + 1}`,
    owner: run.owner || "unknown",
    log: run.log || "",
    stageStatus: run.stageStatus || {}
  }));
}

function parseJson(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function analyzeRun(run) {
  const log = run.log || "";
  const evidence = extractEvidence(log);
  const matches = patterns
    .map((pattern) => ({
      ...pattern,
      hits: pattern.tests.reduce((count, test) => count + (test.test(log) ? 1 : 0), 0)
    }))
    .filter((pattern) => pattern.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.confidence - a.confidence);

  const best = matches[0] || {
    category: "Unknown failure",
    severity: evidence.length > 0 ? "low" : "medium",
    confidence: evidence.length > 0 ? 45 : 20,
    action: "Review the first ERROR or failed stage and add a new detection pattern if this recurs."
  };

  return {
    id: run.id || "run",
    name: run.name || run.id || "Run",
    owner: run.owner || "unknown",
    category: best.category,
    severity: best.severity,
    confidence: Math.min(99, best.confidence + Math.max(0, (best.hits || 0) - 1) * 3),
    stage: inferStage(run.stageStatus, log),
    action: best.action,
    evidence: evidence.slice(0, 5)
  };
}

function extractEvidence(log) {
  const lines = log.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const important = lines.filter((line) => /error|failed|exception|timeout|denied|traceback|exit code/i.test(line));
  return (important.length > 0 ? important : lines.slice(-4)).slice(0, 6);
}

function inferStage(stageStatus, log) {
  const failedStage = Object.entries(stageStatus || {}).find(([, status]) => {
    return String(status).toLowerCase() !== "success" && String(status).toLowerCase() !== "skipped";
  });
  if (failedStage) {
    return failedStage[0];
  }
  const stageMatch = log.match(/stage ["']?([A-Za-z0-9_ -]+)["']? (failed|skipped)/i);
  return stageMatch ? stageMatch[1].trim() : "Unknown";
}

function renderResults(results) {
  lastResults = results;
  elements.results.replaceChildren();
  elements.emptyState.hidden = results.length > 0;
  elements.results.hidden = results.length === 0;
  elements.reportPanel.hidden = results.length === 0;

  results.forEach((result) => {
    const node = elements.template.content.cloneNode(true);
    node.querySelector(".result-title").textContent = result.name;
    node.querySelector(".result-subtitle").textContent = `${result.id} | owner: ${result.owner}`;
    const severity = node.querySelector(".severity");
    severity.textContent = result.severity.toUpperCase();
    severity.classList.add(result.severity);
    node.querySelector(".category").textContent = result.category;
    node.querySelector(".stage").textContent = result.stage;
    node.querySelector(".confidence").textContent = `${result.confidence}%`;
    node.querySelector(".action").textContent = result.action;
    const evidence = node.querySelector(".evidence");
    result.evidence.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      evidence.append(li);
    });
    elements.results.append(node);
  });

  updateMetrics(results);
  elements.report.textContent = buildReport(results);
}

function updateMetrics(results) {
  const counts = results.reduce((acc, result) => {
    acc[result.category] = (acc[result.category] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  elements.runCount.textContent = String(results.length);
  elements.highCount.textContent = String(results.filter((result) => result.severity === "high").length);
  elements.topCategory.textContent = top ? top[0] : "None";
}

function buildReport(results) {
  if (results.length === 0) {
    return "";
  }
  const lines = ["# InteliFixer Triage Report", ""];
  results.forEach((result) => {
    lines.push(`## ${result.name}`);
    lines.push("");
    lines.push(`- Run: ${result.id}`);
    lines.push(`- Owner: ${result.owner}`);
    lines.push(`- Severity: ${result.severity}`);
    lines.push(`- Likely cause: ${result.category}`);
    lines.push(`- Stage: ${result.stage}`);
    lines.push(`- Confidence: ${result.confidence}%`);
    lines.push(`- Next action: ${result.action}`);
    lines.push("- Evidence:");
    result.evidence.forEach((item) => lines.push(`  - ${item}`));
    lines.push("");
  });
  return lines.join("\n");
}
