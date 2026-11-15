import {
  type DesignSystem,
  ImagePlaceholder,
  MorphElement,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { GridPaper } from '@assets/grid-paper';
import clayStill from './assets/clay-ball.png';

export const design: DesignSystem = {
  palette: { bg: '#fafaf7', text: '#161616', accent: '#ff4a1c' },
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", system-ui, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", system-ui, sans-serif',
  },
  typeScale: { hero: 144, body: 40 },
  radius: 0,
};

// ── Theme: grid-paper (themes/grid-paper.md) ────────────────────────────────

const muted = '#6e6e68';
const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const TALK = 'Design is a loop now';

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 240, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

// Loop pages: the page holds and fades, the marker does all the travelling.
const loopMorph: SlideTransition = {
  duration: 280,
  exit: { duration: 300, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 300, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

const Title = ({ children, size = 96 }: { children: ReactNode; size?: number }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.04,
      letterSpacing: '-0.035em',
      textWrap: "balance",
      margin: 0,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
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

const Lede = ({ children, width = 1200 }: { children: ReactNode; width?: number }) => (
  <p
    style={{
      fontSize: 'var(--osd-size-body)',
      lineHeight: 1.4,
      color: muted,
      margin: '36px 0 0',
      maxWidth: width,
    }}
  >
    {children}
  </p>
);

// ── The loop ────────────────────────────────────────────────────────────────
// Fixed pixel geometry: centre (1380, 540), radius 300, seven nodes clockwise
// from the top. Constants, never measured, so the marker morph is exact.

const CX = 1380;
const CY = 540;
const R = 300;
const NODE = 28;
const MARK = 56;

type LabelSide = 'top' | 'right' | 'left';

const NODES: { x: number; y: number; side: LabelSide }[] = [
  { x: 1380, y: 240, side: 'top' },
  { x: 1615, y: 353, side: 'right' },
  { x: 1672, y: 607, side: 'right' },
  { x: 1510, y: 810, side: 'right' },
  { x: 1250, y: 810, side: 'left' },
  { x: 1088, y: 607, side: 'left' },
  { x: 1145, y: 353, side: 'left' },
];

const Ring = () => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: 'absolute', left: 0, top: 0 }}
    aria-hidden="true"
  >
    <circle cx={CX} cy={CY} r={R} fill="none" stroke="#161616" strokeWidth={2} />
  </svg>
);

const LoopNode = ({ i, label, on }: { i: number; label: string; on: boolean }) => {
  const { x, y, side } = NODES[i];
  const gap = 44;
  const labelBox =
    side === 'top'
      ? { left: x - 200, top: y - 84, width: 400, textAlign: 'center' as const }
      : side === 'right'
        ? { left: x + gap, top: y - 16, width: 300, textAlign: 'left' as const }
        : { left: x - gap - 300, top: y - 16, width: 300, textAlign: 'right' as const };
  return (
    <>
      <div
        data-crosshair-target
        style={{
          position: 'absolute',
          left: x - NODE / 2,
          top: y - NODE / 2,
          width: NODE,
          height: NODE,
          borderRadius: 999,
          boxSizing: 'border-box',
          border: '2px solid #161616',
          background: 'var(--osd-bg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          ...labelBox,
          fontFamily: mono,
          fontSize: 24,
          lineHeight: '32px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: on ? 700 : 400,
          color: on ? 'var(--osd-text)' : muted,
        }}
      >
        {label}
      </div>
    </>
  );
};

const Marker = ({ at }: { at: number }) => (
  <MorphElement id="loop-marker">
    <div
      style={{
        position: 'absolute',
        left: NODES[at].x - MARK / 2,
        top: NODES[at].y - MARK / 2,
        width: MARK,
        height: MARK,
        borderRadius: 999,
        background: 'var(--osd-accent)',
      }}
    />
  </MorphElement>
);

const Loop = ({ active, centre }: { active: number | null; centre: string }) => (
  <>
    <Ring />
    <div
      style={{
        position: 'absolute',
        left: CX - 200,
        top: CY - 90,
        width: 400,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 150,
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {centre}
    </div>
    <LoopNode i={0} label="Metaprompt" on={active === 0} />
    <LoopNode i={1} label="Variants" on={active === 1} />
    <LoopNode i={2} label="Pick" on={active === 2} />
    <LoopNode i={3} label="Into Figma" on={active === 3} />
    <LoopNode i={4} label="Tweak" on={active === 4} />
    <LoopNode i={5} label="Sync back" on={active === 5} />
    <LoopNode i={6} label="Polish" on={active === 6} />
    {active !== null && <Marker at={active} />}
  </>
);

const LoopStage = ({
  active,
  centre,
  title,
  line,
  tool,
  slot,
}: {
  active: number | null;
  centre: string;
  title: ReactNode;
  line: ReactNode;
  tool?: string;
  slot?: ReactNode;
}) => (
  <GridPaper>
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 120,
        width: 720,
        height: 840,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Title size={72}>{title}</Title>
      <p style={{ fontSize: 34, lineHeight: 1.42, color: muted, margin: '32px 0 0', textWrap: 'balance' }}>{line}</p>
      {slot && <div style={{ marginTop: 40 }}>{slot}</div>}
      {tool && (
        <div
          style={{
            marginTop: 'auto',
            fontFamily: mono,
            fontSize: 24,
            lineHeight: '32px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: muted }}>With </span>
          {tool}
        </div>
      )}
    </div>
    <Loop active={active} centre={centre} />
    <Footer label={TALK} />
  </GridPaper>
);

const Shot = ({ hint }: { hint: string }) => (
  <ImagePlaceholder hint={hint} width={480} height={270} />
);

// ── The old line ────────────────────────────────────────────────────────────

const Stop = ({ x, y, label, hollow }: { x: number; y: number; label: string; hollow?: boolean }) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: x - 14,
        top: y - 14,
        width: 28,
        height: 28,
        borderRadius: 999,
        boxSizing: 'border-box',
        border: '2px solid #161616',
        background: hollow ? 'var(--osd-bg)' : '#161616',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: x - 180,
        top: y + 40,
        width: 360,
        textAlign: 'center',
        fontFamily: mono,
        fontSize: 26,
        lineHeight: '32px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: hollow ? muted : 'var(--osd-text)',
      }}
    >
      {label}
    </div>
  </>
);

const OldLine = ({ y, broken }: { y: number; broken?: boolean }) => (
  <>
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', left: 0, top: 0 }}
      aria-hidden="true"
    >
      <line x1={240} y1={y} x2={broken ? 960 : 1744} y2={y} stroke="#161616" strokeWidth={2} />
      {broken && (
        <line
          x1={960}
          y1={y}
          x2={1744}
          y2={y}
          stroke="#6e6e68"
          strokeWidth={2}
          strokeDasharray="4 14"
        />
      )}
      <path
        d={`M 1722 ${y - 12} L 1746 ${y} L 1722 ${y + 12}`}
        fill="none"
        stroke={broken ? '#6e6e68' : '#161616'}
        strokeWidth={2}
      />
    </svg>
    <Stop x={240} y={y} label="Brief" />
    <Stop x={600} y={y} label="Wireframes" />
    <Stop x={960} y={y} label="Mockups" />
    <Stop x={1320} y={y} label="Handoff" hollow={broken} />
    <Stop x={1680} y={y} label="Build" hollow={broken} />
  </>
);

// ── Pages ───────────────────────────────────────────────────────────────────

// --- Clay ball -------------------------------------------------------------
// One fragment shader ray-marches a lumpy, thumb-dented sphere and the soft
// shadow it drops on the paper. The canvas is twice the ball's diameter so the
// shadow has room. assets/clay-ball.png is the same shader at time 0, rendered
// by docs/superpowers/render-clay-ball.mjs; keep CLAY_EXTENT in step with it.
const CLAY_EXTENT = 2;
const CLAY_PX = 800;

const CLAY_WGSL = /* wgsl */ `struct Params { time: f32, px: f32 }
@group(0) @binding(0) var<uniform> params: Params;

const EXTENT: f32 = 2.0;
const LIGHT: vec3f = vec3f(-0.37, 0.47, 0.80);

fn hash3(p: vec3f) -> f32 {
  var q = fract(p * vec3f(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

fn noise(p: vec3f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3f(1, 0, 0)), u.x),
        mix(hash3(i + vec3f(0, 1, 0)), hash3(i + vec3f(1, 1, 0)), u.x), u.y),
    mix(mix(hash3(i + vec3f(0, 0, 1)), hash3(i + vec3f(1, 0, 1)), u.x),
        mix(hash3(i + vec3f(0, 1, 1)), hash3(i + vec3f(1, 1, 1)), u.x), u.y),
    u.z);
}

fn fbm(p: vec3f) -> f32 {
  return 0.5 * noise(p) + 0.25 * noise(p * 2.03 + 7.1) + 0.125 * noise(p * 4.01 + 13.7);
}

fn rotY(p: vec3f, a: f32) -> vec3f {
  let c = cos(a);
  let s = sin(a);
  return vec3f(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

fn rotX(p: vec3f, a: f32) -> vec3f {
  let c = cos(a);
  let s = sin(a);
  return vec3f(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

// View space -> clay space: a slow turn around a slightly tilted axis.
fn toClay(p: vec3f) -> vec3f {
  return rotY(rotX(p, -0.35), params.time * 0.314159);
}

fn smax(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (a - b) / k, 0.0, 1.0);
  return mix(b, a, h) + k * h * (1.0 - h);
}

// A thumb pressed into the surface: a shallow dent with a raised lip.
fn thumb(d: f32, q: vec3f, c: vec3f, r: f32) -> f32 {
  let l = length(q - c * 1.16);
  var o = smax(d, -(l - r), 0.16);
  o -= 0.022 * smoothstep(r + 0.26, r + 0.06, l) * smoothstep(r - 0.08, r + 0.06, l);
  return o;
}

fn map(p: vec3f) -> f32 {
  let q = toClay(p);
  var d = length(q) - 1.0;
  d += (fbm(q * 1.7 + 3.0) - 0.44) * 0.11;
  d = thumb(d, q, normalize(vec3f(0.55, 0.45, 0.70)), 0.36);
  d = thumb(d, q, normalize(vec3f(-0.75, -0.20, 0.35)), 0.31);
  d = thumb(d, q, normalize(vec3f(0.10, -0.60, -0.80)), 0.34);
  d = thumb(d, q, normalize(vec3f(-0.30, 0.80, -0.50)), 0.29);
  return d;
}

// Fine surface texture, used only to bend the shading normal.
fn grain(q: vec3f) -> f32 {
  return fbm(q * 9.0) * 0.012 + noise(q * 38.0) * 0.0035;
}

fn normalAt(p: vec3f) -> vec3f {
  let e = vec2f(0.004, 0.0);
  let g = vec3f(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx));
  let b = vec3f(
    grain(toClay(p + e.xyy)) - grain(toClay(p - e.xyy)),
    grain(toClay(p + e.yxy)) - grain(toClay(p - e.yxy)),
    grain(toClay(p + e.yyx)) - grain(toClay(p - e.yyx)));
  return normalize(g + b);
}

fn occlusion(p: vec3f, n: vec3f) -> f32 {
  var o = 0.0;
  var w = 1.0;
  for (var i = 1; i <= 5; i++) {
    let h = 0.05 * f32(i);
    o += (h - map(p + n * h)) * w;
    w *= 0.7;
  }
  return clamp(1.0 - 2.2 * o, 0.0, 1.0);
}

fn selfShadow(p: vec3f, l: vec3f) -> f32 {
  var s = 1.0;
  var t = 0.03;
  for (var i = 0; i < 24; i++) {
    let h = map(p + l * t);
    s = min(s, 7.0 * h / t);
    t += clamp(h, 0.02, 0.15);
    if (s < 0.02 || t > 1.6) { break; }
  }
  return clamp(s, 0.0, 1.0);
}

fn encode(c: vec3f) -> vec3f {
  return pow(clamp(c, vec3f(0.0), vec3f(1.0)), vec3f(1.0 / 2.2));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let l = normalize(LIGHT);
  let xy = vec2f(uv.x - 0.5, 0.5 - uv.y) * 2.0 * EXTENT;

  // Shadow cast on the paper, which lies flat behind the ball (z = -1).
  let paper = vec3f(xy, -1.0);
  let away = length(cross(paper, l));
  let reach = length(xy);
  let soft = 0.14 + 0.26 * clamp(reach / 1.6, 0.0, 1.0);
  var shade = 0.26 * smoothstep(1.0 + soft, 1.0 - soft, away);
  shade += 0.24 * exp(-reach * reach * 1.3);
  shade *= smoothstep(EXTENT, EXTENT - 0.35, max(abs(xy.x), abs(xy.y)));
  shade = clamp(shade, 0.0, 0.5);

  // Orthographic march straight down onto the ball.
  let ro = vec3f(xy, 2.0);
  let rd = vec3f(0.0, 0.0, -1.0);
  var t = 0.0;
  var near = 1e9;
  var hit = false;
  for (var i = 0; i < 96; i++) {
    let d = map(ro + rd * t);
    near = min(near, d);
    if (d < 0.0008) { hit = true; break; }
    t += d * 0.8;
    if (t > 3.2) { break; }
  }
  let cover = select(smoothstep(params.px * 1.5, 0.0, near), 1.0, hit);

  var col = vec3f(0.0);
  if (cover > 0.0) {
    let p = ro + rd * t;
    let n = normalAt(p);
    let q = toClay(p);
    let ao = occlusion(p, n);
    let sun = clamp(dot(n, l), 0.0, 1.0) * selfShadow(p + n * 0.01, l);
    let wrap = clamp((dot(n, l) + 0.45) / 1.45, 0.0, 1.0);
    let sky = 0.5 + 0.5 * n.y;
    let bounce = clamp(-n.z + 0.35, 0.0, 1.0);

    var base = vec3f(1.0, 0.085, 0.016);
    base = mix(base, vec3f(0.80, 0.045, 0.010), smoothstep(0.35, 0.75, fbm(q * 3.1 + 1.7)));
    base *= 0.94 + 0.12 * noise(q * 46.0);

    var lit = vec3f(1.0, 0.96, 0.90) * (0.95 * sun + 0.22 * wrap);
    lit += vec3f(0.80, 0.86, 1.0) * 0.20 * sky * ao;
    lit += vec3f(1.0, 0.93, 0.85) * 0.16 * bounce * ao;
    lit += vec3f(0.10) * ao;
    col = base * lit;

    // Clay has a dull, wide sheen rather than a highlight.
    let h = normalize(l + vec3f(0.0, 0.0, 1.0));
    col += vec3f(1.0, 0.9, 0.8) * 0.045 * pow(clamp(dot(n, h), 0.0, 1.0), 9.0) * sun;
    col += vec3f(1.0, 0.75, 0.6) * 0.05 * pow(1.0 - clamp(n.z, 0.0, 1.0), 3.0) * ao;
    col = encode(col);
  }

  let a = cover + shade * (1.0 - cover);
  return vec4f(col * cover + vec3f(0.07, 0.06, 0.05) * shade * (1.0 - cover), a);
}
`;

const ClayBall = ({ x, y, size = 200 }: { x: number; y: number; size?: number }) => {
  const onStage = useIsActivePage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!onStage || !canvas || !('gpu' in navigator)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let gone = false;
    let release = () => {};

    (async () => {
      const [{ clock, effect, frameLoop, init, surface }, { prepareShader }] = await Promise.all([
        import('vgpu'),
        import('@vgpu/wgsl/prepare'),
      ]);
      const gpu = await init();
      release = () => gpu.dispose();
      if (gone) return release();

      const face = surface(gpu, canvas, { size: [CLAY_PX, CLAY_PX], clearColor: [0, 0, 0, 0] });
      const ball = effect(gpu, prepareShader(CLAY_WGSL), {
        set: { params: { time: 0, px: (2 * CLAY_EXTENT) / CLAY_PX } },
      });
      await ball.compile(face);
      if (gone) return release();

      const time = clock(gpu);
      let first = true;
      const loop = frameLoop(gpu, (frame) => {
        ball.set({ params: { time: time.time } });
        frame.pass(face, ball);
        if (first) {
          first = false;
          setLive(true);
        }
      });
      release = () => {
        loop.stop();
        gpu.dispose();
      };
      if (gone) release();
    })().catch(() => {
      // No usable GPU: the still image stays.
      release();
    });

    return () => {
      gone = true;
      release();
      setLive(false);
    };
  }, [onStage]);

  const box = size * CLAY_EXTENT;
  const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%' } as const;
  return (
    <div style={{ position: 'absolute', left: x - box / 2, top: y - box / 2, width: box, height: box }}>
      <img src={clayStill} alt="" style={{ ...fill, opacity: live ? 0 : 1 }} />
      <canvas
        ref={canvasRef}
        width={CLAY_PX}
        height={CLAY_PX}
        style={{ ...fill, opacity: live ? 1 : 0 }}
      />
    </div>
  );
};

const Cover: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 900 }}>
      <Title size={144}>
        Design is
        <br />a loop now.
      </Title>
      <Lede width={840}>How I work with AI, Figma and code.</Lede>
    </div>
    <Ring />
    <ClayBall x={NODES[0].x} y={NODES[0].y} />
    <div
      style={{
        position: 'absolute',
        left: 120,
        bottom: 46,
        fontFamily: mono,
        fontSize: 22,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: muted,
      }}
    >
      Jonas Broms
    </div>
  </GridPaper>
);

const TheOldLine: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>We were taught a line.</Title>
      <Lede>Each step waits for the one before it.</Lede>
    </div>
    <OldLine y={660} />
    <Footer label={TALK} />
  </GridPaper>
);

const WhereItBreaks: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>
        A mockup is a picture
        <br />
        of the thing.
      </Title>
      <Lede>The handoff is where the thing gets lost.</Lede>
    </div>
    <OldLine y={780} broken />
    <Footer label={TALK} />
  </GridPaper>
);

const TheLoop: Page = () => (
  <LoopStage
    active={null}
    centre="7"
    title="I work in a loop."
    line="Seven moves. The last one hands me back to the first."
  />
);

const Metaprompt: Page = () => (
  <LoopStage
    active={0}
    centre="01"
    title="Start by being asked."
    line="Before anything is drawn, the agent questions me. Who is it for? Why now? What would make it fail?"
    tool="Superpowers"
  />
);

const Variants: Page = () => (
  <LoopStage
    active={1}
    centre="02"
    title="Never one. A couple."
    line="Each user flow comes back as a prototype I can click."
    slot={<Shot hint="Two or three user-flow variants side by side" />}
    tool="Coded prototypes"
  />
);

const Pick: Page = () => (
  <LoopStage
    active={2}
    centre="03"
    title="Choosing is the work."
    line="Options got cheap. Knowing which one is right is still mine."
    tool="Judgement"
  />
);

const IntoFigma: Page = () => (
  <LoopStage
    active={3}
    centre="04"
    title="Onto the canvas."
    line="The coded screen becomes Figma layers I can grab and move."
    tool="Frottage, my own plugin"
  />
);

const Tweak: Page = () => (
  <LoopStage
    active={4}
    centre="05"
    title={
      <>
        I edit in Figma.
        <br />I don't start there.
      </>
    }
    line="Spacing and hierarchy: what my hands know faster than my words."
    slot={<Shot hint="The chosen flow in Figma, after your tweaks" />}
    tool="Figma"
  />
);

const SyncBack: Page = () => (
  <LoopStage
    active={5}
    centre="06"
    title="The code catches up."
    line="The agent reads what I changed in Figma and updates the prototype to match."
    tool="Figma Console MCP"
  />
);

const Polish: Page = () => (
  <LoopStage
    active={6}
    centre="07"
    title="Now make it good."
    line="Named moves, not “make it pop”: polish, critique, audit."
    slot={<Shot hint="The prototype after the polish pass" />}
    tool="Impeccable"
  />
);

const BackToStart: Page = () => (
  <LoopStage
    active={0}
    centre="01"
    title="And I'm back."
    line="A flow that works raises the next question. A new journey needs prototyping."
  />
);

const Row = ({ label, before, after }: { label: string; before: string; after: string }) => (
  <div
    style={{
      height: 120,
      display: 'grid',
      gridTemplateColumns: '360px 600px 720px',
      alignItems: 'center',
      borderTop: '1px solid #161616',
      boxSizing: 'border-box',
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 24,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: muted,
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 38, color: muted }}>{before}</span>
    <span style={{ fontSize: 38, fontWeight: 650 }}>{after}</span>
  </div>
);

const OldVsNew: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>What actually changed.</Title>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 420, width: 1680 }}>
      <div
        style={{
          height: 60,
          display: 'grid',
          gridTemplateColumns: '360px 600px 720px',
          alignItems: 'center',
          fontFamily: mono,
          fontSize: 24,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <span />
        <span style={{ color: muted }}>The line</span>
        <span>The loop</span>
      </div>
      <Row label="The artifact" before="A picture of the product" after="A prototype that works" />
      <Row label="The handoff" before="A meeting and a spec" after="A sync in both directions" />
      <Row label="My time" before="Drawing screens" after="Choosing and refining" />
    </div>
    <Footer label={TALK} />
  </GridPaper>
);

const StaysHuman: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title size={150}>
        Taste.
        <br />
        Choosing.
        <br />
        Saying no.
      </Title>
      <Lede>The loop makes options cheap. It doesn't make them right.</Lede>
    </div>
    <Footer label={TALK} />
  </GridPaper>
);

const Cost = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      height: 120,
      display: 'flex',
      alignItems: 'center',
      gap: 36,
      borderTop: '1px solid #161616',
      boxSizing: 'border-box',
    }}
  >
    <span style={{ fontSize: 44, lineHeight: 1.2 }}>{children}</span>
  </div>
);

const WhatItCosts: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>It is not free.</Title>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 480, width: 1680 }}>
      <Cost>More output means more to review.</Cost>
      <Cost>It is easy to polish the wrong flow.</Cost>
      <Cost>You have to be able to read what it makes.</Cost>
    </div>
    <Footer label={TALK} />
  </GridPaper>
);

const Arc = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      height: 120,
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      border: '2px solid #161616',
      background: 'var(--osd-bg)',
      fontFamily: mono,
      fontSize: 28,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const TryOneArc: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>
        Don't adopt the loop.
        <br />
        Try one arc.
      </Title>
      <Lede>Pick the move closest to how you already work. Do it once.</Lede>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, display: 'flex', gap: 40 }}>
      <Arc>Questions before pixels</Arc>
      <Arc>Prototype to Figma</Arc>
      <Arc>Figma to code</Arc>
    </div>
    <Footer label={TALK} />
  </GridPaper>
);

const Close: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 900 }}>
      <Title size={144}>
        Design is
        <br />a loop now.
      </Title>
      <Lede width={840}>Go round once.</Lede>
    </div>
    <Ring />
    <ClayBall x={NODES[0].x} y={NODES[0].y} />
    <div
      style={{
        position: 'absolute',
        left: 120,
        bottom: 46,
        fontFamily: mono,
        fontSize: 22,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: muted,
      }}
    >
      Jonas Broms
    </div>
  </GridPaper>
);

// The marker glides in both directions across every loop page.
TheLoop.transition = loopMorph;
Metaprompt.transition = loopMorph;
Variants.transition = loopMorph;
Pick.transition = loopMorph;
IntoFigma.transition = loopMorph;
Tweak.transition = loopMorph;
SyncBack.transition = loopMorph;
Polish.transition = loopMorph;
BackToStart.transition = loopMorph;

export const notes: (string | undefined)[] = [
  // 1 Cover
  `Hi, I'm Jonas. I'm a designer, and the way I work has changed a lot recently.

[YOUR EXAMPLE: one line on who you are and what you design, so the room knows whose process this is.]

I'm not here to tell you which AI tool to buy. Tools will be different by the time you get back to your desk.

What I want to show you is a shape. The shape of my working day used to be a line. Now it's a circle. And once I saw that, I couldn't go back to working the old way.

So: seventeen slides, one loop, and at the end I'll ask you to try a small piece of it.`,

  // 2 The old line
  `This is how most of us were taught to work. A brief comes in. We make wireframes. We make mockups. We hand off. Somebody builds it.

It's a relay race. Each step waits for the one before it to finish, and the baton only moves in one direction.

Notice where the feedback is. It's at the far right. You find out whether the design works when it's built, which is when it's most expensive to change your mind.

I worked like this too. The line isn't stupid. It was the right answer when building was slow and drawing was fast.

That's the part that changed.`,

  // 3 Where it breaks
  `Here's the problem I kept running into. A mockup is a picture of the thing. It isn't the thing.

A picture can't be clicked. It can't be slow. It can't show you what happens when the name is forty characters long or the list is empty. So we wrote specs to explain what the picture couldn't.

And then comes the handoff. That's the dotted part. Everything I knew but didn't draw gets lost there.

[YOUR EXAMPLE: one specific time something you designed came back from build different from what you meant. What was it, and when did you find out?]

For a long time I thought the fix was better documentation. It wasn't. The fix was to stop making pictures of the thing and start making the thing.`,

  // 4 The loop
  `So this is what I do now. It's a loop with seven moves.

I'll walk you around it once. Metaprompt, variants, pick, into Figma, tweak, sync back, polish. And then, and this is the point of the whole talk, I end up back at the top.

A few things to notice before we start. Figma is in here. I haven't left it. But look where it sits: it's at the bottom of the circle, not at the start.

Code is in here too, and I'm not an engineer. I don't write most of it.

Watch the orange dot. That's me. That's where my attention is at each step.`,

  // 5 Metaprompt
  `Move one. I don't start by drawing. I don't even start by describing a screen. I start by being asked questions.

I use a set of skills called Superpowers, made by Jesse Vincent. Before the agent builds anything, it has to find out what I want and why. It asks me who this is for. What would make it a failure even if it technically works. What I've seen elsewhere that I loved or hated.

I call this metaprompting, because I'm not writing the prompt that makes the design. I'm having a conversation that produces that prompt.

This step has nothing to do with pixels, and it shapes everything after it. It's a good creative director in a box, asking the questions I skip when I'm in a hurry.

[YOUR EXAMPLE: a question it asked you that changed what you ended up building.]`,

  // 6 Variants
  `Move two. Out of that conversation I don't ask for a design. I ask for a couple of them. Different user flows for the same problem.

And they come back as prototypes. Real, coded, clickable. I can go through each one the way a user would.

This matters more than it sounds. When a variant took me two days to draw, I made one, and then I defended it. When a variant takes minutes, I can afford to be wrong three times before lunch.

[YOUR EXAMPLE: show the screenshot. Name the two or three flows and say in one sentence how they differed, for instance one long page against a step-by-step wizard.]

None of them are good yet, by the way. They're rough. That's fine. At this stage I'm comparing ideas, not finishes.`,

  // 7 Pick
  `Move three is the shortest slide and the most important one. I pick.

I click through the variants and I choose the one that's right. Sometimes I take the skeleton of one and a single idea from another.

Nothing on this slide is automated, and I don't think it should be. The machine made the options cheap. It did not make them right. Knowing which flow respects the user, which one fits the product, which one we can actually ship, that's taste and experience. That's the job.

If you take one thing from this talk about your own value, take this. When making gets cheap, choosing gets expensive. And choosing is what designers are trained to do.

[YOUR EXAMPLE: why you picked the one you picked.]`,

  // 8 Into Figma
  `Move four. Now I have a coded prototype I believe in, and I want to get my hands on it. So I bring it into Figma.

For this I use a plugin I built myself. It's called Frottage. It takes the screen that's running in the browser and puts it on the Figma canvas as real layers. Frames, text, the things I can select and move.

[YOUR EXAMPLE: say why you built Frottage instead of using an existing plugin, and what it does that the others didn't.]

Notice the direction. For my whole career, design went from Figma to code. Here it goes from code to Figma. The canvas isn't where the design is born any more. It's where I pick it up and look at it properly.`,

  // 9 Tweak
  `Move five. This is the part that will feel familiar. I'm in Figma, and I'm designing.

I fix the spacing. I sort out the hierarchy. I move the button to where it should have been. All the things that my hands know how to do faster than I could ever explain them in words.

That's why Figma is still in my loop. Some people will tell you the canvas is dead. I don't think so. Typing "make the heading a bit tighter and nudge that up" is a terrible way to design. Dragging it is a great one.

So I edit in Figma. I just don't start there any more. I arrive with something that already works, and I make it better.

[YOUR EXAMPLE: show the Figma frame and point at two things you changed.]`,

  // 10 Sync back
  `Move six. Now I have a problem the old process never solved. The Figma file and the prototype disagree. I've changed one and not the other.

In the line, this is the handoff, and a person has to carry the changes across by hand.

In the loop, the agent does it. I use something called Figma Console MCP. Think of it as a socket that lets the AI read my Figma file directly. It looks at what I changed and updates the coded prototype to match.

So the handoff hasn't been improved. It's been removed. There is no moment where I throw the design over a wall and hope.

It isn't perfect. I check what it did. But I'm reviewing a change, not explaining one, and that's a very different amount of work.`,

  // 11 Polish
  `Move seven. The prototype matches my design, and it works. Now I make it good.

I use Impeccable, by Paul Bakaus. What it gives me is vocabulary. You know the feeling of asking an AI to "make it pop" and getting a purple gradient. Impeccable replaces that with named moves. Polish, for the final pass. Critique, for a scored review of the experience. Audit, for the technical problems.

Each word loads a specific way of working, so I'm steering with a designer's terms, not hoping.

[YOUR EXAMPLE: show the before and after. Point at one thing the polish pass caught that you had missed.]

And this is where it would have ended, in the old world. Ship it, start the next brief.`,

  // 12 Back to start
  `But it doesn't end. Look where the dot went.

I'm back at the top. Not because I failed, but because I succeeded. The flow works now, and a flow that works always raises the next question. If sign-up is done, what about the person who comes back after a month? If the happy path is good, what about the error?

A new user journey needs prototyping. So I open the conversation again, and I get asked questions again.

This is the thing I want you to see. I used to think of design as a project with a finish line. Now I think of it as laps. Each lap is short, each one ends in something real, and each one starts from a better place than the last.`,

  // 13 Old vs new
  `Let me put the two side by side.

The artifact. In the line, what I produce is a picture of the product. In the loop, it's a prototype that works. One of those can be tested with a user this afternoon.

The handoff. In the line, it's a meeting and a spec. In the loop, it's a sync, and it runs in both directions: code into Figma, Figma back into code.

And my time. It used to go to drawing screens. Now it goes to choosing between options and refining the one I chose.

[YOUR EXAMPLE: if you have a real number, say it here. How long from idea to something clickable, before and now.]

I draw less. I decide more.`,

  // 14 What stays human
  `So what's left for us? It's the question underneath all of this.

Three things, and they're the three things we were always paid for.

Taste. Knowing that something is off before you can say why.

Choosing. Looking at five options that all technically work and knowing which one is right for these people, in this product, this year.

And saying no. This is the underrated one. When you can make anything in ten minutes, the temptation is to make everything. Somebody has to say that we don't need it.

The loop makes options cheap. It doesn't make them right. That's still you.`,

  // 15 What it costs
  `I'd be lying if I said this was free, so here's the honest part.

One. More output means more to review. I get three flows where I used to get one, and I have to actually look at all three. Reviewing is tiring in a different way from making.

Two. It's very easy to polish the wrong flow. The loop is so fast that you can go around it four times on an idea that should have been killed on the first lap. Speed doesn't protect you from a bad brief.

Three. You have to be able to read what it makes. You don't need to write the code. But if you can't tell a working prototype from a convincing fake, the loop will fool you.

[YOUR EXAMPLE: replace any of these with the cost you have actually felt most.]`,

  // 16 Try one arc
  `Here's what I'd like you to do with this.

Please don't go back to work on Monday and announce a new process. It won't survive the week.

Don't adopt the loop. Try one arc of it. One move, once.

If you like to think before you draw, try the first one. Let an agent interview you about a feature before you open Figma, and see what it asks.

If you already have something coded, bring it into Figma and edit it there. Feel what it's like to start from something that works.

Or take a design you've changed and let the AI carry those changes back into code.

Pick the one closest to how you already work. That's all.`,

  // 17 Close
  `Design is a loop now.

It still needs a designer. It needs one more than before, because somebody has to be the dot going round, and somebody has to decide when a lap is done.

Go round once this week and see how it feels.

Thank you. I'd love to hear how you work, so come and find me afterwards.`,
];

export const meta: SlideMeta = {
  title: 'Design is a loop now',
  createdAt: '2026-11-15T02:04:09.246Z',
  theme: 'grid-paper',
};

export default [
  Cover,
  TheOldLine,
  WhereItBreaks,
  TheLoop,
  Metaprompt,
  Variants,
  Pick,
  IntoFigma,
  Tweak,
  SyncBack,
  Polish,
  BackToStart,
  OldVsNew,
  StaysHuman,
  WhatItCosts,
  TryOneArc,
  Close,
] satisfies Page[];
