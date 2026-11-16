<div align="center">

# keynote-presentation

Talks built with [open-slide](https://open-slide.dev): every slide is a React component, and this repo is a Bun monorepo around them.

[![CI](https://img.shields.io/github/actions/workflow/status/bromso/keynote-presentation/ci.yml?branch=main&label=CI&logo=githubactions&logoColor=white)](https://github.com/bromso/keynote-presentation/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/github/deployments/bromso/keynote-presentation/github-pages?label=pages&logo=github)](https://github.com/bromso/keynote-presentation/deployments/github-pages)
[![Live deck](https://img.shields.io/website?url=https%3A%2F%2Fbromso.github.io%2Fkeynote-presentation%2F&label=live%20deck&up_message=online&down_message=offline)](https://bromso.github.io/keynote-presentation/)
[![Last commit](https://img.shields.io/github/last-commit/bromso/keynote-presentation/main)](https://github.com/bromso/keynote-presentation/commits/main)
[![Licence: MIT](https://img.shields.io/badge/licence-MIT-blue)](LICENSE)

[![Bun](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbromso%2Fkeynote-presentation%2Fmain%2Fpackage.json&query=%24.packageManager&label=&logo=bun&logoColor=white&color=000)](https://bun.sh)
[![React](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbromso%2Fkeynote-presentation%2Fmain%2Fpackage.json&query=%24.workspaces.catalog.react&label=react&logo=react&logoColor=white&color=149eca)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbromso%2Fkeynote-presentation%2Fmain%2Fpackage.json&query=%24.workspaces.catalog.typescript&label=typescript&logo=typescript&logoColor=white&color=3178c6)](https://www.typescriptlang.org)
[![Motion](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbromso%2Fkeynote-presentation%2Fmain%2Fpackage.json&query=%24.workspaces.catalog.motion&label=motion&color=fff200&labelColor=000)](https://motion.dev)
[![Biome](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbromso%2Fkeynote-presentation%2Fmain%2Fpackage.json&query=%24.devDependencies%5B%27%40biomejs%2Fbiome%27%5D&label=biome&logo=biome&logoColor=white&color=60a5fa)](https://biomejs.dev)
[![Built with open-slide](https://img.shields.io/badge/built%20with-open--slide-111)](https://open-slide.dev)

**[Open the live deck →](https://bromso.github.io/keynote-presentation/)**

</div>

The version badges read `package.json` on `main`, so they stay current without editing this file.

## Contents

- [What's inside](#whats-inside)
- [Getting started](#getting-started)
- [Commands](#commands)
- [Writing a slide](#writing-a-slide)
- [Deployment](#deployment)
- [Agent skills](#agent-skills)
- [Contributing](#contributing)
- [Security](#security)
- [Licence](#licence)

## What's inside

```
apps/deck/             the open-slide workspace: slides, themes, config
packages/grid-paper/   the grid-paper page background (dots, lines, crosshair cursor)
packages/clay-ball/    the turning clay ball drawn with vgpu
packages/motion/       entrance animations, built on Motion (motion.dev)
docs/superpowers/      design docs and implementation plans
```

### The deck

| Slide | What it shows |
| --- | --- |
| [`showcase`](apps/deck/slides/showcase/index.tsx) | A short deck that demonstrates the grid-paper theme and the three packages |

### The packages

Packages export TypeScript source directly; there is no build step. Each one is a workspace dependency of the deck.

| Package | Exports | What it does |
| --- | --- | --- |
| [`@keynote/grid-paper`](packages/grid-paper) | `GridPaper`, `GRID` | Grid-paper page background with pointer-reactive dots, lines and a crosshair cursor |
| [`@keynote/clay-ball`](packages/clay-ball) | `ClayBall`, `CLAY_WGSL`, `./shader` | A slowly turning clay ball drawn with [vgpu](https://github.com/vercel-labs/vgpu), with a still PNG fallback |
| [`@keynote/motion`](packages/motion) | `Reveal`, `MOTION`, `useStageMotion` | Entrance animations gated to the page that is on stage, with shared timing |

## Getting started

Requires [Bun](https://bun.sh) 1.4 or newer. Bun is the only supported package manager.

```bash
git clone https://github.com/bromso/keynote-presentation.git
cd keynote-presentation
bun install
bun run dev
```

The dev server prints its URL (port 5173 by default). Use the arrow keys to move between pages and `F` for fullscreen play mode.

## Commands

Run from the repository root.

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the dev server with hot reload |
| `bun run build` | Build a static bundle into `apps/deck/dist` |
| `bun run preview` | Preview the built bundle |
| `bun run check` | Lint, typecheck and build in one go, the same as CI |
| `bun run format` | Format and apply safe lint fixes with Biome |
| `bun run typecheck` | Type-check every workspace |
| `bun run render:clay` | Redraw the clay ball's still image from its shader |
| `bun run sync:skills` | Update open-slide's skills in `apps/deck` |
| `bun run skills:restore` | Install the agent skills listed in `skills-lock.json` |

## Writing a slide

Slides live at `apps/deck/slides/<id>/index.tsx` and default-export an array of page components. Every page renders into a fixed 1920 × 1080 canvas.

```tsx
import type { Page, SlideMeta } from '@open-slide/core';
import { Reveal } from '@keynote/motion';

const Cover: Page = () => (
  <Reveal>
    <h1>Hello</h1>
  </Reveal>
);

export const meta: SlideMeta = { title: 'My slide' };
export default [Cover] satisfies Page[];
```

[`apps/deck/README.md`](apps/deck/README.md) covers authoring, navigation and config. Code shared between slides belongs in `packages/*`, not next to a slide.

## Deployment

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `bun run check` on every pull request and push to `main`. A push to `main` that passes is published to GitHub Pages:

<https://bromso.github.io/keynote-presentation/>

The base path comes from the `DECK_BASE` environment variable, read in [`apps/deck/open-slide.config.ts`](apps/deck/open-slide.config.ts). It defaults to `/`, so the same build also works on hosts that serve from the root; [`netlify.toml`](netlify.toml) and [`vercel.json`](vercel.json) are ready for Netlify and Vercel.

## Agent skills

The repo is set up for AI coding agents. [`AGENTS.md`](AGENTS.md) (mirrored in `CLAUDE.md`) holds the rules they follow.

- `apps/deck/.agents/` and `apps/deck/.claude/skills/` hold open-slide's own skills, tracked in git.
- Impeccable and vgpu are listed in `skills-lock.json` but not stored in the repo. Install them after cloning:

  ```bash
  bun run skills:restore
  ```

## Contributing

Issues and pull requests are welcome. Read [`CONTRIBUTING.md`](.github/CONTRIBUTING.md) first; the short version is: use Bun, keep shared code in `packages/*`, and run `bun run check` before you push.

## Security

Please don't report vulnerabilities in public issues. See [`SECURITY.md`](.github/SECURITY.md) for how to report one privately.

## Licence

Everything written for this repo is [MIT](LICENSE), including the showcase deck. Some parts keep their own licences:

- Three components in `packages/grid-paper/src/` come from [React Bits](https://reactbits.dev) (MIT with the Commons Clause, see [`LICENSE-react-bits.md`](packages/grid-paper/LICENSE-react-bits.md)).
- The Inter font is under the SIL Open Font License 1.1 ([`apps/deck/assets/fonts/LICENSE.txt`](apps/deck/assets/fonts/LICENSE.txt)).
- An earlier talk, "Design is a loop now", used to live here and has moved out. The copies of it in this repo's history remain all rights reserved.

[`LICENSE`](LICENSE) has the details.
