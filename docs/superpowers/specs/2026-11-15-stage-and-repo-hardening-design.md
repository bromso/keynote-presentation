# Stage robustness and repo hygiene — design

Date: 2026-11-15

## Intent

Jonas picked items 7–19 from the improvement list: make the deck dependable
on stage, and bring the public repo up to the standard of something he can
point people at. Items 7–9 are checks only he can do; this covers 10–19.

## Goals

- The deck looks the same on any machine and costs less to render.
- The crosshair helps while presenting and stays out of the way while editing.
- Every push is checked, and the deck is reachable at a public URL.
- The repo says what may be reused and what may not.

## Non-goals

- No change to slide content, copy, layout or the motion timing.
- No new npm dependencies. (Inter is a font file, not a package.)
- No tag yet: tagging waits until Jonas has rehearsed (item 13).

## Anti-goals

- A font swap that silently re-wraps headlines or overflows a page.
- A deploy that publishes on every branch, or a CI that Jonas has to babysit.
- A licence that claims rights over React Bits or Inter.

## Approaches considered

- **A. Two pull requests (my pick).** One for what the audience sees (font,
  crosshair, canvas cap, starter deck), one for the repo (CI, Pages, licence,
  docs). Each is reviewable on its own, and a problem with Pages cannot hold
  up the stage fixes.
- **B. One pull request.** Fewer steps, but mixes a visual change that needs
  his eyes with plumbing that does not.
- **C. One pull request per item.** Ten PRs for small changes is noise.

## What Jonas decided

- Bundle Inter; accept that the deck shifts from San Francisco to Inter on
  his Mac. The file comes from Inter's official GitHub repo.
- Host on GitHub Pages; I add the workflow, set the base path and switch
  Pages on in the repo settings.
- MIT for the code; slides and script all rights reserved; a notice points to
  the React Bits licence.
- Remove the `getting-started` deck.
- Delete the merged branches `untrack-skills` and `add-motion` (item 18).
- Run this through the brainstorming flow.

## My calls

### PR 1 — `stage-robustness`

**Font (10)**
- `InterVariable.woff2` (352 KB) and Inter's `LICENSE.txt` (SIL OFL 1.1) go in
  `apps/deck/assets/fonts/`, which open-slide reserves for shared images and
  fonts.
- The `design-loop` deck and the theme demo load it with `@font-face`
  (`font-display: block`, weights 100–900) in the way the `slide-authoring`
  skill prescribes for fonts, and put `"Inter"` first in `design.fonts`.
  The system stack stays as the fallback.
- `themes/grid-paper.md` documents the font and where the file lives.
- Every one of the 17 pages is re-checked at 1920×1080 after the swap. Inter
  is wider than San Francisco; where a headline re-wraps or a block grows,
  fix it with letter-spacing or width, never by shrinking type below the
  scale. No page may gain a line it did not have unless it still fits.

**Crosshair (11)**
- `GridPaper`'s `cursor` prop becomes `'present' | boolean`, default
  `'present'`: the crosshair (and the hidden system cursor) appear only in
  open-slide's present mode. In the editor the normal cursor stays. The dot
  and line effects keep working in both.
- open-slide's player hides the system cursor when the mouse is idle. The
  crosshair should fade out on the same idle, so a parked mouse leaves
  nothing on screen.

**Canvas (12)**
- `CursorGrid` gets `dpr={1}`. Its output is a soft darkening of 1 px lines;
  2× resolution is not visible and costs four times the pixels.
- `DotGrid` keeps its resolution: dots are small round shapes where 1× shows.

**Starter deck (17)**
- `git rm -r apps/deck/slides/getting-started`. Remove its mentions from
  `biome.json`, `README.md`, `AGENTS.md` and `apps/deck/README.md`.

### PR 2 — `repo-hygiene`

**CI and Pages (14, 15)**
- One workflow, `.github/workflows/ci.yml`:
  - `check` job on every pull request and on pushes to `main`:
    `oven-sh/setup-bun` pinned to 1.4.4, `bun install --frozen-lockfile`,
    `bun run check`.
  - `deploy` job on pushes to `main` only, after `check`: build with the base
    path `/keynote-presentation/`, copy `index.html` to `404.html` so deep
    links work, publish with GitHub's Pages actions.
  - `concurrency` cancels superseded runs.
- `open-slide.config.ts` reads the base path from an environment variable and
  defaults to `/`, so local dev and Netlify/Vercel are unchanged.
- Pages is switched on with source "GitHub Actions" through the API.
- The docs stop saying "there is no CI". The rule to run `bun run check`
  before pushing stays; CI is the net, not the test.
- The published site includes the presenter notes inside the bundle. The
  repo is already public, so nothing new is exposed, but say so at hand-over.

**Licence (16)**
- `LICENSE` at the root: MIT, © 2026 Jonas Broms, for the code (packages,
  theme, config, tooling).
- A "what is not covered" section in the same file: the content of
  `apps/deck/slides/` (text, speaker notes, images) and `docs/` is all rights
  reserved; React Bits files keep `packages/grid-paper/LICENSE-react-bits.md`;
  Inter keeps the OFL.
- `README.md` gets a short licence section saying the same.
- This is my reading of what he asked for, not legal advice; say so.

**Old docs (19)**
- The three pre-monorepo design docs and two plans keep their text. Each gets
  a short note at the top: written before the monorepo, with the path
  mapping (`slides/` → `apps/deck/slides/`, `assets/grid-paper/` →
  `packages/grid-paper/`, and so on). Rewriting them would falsify the record.

### Branches (18)

Delete `untrack-skills` and `add-motion`, local and remote, after confirming
each is fully contained in `main`.

### Order

PR 1 first, then PR 2, because the deploy should publish the corrected deck.
Commit and push only when Jonas asks, after `bun run check` passes.

## Open points for the builder

1. How open-slide exposes "present mode" to page code. The player lives in
   `src/app/components/player.tsx`; find a stable signal (a DOM marker or
   fullscreen state). If none is stable, fall back to "no crosshair in the
   editor" by detecting the editor's chrome instead.
2. How fonts are meant to be loaded in an open-slide deck (see
   `slide-authoring/references/assets.md` and `design-system.md`), and that
   the preview route's readiness check waits for the font.
3. Whether the Pages build needs anything beyond `base` (asset URLs, the
   router's basename).
4. Whether reduced-motion can be emulated in the built-in browser; if yes,
   check it, if not, leave it on Jonas's list.

## Done means

- `bun run check` passes on both branches.
- All 17 pages viewed at 1920×1080 with Inter; none overflow or re-wrap badly.
- In the editor the system cursor shows and no crosshair; in present mode the
  crosshair shows and fades when the mouse is idle.
- The CI run on PR 2 is green, and after merge the deck loads at the Pages
  URL, including a deep link to a page.
- No `getting-started` left; no merged branches left.
