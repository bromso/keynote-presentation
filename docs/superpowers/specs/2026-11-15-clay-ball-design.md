# Clay ball on the cover and close — design

> **Note (added after the fact):** this was written before the repo became a Bun monorepo. Paths have moved since: `slides/` → `apps/deck/slides/`, `themes/` → `apps/deck/themes/`, `open-slide.config.ts` → `apps/deck/open-slide.config.ts`, `assets/grid-paper/` → `packages/grid-paper/src/`, the clay ball code in the slide file → `packages/clay-ball/`, and `docs/superpowers/render-clay-ball.mjs` → `packages/clay-ball/scripts/render.ts`. The `getting-started` deck has been removed. The text below is unchanged.

Date: 2026-11-15

## Intent

Jonas wants vgpu set up in this project (skill, MCP server, npm package) and
a realistic 3D clay ball on a page of the `design-loop` deck. He did not say
what the ball is for; the reading below is mine and he accepted it without
comment.

## Goals

- vgpu usable in this project by coding agents: skill, MCP, package.
- A clay ball that reads as real clay: matte, slightly uneven, thumbprints,
  soft contact shadow on the paper.
- It can never leave an empty spot on stage.

## Non-goals

- No change to the moving marker on pages 5–12 (stays a flat disc).
- No change to `open-slide.config.ts`, the `getting-started` deck, or the
  `grid-paper` theme files.
- No interaction (drag, hover). It only turns slowly.

## Anti-goals

- A glossy plastic or glass sphere. If it does not look like clay, it failed.
- A second colour. The ball is the deck's one orange thing on its page.

## Approaches

1. **Live ball with a still fallback (picked by Jonas).** vgpu draws the ball
   on a canvas in the browser; a PNG rendered by vgpu in Node shows wherever
   WebGPU is missing and in thumbnails.
2. Live only. Simpler, but an empty spot where WebGPU is unavailable.
3. Still image only. Safe, but does not move and vgpu is only a build tool.

## What Jonas decided

- Install the vgpu skill, MCP server and dependencies.
- Approach 1.
- By asking for the install he lifts the project's "do not touch
  `package.json` / no new dependencies" rule for vgpu only.

## My calls

- **Placement:** Cover (page 1) and Close (page 17), replacing the flat
  orange disc on the ring's first node (1380, 240). About 200 px across,
  centred on that node.
- **Look:** orange clay near `#ff4a1c`, matte, low-frequency lumps plus two
  or three thumbprint dents, soft key light from upper left, faint contact
  shadow falling on the grid paper. Transparent canvas so the grid shows
  around it.
- **Motion:** one slow turn, roughly 20 s per revolution. Still when the
  viewer prefers reduced motion.
- **How it is drawn:** one fragment shader that ray-marches a displaced
  sphere, kept as a string inside `slides/design-loop/index.tsx` (no `.wgsl`
  loader, so no config change).
- **Fallback:** `slides/design-loop/assets/clay-ball.png`, rendered once by
  vgpu in Node from the same shader. The page shows the PNG first and swaps
  to the canvas only after the first live frame draws. Thumbnails, the
  overview grid and the presenter preview always use the PNG, so only the
  page on stage holds a GPU context.
- **Installs:**
  - `npx skills add vercel-labs/vgpu` (project, like Impeccable).
  - `bun add vgpu` (changes `package.json` and `bun.lock`).
  - `npx -y add-mcp https://vgpu.sh/api/mcp -g` (writes Jonas's global MCP
    client config, outside this repo).
- **Where it lands:** on the open `design-loop-deck` branch. Committed and
  pushed only when Jonas asks, after a local build.

## Left to the builder

- Exact shader (noise, dent positions, lighting values), tuned by eye.
- Whether the render script for the PNG is kept in the repo or run once
  from the scratchpad.
- vgpu API details, taken from the installed package's own docs
  (`npx vgpu`).

## Risks

- vgpu is 0.6.0; its API may not match the website. The installed package's
  docs are the source of truth.
- vgpu pulls in a `three` peer dependency range; if the install demands it,
  stop and tell Jonas rather than adding more packages.
