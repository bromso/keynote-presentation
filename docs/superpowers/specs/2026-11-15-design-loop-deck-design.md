# Design loop deck — design

> **Note (added after the fact):** this was written before the repo became a Bun monorepo. Paths have moved since: `slides/` → `apps/deck/slides/`, `themes/` → `apps/deck/themes/`, `open-slide.config.ts` → `apps/deck/open-slide.config.ts`, `assets/grid-paper/` → `packages/grid-paper/src/`, the clay ball code in the slide file → `packages/clay-ball/`, and `docs/superpowers/render-clay-ball.mjs` → `packages/clay-ball/scripts/render.ts`. The `getting-started` deck has been removed. The text below is unchanged.

Date: 2026-11-15

## Intent

Jonas gives a 15–20 minute talk to designers about how he designs today with
AI, Figma and code. The goal is that designers leave rethinking how they
work: design is no longer a line that ends in a handoff, it is a loop that
keeps returning to a new user journey.

The workspace is a fresh open-slide install. "Optimize it" means: make it
his — a reusable theme in his look, and this deck built on it.

## Goals

- A deck whose structure makes the argument: the loop stays on screen and
  visibly closes.
- Show the method concretely enough that a designer could try one arc of it.
- A reusable theme (white-ish paper, grayish grid lines and dots) that any
  future deck in this workspace can pick.
- A full spoken script in open-slide's presenter notes.

## Non-goals

- No research/evidence slides. The talk is grounded in Jonas's own practice.
- No changes to `package.json`, `open-slide.config.ts`, or the
  `getting-started` demo deck (kept as a reference).
- No new npm dependencies.

## Anti-goals

- A tool tour. If the audience remembers plugin names but not "it's a loop",
  the deck failed.
- An "AI replaces designers" message. The deck says where judgement sits.
- Generic AI-slide look: gradients, emoji, card grids, purple.

## Constraints

- open-slide rules: one `slides/<id>/index.tsx` plus `assets/`; 1920×1080
  canvas, absolute pixels, nothing may overflow 1080 px; only `react` and
  `@open-slide/core`; repeated visual elements are explicit component
  instances, not `map`.
- Theme is a pair: `themes/<id>.md` + `themes/<id>.demo.tsx`.
- Body type ≥ 28 px; ≤ ~40 words per page.

## Approaches considered

- **A. The loop as the spine (picked by Jonas).** One loop diagram persists
  through the middle of the talk; the active node moves around the ring and
  lands back on the first. Structure carries the argument. Risk: abstract
  without real screenshots — mitigated with three optional image slots.
- **B. One real journey, start to finish.** Most convincing, but depends on
  screenshots only Jonas can supply, and buries the loop in detail.
- **C. Manifesto.** Memorable provocations, but leaves designers unable to
  copy the method.

A was picked; it borrows B's image slots and C's framing for the open and
close.

## What Jonas decided

- Audience: designers. Outcome: rethink how they work.
- The workflow, in his words: metaprompt with superpowers to get a couple of
  user-flow variants → take the best one → get it into Figma with a plugin
  → tweak it → use MCP to update the coded prototype from those changes →
  polish the coded prototype with the impeccable.style plugin → land back at
  the start because a new user journey needs prototyping.
- The Figma plugin is **his own, built by him**. (Name and one-line
  description: open question below.)
- Look: white-ish, grayish grid lines and dots.
- Length: 15–20 minutes.
- Full script in presenter notes.
- Keep the `getting-started` deck.
- Use or install relevant skills to make the deck.

## My calls (not yet confirmed by Jonas)

### Theme — `grid-paper`

| Role   | Value     | Use                                         |
| ------ | --------- | ------------------------------------------- |
| bg     | `#fafaf7` | paper                                       |
| line   | `#dfdfd9` | grid lines, 120 px module                   |
| dot    | `#bdbdb6` | 5 px dots on grid intersections             |
| text   | `#161616` | ink                                         |
| muted  | `#6e6e68` | secondary copy, inactive loop nodes         |
| accent | `#ff4a1c` | the active loop node and nothing else       |

- The grid is real: content padding is 120 px and elements sit on the 120 px
  module, so lines and dots read as the layout's skeleton, not wallpaper.
- Grid drawn with CSS background gradients (no image assets).
- Type: system sans stack for display and body (heavy headlines, tight
  tracking); system mono stack for step numbers, labels and footer. No
  webfonts.
- One accent only. It marks "you are here" on the loop; that scarcity is
  what makes the moving node readable from the back of a room.
- Feel: drafting paper / blueprint in daylight. No gradients, shadows,
  rounded cards or emoji.
- Fixed components: Title, Eyebrow (mono step label), Footer (talk title +
  page number via `useSlidePageNumber()`), GridPaper background.

### Deck — `slides/design-loop/`, 17 pages

Working title: **"Design is a loop now"**.

| #  | Page             | Says                                                                 |
| -- | ---------------- | -------------------------------------------------------------------- |
| 1  | Cover            | Design is a loop now. How I work with AI, Figma and code.            |
| 2  | The old line     | Brief → wireframes → mockups → handoff → build. A straight line.     |
| 3  | Where it breaks  | A mockup is a picture of the thing. The handoff is where it gets lost. |
| 4  | The loop         | All seven nodes on the ring, none active. "I work in a loop."        |
| 5  | 01 Metaprompt    | I start by being asked questions, not by drawing. (superpowers)      |
| 6  | 02 Variants      | A couple of user flows as working prototypes, not one. [image slot]  |
| 7  | 03 Pick          | Choosing is the design work. Take the best one.                      |
| 8  | 04 Into Figma    | My own plugin moves the coded screen onto the canvas.                |
| 9  | 05 Tweak         | Figma is where I edit, not where I start. [image slot]               |
| 10 | 06 Sync back     | MCP reads what I changed and updates the prototype.                  |
| 11 | 07 Polish        | Impeccable: polish, critique, audit. [image slot]                    |
| 12 | Back to start    | Node returns to 01. A new journey needs prototyping.                 |
| 13 | Old vs new       | Two columns: artifact, handoff, where time goes.                     |
| 14 | What stays human | Taste. Choosing. Saying no.                                          |
| 15 | What it costs    | Honest downsides: more to review, easy to polish the wrong flow.     |
| 16 | Try one arc      | Pick one arc of the loop and try it this week.                       |
| 17 | Close            | Design is a loop now. Thanks + contact line.                         |

- Pages 4–12 share one loop diagram at fixed pixel coordinates on the right
  half; copy sits on the left. The active-node marker is a `MorphElement`
  that glides from node to node between pages; page 12 lands it back on 01.
- Other pages use one quiet fade transition (200–280 ms). No other motion.
- Tool facts used on slides (verified 2026-11-15):
  - Superpowers — by Jesse Vincent / Prime Radiant; its brainstorming skill
    asks what you want and why before anything is built.
  - Figma MCP — reads design context into code (`get_design_context`) and
    writes to the canvas.
  - Impeccable — by Paul Bakaus; "the design vocabulary for your coding
    agent"; commands include `polish`, `critique`, `audit`.
- Image slots use `<ImagePlaceholder>` for screenshots Jonas supplies:
  variants side by side, the Figma file, the polished prototype. The pages
  must read as complete with the placeholders still empty.
- Page 15 is my addition: a room of designers trusts the talk more if it
  names the costs. Jonas should replace my guesses with his real ones.
- Notes: a full script, first person, written to be said aloud. Total
  running time governs: about 2,200 words (≈ 16 min at 140 wpm), so roughly
  130 words per page, fewer on the cover and close.
- The script never invents anecdotes. Where a real example from Jonas's work
  belongs, the note carries a marked `[YOUR EXAMPLE: …]` slot saying what
  kind of detail fits there.
- Language: English (assumed; open question below).

### Skills and process

- Build with open-slide's `create-theme`, `create-slide` and
  `slide-authoring` skills.
- Install Impeccable into this project (`npx skills add pbakaus/impeccable`)
  and run its critique and polish passes on the finished deck — the deck is
  made with the process it describes. This adds skill files to the repo but
  does not touch `package.json`.
- Review every page in the browser via open-slide's preview route at
  1920×1080.
- Nothing is committed unless Jonas asks.

## Open questions for Jonas

1. Are these three readings of the workflow right?
   - Step 01: "metaprompting (superpowers)" = the superpowers brainstorming
     skill questioning him before anything is built.
   - Step 02: the variants are coded, clickable prototypes (not written
     flows or diagrams).
   - Step 06: ANSWERED — Figma Console MCP (not the official one or his
     own plugin's).
2. Is there one real project the script can draw on, or should it ship with
   `[YOUR EXAMPLE]` slots?
3. What is your Figma plugin called, and what does it do in one line?
   (Page 8 names it; until answered the slide says "my own plugin".)
4. Is the talk in English?
5. Is the single orange accent acceptable, or should the deck be strictly
   gray on white-ish?

## Left to the builder

- Exact copy per page within the "Says" column's meaning.
- Loop geometry (ring radius, node positions) and label placement.
- Grid line weight and dot size tuning after seeing it rendered.
- Wording of the script.
