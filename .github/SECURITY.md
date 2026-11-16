# Security policy

## What this repo is

keynote-presentation is a static slide deck. It has no server, no accounts, no database and no secrets at runtime; the build output is plain HTML, CSS and JavaScript served from GitHub Pages. That keeps the attack surface small, but problems are still possible, for example:

- a script injection or unsafe rendering path in a slide or a package under `packages/*`
- a vulnerable dependency that ends up in the published bundle
- a weakness in the CI workflow (`.github/workflows/ci.yml`), such as one that could let a pull request publish to Pages or read a token
- a supply-chain issue in the agent skills pinned in `skills-lock.json`

## Supported versions

Only the `main` branch and the deck published from it at <https://bromso.github.io/keynote-presentation/> are supported. There are no releases or maintained older versions.

## Reporting a vulnerability

**Please don't open a public issue, pull request or discussion for a security problem.**

Report it privately through GitHub instead:

1. Go to the repository's [**Security** tab](https://github.com/bromso/keynote-presentation/security).
2. Choose **Report a vulnerability** to open a private advisory.

Include what you can of:

- what the problem is and where it lives (file, line, dependency, workflow step)
- how to reproduce it, or a proof of concept
- what an attacker could do with it

## What to expect

This is a personal project kept by one maintainer, so response times are best effort:

- an acknowledgement within 7 days
- an assessment, and a plan if the report is confirmed, within 14 days
- a fix on `main` as soon as practical; the Pages deploy follows automatically

You'll be credited in the advisory unless you'd rather not be.

## Out of scope

- Vulnerabilities in upstream projects (open-slide, React, Motion, vgpu, Bun and so on) that this repo doesn't make worse. Please report those upstream.
- Issues that need a compromised machine or browser.
- Missing security headers on GitHub Pages, which this repo can't configure.
