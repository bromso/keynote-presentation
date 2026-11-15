import { ClayBall } from '@keynote/clay-ball';
import { GridPaper } from '@keynote/grid-paper';
import { Reveal } from '@keynote/motion';
import {
  type DesignSystem,
  ImagePlaceholder,
  MorphElement,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useSlidePageNumber,
} from '@open-slide/core';
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
  <Reveal order={2}>
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
  </Reveal>
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

const LoopNode = ({
  i,
  label,
  on,
  intro,
}: {
  i: number;
  label: string;
  on: boolean;
  intro?: boolean;
}) => {
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
      <Reveal
        from="pop"
        off={!intro}
        order={4 + i * 2}
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
      <Reveal
        from="fade"
        off={!intro}
        order={5 + i * 2}
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
      </Reveal>
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

const Loop = ({
  active,
  centre,
  intro,
}: {
  active: number | null;
  centre: string;
  intro?: boolean;
}) => (
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
    <LoopNode i={0} intro={intro} label="Metaprompt" on={active === 0} />
    <LoopNode i={1} intro={intro} label="Variants" on={active === 1} />
    <LoopNode i={2} intro={intro} label="Pick" on={active === 2} />
    <LoopNode i={3} intro={intro} label="Into Figma" on={active === 3} />
    <LoopNode i={4} intro={intro} label="Tweak" on={active === 4} />
    <LoopNode i={5} intro={intro} label="Sync back" on={active === 5} />
    <LoopNode i={6} intro={intro} label="Polish" on={active === 6} />
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
  intro,
}: {
  active: number | null;
  centre: string;
  title: ReactNode;
  line: ReactNode;
  tool?: string;
  slot?: ReactNode;
  /** Pop the nodes in one by one, clockwise. For the page that first shows the loop. */
  intro?: boolean;
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
      <Reveal order={2}>
        <p
          style={{
            fontSize: 34,
            lineHeight: 1.42,
            color: muted,
            margin: '32px 0 0',
            textWrap: 'balance',
          }}
        >
          {line}
        </p>
      </Reveal>
      {slot && (
        <Reveal order={4} style={{ marginTop: 40 }}>
          {slot}
        </Reveal>
      )}
      {tool && (
        <Reveal
          order={6}
          from="fade"
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
        </Reveal>
      )}
    </div>
    <Loop active={active} centre={centre} intro={intro} />
    <Footer label={TALK} />
  </GridPaper>
);

const Shot = ({ hint }: { hint: string }) => (
  <ImagePlaceholder hint={hint} width={480} height={270} />
);

// ── The old line ────────────────────────────────────────────────────────────

const Stop = ({
  x,
  y,
  label,
  hollow,
  order,
}: {
  x: number;
  y: number;
  label: string;
  hollow?: boolean;
  order: number;
}) => (
  <>
    <Reveal
      from="pop"
      order={order}
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
    <Reveal
      from="fade"
      order={order + 1}
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
    </Reveal>
  </>
);

const OldLine = ({ y, broken }: { y: number; broken?: boolean }) => (
  <>
    {/* The line draws itself from the first stop. */}
    <Reveal
      from="draw"
      order={3}
      style={{ position: 'absolute', left: 0, top: 0, transformOrigin: `240px ${y}px` }}
    >
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" aria-hidden="true">
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
    </Reveal>
    <Stop x={240} y={y} label="Brief" order={3} />
    <Stop x={600} y={y} label="Wireframes" order={5} />
    <Stop x={960} y={y} label="Mockups" order={7} />
    <Stop x={1320} y={y} label="Handoff" hollow={broken} order={9} />
    <Stop x={1680} y={y} label="Build" hollow={broken} order={11} />
  </>
);

// ── Pages ───────────────────────────────────────────────────────────────────

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
    intro
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

const Row = ({
  label,
  before,
  after,
  order,
}: {
  label: string;
  before: string;
  after: string;
  order: number;
}) => (
  <Reveal
    order={order}
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
  </Reveal>
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
      <Row
        order={3}
        label="The artifact"
        before="A picture of the product"
        after="A prototype that works"
      />
      <Row
        order={5}
        label="The handoff"
        before="A meeting and a spec"
        after="A sync in both directions"
      />
      <Row order={7} label="My time" before="Drawing screens" after="Choosing and refining" />
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

const Cost = ({ children, order }: { children: ReactNode; order: number }) => (
  <Reveal
    order={order}
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
  </Reveal>
);

const WhatItCosts: Page = () => (
  <GridPaper>
    <div style={{ position: 'absolute', left: 120, top: 120, width: 1560 }}>
      <Title>It is not free.</Title>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 480, width: 1680 }}>
      <Cost order={3}>More output means more to review.</Cost>
      <Cost order={5}>It is easy to polish the wrong flow.</Cost>
      <Cost order={7}>You have to be able to read what it makes.</Cost>
    </div>
    <Footer label={TALK} />
  </GridPaper>
);

const Arc = ({ children, order }: { children: ReactNode; order: number }) => (
  <Reveal
    order={order}
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
  </Reveal>
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
      <Arc order={5}>Questions before pixels</Arc>
      <Arc order={7}>Prototype to Figma</Arc>
      <Arc order={9}>Figma to code</Arc>
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
