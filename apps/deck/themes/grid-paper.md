---
name: Grid Paper
description: White-ish drafting paper with gray grid lines and dots, black ink, and one orange marker.
mode: light
---

# Grid Paper

## Palette

| Role   | Value     | Notes                                                    |
| ------ | --------- | -------------------------------------------------------- |
| bg     | `#fafaf7` | paper                                                    |
| text   | `#161616` | ink: headlines, body, diagram strokes                    |
| accent | `#ff4a1c` | one "you are here" marker per page, never text or fills  |
| muted  | `#6e6e68` | secondary copy, labels, footer                           |
| line   | `#dfdfd9` | grid lines                                               |
| dot    | `#bdbdb6` | dots on grid intersections                               |

## Typography

- Display font: `"InterVariable", "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif` — weight 800, letter-spacing `-0.035em`.
- Body font: same stack — weight 400–500.
- Label font: `ui-monospace, "SF Mono", Menlo, Consolas, monospace` — uppercase, letter-spacing `0.12em`. Used for eyebrows, step numbers, diagram labels, footer.
- Inter is bundled, not fetched: `assets/fonts/InterVariable.woff2` (SIL Open Font License, `assets/fonts/LICENSE.txt`). Register it once from module top level, never inside a page:

  ```tsx
  import interUrl from '@assets/fonts/InterVariable.woff2';

  const FONT_STYLE_ID = 'osd-font-<slide-id>';
  const FONT_CSS = `@font-face { font-family: "InterVariable"; font-style: normal; font-weight: 100 900; font-display: block; src: url("${interUrl}") format("woff2"); }`;
  if (typeof document !== 'undefined') {
    let style = document.getElementById(FONT_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = FONT_STYLE_ID;
      document.head.appendChild(style);
    }
    if (style.textContent !== FONT_CSS) style.textContent = FONT_CSS;
  }
  ```
- Type-scale overrides:
  - Hero title: 144 px
  - Page heading: 88–96 px
  - Body text: 36–40 px
  - Label: 22–26 px

## Layout

- Content padding: 120 px from every canvas edge.
- The grid is the layout module: 120 px squares, 16 × 9 across the 1920 × 1080 canvas. Left edges, column starts, table rows and diagram anchors sit on grid lines.
- Alignment: left-aligned. Diagrams take the right half.
- Grid notes: lines are 1 px `#dfdfd9`; a 5 px `#bdbdb6` dot sits on every intersection. `GridPaper` (below) draws both; no image assets.

## Fixed components

These are paste-ready. Copy them verbatim into a slide that uses this theme.

### GridPaper

The root of every page. It is a shared module, not pasted code: import it.

```tsx
import { GridPaper } from '@keynote/grid-paper';

<GridPaper>{/* page content */}</GridPaper>
```

It lives in `packages/grid-paper/` and draws three layers on one 120 px module:

- CSS lines and dots. Always present; this is what thumbnails, print and reduced motion show.
- On the page the audience is watching, React Bits `DotGrid` draws the dots (they swell and darken near the pointer) and `CursorGrid` darkens the lines around the pointer.
- React Bits `Crosshair`: two pencil-gray hairlines that follow the pointer, with a readout in slide units. It brackets any element marked `data-crosshair-target`. It appears only in present mode and fades when the mouse is idle.

Props, all optional: `module` (120), `line`, `dot`, `dotSize` (5), `live` (true), `cursor` (`'present'`; `true` shows it in the editor too, `false` never), `cursorTargets`. Use `<GridPaper live={false} cursor={false}>` for a completely still page.

Everything interactive stays gray. Do not give these layers the accent colour.

### Title

```tsx
const Title = ({ children, size = 96 }: { children: React.ReactNode; size?: number }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.04,
      letterSpacing: '-0.035em',
      margin: 0,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
);
```

### Eyebrow

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
      fontSize: 24,
      lineHeight: 1.25,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#6e6e68',
    }}
  >
    {children}
  </div>
);
```

### Footer

Pull the page number from `useSlidePageNumber()` — never hardcode it.

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = ({ label }: { label: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 46,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
        fontSize: 22,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#6e6e68',
      }}
    >
      <span>{label}</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};
```

## Motion

- Philosophy: subtle — pages dissolve, the accent marker travels via a morph, and content arrives with one short entrance.
- Entrances come from `Reveal` in `@keynote/motion` (built on Motion). Give each element an `order`; `from` is `rise` for text, `fade` for labels, `pop` for dots, `draw` for lines. They play only on the on-stage page and never with reduced motion. Do not animate a `MorphElement` or anything that holds one.
- Reusable transition (paste-ready):

```tsx
export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 240, easing: 'cubic-bezier(0, 0, 0.2, 1)', keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};
```

## Aesthetic

Drafting paper in daylight. A working surface, not a stage: the grid is visible because the layout really sits on it. Black ink, gray pencil, and a single orange marker that says "you are here" — use it once per page or not at all. Diagrams are thin strokes and small circles. No gradients, no shadows, no rounded cards, no emoji, no second accent colour.

## Example usage

```tsx
const Cover: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 360, width: 1200 }}>
      <Eyebrow>Chapter 01</Eyebrow>
      <div style={{ height: 28 }} />
      <Title size={144}>The big idea.</Title>
      <p style={{ fontSize: 40, lineHeight: 1.4, color: '#6e6e68', margin: '36px 0 0' }}>
        A short subtitle that explains what this deck is about.
      </p>
    </div>
    <Footer label="Grid Paper" />
  </GridPaper>
);
```
