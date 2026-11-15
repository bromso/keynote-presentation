# Move the talk out of this repo — design

Date: 2026-11-15

## Intent

Jonas wants the "Design is a loop now" deck out of this project for now. This
repo is becoming the base for a Bun-native slide framework; his talk is
content, not framework, and should not live (or be published) here.

## Goals

- The talk lives in a folder of its own on his Mac and still runs there.
- This repo and its public site keep working, showing a neutral demo instead
  of his talk.

## Non-goals

- No GitHub repo for the talk. Local folder only.
- No history rewrite. The talk stays in this repo's old commits.
- No framework work yet. That is a separate project to brainstorm.
- No change to the three packages or the theme.

## Anti-goals

- A parked talk that no longer starts.
- A talk folder that can push to the public repo by accident.
- A demo deck that reuses the talk's argument, copy or script.

## Approaches considered

- **A. Clone, then swap (my pick).** The talk's new home is a clone of this
  repo as it is today, with its link to GitHub removed. It runs on day one
  because it *is* the working project. In this repo the deck is then replaced
  by a demo.
- **B. Hand-assemble a minimal talk project.** Copy the slide, the theme and
  the three packages into a fresh open-slide install. Cleaner folder, but
  more ways to break it, and it would be redone when the framework exists.
- **C. Park the files only.** Rejected by Jonas: it must stay runnable.

## What Jonas decided

- Destination: a local folder only.
- It must keep running there.
- A small demo deck takes its place here.
- History is left as is.

## My calls

### The talk's new home

- Folder: `~/Sites/design-loop-talk`, next to this project.
- Made with `git clone` of this repo at today's `main`, so it has the full
  local history. Then:
  - remove the `origin` remote, so nothing there can reach GitHub;
  - delete `.github/workflows/ci.yml` there (no remote, no Pages);
  - `bun install`, `bun run skills:restore`, `bun run check`;
  - one commit recording the above.
- It keeps the talk's design doc and plan. The talk remains
  "all rights reserved"; its `LICENSE` keeps saying so.
- When the framework exists, this folder is rewired to it. Until then it is
  a frozen, working copy of today's setup.

### This repo

- `git rm` `apps/deck/slides/design-loop/`.
- Remove the talk's own documents: the design-loop design doc and plan.
  The other docs stay; they describe the theme, packages and tooling.
- Add `apps/deck/slides/showcase/`: a short deck, about six pages, whose
  subject is the kit itself:
  1. Cover with the clay ball.
  2. The grid: lines, dots, the 120 px module.
  3. Pointer effects: dots, lines and the present-mode crosshair.
  4. Entrances: `rise`, `fade`, `pop`, `draw`, one of each.
  5–6. A marker that travels: two pages with a morphing marker on a short
     row of nodes, to show `MorphElement` with this theme.
  7. Close.
  Short speaker notes that explain what each page demonstrates. New copy
  throughout; nothing from the talk.
- `LICENSE` and `README.md`: the "talk is all rights reserved" clause changes
  to say the talk has moved out and that older commits containing it remain
  all rights reserved. The showcase deck is MIT like the rest of the code.
- `AGENTS.md`, the theme doc and `apps/deck/README.md`: point at `showcase`
  where they pointed at `design-loop`.
- One pull request into `main`; the Pages site then shows the showcase.

## Left to the builder

- The showcase deck's exact copy and layout, within the theme's rules.
- Whether the theme demo and the showcase can share anything without
  breaking open-slide's one-file-per-slide rule (probably not; keep both).

## Done means

- `~/Sites/design-loop-talk`: `bun run check` passes, the dev server shows
  all 17 pages, and `git remote -v` prints nothing.
- This repo: `bun run check` passes, no file mentions `design-loop` outside
  historical docs, the showcase renders on every page at 1920×1080.
- After merge, the public site shows the showcase and not the talk.
