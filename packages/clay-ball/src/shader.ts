// One fragment shader ray-marches a lumpy, thumb-dented sphere and the soft
// shadow it drops on the paper. The canvas is CLAY_EXTENT times the ball's
// diameter so the shadow has room.
//
// src/clay-ball.png is this shader at time 0. After changing the shader, run
// `bun run render:clay` from the repo root to redraw it.

/** Canvas size as a multiple of the ball's diameter. Must match EXTENT below. */
export const CLAY_EXTENT = 2;

/** Backing-store size of the live canvas and of the still, in pixels. */
export const CLAY_PX = 800;

export const CLAY_WGSL = /* wgsl */ `struct Params { time: f32, px: f32 }
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
