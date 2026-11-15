# keynote-presentation

Talks built with [open-slide](https://open-slide.dev): slides are React components, and this repo is a Bun monorepo around them.

## Layout

```
apps/deck/             the open-slide workspace: slides, themes, config
packages/grid-paper/   the grid-paper page background (dots, lines, crosshair cursor)
packages/clay-ball/    the turning clay ball drawn with vgpu
docs/superpowers/      design docs and plans
```

The decks:

- `apps/deck/slides/design-loop` — "Design is a loop now"
- `apps/deck/slides/getting-started` — the open-slide starter deck

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

## Third-party code

- `packages/grid-paper/src/` contains three components from [React Bits](https://reactbits.dev) under their licence (`packages/grid-paper/LICENSE-react-bits.md`).
- `.agents/` and `apps/deck/.agents/` hold installed agent skills.

Both are marked as vendored in `.gitattributes` and skipped by Biome.

See [`apps/deck/README.md`](apps/deck/README.md) for how to author a slide.
