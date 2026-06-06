# InteliFixer

InteliFixer is a local-first CI failure triage workbench. Paste a console log,
stage status JSON, or a small batch of run records, and it classifies likely
root cause, failed pipeline stage, confidence, and next actions.

This is a public-safe revival of an unfinished 2024 hackathon prototype. The
old prototype depended on private endpoints, hardcoded credentials, and a
terminal-driven workflow. This version removes all private integrations and
turns the idea into a static app that can be inspected, run, and hosted without
secrets.

## Demo

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

For a reviewer-ready demo with the synthetic sample results loaded:

```text
http://localhost:4173/?demo=sample
```

## What It Does

- Detects common CI failure signals from pasted logs.
- Accepts optional stage status JSON.
- Supports single-run and batch-run triage.
- Produces a short incident-style Markdown summary.
- Runs entirely in the browser. No server, token, network call, or data upload.
- Includes sample sanitized runs for demos and screenshots.

## Why This Was Revived

The original hackathon version had the useful idea: reduce the time spent
reading long CI logs. It was not shippable because it assumed internal systems,
embedded sensitive defaults, and required manual terminal prompts.

The finish-up version makes the project usable by anyone:

- Private dependencies were replaced with local parsing.
- Hardcoded credentials and internal URLs were removed.
- The UI now shows severity, stage, evidence, and suggested action.
- The demo uses synthetic sample data.
- Documentation and a submission writeup are included.

## Project Structure

```text
.
├── index.html
├── src/
│   ├── app.js
│   └── styles.css
├── data/
│   └── sample-runs.json
├── docs/
│   └── BEFORE_AFTER.md
├── DEV_POST_DRAFT.md
├── LICENSE
└── README.md
```

## Privacy

InteliFixer does not send data anywhere. Everything is processed in the browser.
Do not paste secrets, private customer data, or proprietary logs into public
screenshots or demos.

## Suggested GitHub Pages Setup

1. Push this repository to GitHub.
2. Open repository settings.
3. Go to Pages.
4. Deploy from the `main` branch root.

## Challenge Note

For the DEV GitHub Finish-Up-A-Thon submission, use `docs/BEFORE_AFTER.md` and
`DEV_POST_DRAFT.md` as the starting point. Before publishing, make one honest
GitHub Copilot pass in VS Code, for example:

- Ask Copilot to review the README for clarity.
- Ask Copilot to suggest another failure pattern.
- Ask Copilot to help write a small test case or demo scenario.

Then update the submission draft with exactly what Copilot did.
