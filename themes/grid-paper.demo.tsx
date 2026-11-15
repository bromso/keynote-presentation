import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import { GridPaper } from '@assets/grid-paper';
import type { ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#fafaf7', text: '#161616', accent: '#ff4a1c' },
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", system-ui, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", system-ui, sans-serif',
  },
  typeScale: { hero: 144, body: 40 },
  radius: 0,
};

const muted = '#6e6e68';
const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

const Title = ({ children, size = 96 }: { children: ReactNode; size?: number }) => (
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

const Eyebrow = ({ children }: { children: ReactNode }) => (
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

const Cover: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 360, width: 1200 }}>
      <Eyebrow>Chapter 01</Eyebrow>
      <div style={{ height: 28 }} />
      <Title size={144}>The big idea.</Title>
      <p style={{ fontSize: 40, lineHeight: 1.4, color: muted, margin: '36px 0 0' }}>
        A short subtitle that explains what this deck is about.
      </p>
    </div>
    <Footer label="Grid Paper" />
  </GridPaper>
);

const Point = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 36, height: 120 }}>
    <span style={{ fontFamily: mono, fontSize: 24, letterSpacing: '0.12em', color: muted, width: 84 }}>
      {n}
    </span>
    <span style={{ fontSize: 44, lineHeight: 1.2 }}>{children}</span>
  </div>
);

const Content: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1680 }}>
      <Eyebrow>How it sits</Eyebrow>
      <div style={{ height: 28 }} />
      <Title>Everything lands on the grid.</Title>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 480, width: 1560 }}>
      <Point n="01">Text starts on a line, 120 pixels in.</Point>
      <Point n="02">Rows are one square tall.</Point>
      <Point n="03">One orange marker says where you are.</Point>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 1652,
        top: 692,
        width: 56,
        height: 56,
        borderRadius: 999,
        background: 'var(--osd-accent)',
      }}
    />
    <Footer label="Grid Paper" />
  </GridPaper>
);

const Closer: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 420, width: 1400 }}>
      <Title size={144}>Thank you.</Title>
      <p style={{ fontSize: 40, lineHeight: 1.4, color: muted, margin: '36px 0 0' }}>
        Black ink, gray pencil, one marker.
      </p>
    </div>
    <Footer label="Grid Paper" />
  </GridPaper>
);

export default [Cover, Content, Closer];
