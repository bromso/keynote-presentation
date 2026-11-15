# Stage and Repo Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the deck dependable on stage (bundled font, present-only crosshair, cheaper canvas, no starter deck) and the public repo complete (CI, GitHub Pages, licence, annotated old docs).

**Architecture:** Two branches off `main`, one pull request each: `stage-robustness`, then `repo-hygiene`.

**Tech Stack:** Bun 1.4.4, open-slide 2.3, Biome 2, GitHub Actions and Pages.

**Spec:** `docs/superpowers/specs/2026-11-15-stage-and-repo-hardening-design.md`

## Global Constraints

- No slide copy, layout or motion-timing changes.
- No new npm dependencies.
- `bun run check` passes before any push; commit and push only when Jonas asks.
- React Bits files change only through marked `[open-slide]` patches.
- Type never shrinks below the scale to make Inter fit.

## Review Focus

- Inter not loaded yet when a page first paints: no flash of the fallback font, and the preview route still reports ready.
- A headline that gains a line with Inter and pushes content past 1080 px.
- Entering and leaving present mode without a reload: crosshair appears and goes.
- Mouse parked in present mode: crosshair fades with the system cursor.
- Deep link on Pages (`/keynote-presentation/s/design-loop?p=5`) loading directly.

---

### Task 0: Branches

- [ ] `git switch main && git pull --ff-only`; confirm `untrack-skills` and `add-motion` are ancestors of `origin/main`; delete both locally and on origin.

### Task 1: `stage-robustness`

**Files:** `apps/deck/assets/fonts/InterVariable.woff2`, `apps/deck/assets/fonts/LICENSE.txt`, `apps/deck/slides/design-loop/index.tsx`, `apps/deck/themes/grid-paper.{md,demo.tsx}`, `packages/grid-paper/src/{index.tsx,Crosshair.tsx}`, `biome.json`, docs.

- [ ] Read `slide-authoring/references/assets.md` and `design-system.md` for font loading; read `player.tsx` for a present-mode signal.
- [ ] Download Inter and its licence; add `@font-face`; put `"Inter"` first in `design.fonts` (deck and theme demo).
- [ ] `GridPaper` `cursor: 'present' | boolean` (default `'present'`); idle fade.
- [ ] `CursorGrid dpr={1}`.
- [ ] `git rm -r apps/deck/slides/getting-started`; remove mentions.
- [ ] Preview all 17 pages at 1920×1080; fix wraps; walk Review Focus; `bun run check`.

### Task 2: `repo-hygiene`

**Files:** `.github/workflows/ci.yml`, `apps/deck/open-slide.config.ts`, `LICENSE`, `README.md`, `AGENTS.md`, five files under `docs/superpowers/`.

- [ ] `open-slide.config.ts`: `base: process.env.DECK_BASE ?? '/'`; verify a build with `DECK_BASE=/keynote-presentation/` references assets under that path.
- [ ] `ci.yml`: `check` on PRs and `main`; `deploy` on `main` after `check` (build with base, `404.html`, Pages actions); concurrency.
- [ ] Enable Pages with source "GitHub Actions".
- [ ] `LICENSE` and README licence section.
- [ ] Path-mapping note at the top of the three pre-monorepo specs and two plans.
- [ ] `bun run check`.
