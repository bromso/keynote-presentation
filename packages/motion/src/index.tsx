// Entrance animations for open-slide pages, built on Motion (motion.dev).
//
// The one rule: only the page the audience is watching animates. Thumbnails,
// the overview grid, the presenter preview, print, the snapshot open-slide
// takes during a page transition, and anyone with reduced motion switched on
// get the finished state straight away. `useStageMotion()` is that gate.
import { useIsActivePage } from '@open-slide/core';
import { motion, useReducedMotion } from 'motion/react';
import type { ComponentProps } from 'react';

/** Shared timing, so every entrance in a deck moves the same way. */
export const MOTION = {
  /** Seconds one element takes to arrive. */
  duration: 0.55,
  /** Seconds between one `order` and the next. */
  step: 0.07,
  /** Seconds before the first element moves; lets the page dissolve land. */
  lead: 0.12,
  /** A quick start and a long, soft landing. */
  ease: [0.22, 1, 0.36, 1],
} as const;

/** True only on the on-stage page, and only when motion is welcome. */
export const useStageMotion = (): boolean => {
  const onStage = useIsActivePage();
  const reduced = useReducedMotion();
  return onStage && !reduced;
};

const FROM = {
  /** Fade in while rising a little. The default for text. */
  rise: { opacity: 0, y: 28 },
  /** Fade only. For labels and anything that must not shift. */
  fade: { opacity: 0 },
  /** Grow from a point. For dots and markers. */
  pop: { opacity: 0, scale: 0.4 },
  /** Draw from left to right. Set `transformOrigin` in `style`. */
  draw: { scaleX: 0 },
} as const;

const TO = {
  rise: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  pop: { opacity: 1, scale: 1 },
  draw: { scaleX: 1 },
} as const;

export type RevealFrom = keyof typeof FROM;

export type RevealProps = Omit<ComponentProps<typeof motion.div>, 'initial' | 'animate'> & {
  /** Position in the page's sequence: 0 moves first, each step follows 70 ms later. */
  order?: number;
  /** How the element arrives. */
  from?: RevealFrom;
  /** Render the finished state with no entrance. */
  off?: boolean;
};

/**
 * A `div` that plays a short entrance on the on-stage page and is simply
 * there everywhere else. It takes the same props as a `div`, so it can be the
 * positioned box itself rather than a wrapper around it.
 */
export const Reveal = ({ order = 0, from = 'rise', off = false, ...rest }: RevealProps) => {
  const live = useStageMotion() && !off;
  return (
    <motion.div
      // Remount when the page goes on or off stage, so the entrance plays from
      // the start and a page that leaves the stage snaps to its finished state.
      key={live ? 'live' : 'still'}
      initial={live ? FROM[from] : false}
      animate={TO[from]}
      transition={{
        duration: MOTION.duration,
        ease: MOTION.ease,
        delay: MOTION.lead + order * MOTION.step,
      }}
      {...rest}
    />
  );
};

export default Reveal;
