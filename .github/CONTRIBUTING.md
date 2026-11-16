# Contributing

Thanks for wanting to help. This is a personal talk repo, so the bar for changes is "does it make the deck or the shared packages better", and the maintainer has the final say on what fits.

## Before you start

- **Small fixes** (typos, broken links, an obvious bug): open a pull request straight away.
- **Anything larger** (a new package, a new slide, a change to how the theme or motion works, a new dependency): open an issue first so we can agree on the approach before you spend time on it.
- **Security problems:** don't open an issue. Follow [`SECURITY.md`](SECURITY.md).

## Setup

You need [Bun](https://bun.sh) 1.4 or newer.

```bash
git clone https://github.com/bromso/keynote-presentation.git
cd keynote-presentation
bun install
bun run dev
```

If you work with an AI coding agent, also run `bun run skills:restore` to install the skills listed in `skills-lock.json`.

## House rules

These match [`AGENTS.md`](../AGENTS.md), which agents follow too.

- **Bun only.** Use `bun` and `bunx`, never npm, pnpm or yarn. Don't commit other lockfiles.
- **TypeScript only.** No `.js` or `.mjs` files of our own.
- **Shared versions live in the catalog.** A dependency used by more than one workspace goes in `workspaces.catalog` in the root `package.json` and is referenced as `"catalog:"`.
- **No new dependencies without asking** in an issue first.
- **Shared code goes in `packages/*`.** Not in `apps/deck/assets/` (images and fonts only), and not as a sibling file in a slide folder. Packages export TypeScript source directly; there is no build step.
- **Slides live at `apps/deck/slides/<id>/index.tsx`.** Follow [`apps/deck/AGENTS.md`](../apps/deck/AGENTS.md) when writing slides or themes.
- **Don't hard-code the base path.** It comes from `DECK_BASE`.
- **Leave third-party code as shipped:** `apps/deck/.agents/` and the React Bits files in `packages/grid-paper/src/` (`DotGrid`, `CursorGrid`, `Crosshair`). If a patch is unavoidable, mark it with an `[open-slide]` comment.

## Making a change

1. Fork the repo and create a branch from `main` with a short, descriptive name, such as `fix-reveal-timing`.
2. Make your change. Keep each pull request to one concern.
3. Format and check:

   ```bash
   bun run format
   bun run check
   ```

   `check` runs Biome, `tsc --noEmit` in every workspace and a production build, exactly as CI does. Please make it pass locally before you push; CI is the safety net, not the test.
4. If you changed something visual, run `bun run dev` and look at it, and add a screenshot to the pull request.
5. If you changed the clay ball's shader, run `bun run render:clay` and commit the new PNG.

## Commits and pull requests

- Write commit subjects in the imperative, under about 70 characters: "Add a fade variant to Reveal", not "added fade".
- Explain *why* in the pull request description, and link the issue it closes.
- The pull request template has a short checklist; please fill it in.
- [`CODEOWNERS`](CODEOWNERS) requests a review automatically.

## Licence

By contributing you agree that your contribution is licensed under the [MIT licence](../LICENSE), like the rest of the code written for this repo. Don't submit code you don't have the right to license that way.
