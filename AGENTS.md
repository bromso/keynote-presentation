# keynote-presentation — Agent Guide

A Bun monorepo. The slides are an open-slide app; the code they share lives in workspace packages.

```
apps/deck/             open-slide workspace: slides/, themes/, open-slide.config.ts
packages/grid-paper/   @keynote/grid-paper: GridPaper background, React Bits dots, lines and crosshair
packages/clay-ball/    @keynote/clay-ball: the vgpu clay ball, its shader, still PNG and render script
packages/motion/       @keynote/motion: Reveal and shared timing, built on Motion (motion.dev)
docs/superpowers/      design docs and plans
```

## Hard rules

- **Authoring or editing slides or themes:** follow `apps/deck/AGENTS.md` and the open-slide skills under `apps/deck/.claude/skills/`. Slides live at `apps/deck/slides/<id>/index.tsx`.
- **Shared code** goes in `packages/*`, never in `apps/deck/assets/` (images only) and never as a sibling file in a slide folder. Packages export TypeScript source directly; there is no build step for them.
- **TypeScript only.** No `.js` / `.mjs` files of our own.
- **Bun only.** Use `bun` and `bunx`, not npm, pnpm or yarn. Shared versions live in the `catalog` in the root `package.json`.
- **Do not add dependencies without asking.**
- **Third-party skills are not in git.** Impeccable and vgpu install into `.agents/` and `.claude/skills/` at the root, which are ignored. `skills-lock.json` records them; run `bun run skills:restore` after a fresh clone. Add or update them with `npx skills`, which keeps the lockfile current.
- **Leave third-party code as shipped:** `apps/deck/.agents/` (open-slide's skills, tracked), the React Bits files in `packages/grid-paper/src/` (`DotGrid`, `CursorGrid`, `Crosshair`; local patches are marked `[open-slide]`). Biome skips them.

## Commands (from the repo root)

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the open-slide dev server |
| `bun run build` | Build the static deck into `apps/deck/dist` |
| `bun run check` | Lint, typecheck and build. Run this before every push; there is no CI |
| `bun run format` | Apply Biome formatting and safe fixes |
| `bun run typecheck` | `tsc --noEmit` in every workspace |
| `bun run render:clay` | Redraw the clay ball's still PNG from its shader |
| `bun run sync:skills` | Update the open-slide skills in `apps/deck` |
| `bun run skills:restore` | Reinstall the third-party skills listed in `skills-lock.json` |
