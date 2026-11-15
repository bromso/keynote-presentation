# Bun monorepo, TypeScript and Biome — design

> **Note (added after the fact):** since this was written, the third-party skills were taken out of git (`bun run skills:restore`), the `getting-started` deck was removed, a third package `packages/motion` was added, and CI now exists. The text below is unchanged.

Date: 2026-11-15

## Intent

Jonas wants this repo to read and behave as a modern TypeScript project:
Bun-native, structured as a Bun monorepo, linted and formatted with Biome.
He showed GitHub's language bar (JavaScript 73 %, TypeScript 23 %) as the
symptom. He also asked for more modularity in the previous round; the
monorepo is where that lands.

## What the research found

- The JavaScript is not his. Five files in the vendored Impeccable skill
  (`.agents/skills/impeccable/scripts/`, one a 566 KB bundle) account for all
  of it. Batchfile and Shell are that skill's launcher.
- His own code is TypeScript already, except
  `docs/superpowers/render-clay-ball.mjs` (1.7 KB).
- Nothing type-checks: TypeScript is not installed and no script runs it.
- Bun is half-used: `bun.lock` exists, but `netlify.toml` and `vercel.json`
  build with `npm run build`.
- It is one open-slide app. `assets/grid-paper/` (GridPaper plus three React
  Bits components) and the clay ball are the parts worth making packages.
- Tool versions on this machine: Bun 1.4.4, Node 24.6. Latest on npm:
  `@biomejs/biome` 2.6.8, `typescript` 7.0.2.

## Goals

- GitHub's language bar shows the repo as TypeScript.
- One command checks everything locally: format, lint, types, build.
- Shared code lives in workspace packages the deck imports by name.
- Install, scripts and deploys all go through Bun.

## Non-goals

- No rewrite of vendored skills (`.agents/`, `.claude/`). They are managed by
  `npx skills` and `open-slide sync:skills`.
- No visual or content change to any slide. The deck must render the same.
- No CI workflow. Jonas's CI minutes are limited and he did not ask for one;
  the check runs locally.
- No build step for packages. They ship TypeScript source.

## Anti-goals

- A monorepo in name only (workspaces config with nothing in `packages/`).
- Breaking open-slide's own tooling (dev server, build, skills sync, the
  inspector's "apply comments" flow).
- Reformatting third-party code so it can no longer be compared to upstream.

## Approaches considered

- **A. Deck plus packages (picked by Jonas).** `apps/deck` is the open-slide
  workspace; `packages/*` hold the grid and the clay ball. Real modularity,
  but nearly every file moves and path-based docs need updating.
- **B. Tooling only.** Keep the layout; add workspaces config, Biome,
  typecheck, Bun deploys. Safe, but nothing becomes a package.
- **C. Split the React Bits components into their own package too.**
  Rejected: their licence forbids redistributing them on their own, and a
  package of only those components reads as exactly that.

## What Jonas decided

- Migrate JavaScript to TypeScript where it is his.
- Make the project Bun-native and a Bun-optimised monorepo.
- Add Biome.
- Shape A.
- Skills and MCP servers may be installed if needed.

Asking for this lifts the project rule "do not touch `package.json` /
`open-slide.config.ts`" for this change.

## My calls

### Layout

```
/
├─ package.json            workspaces, catalog, root scripts
├─ bunfig.toml             only if a setting is actually needed
├─ biome.json
├─ tsconfig.base.json
├─ .gitattributes
├─ netlify.toml, vercel.json
├─ CLAUDE.md, AGENTS.md, README.md
├─ .agents/, .claude/, skills-lock.json     (third-party skills stay here)
├─ docs/superpowers/                         (stays at the root)
├─ apps/
│  └─ deck/                name: deck
│     ├─ package.json
│     ├─ open-slide.config.ts
│     ├─ tsconfig.json
│     ├─ slides/design-loop/, slides/getting-started/
│     ├─ themes/
│     └─ assets/           (.gitkeep; images only again)
└─ packages/
   ├─ grid-paper/          name: @keynote/grid-paper
   │  ├─ package.json
   │  ├─ tsconfig.json
   │  ├─ LICENSE-react-bits.md
   │  └─ src/  index.tsx, DotGrid.tsx/.css, CursorGrid.tsx/.css, Crosshair.tsx
   └─ clay-ball/           name: @keynote/clay-ball
      ├─ package.json
      ├─ tsconfig.json
      ├─ src/  index.tsx (ClayBall), shader.ts (CLAY_WGSL, CLAY_EXTENT),
      │        clay-ball.png
      └─ scripts/render.ts
```

- Files move with `git mv` so history follows.
- Packages export source: `"exports": { ".": "./src/index.tsx" }`. No
  bundling; Vite (inside open-slide) and Bun both read TSX directly.
- The deck imports `@keynote/grid-paper` and `@keynote/clay-ball` via
  `workspace:*`. The `@assets/grid-paper` import and the `ClayBall` code
  inside `slides/design-loop/index.tsx` go away.
- `vgpu` moves from the deck's dependencies to `@keynote/clay-ball`.
- `render-clay-ball.mjs` becomes `packages/clay-ball/scripts/render.ts` and
  imports the shader from `src/shader.ts` instead of regex-reading the deck.

### Bun

- Root `package.json`: `"private": true`, `"workspaces": ["apps/*",
  "packages/*"]`, `"packageManager": "bun@1.4.4"`, and a `catalog` for the
  versions shared across workspaces (`react`, `react-dom`, `@types/react`,
  `@types/react-dom`, `typescript`).
- Root scripts:
  - `dev`, `build`, `preview` → `bun run --filter deck <script>`
  - `format` → `biome format --write .`
  - `lint` → `biome check .`
  - `typecheck` → `bun run --filter '*' typecheck`
  - `check` → lint, typecheck, build, in that order. This is the local CI.
  - `render:clay` → runs the clay ball render script
  - `sync:skills` → open-slide's skills sync (see open points)
- Deploy: `netlify.toml` and `vercel.json` install with `bun install` and
  build with `bun run build`, publishing `apps/deck/dist`.
- Try running the open-slide CLI on the Bun runtime (`bun --bun`). Keep it
  only if dev and build both work; otherwise leave the CLI on Node and say so.
- Docs say `bun` / `bunx` where they said `pnpm` / `npx`, except where a
  third-party tool documents `npx` as its own command (`npx skills`).

### TypeScript

- Add `typescript` (catalog). `tsconfig.base.json` holds the strict options
  from today's `tsconfig.json`; each workspace extends it.
- Each workspace has a `typecheck` script (`tsc --noEmit`).
- Packages get an ambient declaration for `.png` and `.css` imports.
- Type errors in his code get fixed. Type errors inside the React Bits files
  get the smallest possible local fix, marked `[open-slide]` like the
  existing patches; if they are many, `// @ts-nocheck` on that file with a
  comment saying why.

### Biome

- `@biomejs/biome` 2.x at the root, one `biome.json`.
- Formatter set to match the code as written today (2 spaces, single quotes,
  semicolons, 100 columns) so the diff is small.
- Recommended lint rules. Fix what it flags in his code; do not disable a
  rule globally to get green.
- Not checked or formatted: `.agents/`, `.claude/`, `node_modules/`, `dist/`,
  lockfiles, the three React Bits source files and their CSS, and
  `apps/deck/slides/getting-started/` (the framework's starter deck, kept
  as shipped).

### Language bar

`.gitattributes` marks `.agents/**` and `.claude/**` as `linguist-vendored`
and the React Bits sources as `linguist-vendored` too. Success is measured
by tracked bytes of non-vendored code: no `.js`, `.mjs`, `.cmd` or shell.

### Agent docs

- Root `CLAUDE.md` / `AGENTS.md`: slide paths become
  `apps/deck/slides/<id>/`; add that shared code goes in `packages/*`; keep
  "no new dependencies without asking" and "do not touch other slides".
- `themes/grid-paper.md` and the theme demo import from
  `@keynote/grid-paper`.
- `README.md`: the new layout and the five commands.

### Git

- A new branch `bun-monorepo` on top of `design-loop-deck`, so the open pull
  request stays readable. Commit and push only when Jonas asks, after
  `bun run check` passes.

### Dependencies this change may add

Jonas approved installing what is needed. That covers, and is limited to:

- `typescript` and `@biomejs/biome` at the root.
- Declaring in a package what it already uses but only gets by hoisting
  today: `vgpu`, `@vgpu/wgsl` and `pngjs` for `@keynote/clay-ball`.
- Type packages the typecheck needs: `@types/bun` (or `@types/node`) and
  `@types/pngjs`.
- `react`, `react-dom` and `@open-slide/core` as peer dependencies of both
  packages (they call `useIsActivePage`).

Anything else: stop and ask.

### Working in place

The work happens in this checkout on the new branch, not a separate
worktree. A dev server is running from the old layout; the builder stops it
before moving files and starts it again from `apps/deck` when the move is
done, and tells Jonas the port.

### Deploy

Both `netlify.toml` and `vercel.json` came with the open-slide starter.
Whether either host is connected is a question for Jonas (asked at
hand-over). Either way both files are updated, with the Bun version pinned,
and nothing about a live deploy is claimed as verified.

## Open points for the builder to verify first

Each has a fallback so none blocks the work.

1. **open-slide from `apps/deck`.** Does `open-slide dev` / `build` work with
   the project in a subfolder and TSX coming from symlinked workspace
   packages? Fallback: Vite `resolve.alias`/dedupe is not reachable from
   `open-slide.config.ts`, so if workspace imports fail, stop and tell Jonas
   before trying anything invasive.
2. **Skills location.** open-slide resolves everything from the working
   directory, so `sync:skills` run in `apps/deck` writes
   `apps/deck/.agents/`. Move open-slide's own five skills there and keep
   the third-party ones (Impeccable, vgpu) at the root. Confirm the dev
   server's drift check is quiet afterwards.
3. **`current-slide` skill.** It reads `node_modules/.open-slide/current.json`;
   find where that file lands in a workspace and update the docs to match.
4. **Render script under Bun.** `vgpu/node` loads a native Dawn addon.
   Fallback: run that one script with `node` (Node 24 runs `.ts` directly).
5. **React duplicates.** One copy of `react` must resolve for the deck and
   both packages. open-slide's Vite config already dedupes `react` and
   `react-dom`; confirm in the browser console.

## Done means

- `bun install` from a clean checkout works.
- `bun run check` passes.
- Pages 1, 5 and 17 of `design-loop` and the theme demo look the same as
  before in the browser, with the live grid, crosshair and ball working.
- No tracked, non-vendored `.js`, `.mjs`, `.cmd` or shell files remain.
- The dev server runs again from `apps/deck` and Jonas is told the port.
