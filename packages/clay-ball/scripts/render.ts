// Renders the still that ClayBall shows before (or instead of) the live canvas.
// Usage, from the repo root:  bun run render:clay
// Optional arguments: [out.png] [time in seconds]
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { prepareShader } from '@vgpu/wgsl/prepare';
import { PNG } from 'pngjs';
import { effect, init, target } from 'vgpu/node';
import { CLAY_EXTENT, CLAY_PX, CLAY_WGSL } from '../src/shader';

const out = process.argv[2] ?? fileURLToPath(new URL('../src/clay-ball.png', import.meta.url));
const time = Number(process.argv[3] ?? 0);

const gpu = await init();
const colour = target(gpu, { size: [CLAY_PX, CLAY_PX] });
const ball = effect(gpu, prepareShader(CLAY_WGSL), {
  set: { params: { time, px: (2 * CLAY_EXTENT) / CLAY_PX } },
});
ball.draw(colour);
const pixels = await colour.color.read({ mipLevel: 0, region: 'all' });

// The shader writes premultiplied alpha; PNG stores straight alpha.
const png = new PNG({ width: CLAY_PX, height: CLAY_PX });
for (let i = 0; i < pixels.length; i += 4) {
  const a = pixels[i + 3];
  const k = a ? 255 / a : 0;
  png.data[i] = Math.min(255, Math.round(pixels[i] * k));
  png.data[i + 1] = Math.min(255, Math.round(pixels[i + 1] * k));
  png.data[i + 2] = Math.min(255, Math.round(pixels[i + 2] * k));
  png.data[i + 3] = a;
}
writeFileSync(out, PNG.sync.write(png));
gpu.dispose();
console.log(`wrote ${out} (${CLAY_PX}x${CLAY_PX}, time ${time})`);
