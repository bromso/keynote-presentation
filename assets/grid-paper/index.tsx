// Grid Paper: the shared page background for the grid-paper theme.
//
// Three layers, all on one module (default 120 px):
//   1. CSS gradients: lines and dots. This is what thumbnails, print, reduced
//      motion and browsers without WebGL2 show.
//   2. On the page the audience is watching, React Bits adds the moving parts:
//      DotGrid draws the dots (they swell and darken near the pointer) and
//      CursorGrid darkens the lines around the pointer.
//   3. Crosshair: two hairlines that follow the pointer, with a readout in
//      slide units.
//
// Import from a slide or theme with:  import { GridPaper } from '@assets/grid-paper';
import { useIsActivePage } from '@open-slide/core';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import Crosshair from './Crosshair';
import CursorGrid from './CursorGrid';
import DotGrid from './DotGrid';

export const GRID = {
  module: 120,
  line: '#dfdfd9',
  dot: '#bdbdb6',
  dotSize: 5,
  ink: '#161616',
  pencil: '#6e6e68',
} as const;

export type GridPaperProps = {
  children: ReactNode;
  /** Grid pitch in slide px. Lines and dots share it. */
  module?: number;
  line?: string;
  dot?: string;
  dotSize?: number;
  /** Pointer-reactive dots and lines on the on-stage page. */
  live?: boolean;
  /** Crosshair cursor on the on-stage page. */
  cursor?: boolean;
  /** CSS selector for elements the crosshair brackets when it is over them. */
  cursorTargets?: string;
};

const linesCss = (line: string) =>
  `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`;

const dotsCss = (dot: string, size: number) =>
  `radial-gradient(circle, ${dot} ${size / 2}px, transparent ${size / 2 + 0.7}px)`;

// How much the runtime has scaled the 1920 x 1080 canvas on screen. The React
// Bits canvases size themselves once, so the live layers remount when it changes.
const useScreenScale = (ref: React.RefObject<HTMLElement | null>, on: boolean) => {
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0 && el.offsetWidth > 0) setScale(Math.round((w / el.offsetWidth) * 1000) / 1000);
    };
    measure();
    // The runtime rescales with a CSS transform (window resize, a side panel
    // opening, entering present mode). No resize event or ResizeObserver sees
    // that from in here, so check a few times a second.
    const timer = window.setInterval(measure, 250);
    window.addEventListener('resize', measure);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('resize', measure);
    };
  }, [ref, on]);
  return scale;
};

export const GridPaper = ({
  children,
  module = GRID.module,
  line = GRID.line,
  dot = GRID.dot,
  dotSize = GRID.dotSize,
  live = true,
  cursor = true,
  cursorTargets = '[data-crosshair-target]',
}: GridPaperProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const onStage = useIsActivePage();
  // Stay on the CSS grid unless motion is welcome and WebGL2 is there to draw.
  const [calm, setCalm] = useState(true);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const webgl = !!document.createElement('canvas').getContext('webgl2');
    setCalm(reduced || !webgl);
  }, []);

  const moving = onStage && !calm;
  const scale = useScreenScale(rootRef, moving);
  const liveOn = moving && live && scale > 0;
  const cursorOn = moving && cursor && scale > 0;

  // The React Bits grids centre themselves in their box. A box that bleeds half
  // a module past every edge puts their lines and dots on the same
  // intersections as the CSS grid.
  const bleed = {
    position: 'absolute',
    left: -module / 2,
    top: -module / 2,
    width: `calc(100% + ${module}px)`,
    height: `calc(100% + ${module}px)`,
    pointerEvents: 'none',
  } as const;

  return (
    <div
      ref={rootRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--osd-bg)',
        // The CSS lines always stay: they are crisp at any scale. Live, DotGrid
        // takes over the dots, so the CSS dots step aside.
        backgroundImage: liveOn ? linesCss(line) : `${dotsCss(dot, dotSize)}, ${linesCss(line)}`,
        backgroundSize: `${module}px ${module}px`,
        backgroundPosition: liveOn ? '0 0, 0 0' : `${-module / 2}px ${-module / 2}px, 0 0, 0 0`,
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {liveOn ? (
        <div key={`grid-${scale}`} style={bleed}>
          {/* Half a pixel over, so a lit line lands on the CSS line, which is drawn
              from the module edge inwards and not centred on it. */}
          <div style={{ position: 'absolute', inset: 0, transform: 'translate(0.5px, 0.5px)' }}>
            {/* Lines: only the darkening near the pointer. Layout px; the
                runtime's scale applies on top. */}
            <CursorGrid
              cellSize={module}
              lightMode
              color={GRID.pencil}
              gridOpacity={0}
              highlight="area"
              radius={module * 1.6}
              fillOpacity={0}
              maxOpacity={0.55}
              spotlight={0}
              holdTime={150}
              fadeDuration={900}
              clickPulse={false}
              edgeFade={0}
              intro={false}
            />
          </div>
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* Dots: DotGrid works in screen px, so its sizes are pre-scaled. */}
            <DotGrid
              dotSize={dotSize * scale}
              gap={(module - dotSize) * scale}
              baseColor={dot}
              activeColor={GRID.ink}
              proximity={module * 1.6 * scale}
              strength={0}
              swell={0.6}
              stretch={0}
              glow={0}
              shape="circle"
              fade={0}
              intro={false}
              clickShock={false}
            />
          </div>
        </div>
      ) : null}
      {children}
      {cursorOn ? (
        <Crosshair
          key={`cursor-${scale}`}
          containerRef={rootRef}
          color={GRID.pencil}
          thickness={1}
          opacity={0.7}
          gap={10}
          smoothing={0.25}
          showCoordinates
          targetEffect="lock"
          targetSelector={cursorTargets}
          clickPulse
          hideCursor
        />
      ) : null}
    </div>
  );
};

export default GridPaper;
