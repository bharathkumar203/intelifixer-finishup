# GitHub Finish-Up-A-Thon Submission Checklist

Use this checklist to finish the DEV submission without inventing details.

## 1. Push The Repository

Create a public GitHub repository, for example `intelifixer-finishup`.

If using SSH, add this machine's public key to GitHub first:

```bash
cat ~/.ssh/id_rsa.pub
```

Then configure and push:

```bash
git remote add origin git@github.com:<github-user>/intelifixer-finishup.git
git push -u origin main
```

If SSH is not authorized, use GitHub Desktop or an HTTPS remote with a personal access token.

## 2. Enable GitHub Pages

In GitHub:

1. Open the repository settings.
2. Open Pages.
3. Set the source to deploy from the `main` branch root.
4. Wait for the Pages URL to become available.

Suggested demo URL:

```text
https://<github-user>.github.io/intelifixer-finishup/?demo=sample
```

## 3. Upload Screenshots

Use these verified local screenshots in the DEV post:

```text
/Users/bputta/Documents/intelifixer-finishup/.artifacts/intelifixer-desktop-sample.png
/Users/bputta/Documents/intelifixer-finishup/.artifacts/intelifixer-mobile-sample.png
```

The screenshots were generated after loading the sanitized sample data.

## 4. Do One Honest GitHub Copilot Pass

Open the project in VS Code with GitHub Copilot enabled. Useful prompts:

```text
Review this static app for submission-readiness. Focus on bugs, privacy concerns, unclear UI copy, and demo flow.
```

```text
Suggest one more generic CI failure pattern that does not depend on private company systems.
```

Update `DEV_POST_DRAFT.md` with what Copilot actually helped with.

## 5. Publish On DEV

Open the official challenge page:

```text
https://dev.to/challenges/github-2026-05-21
```

Create a post from `DEV_POST_DRAFT.md`, replace the TODO comments with:

- public GitHub repository URL
- GitHub Pages demo URL
- uploaded screenshot
- honest GitHub Copilot notes

Keep the tags:

```text
devchallenge, githubchallenge, githubcopilot
```
