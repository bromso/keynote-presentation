# Bun Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the repo into a Bun workspace monorepo (`apps/deck`, `packages/grid-paper`, `packages/clay-ball`) with TypeScript type-checking and Biome, without changing how any slide looks.

**Architecture:** Source-only workspace packages consumed by the open-slide app through `workspace:*`. One root `check` script is the local CI.

**Tech Stack:** Bun 1.4.4 workspaces + catalog, TypeScript, Biome 2.x, `@open-slide/core` 2.x, React 19, vgpu 0.6.

**Spec:** `docs/superpowers/specs/2026-11-15-bun-monorepo-design.md`

## Global Constraints

- Branch `bun-monorepo` from `design-loop-deck`. No commit or push unless Jonas asks.
- Move files with `git mv`.
- New dependencies limited to: `typescript`, `@biomejs/biome`, `@types/bun` or `@types/node`, `@types/pngjs`, and declaring `vgpu`, `@vgpu/wgsl`, `pngjs`, plus `react`, `react-dom`, `@open-slide/core` peers in packages. Anything else: stop and ask.
- Biome and tsc do not touch `.agents/`, `.claude/`, React Bits sources, or `slides/getting-started/`.
- No slide content or visual change.
- Formatter: 2 spaces, single quotes, semicolons, 100 columns.

## Review Focus

- Workspace TSX imported through a symlink: Vite must transform it and HMR must still work.
- Two copies of React: hooks from packages must not throw "invalid hook call".
- Asset imports inside packages (`.png`, `.css`) must resolve in dev and in the production build.
- `bun install` from a clean `node_modules` must succeed with the catalog.
- Skills drift check on `open-slide dev` start must stay quiet.

Each is checked in Task 6.

---

### Task 1: Branch, stop servers, move files

- [ ] `git switch -c bun-monorepo`; stop dev servers on 5173 and 5174.
- [ ] `git mv` slides, themes, assets/.gitkeep, open-slide.config.ts, tsconfig.json → `apps/deck/`.
- [ ] `git mv assets/grid-paper/*` → `packages/grid-paper/src/` (licence to the package root).
- [ ] `git mv slides/design-loop/assets/clay-ball.png` → `packages/clay-ball/src/`; `git mv docs/superpowers/render-clay-ball.mjs` → `packages/clay-ball/scripts/render.ts`.
- [ ] Move open-slide's five skills (apply-comments, create-slide, create-theme, current-slide, slide-authoring) and their `.claude/skills` links under `apps/deck/`.

### Task 2: Workspace manifests

- [ ] Root `package.json` (workspaces, catalog, scripts, `packageManager`), `tsconfig.base.json`.
- [ ] `apps/deck/package.json` (`deck`), `packages/grid-paper/package.json` (`@keynote/grid-paper`), `packages/clay-ball/package.json` (`@keynote/clay-ball`), each with `typecheck`; per-workspace `tsconfig.json`; ambient `.png`/`.css` declarations.
- [ ] `bun install`; confirm one `react`.

### Task 3: Extract the clay ball

**Interfaces:** `@keynote/clay-ball` exports `ClayBall({ x, y, size? })`, `CLAY_WGSL`, `CLAY_EXTENT`, `CLAY_PX`. `@keynote/grid-paper` exports `GridPaper`, `GRID`, `GridPaperProps`.

- [ ] `src/shader.ts` (constants + WGSL), `src/index.tsx` (component), `scripts/render.ts` importing the shader.
- [ ] Deck and theme import from the packages; remove the inlined ball and `@assets/grid-paper` imports.
- [ ] Run the render script; PNG is byte-stable or visually identical.

### Task 4: TypeScript and Biome

- [ ] `bun run typecheck` green; fix own code, minimal marked fixes in React Bits.
- [ ] `biome.json`; `biome check --write`; fix remaining findings by hand.

### Task 5: Bun deploy, language bar, docs

- [ ] `netlify.toml`, `vercel.json` → Bun install/build, publish `apps/deck/dist`, Bun version pinned.
- [ ] `.gitattributes` vendored markers; confirm no tracked non-vendored `.js/.mjs/.cmd/.sh`.
- [ ] `CLAUDE.md`, `AGENTS.md`, `README.md`, `themes/grid-paper.md`, `.gitignore` updated for the new paths.
- [ ] Try `bun --bun` for the open-slide CLI; keep only if dev and build both work.

### Task 6: Verify

- [ ] Fresh `rm -rf node_modules && bun install`; `bun run check` passes.
- [ ] Start dev from `apps/deck`; pages 1, 5, 17 and the theme demo render; live grid, crosshair and ball work; console clean of hook/duplicate-React errors.
- [ ] Walk the Review Focus list.
