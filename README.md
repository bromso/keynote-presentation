# keynote-presentation

Talks built with [open-slide](https://open-slide.dev): slides are React components, and this repo is a Bun monorepo around them.

## Layout

```
apps/deck/             the open-slide workspace: slides, themes, config
packages/grid-paper/   the grid-paper page background (dots, lines, crosshair cursor)
packages/clay-ball/    the turning clay ball drawn with vgpu
packages/motion/       entrance animations, built on Motion (motion.dev)
docs/superpowers/      design docs and plans
```

The deck:

- `apps/deck/slides/design-loop` — "Design is a loop now"

## Getting started

Requires [Bun](https://bun.sh) 1.4 or newer.

```bash
bun install
bun run dev
```

## Commands

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the dev server with hot reload |
| `bun run build` | Build a static bundle into `apps/deck/dist` |
| `bun run preview` | Preview the built bundle |
| `bun run check` | Lint, typecheck and build in one go |
| `bun run format` | Format and apply safe lint fixes with Biome |
| `bun run typecheck` | Type-check every workspace |
| `bun run render:clay` | Redraw the clay ball's still image |
| `bun run skills:restore` | Install the agent skills listed in `skills-lock.json` |

## Third-party code

- `packages/grid-paper/src/` contains three components from [React Bits](https://reactbits.dev) under their licence (`packages/grid-paper/LICENSE-react-bits.md`).
- `apps/deck/.agents/` holds open-slide's own agent skills.

Both are marked as vendored in `.gitattributes` and skipped by Biome.

Two more agent skills, Impeccable and vgpu, are listed in `skills-lock.json` but not stored in the repo. To install them after cloning:

```bash
bun run skills:restore
```

See [`apps/deck/README.md`](apps/deck/README.md) for how to author a slide.
