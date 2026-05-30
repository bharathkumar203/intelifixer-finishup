# Before And After

## Before

The old 2024 hackathon prototype proved the idea but was not ready to share:

- It depended on private CI and lab endpoints.
- It had sensitive defaults in code.
- It was driven through Flask plus terminal prompts.
- It assumed a single internal data format.
- It had no public demo data, no polished UI, and minimal documentation.

For safety, the original private code is not published in this repository.

## After

The revived version is public-safe and demo-ready:

- It runs fully in the browser.
- It ships with synthetic sample runs.
- It classifies logs into likely root cause categories.
- It displays stage status, confidence, evidence, and next action.
- It exports a Markdown summary that can be pasted into an incident comment.
- It can be hosted on GitHub Pages without any backend.

## Completion Arc

The core unfinished idea was "summarize failures from noisy CI logs." The
finish-up work changed the project from an internal-only script into a usable
local-first web app:

1. Removed private integrations.
2. Rebuilt the parser around generic failure signals.
3. Added a dashboard UI for single and batch analysis.
4. Added sample data and documentation.
5. Prepared the DEV challenge submission draft.
