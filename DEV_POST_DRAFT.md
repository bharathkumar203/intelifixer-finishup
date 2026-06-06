---
title: Finishing InteliFixer: From Internal Hackathon Script To Local CI Failure Workbench
published: false
tags: devchallenge, githubchallenge, githubcopilot
---

*This is a submission for the [GitHub Finish-Up-A-Thon Challenge](https://dev.to/challenges/github-2026-05-21).*

## What I Built

InteliFixer is a local-first CI failure triage workbench.

You paste a console log, optional stage status JSON, or a batch of run records,
and it produces a compact triage result:

- likely failure category
- failed stage
- confidence
- evidence snippets
- recommended next action
- copyable Markdown summary

The project started as a 2024 hackathon prototype for reducing time spent
reading long CI logs. The idea was useful, but the prototype was not something I
could safely share publicly or hand to another developer.

The revived version is a static browser app. It runs without a backend, secrets,
tokens, or network calls.

## Demo

Project repository:

<!-- TODO: add public GitHub repository URL after pushing. -->

Live demo:

<!-- TODO: add GitHub Pages URL after enabling Pages. Suggested demo URL: https://<github-user>.github.io/<repo-name>/?demo=sample -->

Screenshots:

<!-- TODO: upload /Users/bputta/Documents/intelifixer-finishup/.artifacts/intelifixer-desktop-sample.png to this DEV post. Optional mobile screenshot: /Users/bputta/Documents/intelifixer-finishup/.artifacts/intelifixer-mobile-sample.png -->

Run locally:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/?demo=sample
```

## The Comeback Story

Before the finish-up work, the project was an unfinished internal hackathon
script:

- it relied on private CI endpoints
- it had sensitive defaults in source code
- it mixed API calls, parsing, and LLM summarization in one flow
- it required terminal prompts
- it had no polished UI or public demo data

That made it hard to run, hard to trust, and impossible to share.

The comeback was to preserve the core idea while removing everything that made
the old project fragile:

1. I rebuilt the workflow as a local browser app.
2. I replaced private integrations with synthetic sample data.
3. I added generic failure pattern detection.
4. I added a dashboard UI with severity, confidence, evidence, and next actions.
5. I added Markdown export for incident comments.
6. I added a demo mode that can preload sanitized sample results.
7. I wrote a README, privacy note, and before/after documentation.

The result is smaller, safer, and more usable than the original prototype.

## Before And After

Before:

- terminal-driven flow
- private endpoints and sensitive defaults
- no public demo data
- no polished handoff format
- difficult to explain or share

After:

- static app that runs in the browser
- synthetic sample data
- generic classification rules for common CI failures
- responsive triage UI
- copyable Markdown incident report
- no server, token, or data upload

## My Experience with GitHub Copilot

<!-- Replace this section honestly after using GitHub Copilot. Suggested real steps:

- Open the project in VS Code with GitHub Copilot enabled.
- Ask Copilot Chat: "Review this static app for submission-readiness. Focus on bugs, privacy concerns, unclear UI copy, and demo flow."
- Ask Copilot Chat: "Suggest one more generic CI failure pattern that does not depend on private company systems."
- Ask Copilot to review README.md and docs/BEFORE_AFTER.md for clarity.
- Accept only the changes you actually agree with.

Then replace this comment with what Copilot actually helped with. Do not claim Copilot work that did not happen.
-->

## What I Learned

The biggest improvement was not adding more AI. It was removing assumptions.
Once the project no longer depended on private systems, it became easier to
demo, easier to reason about, and easier for someone else to use.

The finished version is not trying to replace a full observability stack. It is
a focused helper for the first few minutes after a CI run fails.
