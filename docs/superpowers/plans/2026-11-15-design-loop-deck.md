# Design Loop Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A reusable `grid-paper` open-slide theme and a 17-page deck, `design-loop`, whose persistent loop diagram closes on itself, with a full spoken script in presenter notes.

**Architecture:** Two theme files under `themes/` (markdown + self-contained demo). One deck file `slides/design-loop/index.tsx` holding all pages, helpers and notes. Pages 4–12 render one shared `LoopStage` component at fixed pixel coordinates; the active-node marker is a `MorphElement` that the runtime glides between pages.

**Tech Stack:** React 19, `@open-slide/core` 2.x, inline styles, CSS background gradients. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-15-design-loop-deck-design.md`

## Global Constraints

- Do not touch `package.json`, `open-slide.config.ts`, or `slides/getting-started/`.
- 1920×1080 canvas, absolute pixels, nothing past 1080 px, no `overflow` escape hatches.
- Content padding 120 px; elements sit on the 120 px grid module.
- Palette: bg `#fafaf7`, line `#dfdfd9`, dot `#bdbdb6`, text `#161616`, muted `#6e6e68`, accent `#ff4a1c`. Accent marks the active loop node and nothing else.
- System sans for display/body, system mono for labels. No webfonts.
- Body type ≥ 28 px; ≤ ~40 words per page; no bullet wraps.
- Repeated visual elements are explicit component instances, not `map`.
- Open questions were not answered: build with "my own plugin", English, `[YOUR EXAMPLE: …]` slots, workflow readings as in the spec.
- Nothing is committed unless Jonas asks.

## Review Focus

- Page jumped to from the overview grid (not stepped to): loop pages must show the correct active node with no morph having played.
- Stepping backward through pages 4–12: the marker must glide back, not pop.
- Thumbnails / presenter preview mount every page at once: no entrance animation may leave a page half-drawn.
- Image placeholders left empty on stage: pages 6, 9, 11 must still read as complete.
- Notes array drifting out of alignment with the page array: `notes.length` must equal the page count.

Each is checked in Task 4's browser pass.

---

### Task 1: `grid-paper` theme

**Files:**
- Create: `themes/grid-paper.md`
- Create: `themes/grid-paper.demo.tsx`

**Interfaces:**
- Produces (paste-ready, reused verbatim by Task 2): `GridPaper` (page root with grid lines + dots, takes `children`), `Title`, `Eyebrow`, `Footer` (uses `useSlidePageNumber()`).

- [ ] Write `themes/grid-paper.md` in the exact section order from the `create-theme` skill; frontmatter `mode: light`; motion philosophy "subtle".
- [ ] Write `themes/grid-paper.demo.tsx`: Cover, Content, Closer; same four components inlined; `export const design`.
- [ ] Grid: lines every 120 px, 1 px, `#dfdfd9`; dots 5 px, `#bdbdb6`, centred on intersections; both via `background-image`.
- [ ] Verify: `bun run build` exits 0.

### Task 2: Deck pages

**Files:**
- Create: `slides/design-loop/index.tsx`

**Interfaces:**
- Consumes: Task 1 components.
- Produces: `LoopStage({ active, step, title, line, tool, slot })` where `active` is `0–6 | null`; `LOOP` constants (centre 1380,560; radius 300; seven nodes clockwise from top); morph id `loop-marker`; `loopMorph: SlideTransition`.

- [ ] Run `node -e "console.log(new Date().toISOString())"` and use the output as `meta.createdAt`; set `meta.theme: 'grid-paper'`.
- [ ] Module-level `transition`: pure-opacity dissolve, 240 ms.
- [ ] Pages 1–3, 13–17 per the spec table.
- [ ] Pages 4–12 via `LoopStage`. Node positions are module constants. The marker is a 56 px accent disc inside `MorphElement id="loop-marker"`, no `transform` on it. Page 4 has no marker; page 12 puts it back on node 0.
- [ ] Assign `loopMorph` (held exit, opacity-only enter, morph 800 ms) to pages 5–12 and also to page 4 so stepping backward glides.
- [ ] `<ImagePlaceholder>` on pages 6, 9, 11 inside `LoopStage`'s `slot`.
- [ ] Verify: `bun run build` exits 0.

### Task 3: Script

**Files:**
- Modify: `slides/design-loop/index.tsx` (`export const notes`)

- [ ] 17 entries, index-aligned, first person, about 2,200 words total, `[YOUR EXAMPLE: …]` slots where a real detail belongs, no invented anecdotes.
- [ ] Verify: entry count equals page count; word count 2,000–2,400.

### Task 4: Browser review

- [ ] Read `node_modules/.open-slide/server.json`; open `/s/design-loop/preview?p=N` for N = 1–17 at 1920×1080; wait for `[data-osd-preview="ready"]`.
- [ ] Fix any overflow, wrap, collision or contrast problem seen.
- [ ] Walk the five Review Focus items in the full viewer.
- [ ] Open the Themes panel and confirm the `grid-paper` demo renders.

### Task 5: Impeccable pass

- [ ] `npx skills add pbakaus/impeccable` in the project root; confirm `package.json` is unchanged.
- [ ] Run its critique on the deck, apply findings that fit the spec's anti-goals, re-run Task 4's page sweep on changed pages.
