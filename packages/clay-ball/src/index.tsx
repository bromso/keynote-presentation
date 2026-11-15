// ClayBall: a slowly turning clay ball for an open-slide page.
//
// It shows a still PNG, then crossfades to a live WebGPU render (vgpu) once
// the first frame has drawn. Thumbnails, print, reduced motion and browsers
// without WebGPU keep the PNG.
import { useIsActivePage } from '@open-slide/core';
import { animate, motionValue } from 'motion';
import { useEffect, useRef, useState } from 'react';
import clayStill from './clay-ball.png';
import { CLAY_EXTENT, CLAY_PX, CLAY_WGSL } from './shader';

export { CLAY_EXTENT, CLAY_PX, CLAY_WGSL } from './shader';

export type ClayBallProps = {
  /** Centre of the ball in slide px. */
  x: number;
  y: number;
  /** Diameter of the ball in slide px. */
  size?: number;
};

export const ClayBall = ({ x, y, size = 200 }: ClayBallProps) => {
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
      // A motion value added to the clock: the ball starts on the still's
      // exact pose, gives one quick turn as it comes alive, and a spring
      // settles it into the slow, steady rotation.
      const kick = motionValue(0);
      const spin = animate(kick, 6, { type: 'spring', stiffness: 26, damping: 11, delay: 0.3 });
      let first = true;
      const loop = frameLoop(gpu, (frame) => {
        ball.set({ params: { time: time.time + kick.get() } });
        frame.pass(face, ball);
        if (first) {
          first = false;
          setLive(true);
        }
      });
      release = () => {
        spin.stop();
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
    <div
      style={{ position: 'absolute', left: x - box / 2, top: y - box / 2, width: box, height: box }}
    >
      {/* Plain elements with a CSS crossfade. A motion.img here kept
          open-slide's preview waiting on img.decode() for seconds. */}
      <img
        src={clayStill}
        alt=""
        style={{ ...fill, opacity: live ? 0 : 1, transition: live ? 'opacity 0.3s' : 'none' }}
      />
      <canvas
        ref={canvasRef}
        width={CLAY_PX}
        height={CLAY_PX}
        style={{ ...fill, opacity: live ? 1 : 0, transition: live ? 'opacity 0.3s' : 'none' }}
      />
    </div>
  );
};

export default ClayBall;
