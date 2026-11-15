import interUrl from '@assets/fonts/InterVariable.woff2';
import { ClayBall } from '@keynote/clay-ball';
import { GridPaper } from '@keynote/grid-paper';
import { Reveal } from '@keynote/motion';
import {
  type DesignSystem,
  MorphElement,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useSlidePageNumber,
} from '@open-slide/core';
import type { ReactNode } from 'react';

// Inter ships with the deck, so every machine shows the same letterforms.
// Registered once in <head> (never per page: every page is mounted at once for
// thumbnails), and updated in place so hot reload picks up changes.
const FONT_STYLE_ID = 'osd-font-showcase';
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

export const design: DesignSystem = {
  palette: { bg: '#fafaf7', text: '#161616', accent: '#ff4a1c' },
  fonts: {
    display:
      '"InterVariable", "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif',
    body: '"InterVariable", "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif',
  },
  typeScale: { hero: 144, body: 40 },
  radius: 0,
};

// ── Theme: grid-paper (themes/grid-paper.md) ────────────────────────────────

const muted = '#6e6e68';
const ink = '#161616';
const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const DECK = 'Grid Paper showcase';

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 240, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

// Marker pages: the page holds and fades, the marker does all the travelling.
const markerMorph: SlideTransition = {
  duration: 280,
  exit: { duration: 300, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 300, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

const Title = ({ children, size = 96 }: { children: ReactNode; size?: number }) => (
  <Reveal>
    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.04,
        letterSpacing: '-0.035em',
        textWrap: 'balance',
        margin: 0,
        color: 'var(--osd-text)',
      }}
    >
      {children}
    </h1>
  </Reveal>
);

const Lede = ({ children, width = 1200 }: { children: ReactNode; width?: number }) => (
  <Reveal order={2}>
    <p
      style={{
        fontSize: 'var(--osd-size-body)',
        lineHeight: 1.4,
        letterSpacing: '-0.014em',
        color: muted,
        margin: '36px 0 0',
        maxWidth: width,
      }}
    >
      {children}
    </p>
  </Reveal>
);

const Label = ({ children, strong }: { children: ReactNode; strong?: boolean }) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 24,
      lineHeight: '32px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: strong ? 'var(--osd-text)' : muted,
    }}
  >
    {children}
  </span>
);

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
        fontFamily: mono,
        fontSize: 22,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: muted,
      }}
    >
      <span>{label}</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// ── Pages ───────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 960 }}>
      <Title size={144}>Grid Paper.</Title>
      <Lede width={840}>
        A slide kit: drafting paper, one orange marker, and things that move only when they should.
      </Lede>
    </div>
    <ClayBall x={1440} y={480} size={280} />
    <Footer label={DECK} />
  </GridPaper>
);

const Point = ({ n, order, children }: { n: string; order: number; children: ReactNode }) => (
  <Reveal
    order={order}
    style={{
      height: 120,
      display: 'flex',
      alignItems: 'center',
      gap: 36,
      borderTop: `1px solid ${ink}`,
      boxSizing: 'border-box',
    }}
  >
    <span style={{ width: 84 }}>
      <Label>{n}</Label>
    </span>
    <span style={{ fontSize: 44, lineHeight: 1.2, letterSpacing: '-0.014em' }}>{children}</span>
  </Reveal>
);

const TheGrid: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>Everything sits on one grid.</Title>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 480, width: 1680 }}>
      <Point n="01" order={3}>
        A line every 120 pixels, a dot on every crossing.
      </Point>
      <Point n="02" order={5}>
        Text starts on a line. Rows are one square tall.
      </Point>
      <Point n="03" order={7}>
        Thumbnails and print get plain CSS. Nothing to load.
      </Point>
    </div>
    <Footer label={DECK} />
  </GridPaper>
);

const Target = ({ x, label, order }: { x: number; label: string; order: number }) => (
  <>
    <Reveal
      from="pop"
      order={order}
      data-crosshair-target
      style={{
        position: 'absolute',
        left: x - 30,
        top: 630,
        width: 60,
        height: 60,
        borderRadius: 999,
        boxSizing: 'border-box',
        border: `2px solid ${ink}`,
        background: 'var(--osd-bg)',
      }}
    />
    <Reveal
      from="fade"
      order={order + 1}
      style={{ position: 'absolute', left: x - 180, top: 720, width: 360, textAlign: 'center' }}
    >
      <Label>{label}</Label>
    </Reveal>
  </>
);

const Pointer: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>Move the pointer.</Title>
      <Lede>
        Dots swell and darken near it, and so do the lines. When presenting, a crosshair takes over
        and brackets what it touches.
      </Lede>
    </div>
    <Target x={480} label="Dots" order={4} />
    <Target x={960} label="Lines" order={6} />
    <Target x={1440} label="Crosshair" order={8} />
    <Footer label={DECK} />
  </GridPaper>
);

const Way = ({ x, name, children }: { x: number; name: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: 480, width: 360, height: 360 }}>
    <div
      style={{
        height: 240,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: `1px solid ${ink}`,
        borderBottom: `1px solid ${ink}`,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
    <div style={{ marginTop: 28 }}>
      <Label strong>{name}</Label>
    </div>
  </div>
);

const Entrances: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>Four ways to arrive.</Title>
    </div>
    <Way x={120} name="Rise">
      <Reveal order={6} style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em' }}>
        Text
      </Reveal>
    </Way>
    <Way x={540} name="Fade">
      <Reveal from="fade" order={12}>
        <Label strong>A label</Label>
      </Reveal>
    </Way>
    <Way x={960} name="Pop">
      <Reveal
        from="pop"
        order={18}
        style={{ width: 56, height: 56, borderRadius: 999, background: ink }}
      />
    </Way>
    <Way x={1380} name="Draw">
      <Reveal
        from="draw"
        order={24}
        style={{ width: 300, height: 2, background: ink, transformOrigin: 'left center' }}
      />
    </Way>
    <Footer label={DECK} />
  </GridPaper>
);

// A short row of stops for the marker pages. Positions are fixed pixels: the
// morph needs identical geometry on both pages.
const STOPS = [360, 760, 1160, 1560];
const STOP_Y = 660;

const Stop = ({ i, on }: { i: number; on: boolean }) => (
  <>
    <div
      data-crosshair-target
      style={{
        position: 'absolute',
        left: STOPS[i] - 14,
        top: STOP_Y - 14,
        width: 28,
        height: 28,
        borderRadius: 999,
        boxSizing: 'border-box',
        border: `2px solid ${ink}`,
        background: 'var(--osd-bg)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: STOPS[i] - 180,
        top: STOP_Y + 60,
        width: 360,
        textAlign: 'center',
      }}
    >
      <Label strong={on}>{`0${i + 1}`}</Label>
    </div>
  </>
);

const Marker = ({ at }: { at: number }) => (
  <MorphElement id="showcase-marker">
    <div
      style={{
        position: 'absolute',
        left: STOPS[at] - 28,
        top: STOP_Y - 28,
        width: 56,
        height: 56,
        borderRadius: 999,
        background: 'var(--osd-accent)',
      }}
    />
  </MorphElement>
);

const MarkerStage = ({ at, title, line }: { at: number; title: string; line: string }) => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>{title}</Title>
      <Lede>{line}</Lede>
    </div>
    <div
      style={{
        position: 'absolute',
        left: STOPS[0],
        top: STOP_Y - 1,
        width: STOPS[3] - STOPS[0],
        height: 2,
        background: ink,
      }}
    />
    <Stop i={0} on={at === 0} />
    <Stop i={1} on={at === 1} />
    <Stop i={2} on={at === 2} />
    <Stop i={3} on={at === 3} />
    <Marker at={at} />
    <Footer label={DECK} />
  </GridPaper>
);

const MarkerHere: Page = () => (
  <MarkerStage
    at={0}
    title="One marker says where you are."
    line="Orange is used once per page, and only for this."
  />
);

const MarkerThere: Page = () => (
  <MarkerStage
    at={2}
    title="Between pages, it travels."
    line="The page dissolves; the marker glides to its new place."
  />
);

MarkerHere.transition = markerMorph;
MarkerThere.transition = markerMorph;

const Line = ({ order, children }: { order: number; children: ReactNode }) => (
  <Reveal order={order} from="fade" style={{ height: 60, display: 'flex', alignItems: 'center' }}>
    <span style={{ fontFamily: mono, fontSize: 30, lineHeight: '40px' }}>{children}</span>
  </Reveal>
);

const Close: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 180, width: 1080 }}>
      <Title size={144}>Three imports.</Title>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 540, width: 1200 }}>
      <Line order={3}>{"import { GridPaper } from '@keynote/grid-paper'"}</Line>
      <Line order={5}>{"import { ClayBall } from '@keynote/clay-ball'"}</Line>
      <Line order={7}>{"import { Reveal } from '@keynote/motion'"}</Line>
    </div>
    <ClayBall x={1560} y={300} size={200} />
    <Footer label={DECK} />
  </GridPaper>
);

export const notes: (string | undefined)[] = [
  // 1 Cover
  `This deck shows what the kit does. The ball is drawn live with WebGPU; where that is not available, and in thumbnails, it is a still image of the same shader.`,

  // 2 The grid
  `The background is a component, GridPaper. Lines and dots share one 120 pixel module, and the page content is laid out on the same module, so the grid reads as structure and not as wallpaper.`,

  // 3 Pointer
  `Move the mouse over this page. The dots and lines near the pointer darken. In present mode a crosshair replaces the cursor, shows the position in slide units, and brackets any element marked data-crosshair-target, like these three circles. It fades when the mouse is idle.`,

  // 4 Entrances
  `Reveal, from the motion package, has four entrances: rise for text, fade for labels, pop for dots, draw for lines. They play only on the page the audience is watching, and not at all with reduced motion.`,

  // 5 Marker here
  `The theme allows one accent colour, used for a single marker.`,

  // 6 Marker there
  `Step back and forward between this page and the last one. The marker is a MorphElement with the same id on both pages, so open-slide animates it from one position to the other.`,

  // 7 Close
  `Everything shown here comes from three workspace packages. A slide imports what it needs.`,
];

export const meta: SlideMeta = {
  title: 'Grid Paper showcase',
  createdAt: '2026-11-15T21:39:57.221Z',
  theme: 'grid-paper',
};

export default [
  Cover,
  TheGrid,
  Pointer,
  Entrances,
  MarkerHere,
  MarkerThere,
  Close,
] satisfies Page[];
