// Renders the clay ball still used as the fallback image on the cover and close.
// Usage: node docs/superpowers/render-clay-ball.mjs [out.png] [time] [shader.wgsl]
// By default the shader is read from slides/design-loop/index.tsx (CLAY_WGSL).
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { effect, init, target } from 'vgpu/node';
import { prepareShader } from '@vgpu/wgsl/prepare';

const out = process.argv[2] ?? 'slides/design-loop/assets/clay-ball.png';
const time = Number(process.argv[3] ?? 0);
const file = process.argv[4];
const SIZE = 800;
const EXTENT = 2;

let wgsl;
if (file) {
  wgsl = readFileSync(file, 'utf8');
} else {
  const deck = readFileSync('slides/design-loop/index.tsx', 'utf8');
  const m = deck.match(/const CLAY_WGSL = \/\* wgsl \*\/ `([\s\S]*?)`;/);
  if (!m) throw new Error('CLAY_WGSL not found in slides/design-loop/index.tsx');
  wgsl = m[1];
}

const gpu = await init();
const colour = target(gpu, { size: [SIZE, SIZE] });
const ball = effect(gpu, prepareShader(wgsl), {
  set: { params: { time, px: (2 * EXTENT) / SIZE } },
});
ball.draw(colour);
const pixels = await colour.color.read({ mipLevel: 0, region: 'all' });

// The shader writes premultiplied alpha; PNG stores straight alpha.
const png = new PNG({ width: SIZE, height: SIZE });
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
console.log(`wrote ${out} (${SIZE}x${SIZE}, time ${time})`);
