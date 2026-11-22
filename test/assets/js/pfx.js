/* ============ PIXELFX: pixel art effects by Patch and Hugo Duprez (https://github.com/patch-gg/pixelfx), bundled by pfxbundle.js. Do not edit by hand.
 * MIT License
 * 
 * Copyright (c) 2026 Patch
 * Copyright (c) 2026 Hugo Duprez
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Parts adapt Sprite Fusion's pixel art VFX (Hugo Duprez, MIT) and Hollow Crown (rehan-remade, MIT): see vendor/pixelfx/NOTICE.md.
 */
const PFX = (function () {
  const __defs = {}, __cache = {};
  const __x = (o, k, g) => Object.defineProperty(o, k, { get: g, enumerable: true, configurable: true });
  const __star = (o, src) => { for (const k of Object.keys(src)) if (k !== 'default' && !(k in o)) __x(o, k, () => src[k]); };
  function __req(r) { if (__cache[r]) return __cache[r]; const e = __cache[r] = {}; __defs[r](e); return e; }
  __defs["core/math.js"] = function (__e) {
__x(__e, "hash", () => hash);
__x(__e, "Rng", () => Rng);
__x(__e, "noise", () => noise);
__x(__e, "noise2", () => noise2);
__x(__e, "fbm", () => fbm);
__x(__e, "tileNoise", () => tileNoise);
__x(__e, "tileFbm", () => tileFbm);
__x(__e, "loopNoise", () => loopNoise);
__x(__e, "TAU", () => TAU);
__x(__e, "clamp", () => clamp);
__x(__e, "lerp", () => lerp);
__x(__e, "invLerp", () => invLerp);
__x(__e, "remap", () => remap);
__x(__e, "fract", () => fract);
__x(__e, "wrap", () => wrap);
__x(__e, "seg", () => seg);
__x(__e, "smooth", () => smooth);
__x(__e, "bump", () => bump);
__x(__e, "pingpong", () => pingpong);
__x(__e, "dist", () => dist);
__x(__e, "angleTo", () => angleTo);
__x(__e, "ease", () => ease);
__x(__e, "rand", () => rand);
__x(__e, "rng", () => rng);
// Numbers, easing, randomness and noise. Everything here is pure and deterministic,
// so an effect drawn at time t always looks the same.

const TAU = Math.PI * 2;

const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const invLerp = (a, b, x) => (b === a ? 0 : (x - a) / (b - a));
const remap = (x, a0, a1, b0, b1) => lerp(b0, b1, invLerp(a0, a1, x));
const fract = (x) => x - Math.floor(x);
const wrap = (x, m) => ((x % m) + m) % m;
/** Progress 0..1 of t through the window [t0, t1]: 0 before it, 1 after it. */
const seg = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
/** Hermite smoothstep of x between e0 and e1. */
const smooth = (e0, e1, x) => {
  const t = seg(x, e0, e1);
  return t * t * (3 - 2 * t);
};
/** 0 → 1 → 0 over the window [t0, t1] (sine bump). */
const bump = (t, t0, t1) => (t <= t0 || t >= t1 ? 0 : Math.sin(Math.PI * seg(t, t0, t1)));
const pingpong = (x) => 1 - Math.abs(wrap(x, 2) - 1);
const dist = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);
const angleTo = (x0, y0, x1, y1) => Math.atan2(y1 - y0, x1 - x0);

/** Easing curves: input 0..1, output 0..1 (back and elastic overshoot). */
const ease = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inQuart: (t) => t * t * t * t,
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  outSine: (t) => Math.sin((t * Math.PI) / 2),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  inBack: (t, s = 1.70158) => (t <= 0 ? 0 : t >= 1 ? 1 : (s + 1) * t * t * t - s * t * t),
  outBack: (t, s = 1.70158) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)),
  outElastic: (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
  outBounce: (t) => {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  },
};

/** 32-bit integer hash of any number of integers. */
function hash(...ns) {
  let h = 0x9e3779b9;
  for (const n of ns) {
    h = Math.imul(h ^ (n | 0), 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
  }
  return h >>> 0;
}
/** Deterministic random number in [0, 1) from integers (seed, particle index, which value...). */
const rand = (...ns) => hash(...ns) / 4294967296;

/** Seeded random generator (mulberry32). */
class Rng {
  constructor(seed = 1) {
    this.s = seed >>> 0 || 1;
  }
  next() {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a, b) {
    return a + (b - a) * this.next();
  }
  int(a, b) {
    return Math.floor(this.range(a, b + 1));
  }
  chance(p) {
    return this.next() < p;
  }
  sign() {
    return this.next() < 0.5 ? -1 : 1;
  }
  pick(list) {
    return list[Math.floor(this.next() * list.length)];
  }
  /** Roughly normal, mean 0, sd 1. */
  gauss() {
    return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
  }
}
/** A generator for one particle: rng(seed, i) gives the same numbers every frame. */
const rng = (...ns) => new Rng(hash(...ns));

/** Smooth 1D value noise in [-1, 1]. */
function noise(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(rand(i, seed), rand(i + 1, seed), u) * 2 - 1;
}
/** Smooth 2D value noise in [-1, 1]. */
function noise2(x, y, seed = 0) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = rand(ix, iy, seed), b = rand(ix + 1, iy, seed), c = rand(ix, iy + 1, seed), d = rand(ix + 1, iy + 1, seed);
  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy) * 2 - 1;
}
/** Fractal 2D noise in about [-1, 1]. */
function fbm(x, y, seed = 0, octaves = 3) {
  let s = 0, a = 0.5, n = 0;
  for (let o = 0; o < octaves; o++) {
    s += noise2(x, y, seed + o * 101) * a;
    n += a;
    x *= 2.03;
    y *= 2.03;
    a *= 0.5;
  }
  return s / n;
}
/**
 * 2D value noise whose lattice repeats every px cells in x and py cells in y (0: no repeat). Scroll it by
 * exactly py cells over a loop and the loop has no seam: tileNoise(x, y + phase * py, 0, py).
 */
function tileNoise(x, y, px = 0, py = 0, seed = 0) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const x0 = px ? wrap(ix, px) : ix, x1 = px ? wrap(ix + 1, px) : ix + 1;
  const y0 = py ? wrap(iy, py) : iy, y1 = py ? wrap(iy + 1, py) : iy + 1;
  const a = rand(x0, y0, seed), b = rand(x1, y0, seed), c = rand(x0, y1, seed), d = rand(x1, y1, seed);
  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy) * 2 - 1;
}
/** Fractal tileNoise: every octave keeps the repeat, so scrolled fields still loop. */
function tileFbm(x, y, px = 0, py = 0, seed = 0, octaves = 3) {
  let s = 0, a = 0.5, n = 0, k = 1;
  for (let o = 0; o < octaves; o++) {
    s += tileNoise(x * k, y * k, px * k, py * k, seed + o * 101) * a;
    n += a;
    a *= 0.5;
    k *= 2;
  }
  return s / n;
}
/** Noise that loops: the same value at phase 0 and phase 1 (for seamless loops). */
function loopNoise(phase, radius = 1, seed = 0) {
  const a = phase * TAU;
  return noise2(Math.cos(a) * radius + 50, Math.sin(a) * radius + 50, seed);
}

};
  __defs["core/color.js"] = function (__e) {
__x(__e, "hex", () => hex);
__x(__e, "mix", () => mix);
__x(__e, "fit", () => fit);
__x(__e, "blend", () => blend);
__x(__e, "rgb", () => rgb);
__x(__e, "red", () => red);
__x(__e, "green", () => green);
__x(__e, "blue", () => blue);
__x(__e, "toHex", () => toHex);
__x(__e, "scale", () => scale);
__x(__e, "luma", () => luma);
__x(__e, "ramp", () => ramp);
__x(__e, "at", () => at);
__x(__e, "PAL", () => PAL);
__x(__e, "RAMP", () => RAMP);
__x(__e, "WHITE", () => WHITE);
__x(__e, "BLACK", () => BLACK);
__x(__e, "INK", () => INK);
__x(__e, "PATCH", () => PATCH);
// Colors are 32-bit integers laid out like ImageData bytes (R, G, B, A in memory),
// so a frame's color buffer can be shown with new ImageData(new Uint8ClampedArray(buf.buffer), w, h).

const { clamp } = __req("core/math.js");

const rgb = (r, g, b) => (255 << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255);
const red = (c) => c & 255;
const green = (c) => (c >>> 8) & 255;
const blue = (c) => (c >>> 16) & 255;

/** "#rgb" or "#rrggbb" (or a color number, passed through) to a color number. */
function hex(h) {
  if (typeof h === "number") return h;
  let s = h.replace("#", "");
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  const v = parseInt(s.slice(0, 6), 16);
  return rgb((v >> 16) & 255, (v >> 8) & 255, v & 255);
}
const toHex = (c) => "#" + [red(c), green(c), blue(c)].map((v) => v.toString(16).padStart(2, "0")).join("");

/** Linear mix of two colors. */
function mix(a, b, t) {
  t = clamp(t);
  return rgb(red(a) + (red(b) - red(a)) * t, green(a) + (green(b) - green(a)) * t, blue(a) + (blue(b) - blue(a)) * t);
}
/** Multiply a color's brightness by k. */
const scale = (c, k) => rgb(Math.min(255, red(c) * k), Math.min(255, green(c) * k), Math.min(255, blue(c) * k));
/** Perceived brightness 0..1. */
const luma = (c) => (0.299 * red(c) + 0.587 * green(c) + 0.114 * blue(c)) / 255;

/** A list of hex strings (dark to bright) to color numbers. */
const ramp = (list) => list.map(hex);
/**
 * Resample a ramp to exactly n steps, keeping its ends (the darkest and brightest stay put). Lets an effect
 * index steps by number (C[5]) whatever length of palette a caller passes.
 */
function fit(r, n) {
  r = r.map(hex);
  if (r.length === n) return r;
  return Array.from({ length: n }, (_, i) => r[Math.round((i * (r.length - 1)) / Math.max(1, n - 1))]);
}
/** The ramp step for t in 0..1, no blending: pixel art picks a color, it doesn't fade between two. */
const at = (r, t) => r[clamp(Math.floor(t * r.length), 0, r.length - 1)];
/** Blended color along a ramp (for light, where smooth is right). */
function blend(r, t) {
  const x = clamp(t) * (r.length - 1), i = Math.min(r.length - 2, Math.floor(x));
  return mix(r[i], r[i + 1], x - i);
}

// Hue-shifted ramps, dark to bright: shadows lean cool or deep, highlights lean warm or white.
// Effects take `palette` as an option, so any of these (or your own) can recolor them.
const PAL = {
  fire: ["#1f0b10", "#4a1118", "#8c1d1c", "#cc3a1a", "#f2701f", "#ffae35", "#ffe27a", "#fff8d6"],
  ember: ["#1a0a0e", "#3d1012", "#701a14", "#a8301a", "#e0561e", "#ff8a2a", "#ffc46a"],
  lava: ["#14060a", "#380a10", "#6e1210", "#ac2410", "#e8501a", "#ff8c2a", "#ffd25a"],
  smoke: ["#0e0c12", "#1d1a22", "#2e2a35", "#433e4b", "#5c5664", "#7b7484", "#a39cab"],
  dust: ["#1c1610", "#33281c", "#4f3f2c", "#6e5a40", "#927a58", "#b89f78", "#dcc8a2"],
  ice: ["#0c1430", "#162c5c", "#1f4f94", "#2f7fcc", "#58b4ec", "#9bdcff", "#d8f4ff", "#ffffff"],
  water: ["#081830", "#0e2e5a", "#14508c", "#1c76bc", "#36a2e0", "#78ccf4", "#c4ecff", "#ffffff"],
  electric: ["#0a0f2e", "#172a78", "#2550d0", "#3f8cff", "#7cc8ff", "#c8f0ff", "#ffffff"],
  volt: ["#24160a", "#5e3a0c", "#a8680f", "#e8a218", "#ffd23c", "#fff08a", "#ffffff"],
  poison: ["#0d1a0c", "#173a14", "#265e18", "#3f8a1e", "#6cb82a", "#a8e04a", "#e0ff8a"],
  holy: ["#2a1c08", "#5a3e10", "#9a6c18", "#d8a428", "#ffd84a", "#fff09a", "#fffbe6", "#ffffff"],
  heal: ["#08201a", "#0f3f2c", "#17663e", "#24924e", "#3ec466", "#7ee88a", "#c8ffc4", "#ffffff"],
  arcane: ["#140a26", "#2b1252", "#481c88", "#6b2cc0", "#9a48ec", "#c684ff", "#ecc8ff", "#ffffff"],
  shadow: ["#050308", "#0f0a18", "#1c1230", "#2c1a4a", "#432468", "#5e3290", "#8048b8", "#a970e0"],
  blood: ["#14040a", "#3a0a14", "#6a101c", "#a01824", "#d42a30", "#ff5a50", "#ff9a8a"],
  earth: ["#140e0a", "#2a1e14", "#47321e", "#69492a", "#8e6638", "#b88a52", "#dcb47c"],
  stone: ["#0e0e12", "#1c1c24", "#2c2c38", "#42424f", "#5c5c6b", "#7d7d8c", "#a4a4b2", "#d0d0da"],
  gold: ["#1e1206", "#4a2c08", "#86520c", "#c48412", "#f0b424", "#ffe066", "#fff6c4", "#ffffff"],
  leaf: ["#0c1a0e", "#163418", "#225224", "#357530", "#4f9a3a", "#7cc048", "#b4e070", "#e4ffb0"],
  wood: ["#160c06", "#2e1a0c", "#4a2c14", "#6a421e", "#8e5c2c", "#b47c40", "#d8a464"],
  metal: ["#0c0e14", "#1c2230", "#2e3648", "#4a5468", "#6e7a90", "#9aa6ba", "#d0d8e6", "#ffffff"],
  bone: ["#1a1814", "#3a352c", "#5e5648", "#8a806c", "#b8ad96", "#e4dcc8", "#fffaf0"],
  neon: ["#1a0516", "#3d0a33", "#701560", "#b0228f", "#f53cd1", "#ff86e6", "#ffd2f6", "#ffffff"],
  cyber: ["#041418", "#08303a", "#0c5260", "#108088", "#18b4b0", "#4ce8d8", "#b4fff0", "#ffffff"],
  matrix: ["#020a04", "#05200c", "#0a3c16", "#106624", "#1a9a34", "#3cd650", "#a4ffa8", "#e8ffe8"],
  candy: ["#ff4a5a", "#ff9a2a", "#ffe03c", "#5ad84a", "#3cc8ff", "#7a6cff", "#f53cd1"],
  night: ["#07060d", "#0c0a18", "#131026", "#1b1734", "#241f44", "#2f2956"],
};
/** The same ramps as color numbers. */
const RAMP = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, ramp(v)]));

const WHITE = hex("#ffffff");
const BLACK = hex("#000000");
const INK = hex("#0b0a10");
const PATCH = hex("#f53cd1");

};
  __defs["core/particles.js"] = function (__e) {
__x(__e, "fly", () => fly);
__x(__e, "flyV", () => flyV);
__x(__e, "burst", () => burst);
__x(__e, "cycle", () => cycle);
__x(__e, "stream", () => stream);
__x(__e, "Particles", () => Particles);
// Particles without a simulation: each one's position is a closed-form function of its age, so an effect
// can be drawn at any time t, scrubbed, looped and rendered to a sprite sheet frame by frame.

const { rng, clamp } = __req("core/math.js");

/**
 * Where a particle is after t seconds, launched from (x, y) at (vx, vy) px/s, under gravity g (px/s²,
 * positive is down) and linear drag (1/s). Returns [x, y].
 */
function fly(x, y, vx, vy, t, g = 0, drag = 0) {
  if (drag <= 0) return [x + vx * t, y + vy * t + 0.5 * g * t * t];
  const f = (1 - Math.exp(-drag * t)) / drag, vt = g / drag;
  return [x + vx * f, y + vt * t + (vy - vt) * f];
}
/** Its velocity at t, for streaks that point along the motion. Returns [vx, vy]. */
function flyV(vx, vy, t, g = 0, drag = 0) {
  if (drag <= 0) return [vx, vy + g * t];
  const e = Math.exp(-drag * t), vt = g / drag;
  return [vx * e, vt + (vy - vt) * e];
}

/**
 * n one-shot particles: fn(r, i) with a repeatable rng per particle (the same numbers every frame).
 */
function burst(n, seed, fn) {
  for (let i = 0; i < n; i++) fn(rng(seed, i), i);
}

/**
 * Particles that repeat every `period` seconds, for loops with no seam. Particle i is born at its own
 * phase in the period and lives `life` seconds (a number, or a function of an rng). For every live copy,
 * fn(age, life, r, i) is called; r is a fresh rng for particle i, the same each period.
 */
function cycle(t, period, count, seed, life, fn) {
  for (let i = 0; i < count; i++) {
    const g = rng(seed, i, 911);
    const born = g.next() * period;
    const L = typeof life === "function" ? life(g) : life;
    let age = (((t - born) % period) + period) % period;
    for (; age < L; age += period) fn(age, L, rng(seed, i), i);
  }
}

/**
 * Particles born at a steady rate between t0 and t1 (an emitter that stops): fn(age, life, r, i) for every
 * particle alive at t. rate is particles per second.
 */
function stream(t, t0, t1, rate, seed, life, fn) {
  const n = Math.floor((Math.min(t, t1) - t0) * rate);
  for (let i = 0; i <= n; i++) {
    const born = t0 + i / rate, g = rng(seed, i, 911), L = typeof life === "function" ? life(g) : life;
    const age = t - born;
    if (age >= 0 && age < L) fn(age, L, rng(seed, i), i);
  }
}

/** A simple simulated particle list, for effects that export create() and keep state. */
class Particles {
  constructor() {
    this.list = [];
  }
  /** p: { x, y, vx, vy, life, g?, drag?, ground?, bounce? } plus anything you want to draw with. */
  add(p) {
    p.age = 0;
    p.g ??= 0;
    p.drag ??= 0;
    this.list.push(p);
    return p;
  }
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      if ((p.age += dt) >= p.life) {
        this.list.splice(i, 1);
        continue;
      }
      p.vx -= p.vx * p.drag * dt;
      p.vy += p.g * dt - p.vy * p.drag * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.ground !== undefined && p.y > p.ground) {
        p.y = p.ground;
        p.vy = -Math.abs(p.vy) * (p.bounce ?? 0.3);
        p.vx *= 0.7;
      }
    }
  }
  /** Life left, 1 at birth to 0 at death. */
  static k(p) {
    return clamp(1 - p.age / p.life);
  }
}

};
  __defs["core/shapes.js"] = function (__e) {
__x(__e, "bolt", () => bolt);
__x(__e, "forks", () => forks);
__x(__e, "star", () => star);
__x(__e, "ngon", () => ngon);
__x(__e, "trail", () => trail);
// Point lists for shapes effects keep reaching for: lightning paths, stars, polygons, trails.

const { TAU } = __req("core/math.js");

/**
 * A jagged lightning path from (x0, y0) to (x1, y1) by midpoint displacement. jag is how far a midpoint
 * may move sideways, as a share of the segment's length. Returns [[x, y], ...].
 */
function bolt(r, x0, y0, x1, y1, { jag = 0.22, depth = 5 } = {}) {
  let pts = [[x0, y0], [x1, y1]];
  for (let d = 0; d < depth; d++) {
    const next = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy);
      const off = (r.next() * 2 - 1) * jag * L;
      next.push([(ax + bx) / 2 + (-dy / (L || 1)) * off, (ay + by) / 2 + (dx / (L || 1)) * off], pts[i]);
    }
    pts = next;
  }
  return pts;
}

/** Forks off a bolt path: count branches, each up to len px long. Returns a list of paths. */
function forks(r, path, { count = 3, len = 20, jag = 0.3, spread = 0.9 } = {}) {
  const out = [];
  for (let k = 0; k < count; k++) {
    const i = 1 + Math.floor(r.next() * (path.length - 2)), [x, y] = path[i], [px, py] = path[i - 1];
    const a = Math.atan2(y - py, x - px) + (r.next() < 0.5 ? -1 : 1) * spread * (0.4 + 0.6 * r.next());
    const l = len * (0.4 + 0.6 * r.next());
    out.push(bolt(r, x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, { jag, depth: 3 }));
  }
  return out;
}

/** A star: n points between radii r1 (tips) and r0 (inner corners). */
function star(cx, cy, r0, r1, n = 5, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * Math.PI) / n, r = i % 2 ? r0 : r1;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

/** A regular polygon with n sides. */
function ngon(cx, cy, r, n = 6, rot = 0) {
  return Array.from({ length: n }, (_, i) => [cx + Math.cos(rot + (i * TAU) / n) * r, cy + Math.sin(rot + (i * TAU) / n) * r]);
}

/** Positions of pos(t - i * dt) for i = 0..n-1: a moving thing's trail, newest first. */
function trail(pos, t, n, dt) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(pos(Math.max(0, t - i * dt)));
  return out;
}

};
  __defs["core/sim.js"] = function (__e) {
__x(__e, "Particles", () => Particles);
__x(__e, "Blazes", () => Blazes);
__x(__e, "Bits", () => Bits);
__x(__e, "Lights", () => Lights);
__x(__e, "sparkle", () => sparkle);
__x(__e, "flare", () => flare);
__x(__e, "band", () => band);
__x(__e, "crystal", () => crystal);
__x(__e, "GRAVITY", () => GRAVITY);
__x(__e, "FIRE_RAMP", () => FIRE_RAMP);
__x(__e, "SMOKE_RAMP", () => SMOKE_RAMP);
__x(__e, "P", () => P);
__x(__e, "PF", () => PF);
__x(__e, "B", () => B);
// Simulated particles, debris and lights, for effects that want real physics: sparks that streak and bounce
// off the floor, shards that tumble and settle, vapour and smoke that swell and thin, lights that flare and die.
// Adapted from Sprite Fusion's open-source pixel art VFX (https://www.spritefusion.com/pixel-art-vfx),
// MIT License, Copyright (c) 2026 Hugo Duprez. Units here are art pixels and seconds; draw through a Painter,
// so effects stay in local space and mirror or rotate like any other.

const { Rng, clamp, TAU } = __req("core/math.js");
const { hex, scale, mix, rgb, WHITE } = __req("core/color.js");

const GRAVITY = 950; // px/s²
const CROSS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const HOT = ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"].map(hex);
/** Fire from white-hot to smouldering, and smoke from fresh to thin: the ramps FIRE puffs and SMOKE walk down. */
const FIRE_RAMP = ["#ffffff", "#fff3a6", "#ffe26b", "#ffc23d", "#ff8a2a", "#f2561d", "#c9281f", "#8a1f17", "#4a1712"].map(hex);
const SMOKE_RAMP = ["#7b6f72", "#5d5660", "#433d48", "#2b2630", "#1a171e"].map(hex);
const rampAt = (r, t) => r[Math.min(r.length - 1, Math.max(0, Math.floor(t * r.length)))];

/** Particle kinds. */
const P = { SPARK: 0, MOTE: 1, STREAK: 2, FLAKE: 3, VAPOUR: 4, DUST: 5, STAR: 6, EMBER: 7, SMOKE: 8, FIRE: 9, BRAND: 10, GRIT: 11 };
/** Particle flags: SMOKES (a FIRE puff leaves smoke when it dies), BIG (bigger, slower smoke), BACK (draw behind). */
const PF = { SMOKES: 1, BIG: 2, BACK: 4 };
const SOFT = new Set([P.VAPOUR, P.DUST, P.SMOKE]);

/**
 * A particle system. opts: { seed, ground: (x) => floor y (local px; sparks bounce on it), sparks: [head..tail]
 * colors for SPARK, haze: color vapour glows with }.
 * spawn(kind, x, y, vx, vy, life, color, size); update(dt); draw(p, layer): "back" draws the soft kinds
 * (vapour, dust, smoke), "front" the rest, nothing for both.
 */
class Particles {
  constructor(opts = {}) {
    this.R = opts.rng ?? new Rng(opts.seed ?? 1);
    this.list = [];
    this.t = 0;
    this.ground = opts.ground ?? (() => Infinity);
    this.sparks = (opts.sparks ?? HOT).map(hex);
    this.haze = opts.haze === undefined ? null : hex(opts.haze);
    this.onLand = opts.onLand ?? null; // (x, y) when a BRAND hits the floor
  }
  /** delay: seconds before it appears; flag: PF bits. col 0 lets FIRE and SMOKE use their own ramps. */
  spawn(k, x, y, vx, vy, life, col = WHITE, size = 1, delay = 0, flag = 0) {
    this.list.push({ k, x, y, vx, vy, life, max: life, col: col ? hex(col) : 0, size, seed: this.R.next() * 100, delay, flag });
  }
  get count() {
    return this.list.length;
  }
  update(dt) {
    this.t += dt;
    const R = this.R, t = this.t;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      if (p.delay > 0) {
        p.delay -= dt;
        continue;
      }
      if ((p.life -= dt) <= 0) {
        if (p.k === P.FIRE && p.flag & PF.SMOKES) {
          const big = p.flag & PF.BIG;
          this.spawn(P.SMOKE, p.x, p.y, p.vx * 0.6, p.vy * 0.6 - 6, big ? R.range(1.3, 2.3) : R.range(0.8, 1.4), 0, p.size * (big ? 0.85 : 0.7), 0, big ? PF.BIG : 0);
        }
        this.list.splice(i, 1);
        continue;
      }
      switch (p.k) {
        case P.FIRE:
          p.vy -= 95 * dt;
          p.vx += Math.sin(t * 17 + p.seed) * 30 * dt;
          p.vx -= p.vx * 5 * dt;
          p.vy -= p.vy * 3.2 * dt;
          break;
        case P.GRIT: {
          p.vy += GRAVITY * dt;
          p.vx -= p.vx * 0.8 * dt;
          const g = this.ground(p.x), ny = p.y + p.vy * dt;
          p.x += p.vx * dt;
          if (p.vy > 0 && p.y <= g && ny >= g) {
            p.y = g - 0.25;
            if (p.vy > 130 && R.chance(0.4)) (p.vy = -p.vy * 0.25), (p.vx = p.vx * 0.5 + R.range(-10, 10));
            else (p.vx = p.vy = 0), (p.life = Math.min(p.life, 0.5));
          } else p.y = ny;
          continue;
        }
        case P.BRAND: {
          // a burning chunk: arcs, trails flame, and starts a little fire where it lands
          p.vy += GRAVITY * 0.8 * dt;
          p.vx -= p.vx * 0.9 * dt;
          if (R.chance(0.9 * Math.min(1, dt * 60))) this.spawn(P.FIRE, p.x, p.y, p.vx * 0.1 + R.range(-7, 7), p.vy * 0.1 - 10, R.range(0.16, 0.32), 0, R.range(0.9, 1.7) * (0.5 + (p.life / p.max) * 0.6), 0, R.chance(0.4) ? PF.SMOKES : 0);
          const g = this.ground(p.x), ny = p.y + p.vy * dt;
          p.x += p.vx * dt;
          if (p.vy > 0 && p.y <= g && ny >= g) {
            this.onLand?.(p.x, g);
            this.list.splice(i, 1);
          } else p.y = ny;
          continue;
        }
        case P.SPARK: {
          p.vy += GRAVITY * 0.45 * dt;
          p.vx -= p.vx * 2.2 * dt;
          p.vy -= p.vy * 2.2 * dt;
          const g = this.ground(p.x), ny = p.y + p.vy * dt;
          p.x += p.vx * dt;
          if (p.vy > 0 && p.y <= g && ny >= g) (p.vy = -p.vy * 0.45), (p.vx *= 0.7), (p.y = g - 0.25);
          else p.y = ny;
          continue;
        }
        case P.STREAK: (p.vx += p.vx * 3 * dt), (p.vy += p.vy * 3 * dt); break;
        case P.FLAKE:
          p.vx -= p.vx * 2.2 * dt;
          p.vy -= p.vy * 2.2 * dt - 35 * dt;
          p.x += Math.sin(this.t * 2.5 + p.seed) * 7 * dt;
          break;
        case P.EMBER:
          p.vy += (-30 + Math.sin(t * 3 + p.seed) * 20) * dt;
          p.vx += Math.cos(t * 2.3 + p.seed) * 45 * dt;
          p.vx -= p.vx * 1.6 * dt;
          p.vy -= p.vy * 1.6 * dt;
          break;
        case P.SMOKE: {
          const big = p.flag & PF.BIG;
          p.vy -= (big ? 23 : 16) * dt;
          p.vx += Math.sin(t * 1.3 + p.seed) * 8 * dt;
          p.vx -= p.vx * 1.6 * dt;
          p.vy -= p.vy * 1.2 * dt;
          break;
        }
        case P.MOTE: p.vx -= p.vx * 0.6 * dt; p.vy -= p.vy * 0.6 * dt; break;
        default: {
          const drag = SOFT.has(p.k) ? 4 : 1.6;
          p.vx -= p.vx * drag * dt;
          p.vy -= p.vy * drag * dt + 5 * dt;
        }
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }
  draw(p, layer) {
    for (const q of this.list) {
      if (q.delay > 0) continue;
      if (layer && (SOFT.has(q.k) || q.flag & PF.BACK ? "back" : "front") !== layer) continue;
      const k = q.life / q.max, x = q.x, y = q.y, sp = Math.hypot(q.vx, q.vy) || 1, ux = q.vx / sp, uy = q.vy / sp;
      switch (q.k) {
        case P.SPARK: {
          const S = this.sparks, head = k > 0.6 ? S[0] : k > 0.3 ? S[1] : S[2], len = Math.min(9, 1 + sp * 0.022);
          p.line(x - ux * len, y - uy * len, x - ux * len * 0.4, y - uy * len * 0.4, k > 0.5 ? head : S[S.length - 1]);
          p.line(x - ux * len * 0.45, y - uy * len * 0.45, x, y, head);
          p.glow(x, y, 3, head, 0.45 * k);
          break;
        }
        case P.MOTE: {
          const len = Math.min(16, 0.5 + sp * 0.026) * q.size, a = k < 0.35 ? k / 0.35 : 1;
          p.line(x - ux * len, y - uy * len, x - ux * len * 0.35, y - uy * len * 0.35, scale(q.col, 0.55), a);
          p.line(x - ux * len * 0.4, y - uy * len * 0.4, x, y, q.col, a);
          p.glow(x, y, 2.5 + q.size, q.col, 0.4 * k);
          break;
        }
        case P.STREAK: {
          const L = clamp(sp / 30, 1, 7);
          for (let d = L; d >= 0; d -= 0.5) p.dot(x - ux * d, y - uy * d, d < 1 ? WHITE : d < L * 0.5 ? q.col : scale(q.col, 0.6), d < L * 0.5 ? 1 : 1.2 - d / L);
          p.glow(x, y, 4, q.col, 0.4);
          break;
        }
        case P.FLAKE: {
          const a = Math.min(1, k * 3);
          p.dot(x, y, q.col, a);
          if (q.size > 1.3) for (const [dx, dy] of CROSS) p.dot(x + dx, y + dy, scale(q.col, 0.8), a * 0.8);
          break;
        }
        case P.VAPOUR: {
          const r = q.size * (0.6 + (1 - k) * 0.9);
          p.disc(x, y, r, q.col, Math.pow(k, 1.3) * 0.45);
          if (this.haze) p.glow(x, y, r * 1.8, this.haze, 0.16 * k);
          break;
        }
        case P.DUST: p.disc(x, y, q.size * (0.6 + (1 - k) * 0.9), q.col, Math.pow(k, 1.3) * 0.7); break;
        case P.SMOKE: {
          // three soft discs: a body, a denser core sitting low, a lit cap while it's young
          const age = 1 - k, big = q.flag & PF.BIG;
          const r = q.size * (0.65 + Math.min(1, age * 2.5) * 0.45 + age * (big ? 0.5 : 0.4));
          const a = Math.min(1, age * 12) * Math.min(1, k * 2.4) * (big ? 0.7 : 0.58);
          const c = q.col ? mix(q.col, rampAt(SMOKE_RAMP, age), age) : rampAt(SMOKE_RAMP, age * 1.05);
          p.disc(x, y, r, c, a * 0.45);
          p.disc(x + r * 0.05, y + r * 0.06, r * 0.74, c, a * 0.62);
          if (age < 0.5) p.disc(x - r * 0.22, y - r * 0.3, r * 0.5, mix(c, WHITE, 0.12), a * 0.4 * (1 - age * 2));
          break;
        }
        case P.FIRE: {
          // a ball of flame that cools down the ramp as it rises: a darker rim, a lit core, a tongue on top
          const age = 1 - k, heat = Math.min(0.999, Math.pow(age, 0.62) + (q.seed % 1) * 0.1), F = FIRE_RAMP, n = F.length;
          const idx = Math.min(n - 2, Math.floor(heat * (n - 1)));
          const r = q.size * (0.55 + 0.45 * Math.min(1, age * 7)) * (1 - age * 0.55), c = F[idx];
          if (idx >= n - 2) p.disc(x, y, r, c, Math.min(1, k * 3) * 0.85);
          else {
            p.circle(x, y, r, F[Math.min(n - 1, idx + 2)]);
            p.circle(x - r * 0.16, y - r * 0.22, r * 0.78, c);
            if (r > 1.6) p.circle(x, y - r * 0.9, r * 0.42, c);
            if (idx <= 3 && r > 1.8) p.circle(x - r * 0.28, y - r * 0.34, r * 0.36, F[Math.max(0, idx - 1)]);
            if (idx < 6) p.glow(x, y, r * 2.4 + 2, c, 0.18 * k);
          }
          break;
        }
        case P.BRAND:
          p.circle(x, y, 1.6, HOT[3]);
          p.px(x, y, Math.sin(this.t * 40 + q.seed) > 0 ? HOT[0] : HOT[1]);
          p.px(x + 1, y, HOT[1]);
          p.glow(x, y, 7, HOT[2], 0.45);
          break;
        case P.GRIT:
          if (k > 0.25 || k * 4 > 0.5) {
            p.px(x, y, q.col);
            if (q.size >= 2) p.px(x + 1, y, q.col), p.px(x, y + 1, scale(q.col, 0.8)), p.px(x + 1, y + 1, scale(q.col, 0.7));
          }
          break;
        case P.EMBER: {
          const c = k > 0.6 ? this.sparks[0] : k > 0.3 ? this.sparks[1] : this.sparks[2];
          if (k < 0.25 && Math.sin(this.t * 40 + q.seed) < 0) break;
          p.px(x, y, c);
          if (q.size > 1.5) p.px(x, y + 1, this.sparks[this.sparks.length - 1]);
          p.glow(x, y, 3 + q.size, c, 0.35 * k);
          break;
        }
        default: {
          // STAR: a twinkling cross, arms set by size
          const tw = 0.6 + 0.4 * Math.sin(this.t * (8 + (q.seed % 5)) + q.seed);
          if (q.size < 1) {
            if (tw * k > 0.25) p.px(x, y, tw > 0.8 ? WHITE : q.col);
            p.glow(x, y, 3, q.col, 0.4 * k * tw);
            break;
          }
          sparkle(p, x, y, q.size * tw * Math.min(1, k * 3), q.col, scale(q.col, 0.75), 0.5 * k * tw);
        }
      }
    }
  }
}

/**
 * Little fires burning where something landed: add(x, y, life, power) feeds FIRE puffs (and the odd ember)
 * into a particle system, fading over its life. update(dt); drawBack(p) adds a hot pixel and a glow at its foot.
 */
class Blazes {
  constructor(ps) {
    this.ps = ps;
    this.list = [];
  }
  add(x, y, life, power) {
    this.list.push({ x, y, life, max: life, acc: this.ps.R.next(), power });
  }
  get count() {
    return this.list.length;
  }
  update(dt) {
    const ps = this.ps, R = ps.R;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const b = this.list[i];
      if ((b.life -= dt) <= 0) {
        this.list.splice(i, 1);
        continue;
      }
      const k = b.life / b.max, intensity = b.power * (k > 0.7 ? 1 : 0.35 + (k / 0.7) * 0.65);
      for (b.acc += dt * (6 + 16 * intensity); b.acc > 1; b.acc--) {
        const s = R.range(1.2, 2.8) * intensity;
        ps.spawn(P.FIRE, b.x + R.range(-1.5, 1.5), b.y - s * 0.6, R.range(-6, 6), R.range(-30, -12), R.range(0.28, 0.6), 0, s, 0, PF.BACK | (R.chance(0.3) ? PF.SMOKES : 0));
        if (R.chance(0.06)) ps.spawn(P.EMBER, b.x, b.y - 1.5, R.range(-15, 15), R.range(-45, -15), R.range(0.6, 1.4), HOT[2], 1, 0, PF.BACK);
      }
    }
  }
  drawBack(p) {
    for (const b of this.list) {
      const k = b.life / b.max;
      p.px(b.x, b.y, k > 0.4 ? (Math.sin(b.life * 31 + b.x) > 0 ? HOT[1] : HOT[2]) : HOT[3]);
      p.glow(b.x, b.y, 6 + 5 * k * b.power, HOT[2], 0.3 * k * b.power);
    }
  }
}

/** Debris kinds. */
const B = { SHARD: 0, CHUNK: 1, DRIP: 2 };

/**
 * Rigid debris that tumbles, bounces and settles. add({ kind, x, y, vx, vy, a, va, s (size), c (color), ramp
 * (chunk shading, dark to bright), g (gravity scale), drag, bounce, life }); update(dt); draw(p).
 */
class Bits {
  constructor(opts = {}) {
    this.list = [];
    this.ground = opts.ground ?? (() => Infinity);
  }
  add(b) {
    const life = b.life ?? 1;
    this.list.push({ kind: B.SHARD, vx: 0, vy: 0, a: 0, va: 0, s: 1, c: WHITE, g: 1, drag: 0, bounce: 0, rest: false, ...b, life, max: life });
  }
  get count() {
    return this.list.length;
  }
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const b = this.list[i];
      if ((b.life -= dt) <= 0) {
        this.list.splice(i, 1);
        continue;
      }
      if (b.rest) continue;
      b.vy += GRAVITY * b.g * dt;
      b.vx -= b.vx * b.drag * dt;
      b.vy -= b.vy * b.drag * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.a += b.va * dt;
      const floor = this.ground(b.x), sp = b.vy;
      if (b.g <= 0 || b.y < floor || sp <= 0) continue;
      b.y = floor - 0.01;
      if (b.kind === B.DRIP) b.life = 0;
      else if (b.bounce > 0 && sp > 70) (b.vy = -sp * b.bounce), (b.vx *= 0.7), (b.va *= 0.6);
      else (b.rest = true), (b.vx = b.vy = 0);
    }
  }
  draw(p) {
    for (const b of this.list) {
      const a = Math.min(1, b.life / 0.4), ca = Math.cos(b.a), sa = Math.sin(b.a);
      if (b.kind === B.SHARD) {
        for (let d = -b.s / 2; d <= b.s / 2; d += 0.5) p.dot(b.x + ca * d, b.y + sa * d, d > b.s / 2 - 0.6 ? WHITE : hex(b.c), a);
      } else if (b.kind === B.DRIP) {
        p.dot(b.x, b.y, hex(b.c), a);
        p.dot(b.x, b.y - 1, hex(b.c), a * 0.5);
      } else {
        // a shaded chunk: lit top-left, dark bottom-right, a dark rim
        const R = (b.ramp ?? ["#1c2030", "#3a4a66", "#6e86a8", "#a8c0dc", "#e8f2ff"]).map(hex), n = R.length;
        const x = Math.round(b.x), y = Math.round(b.y), r = Math.ceil(b.s) + 1;
        for (let py = -r; py <= r; py++)
          for (let px = -r; px <= r; px++) {
            const u = (px + 0.5) * ca + (py + 0.5) * sa, v = -(px + 0.5) * sa + (py + 0.5) * ca;
            const d = Math.abs(u) / b.s + Math.abs(v) / (b.s * 0.62);
            if (d > 1.3) continue;
            p.dot(x + px, y + py, d > 1 ? R[0] : v < 0 ? (u < 0 ? R[n - 1] : R[n - 2]) : u < 0 ? R[n - 3] : R[Math.max(1, n - 4)], a);
          }
      }
    }
  }
}

/** Lights that flare and die: add(x, y, r, color, k, life); update(dt); draw(p). */
class Lights {
  constructor() {
    this.list = [];
  }
  add(x, y, r, color, k, life) {
    this.list.push({ x, y, r, color: hex(color), k, life, max: life });
  }
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) if ((this.list[i].life -= dt) <= 0) this.list.splice(i, 1);
  }
  draw(p) {
    for (const l of this.list) {
      const k = l.life / l.max;
      p.glow(l.x, l.y, l.r * (0.55 + 0.45 * k), l.color, l.k * k * k);
    }
  }
}

/** A star glint: arms of length arm in color c with tips in tip, a white heart, light. */
function sparkle(p, x, y, arm, c, tip = c, k = 0.6) {
  const n = Math.round(arm);
  if (n < 1) return;
  const X = Math.floor(x), Y = Math.floor(y);
  for (let d = 1; d <= n; d++) {
    const cc = d > n * 0.6 ? tip : c;
    for (const [dx, dy] of CROSS) p.px(X + dx * d, Y + dy * d, cc);
  }
  if (n >= 3) for (const [dx, dy] of DIAG) p.px(X + dx, Y + dy, c);
  if (n >= 6) for (const [dx, dy] of DIAG) p.px(X + dx * 2, Y + dy * 2, tip);
  p.px(X, Y, WHITE);
  p.glow(x, y, 4 + n * 2, c, k);
}

/** An 8-ray flare: long rays on the axes, shorter between, fading out along their length. ramp dark to bright. */
function flare(p, x, y, L, k, ramp) {
  if (L < 1) return;
  const R = ramp.map(hex), n = R.length;
  for (let i = 0; i < 8; i++) {
    const an = (i * Math.PI) / 4, len = i % 4 === 0 ? L : i % 2 === 0 ? L * 0.6 : L * 0.3, ca = Math.cos(an), sa = Math.sin(an);
    for (let d = 0; d <= len; d += 0.5) {
      const u = d / len;
      p.dot(x + ca * d, y + sa * d, u < 0.35 ? WHITE : u < 0.7 ? R[n - 2] : R[n - 3], u < 0.6 ? 1 : k * 1.5 * (1 - u) + 0.2);
    }
  }
}

/**
 * A ring on a tilted plane (sy squashes it: 0.16 lies on the floor, 1 stands up), thickness th inward, alpha k,
 * colored by depth through the band with ramp (dark to bright). keep(angle) picks which part to draw, so the
 * far half can go behind things and the near half in front: (g) => Math.sin(g) < 0 is the far half.
 */
function band(p, cx, cy, r, sy, th, k, ramp, keep = () => true, hot = false) {
  if (r <= 0 || k <= 0) return;
  const R = ramp.map(hex), n = R.length;
  for (let j = 0, m = Math.ceil(r * TAU * 1.2); j < m; j++) {
    const ang = (j / m) * TAU, ca = Math.cos(ang), sa = Math.sin(ang);
    if (!keep(ang)) continue;
    for (let o = th; o >= 0; o -= 0.5) {
      const u = o / th, c = u < 0.15 ? (hot ? WHITE : R[n - 1]) : u < 0.4 ? R[n - 2] : u < 0.7 ? R[n - 3] : R[n - 4];
      p.dot(cx + ca * (r - o), cy + sa * (r - o) * sy, c, k * (u < 0.4 ? 1.2 : 1.15 - u));
    }
  }
}

/**
 * A faceted crystal spike standing on (x, base), height h, base width w, leaning lean px at the tip, shaded in
 * ramp (dark to bright, 6+ steps): a lit ridge, a bright left face, a darker right face, a dark rim.
 * opts: { a (alpha), white (flash it white), glint (0..1 height of a sweeping highlight, or -1) }.
 */
function crystal(p, x, base, h, w, lean, ramp, opts = {}) {
  if (h < 1.5) return;
  const R = ramp.map(hex), n = R.length, C = (i) => R[Math.max(0, n - 1 - i)];
  const a = opts.a ?? 1, top = base - h, ridge0 = x - w * 0.14, glint = opts.glint ?? -1;
  const inside = (px, py) => {
    const u = (base - (py + 0.5)) / h;
    return u >= 0 && u <= 1 && Math.abs(px + 0.5 - (x + lean * u)) <= (w / 2) * (1 - u) + 0.35;
  };
  for (let py = Math.floor(top) - 1; py < Math.ceil(base); py++)
    for (let px = Math.floor(x - w / 2 - Math.abs(lean) - 2); px <= Math.ceil(x + w / 2 + Math.abs(lean) + 2); px++) {
      if (!inside(px, py)) {
        if (inside(px - 1, py) || inside(px + 1, py) || inside(px, py + 1) || (inside(px, py - 1) && py < base - 1)) p.dot(px, py, R[0], a);
        continue;
      }
      if (opts.white) {
        p.dot(px, py, WHITE, a);
        continue;
      }
      const u = (base - (py + 0.5)) / h, rx = ridge0 + (x + lean - ridge0) * u, c = x + lean * u, hw = (w / 2) * (1 - u) + 0.35, fx = px + 0.5;
      let col = u > 0.9 ? WHITE : Math.abs(fx - rx) < 0.55 ? C(1)
        : fx < rx ? (fx - (c - hw) < 1 ? C(1) : (fx - (c - hw)) / Math.max(1, rx - (c - hw)) > 0.55 ? C(2) : C(3))
        : c + hw - fx < 1.2 ? C(Math.min(n - 2, 6)) : (fx - rx) / Math.max(1, c + hw - rx) > 0.5 ? C(5) : C(4);
      if (glint >= 0 && fx <= rx + 0.6) {
        const g = Math.abs(u - glint);
        if (g < 0.05) col = WHITE;
        else if (g < 0.1) col = C(1);
      }
      p.dot(px, py, col, a);
    }
}

};
  __defs["core/font.js"] = function (__e) {
__x(__e, "textWidth", () => textWidth);
__x(__e, "rasterText", () => rasterText);
__x(__e, "FONTS", () => FONTS);
// Two pixel fonts: "mini" (3x5) for small numbers and tags, "big" (5x7) for words like LEVEL UP.
// Glyphs are trimmed to their inked columns, so text sets proportionally (an I is narrower than an M).

const MINI = {
  A: ".#.|#.#|###|#.#|#.#", B: "##.|#.#|##.|#.#|##.", C: ".##|#..|#..|#..|.##", D: "##.|#.#|#.#|#.#|##.",
  E: "###|#..|##.|#..|###", F: "###|#..|##.|#..|#..", G: ".##|#..|#.#|#.#|.##", H: "#.#|#.#|###|#.#|#.#",
  I: "###|.#.|.#.|.#.|###", J: "..#|..#|..#|#.#|.#.", K: "#.#|#.#|##.|#.#|#.#", L: "#..|#..|#..|#..|###",
  M: "#.#|###|###|#.#|#.#", N: "##.|#.#|#.#|#.#|#.#", O: ".#.|#.#|#.#|#.#|.#.", P: "##.|#.#|##.|#..|#..",
  Q: ".#.|#.#|#.#|##.|.##", R: "##.|#.#|##.|#.#|#.#", S: ".##|#..|.#.|..#|##.", T: "###|.#.|.#.|.#.|.#.",
  U: "#.#|#.#|#.#|#.#|###", V: "#.#|#.#|#.#|#.#|.#.", W: "#.#|#.#|###|###|#.#", X: "#.#|#.#|.#.|#.#|#.#",
  Y: "#.#|#.#|.#.|.#.|.#.", Z: "###|..#|.#.|#..|###",
  0: "###|#.#|#.#|#.#|###", 1: ".#.|##.|.#.|.#.|###", 2: "##.|..#|.#.|#..|###", 3: "##.|..#|.#.|..#|##.",
  4: "#.#|#.#|###|..#|..#", 5: "###|#..|##.|..#|##.", 6: ".##|#..|###|#.#|###", 7: "###|..#|.#.|.#.|.#.",
  8: "###|#.#|###|#.#|###", 9: "###|#.#|###|..#|##.",
  "+": "...|.#.|###|.#.|...", "-": "...|...|###|...|...", "!": "#|#|#|.|#", "?": "##.|..#|.#.|...|.#.",
  ".": ".|.|.|.|#", ",": "..|..|..|.#|#.", ":": ".|#|.|#|.", "/": "..#|..#|.#.|#..|#..",
  "%": "#.#|..#|.#.|#..|#.#", x: "...|#.#|.#.|#.#|...", "*": "#.#|.#.|#.#|...|...", "'": "#|#|.|.|.",
  "(": ".#|#.|#.|#.|.#", ")": "#.|.#|.#|.#|#.", "<": "..#|.#.|#..|.#.|..#", ">": "#..|.#.|..#|.#.|#..",
  "=": "...|###|...|###|...", _: "...|...|...|...|###", "#": "#.#|###|#.#|###|#.#",
};

const BIG = {
  A: ".###.|#...#|#...#|#####|#...#|#...#|#...#", B: "####.|#...#|#...#|####.|#...#|#...#|####.",
  C: ".###.|#...#|#....|#....|#....|#...#|.###.", D: "####.|#...#|#...#|#...#|#...#|#...#|####.",
  E: "#####|#....|#....|####.|#....|#....|#####", F: "#####|#....|#....|####.|#....|#....|#....",
  G: ".###.|#...#|#....|#.###|#...#|#...#|.####", H: "#...#|#...#|#...#|#####|#...#|#...#|#...#",
  I: "###|.#.|.#.|.#.|.#.|.#.|###", J: "..###|...#.|...#.|...#.|...#.|#..#.|.##..",
  K: "#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#", L: "#....|#....|#....|#....|#....|#....|#####",
  M: "#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#", N: "#...#|#...#|##..#|#.#.#|#..##|#...#|#...#",
  O: ".###.|#...#|#...#|#...#|#...#|#...#|.###.", P: "####.|#...#|#...#|####.|#....|#....|#....",
  Q: ".###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#", R: "####.|#...#|#...#|####.|#.#..|#..#.|#...#",
  S: ".####|#....|#....|.###.|....#|....#|####.", T: "#####|..#..|..#..|..#..|..#..|..#..|..#..",
  U: "#...#|#...#|#...#|#...#|#...#|#...#|.###.", V: "#...#|#...#|#...#|#...#|#...#|.#.#.|..#..",
  W: "#...#|#...#|#...#|#.#.#|#.#.#|#.#.#|.#.#.", X: "#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#",
  Y: "#...#|#...#|.#.#.|..#..|..#..|..#..|..#..", Z: "#####|....#|...#.|..#..|.#...|#....|#####",
  0: ".###.|#...#|#..##|#.#.#|##..#|#...#|.###.", 1: ".#.|##.|.#.|.#.|.#.|.#.|###",
  2: ".###.|#...#|....#|...#.|..#..|.#...|#####", 3: "#####|...#.|..#..|...#.|....#|#...#|.###.",
  4: "...#.|..##.|.#.#.|#..#.|#####|...#.|...#.", 5: "#####|#....|####.|....#|....#|#...#|.###.",
  6: "..##.|.#...|#....|####.|#...#|#...#|.###.", 7: "#####|....#|...#.|..#..|.#...|.#...|.#...",
  8: ".###.|#...#|#...#|.###.|#...#|#...#|.###.", 9: ".###.|#...#|#...#|.####|....#|...#.|.##..",
  "!": "#|#|#|#|#|.|#", "?": ".###.|#...#|....#|...#.|..#..|.....|..#..", "+": ".....|..#..|..#..|#####|..#..|..#..|.....",
  "-": "....|....|....|####|....|....|....", ".": ".|.|.|.|.|.|#", ",": "..|..|..|..|..|.#|#.", ":": ".|.|#|.|.|#|.",
  "/": "....#|....#|...#.|..#..|.#...|#....|#....", "%": "##...|##..#|...#.|..#..|.#...|#..##|...##",
  x: ".....|.....|#...#|.#.#.|..#..|.#.#.|#...#", "*": ".....|..#..|#.#.#|.###.|#.#.#|..#..|.....", "'": "#|#|.|.|.|.|.",
  "<": "...#|..#.|.#..|#...|.#..|..#.|...#", ">": "#...|.#..|..#.|...#|..#.|.#..|#...", "=": "....|....|####|....|####|....|....",
  "(": "..#|.#.|#..|#..|#..|.#.|..#", ")": "#..|.#.|..#|..#|..#|.#.|#..", "#": ".#.#.|.#.#.|#####|.#.#.|#####|.#.#.|.#.#.",
};

function build(table, h) {
  const out = {};
  for (const [ch, src] of Object.entries(table)) {
    const rows = src.split("|");
    out[ch] = { w: rows[0].length, rows: rows.map((r) => [...r].map((c) => c === "#")) };
    if (rows.length !== h) throw new Error(`glyph ${ch} has ${rows.length} rows, expected ${h}`);
  }
  return out;
}

const FONTS = {
  mini: { h: 5, space: 2, gap: 1, glyphs: build(MINI, 5) },
  big: { h: 7, space: 3, gap: 1, glyphs: build(BIG, 7) },
};

/** Width in font pixels of a string (before scaling). */
function textWidth(str, font = "mini") {
  const F = FONTS[font];
  let w = 0;
  for (const ch of String(str)) {
    const g = F.glyphs[ch] ?? F.glyphs[ch.toUpperCase()];
    w += (g ? g.w : F.space) + F.gap;
  }
  return Math.max(0, w - F.gap);
}

/** Calls plot(x, y) for every inked font pixel of str, with the top-left of the text at (0, 0). */
function rasterText(str, font, plot) {
  const F = FONTS[font];
  let x = 0;
  for (const ch of String(str)) {
    const g = F.glyphs[ch] ?? F.glyphs[ch.toUpperCase()];
    if (!g) {
      x += F.space + F.gap;
      continue;
    }
    for (let r = 0; r < F.h; r++) for (let c = 0; c < g.w; c++) if (g.rows[r][c]) plot(x + c, r);
    x += g.w + F.gap;
  }
}

};
  __defs["core/painter.js"] = function (__e) {
__x(__e, "Painter", () => Painter);
// The painter draws into a frame's two buffers: `color` (opaque pixels, faded with ordered dither, never
// blended) and `light` (additive glow, composited on top). Effects draw in local coordinates around their
// origin; the painter places, mirrors and rotates them, so an effect never needs to know where it is.

const { clamp } = __req("core/math.js");
const { hex } = __req("core/color.js");
const { rasterText, textWidth, FONTS } = __req("core/font.js");

// 4x4 ordered (Bayer) thresholds: a pixel at alpha a is drawn when a is above its cell's threshold.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const OUT = { c: 0, a: 1, l: 0, k: 0 };
const sprites = new WeakMap();
const call = (v, ...args) => (typeof v === "function" ? v(...args) : v);

class Painter {
  constructor(frame) {
    this.frame = frame;
    this.reset();
  }

  /** Re-read the frame and clear placement, fade and light strength. */
  reset() {
    const f = this.frame;
    this.w = f.w; this.h = f.h; this.ox = f.ox | 0; this.oy = f.oy | 0; this.C = f.color; this.L = f.light;
    this.tx = 0; this.ty = 0; this.fx = 1; this.cs = 1; this.sn = 0;
    this.fade = 1; this.lightK = 1; this.layer = "front";
    return this;
  }

  /** Put the effect's origin at (x, y) in frame space, mirrored if flip, rotated by angle (radians). */
  place(x, y, flip = false, angle = 0) {
    this.tx = x; this.ty = y; this.fx = flip ? -1 : 1; this.cs = Math.cos(angle); this.sn = Math.sin(angle);
    return this;
  }

  // ---- transforms: local (effect) space <-> screen (frame) space
  toX(x, y) { return this.tx + x * this.fx * this.cs - y * this.sn; }
  toY(x, y) { return this.ty + x * this.fx * this.sn + y * this.cs; }
  fromX(sx, sy) { const dx = sx - this.tx, dy = sy - this.ty; return (dx * this.cs + dy * this.sn) * this.fx; }
  fromY(sx, sy) { const dx = sx - this.tx, dy = sy - this.ty; return -dx * this.sn + dy * this.cs; }
  // the screen pixel of the local pixel cell holding (x, y): mirrors and rotations land on whole cells
  cellX(x, y) { return Math.floor(this.toX(Math.floor(x) + 0.5, Math.floor(y) + 0.5)); }
  cellY(x, y) { return Math.floor(this.toY(Math.floor(x) + 0.5, Math.floor(y) + 0.5)); }

  // ---- raw writes, screen space, whole pixels. Color 0 means "nothing": it never erases what's there.
  put(sx, sy, c, a = 1) {
    if (!c) return;
    a *= this.fade;
    if (a < 1 && a <= BAYER[((sy & 3) << 2) | (sx & 3)]) return;
    const x = sx - this.ox, y = sy - this.oy;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.C[y * this.w + x] = c;
  }
  add(sx, sy, c, k = 1) {
    k *= this.fade * this.lightK;
    if (k <= 0.004) return;
    const x = sx - this.ox, y = sy - this.oy;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = y * this.w + x, d = this.L[i];
    const r = Math.min(255, (d & 255) + (c & 255) * k) | 0;
    const g = Math.min(255, ((d >>> 8) & 255) + ((c >>> 8) & 255) * k) | 0;
    const b = Math.min(255, ((d >>> 16) & 255) + ((c >>> 16) & 255) * k) | 0;
    this.L[i] = (255 << 24) | (b << 16) | (g << 8) | r;
  }
  /**
   * Blend a color over what's there at alpha a (0..1), keeping the result's own alpha: soft smoke, vapour and
   * mist. Use dithered dot() for hard pixel fades and blend() for translucent volumes.
   */
  blendPx(sx, sy, c, a) {
    a *= this.fade;
    if (!c || a <= 0.004) return;
    const x = sx - this.ox, y = sy - this.oy;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = y * this.w + x, d = this.C[i], da = (d >>> 24) / 255, oa = a + da * (1 - a), k = a / oa;
    const ch = (s) => ((((c >>> s) & 255) * k + ((d >>> s) & 255) * (1 - k)) & 255);
    this.C[i] = (((oa * 255) & 255) << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0);
  }
  /** Translucent pixel at a local point. */
  blend(x, y, c, a) { this.blendPx(this.cellX(x, y), this.cellY(x, y), c, a); }
  /** A translucent disc: puffs of smoke, vapour, dust. c and a may be functions of (d: 0 center..1 rim, angle). */
  disc(cx, cy, r, c, a) {
    if (r < 0.5) return this.blend(cx, cy, call(c, 0, 0), call(a, 0, 0));
    this.each(cx - r, cy - r, cx + r, cy + r, (x, y, sx, sy) => {
      const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
      if (d2 > r * r) return;
      const d = Math.sqrt(d2) / r, ang = Math.atan2(dy, dx);
      this.blendPx(sx, sy, call(c, d, ang), call(a, d, ang));
    });
  }
  /** Read back the color under a local point (0 if empty). */
  get(x, y) {
    const sx = this.cellX(x, y) - this.ox, sy = this.cellY(x, y) - this.oy;
    return sx < 0 || sy < 0 || sx >= this.w || sy >= this.h ? 0 : this.C[sy * this.w + sx];
  }

  // ---- pixels
  /** One opaque pixel. */
  px(x, y, c) { this.put(this.cellX(x, y), this.cellY(x, y), c, 1); }
  /** One pixel at alpha a (0..1), faded by ordered dither. */
  dot(x, y, c, a = 1) { if (a > 0) this.put(this.cellX(x, y), this.cellY(x, y), c, a); }
  /** Add light to one pixel. */
  light(x, y, c, k = 1) { this.add(this.cellX(x, y), this.cellY(x, y), c, k); }

  /**
   * Visit every screen pixel whose center falls in the local box [x0, x1] x [y0, y1], with that center in
   * local space: fn(lx, ly, sx, sy). The basis of every filled shape, so shapes mirror and rotate exactly.
   */
  each(x0, y0, x1, y1, fn) {
    let ax = Infinity, bx = -Infinity, ay = Infinity, by = -Infinity;
    for (let k = 0; k < 4; k++) {
      const x = k & 1 ? x1 : x0, y = k & 2 ? y1 : y0, sx = this.toX(x, y), sy = this.toY(x, y);
      if (sx < ax) ax = sx; if (sx > bx) bx = sx; if (sy < ay) ay = sy; if (sy > by) by = sy;
    }
    const sx0 = Math.max(Math.floor(ax), this.ox), sx1 = Math.min(Math.ceil(bx), this.ox + this.w - 1);
    const sy0 = Math.max(Math.floor(ay), this.oy), sy1 = Math.min(Math.ceil(by), this.oy + this.h - 1);
    for (let sy = sy0; sy <= sy1; sy++)
      for (let sx = sx0; sx <= sx1; sx++) {
        const cx = sx + 0.5, cy = sy + 0.5;
        fn(this.fromX(cx, cy), this.fromY(cx, cy), sx, sy);
      }
  }

  /**
   * A pixel shader over a local box. fn(x, y, out) returns a color, or sets out.c (color), out.a (alpha),
   * out.l (light color, defaults to out.c) and out.k (light amount). Return nothing to leave the pixel alone.
   */
  shade(x0, y0, x1, y1, fn) {
    const o = OUT;
    this.each(x0, y0, x1, y1, (lx, ly, sx, sy) => {
      o.c = 0; o.a = 1; o.l = 0; o.k = 0;
      const c = fn(lx, ly, o) || o.c;
      if (c) this.put(sx, sy, c, o.a);
      if (o.k > 0) this.add(sx, sy, o.l || c, o.k);
    });
  }

  // ---- shapes. Colors (c) and alphas (a) can be numbers or functions of the shape's own coordinates.
  /** 1 px line. c and a may be functions of u (0 at the start, 1 at the end). */
  line(x0, y0, x1, y1, c, a = 1) {
    let sx = this.cellX(x0, y0), sy = this.cellY(x0, y0);
    const ex = this.cellX(x1, y1), ey = this.cellY(x1, y1);
    const dx = Math.abs(ex - sx), dy = -Math.abs(ey - sy), stepx = sx < ex ? 1 : -1, stepy = sy < ey ? 1 : -1;
    const n = Math.max(dx, -dy) || 1, fc = typeof c === "function", fa = typeof a === "function";
    let err = dx + dy, i = 0;
    for (;;) {
      const u = i++ / n;
      this.put(sx, sy, fc ? c(u) : c, fa ? a(u) : a);
      if (sx === ex && sy === ey) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; sx += stepx; }
      if (e2 <= dx) { err += dx; sy += stepy; }
    }
  }
  /** Lines through a list of points [[x, y], ...]. */
  polyline(pts, c, a = 1) {
    for (let i = 1; i < pts.length; i++) this.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], c, a);
  }
  /** Thick segment with round ends. c and a may be functions of (u along, v across: 0 center, 1 edge). */
  beam(x0, y0, x1, y1, width, c, a = 1) {
    const r = width / 2, dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1e-9;
    this.shade(Math.min(x0, x1) - r, Math.min(y0, y1) - r, Math.max(x0, x1) + r, Math.max(y0, y1) + r, (x, y, o) => {
      const u = clamp(((x - x0) * dx + (y - y0) * dy) / L2), px = x0 + dx * u - x, py = y0 + dy * u - y;
      const d2 = px * px + py * py;
      if (d2 > r * r) return;
      const v = Math.sqrt(d2) / r;
      o.c = call(c, u, v);
      o.a = call(a, u, v);
    });
  }
  /** Filled disc. c and a may be functions of (d: 0 center to 1 rim, angle). */
  circle(cx, cy, r, c, a = 1) {
    if (r < 0.6) return this.dot(cx, cy, call(c, 0, 0), call(a, 0, 0));
    this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
      const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
      if (d2 > r * r) return;
      const d = Math.sqrt(d2) / r, ang = Math.atan2(dy, dx);
      o.c = call(c, d, ang);
      o.a = call(a, d, ang);
    });
  }
  /** Ellipse. c and a may be functions of (d: 0 center to 1 rim, angle). */
  ellipse(cx, cy, rx, ry, c, a = 1) {
    if (rx <= 0 || ry <= 0) return;
    this.shade(cx - rx, cy - ry, cx + rx, cy + ry, (x, y, o) => {
      const dx = (x - cx) / rx, dy = (y - cy) / ry, d2 = dx * dx + dy * dy;
      if (d2 > 1) return;
      const d = Math.sqrt(d2), ang = Math.atan2(dy, dx);
      o.c = call(c, d, ang);
      o.a = call(a, d, ang);
    });
  }
  /** Ring from radius r - w to r. c and a may be functions of (v: 0 inner to 1 outer, angle). */
  ring(cx, cy, r, w, c, a = 1) {
    const r0 = Math.max(0, r - w);
    this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
      const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
      if (d2 > r * r || d2 < r0 * r0) return;
      const v = w > 0 ? (Math.sqrt(d2) - r0) / (r - r0 || 1) : 1, ang = Math.atan2(dy, dx);
      o.c = call(c, v, ang);
      o.a = call(a, v, ang);
    });
  }
  /**
   * Band of a ring from angle a0 to a1 (radians, a1 > a0), radius r - w to r: the slash and smear shape.
   * c and a may be functions of (u: 0 at a0 to 1 at a1, v: 0 inner to 1 outer). w can be a function of u
   * for a crescent that tapers at both ends.
   */
  arc(cx, cy, r, w, a0, a1, c, a = 1) {
    const span = a1 - a0, wf = typeof w === "function";
    this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
      const dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
      if (d > r) return;
      let ang = Math.atan2(dy, dx) - a0;
      ang -= Math.floor(ang / (Math.PI * 2)) * Math.PI * 2;
      if (ang > span) return;
      const u = ang / span, ww = wf ? w(u) : w;
      if (ww <= 0 || d < r - ww) return;
      const v = (d - (r - ww)) / ww;
      o.c = call(c, u, v);
      o.a = call(a, u, v);
    });
  }
  /** Filled rectangle. */
  rect(x, y, w, h, c, a = 1) {
    if (this.sn === 0) {
      const X0 = Math.round(x), Y0 = Math.round(y), X1 = Math.round(x + w), Y1 = Math.round(y + h);
      for (let yy = Y0; yy < Y1; yy++) for (let xx = X0; xx < X1; xx++) this.put(this.cellX(xx, yy), this.cellY(xx, yy), c, a);
      return;
    }
    this.shade(x, y, x + w, y + h, (lx, ly, o) => {
      if (lx < x || ly < y || lx >= x + w || ly >= y + h) return;
      o.c = c; o.a = a;
    });
  }
  /** Filled polygon from points [[x, y], ...] (even-odd rule). */
  poly(pts, c, a = 1) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const n = pts.length;
    this.shade(x0, y0, x1, y1, (x, y, o) => {
      let inside = false;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (!inside) return;
      o.c = call(c, x, y);
      o.a = call(a, x, y);
    });
  }
  tri(x0, y0, x1, y1, x2, y2, c, a = 1) { this.poly([[x0, y0], [x1, y1], [x2, y2]], c, a); }

  // ---- light
  /** Radial glow into the light buffer: k at the center, falling to 0 at radius r. */
  glow(x, y, r, c, k = 0.5) {
    if (r < 1 || k <= 0.004) return;
    const cx = this.toX(x, y), cy = this.toY(x, y);
    const x0 = Math.floor(cx - r), x1 = Math.ceil(cx + r), y0 = Math.floor(cy - r), y1 = Math.ceil(cy + r);
    for (let sy = y0; sy <= y1; sy++) {
      const dy = (sy + 0.5 - cy) / r;
      for (let sx = x0; sx <= x1; sx++) {
        const dx = (sx + 0.5 - cx) / r, d = dx * dx + dy * dy;
        if (d >= 1) continue;
        const f = 1 - Math.sqrt(d);
        this.add(sx, sy, c, f * f * k);
      }
    }
  }
  /** Glow around a segment (a soft beam of light). */
  glowLine(x0, y0, x1, y1, r, c, k = 0.5) {
    if (r < 1 || k <= 0.004) return;
    const ax = this.toX(x0, y0), ay = this.toY(x0, y0), bx = this.toX(x1, y1), by = this.toY(x1, y1);
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-9;
    const X0 = Math.floor(Math.min(ax, bx) - r), X1 = Math.ceil(Math.max(ax, bx) + r);
    const Y0 = Math.floor(Math.min(ay, by) - r), Y1 = Math.ceil(Math.max(ay, by) + r);
    for (let sy = Y0; sy <= Y1; sy++)
      for (let sx = X0; sx <= X1; sx++) {
        const px = sx + 0.5, py = sy + 0.5, u = clamp(((px - ax) * dx + (py - ay) * dy) / L2);
        const ex = ax + dx * u - px, ey = ay + dy * u - py, d = Math.sqrt(ex * ex + ey * ey) / r;
        if (d >= 1) continue;
        const f = 1 - d;
        this.add(sx, sy, c, f * f * k);
      }
  }
  /** Glow hugging a circle of radius R (a shockwave's light), falling off over width r. */
  glowRing(x, y, R, r, c, k = 0.5) {
    if (r < 1 || k <= 0.004) return;
    const cx = this.toX(x, y), cy = this.toY(x, y), E = R + r;
    for (let sy = Math.floor(cy - E); sy <= Math.ceil(cy + E); sy++)
      for (let sx = Math.floor(cx - E); sx <= Math.ceil(cx + E); sx++) {
        const d = Math.abs(Math.hypot(sx + 0.5 - cx, sy + 0.5 - cy) - R) / r;
        if (d >= 1) continue;
        const f = 1 - d;
        this.add(sx, sy, c, f * f * k);
      }
  }

  // ---- sprites, text, masks
  /**
   * A little sprite from strings: rows like ["..##..", ".#oo#."], pal maps characters to colors
   * ({ "#": "#222034", o: 0xff... }); "." and " " are empty. Top-left at (x, y).
   * opts: { scale, a, flip (mirror left-right), flipY (upside down), tint (draw every pixel in one color) }.
   */
  sprite(rows, pal, x, y, opts = {}) {
    let s = sprites.get(rows);
    if (!s) sprites.set(rows, (s = rows.map((r) => [...r])));
    const k = opts.scale ?? 1, a = opts.a ?? 1, W = s[0]?.length ?? 0, cache = {};
    for (let r = 0; r < s.length; r++)
      for (let q = 0; q < s[r].length; q++) {
        const ch = s[r][q];
        if (ch === "." || ch === " ") continue;
        let c = opts.tint;
        if (c === undefined) {
          c = cache[ch];
          if (c === undefined) c = cache[ch] = pal[ch] === undefined ? 0 : hex(pal[ch]);
        }
        if (!c) continue;
        const col = opts.flip ? W - 1 - q : q, row = opts.flipY ? s.length - 1 - r : r;
        if (k === 1) this.dot(x + col, y + row, c, a);
        else this.rect(x + col * k, y + row * k, k, k, c, a);
      }
  }
  /**
   * Pixel text. opts: { font: "mini" (3x5) | "big" (5x7), scale, align: "left" | "center" | "right",
   * outline: color, shadow: color, a }. (x, y) is the top of the text, at the left, center or right.
   */
  text(str, x, y, c, opts = {}) {
    const font = opts.font ?? "mini", k = opts.scale ?? 1, a = opts.a ?? 1, w = textWidth(str, font) * k;
    const left = Math.round(opts.align === "center" ? x - w / 2 : opts.align === "right" ? x - w : x), top = Math.round(y);
    const ol = opts.outline, sh = opts.shadow;
    if (ol !== undefined) rasterText(str, font, (gx, gy) => this.rect(left + gx * k - 1, top + gy * k - 1, k + 2, k + 2, ol, a));
    if (sh !== undefined) rasterText(str, font, (gx, gy) => this.rect(left + gx * k + 1, top + gy * k + 1, k, k, sh, a));
    rasterText(str, font, (gx, gy) => this.rect(left + gx * k, top + gy * k, k, k, call(c, gx, gy), a));
  }
  /** Size of text in pixels: [w, h]. */
  measure(str, opts = {}) {
    const k = opts.scale ?? 1;
    return [textWidth(str, opts.font ?? "mini") * k, FONTS[opts.font ?? "mini"].h * k];
  }
  /** Fill a mask ({ w, h, data }) with its top-left at (x, y). c may be a function of (mx, my). */
  mask(m, x, y, c, a = 1) {
    for (let my = 0; my < m.h; my++)
      for (let mx = 0; mx < m.w; mx++) if (m.data[my * m.w + mx]) this.dot(x + mx, y + my, call(c, mx, my), call(a, mx, my));
  }
  /** The 1 px outline just outside a mask. */
  outline(m, x, y, c, a = 1) {
    const at = (mx, my) => mx >= 0 && my >= 0 && mx < m.w && my < m.h && m.data[my * m.w + mx];
    for (let my = -1; my <= m.h; my++)
      for (let mx = -1; mx <= m.w; mx++)
        if (!at(mx, my) && (at(mx - 1, my) || at(mx + 1, my) || at(mx, my - 1) || at(mx, my + 1)))
          this.dot(x + mx, y + my, call(c, mx, my), call(a, mx, my));
  }
}

};
  __defs["core/actor.js"] = function (__e) {
__x(__e, "HERO", () => HERO);
__x(__e, "HERO2", () => HERO2);
__x(__e, "HERO_PAL", () => HERO_PAL);
__x(__e, "DUMMY_PAL", () => DUMMY_PAL);
__x(__e, "stockActor", () => stockActor);
__x(__e, "drawActor", () => drawActor);
__x(__e, "actorAlphaOf", () => actorAlphaOf);
const { hex } = __req("core/color.js");
// A stock character to try effects on: status effects wrap its silhouette, hits land on it, auras sit
// behind it. Previews and the gallery draw it; effects only read its mask through o.actor.

const HERO = [
  "....kkkkk...",
  "..kkhhhhhk..",
  ".khhhhhhhhk.",
  ".khhhhhhhhhk",
  ".khhssssshhk",
  ".khsessesshk",
  ".khsessesshk",
  "..ksssssssk.",
  "...kkSSSkk..",
  "..kttttttk..",
  ".kttTttTttk.",
  ".ksttTTttsk.",
  ".kstttttttk.",
  "..kbbbbbbk..",
  "..kppkkppk..",
  "..kppk.kppk.",
  "..kppk.kppk.",
  "..koook.kook",
  "..kkkkk.kkkk",
];
const HERO_PAL = {
  k: "#17121f", h: "#7a4128", s: "#f3c49d", S: "#c98b6c", e: "#17121f",
  t: "#5f6f94", T: "#46536f", b: "#8a5a32", p: "#38334a", o: "#6a4030",
  // the 2x character's extra detail
  H: "#a35d34", w: "#ffffff", m: "#a3564a", g: "#e8c060", L: "#7f90b6", O: "#8f5a3f", P: "#4b4560",
  // the scarf
  c: "#f53cd1", C: "#ff8fe6", D: "#a31f8a",
};
// the dummy: a neutral shell that lets any effect's colors do the talking, near and far limbs, dark bands at the joints, a small mark
const DUMMY_PAL = {
  k: "#0e0c14", A: "#e4e6ec", B: "#b6b9c3", C: "#868995", D: "#5c5e6a", E: "#6e707c", F: "#4b4d58", G: "#34353f", J: "#2a2b33", m: "#f53cd1",
};
// The same character at twice the size (24 x 38), standing easy: the rest pose of src/core/rig.js, baked.
const HERO2 = [
  "...........kkk..........",
  "..........kAABk.........",
  ".........kAAABJk........",
  ".........kABBJJk........",
  ".........kBBBJCDk.......",
  ".........kBCJDDDk.......",
  ".........kkJJJDk........",
  ".......kkkkABBJCkk......",
  "......kAABCJBCCCkDk.....",
  "......kABBCJCCCmDkDk....",
  "......kBBCDDJCDDDkDk....",
  "......kABCDJDDDDDkk.....",
  ".....kAABDkDDDDJkk......",
  ".....kABCDkDDJJGkk......",
  ".....kABCkJJJGGGkk......",
  "....kJJCDkFFFGGGk.......",
  "....kAJJDkJJJGGGk.......",
  "....kJCJJkABBJGGk.......",
  ".....kJCCkBBCDJJJk......",
  ".....kCCCJBBCDJJDk......",
  ".....kCCCDJCCDkJDDk.....",
  "......kCDDJBCDkDDDk.....",
  ".......kDJJJCDkDDDkk....",
  ".......kJBCJCDkDDDkk....",
  ".......kBDJBCDkCDDkk....",
  "........kJJBCDkCDDk.....",
  "........kBBBCDkCCDDk....",
  "........kBBBCDkCCDDk....",
  ".........kBBCDkJDDDk....",
  "........kBJJJJkCJJJk....",
  "........kBBCCDkCCDDk....",
  "........kBBCDDkCDDk.....",
  "........kBBCDkCCDDk.....",
  "........kBCCDkCCDDk.....",
  "........kBCDDkCDDDk.....",
  ".......kJBCJkkkDJkkkk...",
  ".......kAJJAAAAkCCCCCk..",
  "........kkkkkkkkkkkkk...",
];


function maskOf(rows, k = 1) {
  const h = rows.length * k, w = rows[0].length * k, data = new Uint8Array(w * h);
  rows.forEach((r, y) => [...r].forEach((ch, x) => {
    if (ch === ".") return;
    for (let j = 0; j < k * k; j++) data[(y * k + ((j / k) | 0)) * w + x * k + (j % k)] = 1;
  }));
  return { w, h, data };
}

const MASKS = { 1: maskOf(HERO, 1), 2: maskOf(HERO2, 1) };
const SPRITES = { 1: HERO, 2: HERO2 };
// the character's own colors, row by row (0 where empty), for effects that recolor it: frozen, poisoned, stone
function pixelsOf(rows, pal) {
  const w = rows[0].length, data = new Uint32Array(w * rows.length);
  rows.forEach((r, y) => [...r].forEach((ch, x) => (data[y * w + x] = ch === "." ? 0 : hex(pal[ch]))));
  return data;
}
const PIXELS = { 1: pixelsOf(HERO, HERO_PAL), 2: pixelsOf(HERO2, DUMMY_PAL) };

/**
 * The stock actor at scale k (1: 12 x 19 px, 2: 24 x 38 px), in local space with its feet at (0, 0):
 * { mask, x, y (top-left of the mask), w, h, k, head: [x, y] (top of the head), chest: [x, y] }.
 */
function stockActor(k = 1) {
  k = k === 2 ? 2 : 1;
  const m = MASKS[k], x = -Math.floor(m.w / 2), y = -m.h;
  return { mask: m, pixels: PIXELS[k], x, y, w: m.w, h: m.h, k, head: [0, y], chest: [0, k === 2 ? -26 : y + 11], ...(k === 2 ? { eyes: [[13, 3], [15, 3]] } : {}) };
}

/** Draw the stock actor with its feet at the painter's origin, at alpha a (dithered). */
function drawActor(p, actor = stockActor(), a = 1) {
  if (a > 0) p.sprite(SPRITES[actor.k === 2 ? 2 : 1], actor.k === 2 ? DUMMY_PAL : HERO_PAL, actor.x, actor.y, { a });
}
/** How visible an effect wants the stand-in character at time t (effects may export actorAlpha). */
const actorAlphaOf = (mod, t, o) => (typeof mod.actorAlpha === "function" ? mod.actorAlpha(t, o) : 1);



};
  __defs["core/fx.js"] = function (__e) {
__x(__e, "createFrame", () => createFrame);
__x(__e, "clearFrame", () => clearFrame);
__x(__e, "painterFor", () => painterFor);
__x(__e, "resolveOptions", () => resolveOptions);
__x(__e, "createFx", () => createFx);
__x(__e, "composite", () => composite);
// Frames and live effect instances.

const { Painter } = __req("core/painter.js");
const { clamp } = __req("core/math.js");
const { stockActor } = __req("core/actor.js");
const { fit, toHex } = __req("core/color.js");

/**
 * A frame: w x h pixels whose top-left sits at (ox, oy) in world space. `color` holds opaque pixels,
 * `light` additive glow; composite() puts them together. Same shape as Sprite Fusion's VFX frames.
 */
function createFrame(w, h, ox = 0, oy = 0) {
  return { w, h, ox, oy, color: new Uint32Array(w * h), light: new Uint32Array(w * h) };
}
function clearFrame(f) {
  f.color.fill(0);
  f.light.fill(0);
  return f;
}

const painters = new WeakMap();
/** The painter for a frame (one per frame, reused). */
function painterFor(frame) {
  let p = painters.get(frame);
  if (!p) painters.set(frame, (p = new Painter(frame)));
  return p.reset();
}

const FADE = 0.3;

const isRamp = (v) => Array.isArray(v) && v.length > 0 && v.every((c) => typeof c === "number" || /^#[0-9a-f]{3,8}$/i.test(c));

/**
 * An effect's options: its defaults with the caller's on top. Any color ramp (palette, or another ramp option
 * like dust or smoke) of a different length than its default is resampled to the default's length, so effects
 * can index steps by number whatever a caller passes.
 */
function resolveOptions(meta, o = {}) {
  const opts = { ...(meta.options ?? {}), ...o };
  for (const [k, def] of Object.entries(meta.options ?? {}))
    if (isRamp(def) && isRamp(o[k]) && o[k].length !== def.length) opts[k] = fit(o[k], def.length).map(toHex);
  if (meta.actor && !opts.actor) opts.actor = stockActor(meta.actor === 2 ? 2 : 1);
  return opts;
}

/**
 * A live instance of an effect module: { update(dt), draw(frame, layer), stop(), done() }.
 * o: { x, y, flip, angle, seed, palette, light (glow strength), actor, ...the effect's own options }.
 * draw(frame, "back") draws what goes behind a character, "front" what goes in front, nothing both.
 */
function createFx(mod, o = {}) {
  const meta = mod.meta ?? {};
  const opts = resolveOptions(meta, o);
  const impl = mod.create ? mod.create(opts) : mod;
  const D = meta.duration ?? 1;
  let t = 0, stopAt = Infinity;
  return {
    meta,
    options: opts,
    get t() {
      return t;
    },
    update(dt) {
      t += dt;
      if (!impl.update) return;
      // simulations step at 120 Hz or finer whatever the caller's frame rate, so they look the same everywhere
      const n = Math.max(1, Math.ceil(dt * 120 - 1e-9));
      for (let i = 0; i < n; i++) impl.update(dt / n, opts);
    },
    draw(frame, layer) {
      const p = painterFor(frame);
      p.place(opts.x ?? 0, opts.y ?? 0, !!opts.flip, opts.angle ?? 0);
      p.fade = stopAt === Infinity ? 1 : clamp(1 - (t - stopAt) / FADE);
      p.lightK = opts.light ?? 1;
      const tt = meta.loop ? t % D : Math.min(t, D);
      if (layer !== "front" && impl.drawBack) {
        p.layer = "back";
        impl.drawBack(p, tt, opts);
      }
      if (layer !== "back") {
        p.layer = "front";
        impl.draw(p, tt, opts);
      }
    },
    /** Let it end: loops fade out, one-shots cut short. */
    stop() {
      if (stopAt === Infinity) stopAt = t;
    },
    done() {
      return t - stopAt >= FADE || (!meta.loop && t >= D);
    },
  };
}

/**
 * Color over a background, plus light, into RGBA bytes (a Uint8ClampedArray or Buffer, w * h * 4).
 * bg: null for transparent, a color number, or a Uint32Array of the frame's size. Over transparency, light
 * becomes color with alpha (its brightest channel), which reads as additive over dark backgrounds.
 */
function composite(f, out, bg = null, lightK = 1) {
  const n = f.w * f.h, C = f.color, L = f.light, flat = typeof bg === "number";
  for (let i = 0; i < n; i++) {
    const c = C[i], l = L[i] & 0xffffff;
    let r, g, b, a;
    const ca = c >>> 24;
    if (ca === 255) {
      r = c & 255; g = (c >>> 8) & 255; b = (c >>> 16) & 255; a = 255;
    } else if (bg === null) {
      // translucent color over nothing keeps its alpha
      r = c & 255; g = (c >>> 8) & 255; b = (c >>> 16) & 255; a = ca;
    } else {
      const k = flat ? bg : bg[i], f = ca / 255;
      r = (c & 255) * f + (k & 255) * (1 - f); g = ((c >>> 8) & 255) * f + ((k >>> 8) & 255) * (1 - f);
      b = ((c >>> 16) & 255) * f + ((k >>> 16) & 255) * (1 - f); a = 255;
    }
    if (l) {
      const lr = (l & 255) * lightK, lg = ((l >>> 8) & 255) * lightK, lb = ((l >>> 16) & 255) * lightK;
      if (a < 255) {
        // over transparency: premultiply what's there, add the light, divide by the new alpha
        const pa = a / 255, pr = r * pa + lr, pg = g * pa + lg, pb = b * pa + lb;
        const na = Math.min(1, Math.max(pa, Math.max(lr, lg, lb) / 255));
        if (na > 0) { r = Math.min(255, pr / na); g = Math.min(255, pg / na); b = Math.min(255, pb / na); a = na * 255; }
      } else {
        r = Math.min(255, r + lr); g = Math.min(255, g + lg); b = Math.min(255, b + lb);
      }
    }
    const j = i * 4;
    out[j] = r; out[j + 1] = g; out[j + 2] = b; out[j + 3] = a;
  }
  return out;
}

};
  __defs["core/scene.js"] = function (__e) {
__x(__e, "backdrop", () => backdrop);
__x(__e, "BACKDROPS", () => BACKDROPS);
// Preview backdrops: what the tools and the gallery draw behind an effect. Sprite sheets stay transparent.

const { hex, mix } = __req("core/color.js");
const { rand } = __req("core/math.js");

const SKY = hex("#15131d"), SKY_TOP = hex("#0d0b14"), SKY_LOW = hex("#221d33");
const FLOOR_EDGE = hex("#4a4263"), FLOOR = hex("#2b2639"), FLOOR_DARK = hex("#211d2d"), MORTAR = hex("#1a1724");
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const BACKDROPS = ["dark", "ground", "sky", "light", "black"];

/**
 * A backdrop as a Uint32Array of w x h colors. kind: "dark" | "ground" (a stone floor from groundY down)
 * | "sky" (night gradient with stars) | "light" | "black".
 */
function backdrop(kind, w, h, groundY = h) {
  const out = new Uint32Array(w * h);
  if (kind === "light") return out.fill(hex("#ebe8f0"));
  if (kind === "black") return out.fill(hex("#000000"));
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let c = SKY;
      if (kind === "sky") {
        const t = y / Math.max(1, h - 1), step = (t * 5 + BAYER[((y & 3) << 2) | (x & 3)] / 16) | 0;
        c = mix(SKY_TOP, SKY_LOW, Math.min(1, step / 4));
        const r = rand(x, y, 77);
        if (r > 0.994) c = mix(c, hex("#cfc8ff"), 0.35 + (r - 0.994) * 90);
      }
      if (kind === "ground" && y >= groundY) {
        const gy = y - groundY;
        if (gy === 0) c = FLOOR_EDGE;
        else {
          const row = Math.floor((gy - 1) / 5), off = row % 2 ? 6 : 0;
          const mortar = (gy - 1) % 5 === 4 || (x + off) % 12 === 0;
          c = mortar ? MORTAR : gy < 3 ? FLOOR : FLOOR_DARK;
        }
      }
      out[y * w + x] = c;
    }
  return out;
}

};
  __defs["core/rig.js"] = function (__e) {
__x(__e, "shortfall", () => shortfall);
__x(__e, "posed", () => posed);
__x(__e, "skeleton", () => skeleton);
__x(__e, "posedParts", () => posedParts);
__x(__e, "STAND", () => STAND);
__x(__e, "WEAPONS", () => WEAPONS);
// The character who acts: a real skeleton in 3D, drawn down to pixels the way Dead Cells makes its sprites. Bones have
// fixed lengths and hang from each other, pelvis to spine to chest to shoulders, so the body can twist, bend and turn round,
// and depth decides what's in front. A pose only says where the hands and feet should be and how the body is carrying
// itself; the solver works out every joint, and the renderer shades it into a few flat tones with one clean ink line.
//
// Coordinates: x right, y up, z towards the viewer, in pixels, the feet at the origin. Poses are in screen terms (y negative
// is up), as effects are. The character faces +x with his right side towards the viewer, so the right hand is the near one.
//
// A rendered pose also knows, for each of its pixels, which pixel of the standing character it came from (`src`). That
// is what lets an effect drawn on the standing body (frost, poison, a scan line) follow the body wherever it goes.

const { hex } = __req("core/color.js");
const { DUMMY_PAL } = __req("core/actor.js");

const PAL = Object.fromEntries(Object.entries(DUMMY_PAL).map(([k, v]) => [k, hex(v) >>> 0]));
const INK = PAL.k, SEAM = PAL.J, MARK = PAL.m;
// plates and joints: lit to dark
const SHELL = [PAL.A, PAL.B, PAL.C, PAL.D], CORE = [PAL.E, PAL.F, PAL.G, PAL.G];
const DEG = Math.PI / 180, W0 = 24, H0 = 38;

// ---- vectors and turns
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => mul(a, 1 / (len(a) || 1e-6));
const rotY = (t) => { const c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
const rotZ = (t) => { const c = Math.cos(t), s = Math.sin(t); return [c, -s, 0, s, c, 0, 0, 0, 1]; };
const mm = (A, B) => { const o = new Array(9); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]; return o; };
const mv = (M, v) => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];
const tv = (M, v) => [M[0] * v[0] + M[3] * v[1] + M[6] * v[2], M[1] * v[0] + M[4] * v[1] + M[7] * v[2], M[2] * v[0] + M[5] * v[1] + M[8] * v[2]];
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// ---- the body's measurements, in pixels
const M = {
  pelvis: 19.7, spine1: 2.8, spine2: 4.6, shoulderUp: 2.5, shoulderOut: 5.9, neckUp: 4.0, headUp: 3.1,
  hipDown: 1.1, hipOut: 2.8, thigh: 8.6, shin: 8.3, upper: 7.6, fore: 7.4, turn: 36 * DEG,
};
/** Standing easy, in screen terms: hands and feet are where they should end up, y negative is up. */
const STAND = { lean: 0, crouch: 0, yaw: 0, fx: -3, fy: -15, bx: 5, by: -15, ffx: -2, ffy: -4, fbx: 3, fby: -4 };

// ---- solving a pose: from where the hands and feet should be, to every joint
function ik(a, target, L1, L2, pole) {
  let to = sub(target, a), d = len(to);
  const reach = L1 + L2 - 0.02;
  if (d > reach) { to = mul(to, reach / d); d = reach; }
  const u = unit(to), along = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - along * along));
  let v = sub(pole, mul(u, dot(pole, u)));
  v = len(v) < 1e-4 ? unit(cross(u, [0, 0, 1])) : unit(v);
  return { joint: add(a, add(mul(u, along), mul(v, h))), end: add(a, to), u, v };
}
function frame(t, R) {
  return { t, R };
}
// a frame along a bone: its local x runs down the bone
function boneFrame(a, b, pole) {
  const x = unit(sub(b, a));
  let y = sub(pole, mul(x, dot(pole, x)));
  y = len(y) < 1e-4 ? unit(cross(x, [0, 0, 1])) : unit(y);
  const z = cross(x, y);
  return frame(a, [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]]);
}
const weaponOf = (name) => WEAPONS[name];

function solve(pose) {
  const q = { ...STAND, ...pose }, lean = q.lean, W = q.weapon && weaponOf(q.weapon), OW = q.offWeapon && weaponOf(q.offWeapon);
  const sa = q.sa ?? 0, wl = q.wl ?? 1, axisZ = Math.sqrt(Math.max(0, 1 - wl * wl)) * (q.wz ?? 1);
  const axis = [Math.cos(sa) * wl, -Math.sin(sa) * wl, axisZ], side = [-Math.sin(sa), -Math.cos(sa), 0];
  const two = !!(q.two && W), nearZ = q.fz ?? (two ? 3 : 4.5);
  // how the chest is turned follows the hands: a hand driving forward brings its shoulder round; one drawn back opens him up
  const fwd = (q.fx - STAND.fx) / 24, farFwd = two ? 0 : (q.bx - STAND.bx) / 22;
  let turn = M.turn + (fwd >= 0 ? -44 * DEG * Math.min(1, fwd) : 28 * DEG * Math.min(1, -fwd * 1.8));
  turn += (farFwd > 0 ? 34 * DEG * Math.min(1, farFwd) : 0) + (q.twist ?? 0) * 4 * DEG;
  if (q.turn !== undefined) turn = q.turn;
  const hipTurn = M.turn + (turn - M.turn) * 0.45, tilt = Math.atan2(lean, 13);
  const Rp = mm(rotZ(-tilt * 0.25), rotY(-hipTurn)), Rc = mm(rotZ(-tilt), rotY(-turn));
  // feet first: the pelvis sinks if that's what it takes for both legs to reach them
  const ankleN = [q.ffx, -q.ffy - 1.8, q.fzz ?? 2.4], ankleF = [q.fbx, -q.fby - 1.8, q.bzz ?? -2.4];
  let pelvis = [lean * 0.2, M.pelvis - q.crouch, 0];
  const hipAt = (s) => add(pelvis, mv(Rp, [0, -M.hipDown, s * M.hipOut]));
  const maxLeg = (M.thigh + M.shin) * 0.995;
  for (const [s, a] of [[1, ankleN], [-1, ankleF]]) {
    const h = hipAt(s), dx = h[0] - a[0], dz = h[2] - a[2], flat = dx * dx + dz * dz;
    if (flat < maxLeg * maxLeg) {
      const top = a[1] + Math.sqrt(maxLeg * maxLeg - flat);
      if (h[1] > top) pelvis = [pelvis[0], pelvis[1] - (h[1] - top), pelvis[2]];
    }
  }
  const waist = add(pelvis, [Math.sin(tilt * 0.45) * M.spine1, Math.cos(tilt * 0.45) * M.spine1, 0]);
  const chest = add(waist, [Math.sin(tilt) * M.spine2, Math.cos(tilt) * M.spine2, 0]);
  const neck = add(chest, mv(Rc, [0, M.neckUp, 0]));
  // the head keeps looking where he's going: it takes only part of the lean and part of the turn
  const headTurn = M.turn * 0.9 + (turn - M.turn) * 0.35, nod = tilt * 0.35 + (q.hy ?? 0) * 7 * DEG, roll = (q.hx ?? 0) * 7 * DEG;
  const Rh = mm(rotZ(-nod - roll), rotY(-headTurn));
  const head = add(neck, mv(Rh, [0.15, M.headUp, 0]));
  // the arms: shoulders reach a little towards a far hand
  const pick = (s, target) => {
    const base = add(chest, mv(Rc, [0, M.shoulderUp, s * M.shoulderOut])), to = sub(target, base), d = len(to);
    return add(base, mul(unit(to), Math.min(1.8, Math.max(0, d - 11) * 0.35)));
  };
  const nearT = [q.fx, -q.fy, nearZ];
  const farT = two ? [q.fx + axis[0] * W.two, -q.fy + axis[1] * W.two, nearZ + axis[2] * W.two] : [q.bx, -q.by, q.bz ?? (q.armsFront ? 5.5 : -4.5)];
  const sN = pick(1, nearT), sF = pick(-1, farT);
  const pole = (s, T, shoulder, hold) => {
    // elbows hang down and back; overhead they go out and forward
    const up = clamp01((T[1] - shoulder[1] + 2) / 10);
    const base = [-0.55 + up * 1.1, -1 + up * 0.9, s * (0.45 + up * 0.5)];
    if (!hold) return base;
    // holding something, the forearm wants to meet the handle side on: try round the circle, keep the best
    const u = unit(sub(T, shoulder));
    let best = base, score = Infinity;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, x = unit(cross(u, [0.3, 1, 0.2])), y = cross(u, x), v = add(mul(x, Math.cos(a)), mul(y, Math.sin(a)));
      const A = ik(shoulder, T, M.upper, M.fore, v), f = unit(sub(A.end, A.joint));
      const cost = Math.abs(dot(f, hold)) * 0.7 + (1 - dot(unit(base), v)) * 0.55;
      if (cost < score) { score = cost; best = v; }
    }
    return best;
  };
  const holdN = W ? (W.across ? side : axis) : null, holdF = two ? (W.across ? side : axis) : OW ? [Math.cos(q.sb ?? Math.PI), -Math.sin(q.sb ?? Math.PI), 0] : null;
  const armN = ik(sN, nearT, M.upper, M.fore, pole(1, nearT, sN, holdN)), armF = ik(sF, farT, M.upper, M.fore, pole(-1, farT, sF, holdF));
  // the legs: knees forward, a little out
  const kneePole = (s) => mv(Rp, [1, 0, s * 0.35]);
  const hipN = hipAt(1), hipF = hipAt(-1);
  const legN = ik(hipN, ankleN, M.thigh, M.shin, kneePole(1)), legF = ik(hipF, ankleF, M.thigh, M.shin, kneePole(-1));
  const footDir = (s) => { const t = hipTurn * 0.6 + s * 8 * DEG; return [Math.cos(t), 0, Math.sin(t)]; };
  const B = {
    pelvis: frame(pelvis, Rp), waist: frame(waist, mm(rotZ(-tilt * 0.6), rotY(-(turn + hipTurn) / 2))), chest: frame(chest, Rc), head: frame(head, Rh), neck: frame(neck, Rh),
    upperN: boneFrame(sN, armN.joint, armN.v), foreN: boneFrame(armN.joint, armN.end, armN.v), upperF: boneFrame(sF, armF.joint, armF.v), foreF: boneFrame(armF.joint, armF.end, armF.v),
    thighN: boneFrame(hipN, legN.joint, legN.v), shinN: boneFrame(legN.joint, legN.end, legN.v), thighF: boneFrame(hipF, legF.joint, legF.v), shinF: boneFrame(legF.joint, legF.end, legF.v),
  };
  B.footN = frame(legN.end, mm(rotY(-Math.atan2(footDir(1)[2], footDir(1)[0])), rotZ(q.toeF ? -55 * DEG : 0)));
  B.footF = frame(legF.end, mm(rotY(-Math.atan2(footDir(-1)[2], footDir(-1)[0])), rotZ(q.toeB ? -55 * DEG : 0)));
  return { B, W, OW, q, axis, side, armN, armF, legN, legF, sN, sF, hipN, hipF, turn };
}

// ---- drawing: every part goes through one depth buffer
const BW = 300, BH = 240, OX = 150, OY = 180; // the scratch grid, big enough for a raised scythe; feet at (OX, OY)
const Zb = new Float32Array(BW * BH), Tone = new Float32Array(BW * BH), Part = new Int8Array(BW * BH), Mat = new Int8Array(BW * BH), Fr = new Int8Array(BW * BH), LX = new Float32Array(BW * BH), LY = new Float32Array(BW * BH), Col = new Uint32Array(BW * BH);
const touched = [];
const LIGHT = unit([-0.55, 0.72, 0.5]);
let clipBody = false, clipWeapon = false, curFrameIndex = 0, curDim = 0, onlyPart = 0;
const FRAME_IDS = ["pelvis", "waist", "chest", "head", "neck", "upperN", "foreN", "upperF", "foreF", "thighN", "shinN", "thighF", "shinF", "footN", "footF"];
function plot(i, z, tone, part, mat, wx, wy, color) {
  if (onlyPart && part !== onlyPart) return;
  if (Part[i] === 0) touched.push(i);
  else if (z <= Zb[i]) return;
  Zb[i] = z;
  Tone[i] = tone;
  Part[i] = part;
  Mat[i] = mat;
  Fr[i] = curFrameIndex;
  LX[i] = wx;
  LY[i] = wy;
  Col[i] = color;
}
function sphere(c, r, part, mat) {
  const x0 = Math.floor(c[0] - r), x1 = Math.ceil(c[0] + r), y0 = Math.floor(c[1] - r), y1 = Math.ceil(c[1] + r);
  for (let wy = y0; wy <= y1; wy++)
    for (let wx = x0; wx <= x1; wx++) {
      const dx = wx - c[0], dy = wy - c[1], d2 = dx * dx + dy * dy;
      if (d2 > r * r || (clipBody && wy < 1.5)) continue;
      const dz = Math.sqrt(r * r - d2), n = [dx / r, dy / r, dz / r], i = (OY - wy) * BW + (OX + wx);
      plot(i, c[2] + dz, dot(n, LIGHT), part, mat, wx, wy, 0);
    }
}
function sweep(a, b, ra, rb, part, mat, bulge = 0) {
  const n = Math.max(2, Math.ceil(len(sub(b, a)) / 0.4));
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    sphere(add(a, mul(sub(b, a), u)), ra + (rb - ra) * u + bulge * Math.sin(u * Math.PI), part, mat);
  }
}
// an ellipsoid with radii r along the axes of frame R, seen along z
function ellipsoid(c, R, r, part, mat) {
  const big = Math.max(r[0], r[1], r[2]), x0 = Math.floor(c[0] - big), x1 = Math.ceil(c[0] + big), y0 = Math.floor(c[1] - big), y1 = Math.ceil(c[1] + big);
  const Rt = [R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8]], D = [1 / (r[0] * r[0]), 1 / (r[1] * r[1]), 1 / (r[2] * r[2])];
  // A = R diag(D) R^T
  const A = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) A[i * 3 + j] = R[i * 3] * D[0] * R[j * 3] + R[i * 3 + 1] * D[1] * R[j * 3 + 1] + R[i * 3 + 2] * D[2] * R[j * 3 + 2];
  void Rt;
  for (let wy = y0; wy <= y1; wy++)
    for (let wx = x0; wx <= x1; wx++) {
      if (clipBody && wy < 1.5) continue;
      const dx = wx - c[0], dy = wy - c[1];
      const qa = A[8], qb = 2 * (A[2] * dx + A[5] * dy), qc = A[0] * dx * dx + 2 * A[1] * dx * dy + A[4] * dy * dy - 1, disc = qb * qb - 4 * qa * qc;
      if (disc < 0) continue;
      const dz = (-qb + Math.sqrt(disc)) / (2 * qa);
      const n = unit([A[0] * dx + A[1] * dy + A[2] * dz, A[3] * dx + A[4] * dy + A[5] * dz, A[6] * dx + A[7] * dy + A[8] * dz]);
      plot((OY - wy) * BW + (OX + wx), c[2] + dz, dot(n, LIGHT), part, mat, wx, wy, 0);
    }
}
// parts: each has its own number, so edges between them can be seen
const PART = { pelvis: 1, waist: 2, chest: 3, neck: 4, head: 5, face: 6, upperN: 7, elbowN: 8, foreN: 9, handN: 10, upperF: 11, elbowF: 12, foreF: 13, handF: 14, thighN: 15, kneeN: 16, shinN: 17, footN: 18, thighF: 19, kneeF: 20, shinF: 21, footF: 22, weapon: 23, offWeapon: 24 };
const useFrame = (name) => { curFrameIndex = FRAME_IDS.indexOf(name); };

function drawBody(S) {
  const { B, armN, armF, legN, legF, sN, sF, hipN, hipF, turn } = S, F_ = (name) => B[name];
  useFrame("pelvis");
  ellipsoid(add(F_("pelvis").t, mv(F_("pelvis").R, [0, -0.2, 0])), F_("pelvis").R, [2.9, 2.6, 4.2], PART.pelvis, 0);
  useFrame("waist");
  sweep(F_("pelvis").t, F_("chest").t, 3, 3.3, PART.waist, 1);
  useFrame("chest");
  ellipsoid(add(F_("chest").t, mv(F_("chest").R, [0.2, 0.9, 0])), F_("chest").R, [3.4, 4.2, 5.5], PART.chest, 0);
  useFrame("neck");
  sweep(F_("neck").t, add(F_("neck").t, mv(F_("head").R, [0, 1.6, 0])), 1.25, 1.15, PART.neck, 1);
  useFrame("head");
  ellipsoid(F_("head").t, F_("head").R, [3, 3.3, 2.8], PART.head, 0);
  ellipsoid(add(F_("head").t, mv(F_("head").R, [0.85, -0.45, 0])), F_("head").R, [2.4, 2.7, 2.35], PART.face, 0);
  const arm = (far, A, sh, up, el, fo, ha, nameU, nameF) => {
    curDim = far ? 1 : 0;
    useFrame(nameU);
    sphere(sh, 2.5, up, 0);
    sweep(sh, A.joint, 2.1, 1.6, up, 0);
    sphere(A.joint, 1.45, el, 1);
    useFrame(nameF);
    sweep(A.joint, A.end, 1.6, 1.2, fo, 0, 0.15);
    sphere(A.end, 1.9, ha, 0);
    curDim = 0;
  };
  arm(false, armN, sN, PART.upperN, PART.elbowN, PART.foreN, PART.handN, "upperN", "foreN");
  arm(true, armF, sF, PART.upperF, PART.elbowF, PART.foreF, PART.handF, "upperF", "foreF");
  const leg = (far, L, hip, th, kn, sh, fo, nameT, nameS, nameFt) => {
    useFrame(nameT);
    sweep(hip, L.joint, 3.2, 2.2, th, 0);
    sphere(L.joint, 1.9, kn, 1);
    useFrame(nameS);
    sweep(L.joint, L.end, 2.15, 1.4, sh, 0, 0.4);
    useFrame(nameFt);
    const R = F_(nameFt).R, a = F_(nameFt).t;
    sweep(add(a, mv(R, [-1.5, -0.6, 0])), add(a, mv(R, [4.6, -1.1, 0])), 1.7, 1.25, fo, 0);
  };
  leg(false, legN, hipN, PART.thighN, PART.kneeN, PART.shinN, PART.footN, "thighN", "shinN", "footN");
  leg(true, legF, hipF, PART.thighF, PART.kneeF, PART.shinF, PART.footF, "thighF", "shinF", "footF");
  void turn;
}

// ---- what they hold: drawn along the handle from the fist, through the same depth buffer
function along(H, axis, side, part) {
  const n = cross(axis, side);
  const T = (i, k, c, lift = 0) => {
    const x = H[0] + axis[0] * i + side[0] * k + n[0] * lift, y = H[1] + axis[1] * i + side[1] * k + n[1] * lift, z = H[2] + axis[2] * i + side[2] * k + n[2] * lift;
    const wx = Math.round(x), wy = Math.round(y);
    if (clipWeapon && wy < 0) return;
    const idx = (OY - wy) * BW + (OX + wx);
    if (idx < 0 || idx >= BW * BH) return;
    curFrameIndex = -1;
    plot(idx, z + 0.05, 2, part, 2, wx, wy, c);
  };
  T.at = (i, k) => [H[0] + axis[0] * i + side[0] * k, H[1] + axis[1] * i + side[1] * k, H[2] + axis[2] * i + side[2] * k];
  return T;
}
const STEEL = Object.fromEntries(Object.entries({ hi: "#ffffff", a: "#e8edf6", b: "#a4afc6", d: "#68748f", gold: "#ffd84a", goldD: "#b8862a", grip: "#7a3a2a", gripD: "#4a2018", wood: "#8a5a32", woodD: "#5a3820", dark: "#3a3448", darkD: "#262033", olive: "#58663f", oliveA: "#7d8c58", oliveD: "#3a4529" }).map(([k, v]) => [k, hex(v) >>> 0]));
function blade(T, from, length, w) {
  for (let i = from; i <= from + length + 0.01; i += 0.4) {
    const r = i - from, wd = r > length - 5 ? Math.max(0, ((length - r) / 5) * w) : w;
    for (let k = -wd; k <= wd + 0.01; k += 0.4) T(i, k, k < -w * 0.4 ? STEEL.hi : k > w * 0.4 ? STEEL.d : STEEL.a);
  }
}
const haft = (T, from, to, a, d, r = 0.8) => {
  for (let i = from; i <= to; i += 0.4) for (let k = -r; k <= r + 0.01; k += 0.4) T(i, k, k > 0.1 ? d : a);
};
const WEAPONS = {
  // the fist is at i = 0; `two` is where the other hand goes; `across`: the handle lies across the weapon's length
  sword: { two: -4.4, draw(T, q) {
    const end = q.two ? -6.5 : -2.6;
    haft(T, end, 2.2, STEEL.grip, STEEL.gripD);
    for (let k = -1.4; k <= 1.4; k += 0.4) T(end - 0.4, k, STEEL.gold);
    for (let k = -4.6; k <= 4.6; k += 0.4) (T(2.6, k, Math.abs(k) > 3.8 ? STEEL.goldD : STEEL.gold), T(3, k, STEEL.goldD));
    blade(T, 3.2, 25, 2.2);
  } },
  greatsword: { two: -4.8, draw(T) {
    haft(T, -7.2, 2.2, STEEL.grip, STEEL.gripD);
    for (let k = -1.8; k <= 1.8; k += 0.4) T(-7.6, k, STEEL.gold);
    for (let k = -6.6; k <= 6.6; k += 0.4) (T(2.6, k, Math.abs(k) > 5.6 ? STEEL.goldD : STEEL.gold), T(3, k, STEEL.goldD));
    blade(T, 3.2, 31, 3);
    for (let i = 4; i <= 28; i += 0.4) T(i, 0, STEEL.b);
  } },
  dagger: { draw(T) {
    haft(T, -2.4, 1.8, STEEL.grip, STEEL.gripD);
    for (let k = -2.6; k <= 2.6; k += 0.4) T(2.2, k, STEEL.goldD);
    blade(T, 2.6, 10, 1.3);
  } },
  spear: { two: -12, draw(T) {
    haft(T, -18, 36, STEEL.wood, STEEL.woodD, 0.5);
    blade(T, 36, 11, 2);
    for (let k = -2.4; k <= 2.4; k += 0.4) T(36, k, STEEL.goldD);
  } },
  hammer: { two: -7, draw(T) {
    for (const lift of [-0.8, 0, 0.8]) for (let i = -10; i <= 18; i += 0.4) for (let k = -0.8; k <= 0.81; k += 0.4) T(i, k, k > 0.1 ? STEEL.woodD : STEEL.wood, lift);
    // the head is a block: its two faces, and the steel between them
    for (let i = 18; i <= 28; i += 0.4) for (let k = -9; k <= 9; k += 0.4) {
      const face = Math.abs(k) > 7.4 ? (k < 0 ? STEEL.a : STEEL.d) : i < 20 ? STEEL.hi : i > 26.4 ? STEEL.d : Math.abs(k) < 2 ? STEEL.gold : STEEL.b;
      T(i, k, face, 4.5);
      T(i, k, face, -4.5);
      if (i < 18.4 || i > 27.6 || Math.abs(k) > 8.6) for (let l = -4; l <= 4; l += 0.4) T(i, k, k < 0 ? STEEL.a : i > 27.6 ? STEEL.d : STEEL.b, l);
    }
  } },
  scythe: { two: -11, draw(T) {
    haft(T, -16, 31, STEEL.dark, STEEL.darkD, 0.5);
    for (let j = 0; j <= 28; j += 0.4) {
      const u = j / 28, w = 3.2 * (1 - u) + 0.3, b = 31.5 - u * u * 12;
      for (let k = -w; k <= w; k += 0.4) T(b + k, j + 0.8, k > w * 0.3 ? STEEL.hi : k < -w * 0.4 ? STEEL.d : STEEL.b);
    }
  } },
  claw: { draw(T) {
    for (const q0 of [-2.4, 0, 2.4])
      for (let i = 2; i <= 9.5; i += 0.4) {
        const u = (i - 2) / 7.5, k = q0 + u * u * 1.8;
        T(i, k, u > 0.55 ? STEEL.hi : STEEL.a);
        if (u < 0.6) T(i, k + 0.8, STEEL.d);
      }
  } },
  bow: { across: true, draw(T, q, off) {
    for (let u = -1; u <= 1.001; u += 0.025) {
      const k = u * 17, i = 6 * (1 - u * u) - 1;
      T(i, k, Math.abs(u) > 0.85 ? STEEL.goldD : STEEL.wood);
      T(i + 0.8, k, STEEL.woodD);
    }
    const tipA = T.at(-1, -17), tipB = T.at(-1, 17), mid = q.pull ? off : T.at(-1, 0);
    const line = (A, B, c) => {
      const n = Math.max(2, Math.ceil(len(sub(B, A)) / 0.4)), Z = STEEL.a;
      for (let k = 0; k <= n; k++) {
        const P = add(A, mul(sub(B, A), k / n)), wx = Math.round(P[0]), wy = Math.round(P[1]), idx = (OY - wy) * BW + (OX + wx);
        curFrameIndex = -1;
        plot(idx, P[2] + 0.05, 2, PART.weapon, 2, wx, wy, c ?? Z);
      }
    };
    line(tipA, mid);
    line(tipB, mid);
    if (q.nocked) {
      const nock = mid, tip = T.at(13, 0);
      line(nock, tip, STEEL.wood);
      for (let i = 9; i <= 13; i += 0.4) for (let k = -(13 - i) * 0.45; k <= (13 - i) * 0.45; k += 0.4) T(i, k, STEEL.hi);
    }
  } },
  pistol: { across: true, draw(T) {
    for (let i = -1; i <= 9.5; i += 0.4) for (let k = -4.2; k <= -2.4; k += 0.4) T(i, k, k < -3.6 ? STEEL.a : k > -2.9 ? STEEL.d : STEEL.b);
    for (let i = -1.2; i <= 1.2; i += 0.4) for (let k = -2.4; k <= 2.4; k += 0.4) T(i, k, STEEL.gripD);
    T(9, -4.6, STEEL.hi);
  } },
  launcher: { two: -9, draw(T) {
    for (let i = -14; i <= 22; i += 0.4) for (let k = -6; k <= -1; k += 0.4) T(i, k, k < -4.8 ? STEEL.oliveA : k > -2.2 ? STEEL.oliveD : Math.abs(i - 3) < 1.4 ? STEEL.gold : STEEL.olive);
    for (let k = -6.8; k <= -0.2; k += 0.4) (T(22.4, k, STEEL.b), T(-14.4, k, STEEL.d));
  } },
  handle: { draw(T) {
    haft(T, -2.6, 6, STEEL.grip, STEEL.gripD);
    for (let k = -1.6; k <= 1.6; k += 0.4) (T(-3, k, STEEL.gold), T(6.4, k, STEEL.gold));
  } },
};

// ---- flat tones, seams, and one clean ink line
function finish(S, restFrames) {
  const dim = (part) => part >= PART.upperF && part <= PART.handF ? 1 : part >= PART.thighF && part <= PART.footF ? 1 : 0;
  const toneOf = (v, part) => {
    let t = v > 0.8 ? 0 : v > 0.42 ? 1 : v > 0.08 ? 2 : 3;
    t = Math.min(3, t + dim(part));
    return t;
  };
  const tones = new Map();
  for (const i of touched) tones.set(i, toneOf(Tone[i], Part[i]));
  // a lone pixel of a tone, with no neighbour like it on the same part, takes its neighbours' tone
  for (const i of touched) {
    if (Mat[i] === 2) continue;
    const t = tones.get(i), votes = [0, 0, 0, 0];
    let same = false;
    for (const d of [-1, 1, -BW, BW]) {
      const j = i + d;
      if (Part[j] !== Part[i] || !tones.has(j)) continue;
      const u = tones.get(j);
      votes[u]++;
      if (u === t) same = true;
    }
    if (!same && votes.some((v) => v > 0)) tones.set(i, votes.indexOf(Math.max(...votes)));
  }
  for (const i of touched) {
    if (Mat[i] === 2) continue;
    Col[i] = (Mat[i] === 1 ? CORE : SHELL)[tones.get(i)];
  }
  // where two parts meet: a soft seam if they touch, ink if one stands in front of the other
  const marks = new Map();
  for (const i of touched) {
    for (const d of [1, BW]) {
      const j = i + d;
      if (Part[j] === 0 || Part[j] === Part[i]) continue;
      const far = Zb[i] < Zb[j] ? i : j, dz = Math.abs(Zb[i] - Zb[j]), steel = Mat[i] === 2 || Mat[j] === 2;
      if (Mat[far] === 2 && dz < 1) continue;
      const ink = steel || dz > 2.2;
      if (ink) marks.set(far, INK);
      else if (!marks.has(far)) marks.set(far, SEAM);
    }
  }
  for (const [i, c] of marks) Col[i] = c;
  // the mark on his chest, when it's facing us
  const { B } = S, chestAt = add(B.chest.t, mv(B.chest.R, [3, 1.6, -1.8]));
  if (mv(B.chest.R, [1, 0, 0])[2] > 0.15) {
    const i = (OY - Math.round(chestAt[1])) * BW + (OX + Math.round(chestAt[0]));
    if (Part[i] === PART.chest) Col[i] = MARK;
  }
  // the outline, and everything into a small list of pixels
  const list = touched.slice(), ring = new Map();
  for (const i of list) for (const d of [-1, 1, -BW, BW]) { const j = i + d; if (Part[j] === 0 && !ring.has(j)) ring.set(j, i); }
  const n = list.length + ring.size, out = { n, xs: new Int16Array(n), ys: new Int16Array(n), color: new Uint32Array(n), src: new Int16Array(n), ink: new Uint8Array(n), x0: 0, y0: 0, x1: 0, y1: 0 };
  const srcFor = (i) => {
    const f = Fr[i];
    if (f < 0 || !restFrames) return -1;
    const name = FRAME_IDS[f], A = B[name], R0 = restFrames[name], wx = (i % BW) - OX, wy = OY - ((i / BW) | 0), P = [wx, wy, Zb[i]];
    const lp = tv(A.R, sub(P, A.t)), rp = add(R0.t, mv(R0.R, lp)), c = Math.round(rp[0]) + 12, r = 38 - Math.round(rp[1]);
    return c < 0 || r < 0 || c >= W0 || r >= H0 ? -1 : r * W0 + c;
  };
  let k = 0, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const push = (i, c, s, isInk) => {
    const x = (i % BW) - OX, y = ((i / BW) | 0) - OY;
    out.xs[k] = x; out.ys[k] = y; out.color[k] = c; out.src[k] = s; out.ink[k] = isInk ? 1 : 0;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    k++;
  };
  for (const i of list) push(i, Col[i], srcFor(i), Col[i] === INK);
  for (const [j, i] of ring) push(j, INK, srcFor(i), true);
  let zs = 0;
  for (const i of list) zs += Zb[i];
  Object.assign(out, { x0, y0, x1, y1, z: list.length ? zs / list.length : 0 });
  for (const i of list) Part[i] = 0;
  touched.length = 0;
  return out;
}

const turnAll = (S, a) => {
  // the whole figure turned about the vertical through the feet
  const R = rotY(-a), P = (v) => mv(R, v);
  for (const f of Object.values(S.B)) { f.t = P(f.t); f.R = mm(R, f.R); }
  for (const A of [S.armN, S.armF, S.legN, S.legF]) { A.joint = P(A.joint); A.end = P(A.end); }
  S.sN = P(S.sN); S.sF = P(S.sF); S.hipN = P(S.hipN); S.hipF = P(S.hipF);
  S.axis = P(S.axis); S.side = P(S.side);
};
let REST_FRAMES = null;
function render(pose) {
  const S = solve(pose), q = S.q, whole = (q.yaw ?? 0) + (q.face === -1 ? Math.PI : 0);
  if (whole) turnAll(S, whole);
  const air = (q.y ?? 0) < -0.5;
  clipBody = !air;
  clipWeapon = !air;
  drawBody(S);
  clipBody = false;
  if (S.W) S.W.draw(along(S.armN.end, S.axis, S.side, PART.weapon), q, S.armF.end);
  if (S.OW) {
    const sb = q.sb ?? Math.PI;
    let ax = [Math.cos(sb), -Math.sin(sb), 0], sd = [-Math.sin(sb), -Math.cos(sb), 0];
    if (whole) { const R = rotY(-whole); ax = mv(R, ax); sd = mv(R, sd); }
    S.OW.draw(along(S.armF.end, ax, sd, PART.offWeapon), q, S.armF.end);
  }
  clipWeapon = false;
  return finish(S, REST_FRAMES);
}
REST_FRAMES = solve({}).B;

const CACHE = new Map();
const keyOf = (p) => {
  let s = (p.y ?? 0) < -0.5 ? "air," : "";
  for (const k of Object.keys(p).sort()) {
    const v = p[k];
    if (v === undefined || k === "x" || k === "y" || k === "ghost") continue;
    s += k + (typeof v === "number" ? (k === "sa" || k === "sb" || k === "wl" || k === "yaw" || k === "turn" ? Math.round(v * 20) : Math.round(v)) : v) + ",";
  }
  return s;
};
/** How far short of where the pose wants them the hands fall, in px: arms don't stretch. */
function shortfall(pose) {
  const S = solve(pose), q = S.q, near = len(sub(S.armN.end, [q.fx, -q.fy, S.armN.end[2]])), far = q.two ? 0 : len(sub(S.armF.end, [q.bx, -q.by, S.armF.end[2]]));
  return Math.max(near, far);
}
/** The pixels of a pose: { n, xs, ys, color, src, ink, x0, y0, x1, y1 }, in local space with the feet at (0, 0). */
function posed(pose) {
  const key = keyOf(pose);
  let r = CACHE.get(key);
  if (!r) {
    if (CACHE.size > 6000) CACHE.clear();
    CACHE.set(key, (r = render(pose)));
  }
  return r;
}

/**
 * The skeleton of a pose, in the same local space as posed(): x right, y down, feet at (0, 0), z toward the viewer, whole
 * figure turned by its yaw. { joints: { name: [x, y, z] }, bones: [[from, to], ...], handles: [name, ...] }: the handles
 * are what a pose moves (hands and feet); everything else is solved from them.
 */
function skeleton(pose) {
  const S = solve(pose), q = S.q, whole = (q.yaw ?? 0) + (q.face === -1 ? Math.PI : 0);
  if (whole) turnAll(S, whole);
  const { B, armN, armF, legN, legF, sN, sF, hipN, hipF } = S, at = (f, v) => add(f.t, mv(f.R, v));
  const J = {
    pelvis: B.pelvis.t, waist: B.waist.t, chest: B.chest.t, neck: B.neck.t, head: B.head.t, crown: at(B.head, [0, 3.3, 0]),
    shoulderN: sN, elbowN: armN.joint, handN: armN.end, shoulderF: sF, elbowF: armF.joint, handF: armF.end,
    hipN, kneeN: legN.joint, ankleN: legN.end, toeN: at(B.footN, [4.6, -1.1, 0]), hipF, kneeF: legF.joint, ankleF: legF.end, toeF: at(B.footF, [4.6, -1.1, 0]),
  };
  const joints = Object.fromEntries(Object.entries(J).map(([k, v]) => [k, [v[0], -v[1], v[2]]]));
  const bones = [["pelvis", "waist"], ["waist", "chest"], ["chest", "neck"], ["neck", "head"], ["head", "crown"], ["chest", "shoulderN"], ["shoulderN", "elbowN"], ["elbowN", "handN"], ["chest", "shoulderF"], ["shoulderF", "elbowF"], ["elbowF", "handF"], ["pelvis", "hipN"], ["hipN", "kneeN"], ["kneeN", "ankleN"], ["ankleN", "toeN"], ["pelvis", "hipF"], ["hipF", "kneeF"], ["kneeF", "ankleF"], ["ankleF", "toeF"]];
  return { joints, bones, handles: ["handN", "handF", "ankleN", "ankleF"] };
}
/** The figure taken apart: each part drawn alone, with its own outline, and where its middle is. For exploded views. */
function posedParts(pose) {
  const out = [];
  for (const [name, part] of Object.entries(PART)) {
    onlyPart = part;
    const r = render(pose);
    onlyPart = 0;
    if (!r.n) continue;
    let cx = 0, cy = 0;
    for (let i = 0; i < r.n; i++) { cx += r.xs[i]; cy += r.ys[i]; }
    out.push({ name, part, n: r.n, xs: r.xs, ys: r.ys, color: r.color, cx: cx / r.n, cy: cy / r.n, z: r.z });
  }
  return out;
}

};
  __defs["core/act.js"] = function (__e) {
__x(__e, "STAND", () => STAND);
__x(__e, "posed", () => posed);
__x(__e, "lerpPose", () => lerpPose);
__x(__e, "poseAt", () => poseAt);
__x(__e, "Target", () => Target);
__x(__e, "actSpan", () => actSpan);
__x(__e, "createAct", () => createAct);
__x(__e, "actTiming", () => actTiming);
__x(__e, "actBounds", () => actBounds);
__x(__e, "SKINS", () => SKINS);
// An act: an effect performed. The character winds up, lets go and recovers, a target takes the hit, and everything
// freezes for a moment on contact. Effects describe it as data (`export const act`), so a game with its own character
// can read the same timing. The freeze, the shake, the springy target and poses held on 12 fps steps are how Hollow Crown
// plays its skills (https://github.com/rehan-remade/hollow-crown), MIT License, Copyright (c) 2026 rehan-remade.

const { Rng, clamp } = __req("core/math.js");
const { hex, mix } = __req("core/color.js");
const { createFrame, clearFrame, createFx, painterFor } = __req("core/fx.js");
const { stockActor, drawActor, actorAlphaOf, HERO2, DUMMY_PAL } = __req("core/actor.js");
const { posed, STAND } = __req("core/rig.js");



// ---- poses over time
const lerp = (a, b, u) => a + (b - a) * u;
/** Between two poses: numbers move, everything else changes at the later key. */
function lerpPose(a, b, u) {
  const out = { ...STAND, ...a };
  const B = { ...STAND, ...b };
  for (const k of Object.keys(B)) {
    const v = B[k];
    if (typeof v === "number" && typeof out[k] === "number") out[k] = lerp(out[k], v, u);
    else if (out[k] === undefined && typeof v === "number") out[k] = v;
  }
  // what the later pose doesn't mention eases back to its default
  for (const k of ["hx", "hy", "lean", "crouch"]) if (B[k] === undefined && typeof out[k] === "number") out[k] = lerp(out[k], 0, u);
  if (B.wl === undefined && typeof out.wl === "number") out.wl = lerp(out.wl, 1, u);
  return out;
}
const eases = { out: (u) => 1 - (1 - u) * (1 - u), in: (u) => u * u, line: (u) => u };
/**
 * The pose at time t on a track of keys [t, pose, how]: `how` says how the pose arrives: smoothly by default, "out"
 * fast then settling, "in" slowly then fast, "snap" holding the last pose and jumping on the key. Limbs move in whole
 * 12 fps steps counted from each key, so they read as held drawings; the feet's position over the floor (x, y) stays smooth.
 */
function poseAt(track, t) {
  if (t <= track[0][0]) return track[0][1];
  for (let i = 0; i < track.length - 1; i++) {
    const [t0, a] = track[i], [t1, b, how] = track[i + 1];
    if (t >= t1) continue;
    if (how === "snap") return a;
    const e = eases[how] ?? ((u) => u * u * (3 - 2 * u));
    const stepped = t0 + Math.floor((t - t0) * 12 + 1e-6) / 12;
    const out = lerpPose(a, b, e((stepped - t0) / (t1 - t0)));
    const u = e((t - t0) / (t1 - t0));
    out.x = lerp(a.x ?? 0, b.x ?? 0, u);
    out.y = lerp(a.y ?? 0, b.y ?? 0, u);
    return out;
  }
  return track[track.length - 1][1];
}

/** Is the body between keys that hardly differ, or past the last? */
function isHeld(track, t) {
  if (t >= track[track.length - 1][0] || t < track[0][0]) return true;
  for (let i = 0; i < track.length - 1; i++) {
    if (t >= track[i + 1][0]) continue;
    const a = { ...STAND, ...track[i][1] }, b = { ...STAND, ...track[i + 1][1] };
    return track[i + 1][0] - track[i][0] > 0.4 && ["fx", "fy", "bx", "by", "crouch", "lean", "x", "y"].every((k) => Math.abs((a[k] ?? 0) - (b[k] ?? 0)) < 1.5);
  }
  return true;
}

// ---- the target
const TW = 38, TH = 52;
const TP = Object.fromEntries(Object.entries({ ink: "#0b0a1a", wood: "#724c2e", woodL: "#a0703a", woodD: "#4e331f", straw: "#d2aa55", strawL: "#f0d98a", burlapD: "#86643a", burlap: "#b38b57", burlapL: "#c9a26c", red: "#9a2f3c", redL: "#c4434f", white: "#ffffff" }).map(([k, v]) => [k, hex(v)]));
const DUST = ["#efe7dc", "#c9bfb8", "#8f8693", "#5a5468"].map(hex);
const DUMMY = new Uint32Array(TW * TH);
(function buildDummy() {
  const px = (x, y, c) => { if (x >= 0 && y >= 0 && x < TW && y < TH) DUMMY[y * TW + x] = c; };
  const R = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, c); };
  // the post and the crossbar
  R(15, 38, 8, 14, TP.ink); R(16, 34, 6, 18, TP.wood); R(16, 34, 2, 18, TP.woodL); R(20, 34, 2, 18, TP.woodD);
  R(1, 18, 36, 1, TP.ink); R(1, 23, 36, 1, TP.ink); R(1, 19, 36, 4, TP.wood); R(1, 19, 36, 1, TP.woodL); R(1, 22, 36, 1, TP.woodD);
  // straw bursting out of the ends of the arms
  for (const [bx, s] of [[0, -1], [33, 1]]) {
    R(bx, 17, 5, 8, TP.straw);
    for (const [dx, dy, c] of [[2, 16, TP.straw], [3, 15, TP.strawL], [1, 17, TP.strawL], [2, 25, TP.straw], [1, 26, TP.strawL], [3, 25, TP.burlapD], [2, 19, TP.strawL], [3, 21, TP.strawL], [1, 22, TP.burlapD], [2, 23, TP.strawL]]) px(bx + dx, dy, c);
    px(s < 0 ? bx - 1 : bx + 5, 19, TP.straw); px(s < 0 ? bx - 1 : bx + 5, 22, TP.strawL);
  }
  const sack = (x, y, w, h) => {
    R(x + 1, y, w - 2, 1, TP.ink); R(x + 1, y + h - 1, w - 2, 1, TP.ink);
    R(x, y + 1, 1, h - 2, TP.ink); R(x + w - 1, y + 1, 1, h - 2, TP.ink);
    R(x + 1, y + 1, w - 2, h - 2, TP.burlap);
    R(x + w - 4, y + 1, 3, h - 2, TP.burlapD);
    R(x + 1, y + h - 3, w - 2, 2, TP.burlapD);
    R(x + 1, y + 1, 1, h - 4, TP.burlapL); R(x + 1, y + 1, w - 6, 1, TP.burlapL);
    // the weave
    for (let j = y + 2; j < y + h - 2; j += 3) for (let i = x + 3 + (j % 2); i < x + w - 4; i += 4) px(i, j, TP.burlapD);
  };
  sack(9, 17, 20, 24);
  // the rings on its chest
  for (let y = 19; y < 36; y++) for (let x = 11; x < 27; x++) { const d = Math.hypot(x - 18.5, y - 27); if ((d > 4 && d < 5.4) || d < 1.9) px(x, y, x + y < 45 ? TP.redL : TP.red); }
  // the rope belt, and straw coming out under it
  for (let x = 10; x < 28; x++) { px(x, 36, x & 1 ? TP.woodL : TP.straw); px(x, 37, x & 1 ? TP.woodD : TP.wood); }
  for (const [x, y, c] of [[11, 41, TP.straw], [12, 42, TP.strawL], [14, 41, TP.strawL], [15, 42, TP.straw], [23, 41, TP.straw], [24, 42, TP.strawL], [26, 41, TP.straw], [13, 43, TP.straw], [25, 43, TP.straw]]) px(x, y, c);
  sack(10, 1, 18, 16);
  // X for eyes and a stitched mouth
  for (const ex of [14, 23]) for (let d = -2; d <= 2; d++) { px(ex + d, 7 + d, TP.ink); px(ex - d, 7 + d, TP.ink); }
  for (let x = 14; x < 24; x++) px(x, 12, x & 1 ? TP.ink : TP.burlapD);
  for (const x of [15, 18, 21]) { px(x, 11, TP.ink); px(x, 13, TP.ink); }
  // the rope at its neck, and straw for hair
  for (let x = 12; x < 26; x++) { px(x, 16, x & 1 ? TP.woodL : TP.straw); px(x, 17, x & 1 ? TP.wood : TP.woodD); }
  for (const [x, y, c] of [[13, 0, TP.straw], [15, 0, TP.strawL], [18, 0, TP.straw], [21, 0, TP.strawL], [24, 0, TP.straw], [9, 4, TP.straw], [28, 6, TP.straw], [8, 7, TP.strawL], [29, 3, TP.strawL]]) px(x, y, c);
})();
/** What a hit can leave on the target: [color, how much of it]. */
const SKINS = { flash: [TP.white, 1], char: [hex("#1a0c0e"), 0.72], ice: [hex("#a8e8ff"), 0.72], shadow: [hex("#3a1a70"), 0.5], holy: [hex("#fff4c0"), 0.5], red: [hex("#ff2040"), 0.45], shock: [hex("#8fd6ff"), 0.6], poison: [hex("#58c43a"), 0.5] };
const STRAW = [TP.strawL, TP.straw, TP.straw, TP.burlapD, TP.burlapD];

/** A straw target on a spring: it sways, flashes, takes a skin, shivers and sheds straw. (x, y): the floor under it, local space. */
class Target {
  constructor(x, seed = 5) {
    Object.assign(this, { x, theta: 0, omega: 0, flashT: 0, skin: null, skinFade: 0, shiver: 0, clock: 0, R: new Rng(seed), straw: [] });
  }
  hit({ push = 1.2, straw = 8, flash = 0.05, skin, shiver = 0, y = -26 } = {}) {
    this.omega += push;
    this.flashT = Math.max(this.flashT, flash);
    if (skin !== undefined) this.skin = skin;
    if (shiver) this.shiver = shiver;
    const R = this.R;
    for (let k = 0; k < straw; k++) {
      const back = R.next() < 0.3;
      this.straw.push({ x: this.x + R.range(-3, 3), y: y + R.range(-3, 3), vx: back ? R.range(-60, -5) : R.range(10, 130), vy: R.range(-120, -5), age: 0, life: R.range(1.2, 2.2), big: R.next() < 0.5 });
    }
  }
  step(dt) {
    this.clock += dt;
    this.omega += (-60 * this.theta - 3.4 * this.omega) * dt;
    this.theta = clamp(this.theta + this.omega * dt, -0.4, 0.42);
    if (this.flashT > 0) this.flashT -= dt;
    if (this.shiver > 0) this.shiver -= dt;
    for (const s of this.straw) {
      s.age += dt;
      s.vy += 210 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.y >= 0) { s.y = 0; s.vx *= 0.2; s.vy = 0; }
    }
    this.straw = this.straw.filter((s) => s.age < s.life);
  }
  draw(C, W, H, X, Y, flip) {
    const tan = Math.tan(this.theta), sv = this.shiver > 0 ? (Math.floor(this.clock * 30) & 1 ? 1 : -1) : 0, name = this.flashT > 0 ? "flash" : this.skin, sk = name ? SKINS[name] : null;
    const base = X + (flip ? -this.x - 1 : this.x);
    for (let r = 0; r < TH; r++) {
      const o = Math.round((TH - 1 - r) * tan * 0.8) + sv;
      for (let x = 0; x < TW; x++) {
        const c = DUMMY[r * TW + x];
        if (!c) continue;
        const px = base + (flip ? -(x - 19 + o) - 1 : x - 19 + o), py = Y - TH + r;
        if (px >= 0 && py >= 0 && px < W && py < H) C[py * W + px] = sk ? mix(c, sk[0], sk[1]) : c;
      }
    }
  }
  drawStraw(C, W, H, X, Y, flip) {
    for (const s of this.straw) {
      const c = STRAW[Math.min(4, Math.floor((s.age / s.life) * 5))], lx = Math.round(s.x), ly = Math.round(s.y) - 1;
      for (let i = 0; i < (s.big ? 2 : 1); i++) {
        const px = X + (flip ? -(lx + i) - 1 : lx + i), py = Y + ly;
        if (px >= 0 && py >= 0 && px < W && py < H) C[py * W + px] = c;
      }
    }
  }
}

// ---- the act itself
const GHOST_LIFE = 0.16;
const REST_MASK = new Uint8Array(24 * 38), REST_PX = new Uint32Array(24 * 38);
HERO2.forEach((row, r) => [...row].forEach((ch, c) => {
  if (ch !== ".") {
    REST_MASK[r * 24 + c] = 1;
    REST_PX[r * 24 + c] = hex(DUMMY_PAL[ch]);
  }
}));

// every cell of the standing sprite, mapped to the nearest cell that's on the body
const NEAREST = new Int16Array(24 * 38).fill(-1);
for (let r = 0; r < 38; r++)
  for (let c = 0; c < 24; c++) {
    let best = -1, bd = 1e9;
    for (let y = Math.max(0, r - 7); y < Math.min(38, r + 8); y++)
      for (let x = Math.max(0, c - 7); x < Math.min(24, c + 8); x++) {
        const d = (x - c) * (x - c) + (y - r) * (y - r);
        if (REST_MASK[y * 24 + x] && d < bd) { bd = d; best = y * 24 + x; }
      }
    NEAREST[r * 24 + c] = best;
  }
const lum = (c) => (0.3 * (c & 255) + 0.59 * ((c >>> 8) & 255) + 0.11 * ((c >>> 16) & 255)) / 255;
// an effect's color over the standing body, moved onto a pixel of the pose: its color, at this pixel's own light and shade
function carry(v, rest, own) {
  const lv = lum(v);
  if (lv > 0.9 || v >>> 24 < 255) return v;
  const k = Math.max(0.45, Math.min(1.5, lum(own) / Math.max(0.08, lum(rest))));
  const ch = (n) => Math.min(255, Math.round(((v >>> n) & 255) * k));
  return (255 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0);
}

/** When an act's poses begin and end, in effect time (a loop ends when it's told to). */
function actSpan(mod) {
  const a = mod.act, D = mod.meta?.duration ?? 1, k = a?.poses;
  return { from: Math.min(0, k?.[0]?.[0] ?? 0), to: mod.meta?.loop ? Infinity : Math.max(D, k?.[k.length - 1]?.[0] ?? 0) };
}

/**
 * An effect performed: { fx, t, update(dt), draw(frame, { body, target }), shake, done() }. t runs from the first pose
 * (before the effect's own t = 0) to the last. update() holds everything still during a freeze; draw() paints the effect, the
 * character and the target together. o: the effect's options, with x, y placing the feet. Without an act, it just plays.
 */
function createAct(mod, o = {}) {
  const a = mod.act ?? {}, meta = mod.meta ?? {}, D = meta.duration ?? 1, flip = !!o.flip, seed = o.seed ?? meta.options?.seed ?? 1;
  const fx = createFx(mod, o), track = a.poses ?? [[0, { ...STAND }]], span = actSpan(mod);
  const X = o.x ?? 0, Y = o.y ?? 0;
  const targets = (a.targets ?? (a.target ? [a.target] : [])).map((g, i) => new Target(g.x ?? 66, seed + 4 + i));
  const hits = (a.hits ?? []).map((h) => ({ ...h })).sort((p, q) => p.t - q.t), dust = (a.dust ?? []).slice();
  const R = new Rng(seed + 9), specks = [];
  // after-images take the effect's own color unless the act names one
  const ramp = o.palette ?? meta.options?.palette, ghosts = [], gc = hex(a.ghost ?? ramp?.[Math.floor(ramp.length * 0.7)] ?? "#8fb4ff");
  let t = span.from, stop = 0, stopped = false, shakeT = 0, shake0 = 0, amp = 0, nh = 0, nd = 0, loopN = 0, gAcc = 0, last = null;
  const poseNow = () => {
    let tt = t;
    if (meta.loop && t >= D) tt = t % D;
    let q = poseAt(track, tt);
    // nothing is asked of him: he breathes
    if (!meta.loop && isHeld(track, tt)) {
      const up = Math.floor(tt * 3) & 1;
      q = { ...STAND, ...q, crouch: (q.crouch ?? 0) + up, fy: (q.fy ?? STAND.fy) + up, by: (q.by ?? STAND.by) + up };
    }
    last = q;
    return q;
  };
  let scratch = null;
  const scratchFor = (f) => {
    if (!scratch || scratch.a.w !== f.w || scratch.a.h !== f.h) scratch = { a: createFrame(f.w, f.h, f.ox, f.oy), b: createFrame(f.w, f.h, f.ox, f.oy) };
    return scratch;
  };
  const out = {
    fx, meta, act: a, targets,
    get t() { return t; },
    /** How far the whole picture is thrown right now, in px. */
    get shake() {
      if (shakeT <= 0) return [0, 0];
      const k = amp * (shakeT / shake0), f = Math.floor(shakeT * 60);
      return [Math.round(Math.sin(f * 2.4) * k), Math.round(Math.cos(f * 3.7) * k * 0.7)];
    },
    get frozen() { return stop > 0; },
    /** The pose he's in right now. */
    get pose() { return last; },
    update(dt) {
      if (shakeT > 0) shakeT -= dt;
      if (stop > 0) {
        stop -= dt;
        return;
      }
      const t0 = t;
      t += dt;
      if (t >= 0) fx.update(t0 < 0 ? t : dt);
      if (meta.loop && t >= D) {
        const n = Math.floor(t / D);
        if (n !== loopN) {
          loopN = n;
          nh = 0;
          nd = 0;
        }
      }
      const tt = meta.loop && t >= D ? t % D : t;
      for (; nh < hits.length && hits[nh].t <= tt; nh++) {
        const h = hits[nh];
        if (h.stop) stop = Math.max(stop, h.stop);
        if (h.shake) {
          shakeT = shake0 = h.shake;
          amp = h.amp ?? 2;
        }
        if (h.target !== false) targets.forEach((g, i) => (h.at === undefined || h.at === i) && g.hit(h));
        out.onHit?.(h);
      }
      for (; nd < dust.length && dust[nd].t <= tt; nd++) {
        const d = dust[nd], n = d.n ?? 6;
        for (let i = 0; i < n; i++) {
          const dir = d.dir ?? (R.next() < 0.5 ? -1 : 1);
          specks.push({ x: d.x + R.range(-3, 3), y: -1 - R.range(0, 2), vx: dir * R.range(22, 90), vy: R.range(-34, -6), age: 0, life: R.range(0.16, 0.4), big: R.next() < 0.45, c: d.c ? hex(d.c) : 0 });
        }
      }
      for (const k of specks) {
        k.age += dt;
        k.vx *= 1 - 5 * dt;
        k.vy += 110 * dt;
        k.x += k.vx * dt;
        k.y = Math.min(-1, k.y + k.vy * dt);
      }
      for (let i = specks.length - 1; i >= 0; i--) if (specks[i].age >= specks[i].life) specks.splice(i, 1);
      const q = poseNow();
      for (const g of targets) g.step(dt);
      // after-images while a key asks for them
      gAcc += dt;
      if (q.ghost && gAcc >= 1 / 30) {
        gAcc = 0;
        ghosts.push({ q, age: 0 });
        if (ghosts.length > 7) ghosts.shift();
      }
      for (const g of ghosts) g.age += dt;
      while (ghosts.length && ghosts[0].age > GHOST_LIFE) ghosts.shift();
    },
    /** Paint it. { body: false } leaves the character out, { target: false } the target. */
    draw(frame, { body = true, target: showTarget = true } = {}) {
      const W = frame.w, H = frame.h, q = last ?? poseNow(), active = t >= 0;
      const tgt = showTarget ? targets : [];
      const drawTargets = () => tgt.forEach((g) => g.draw(frame.color, W, H, FX, FY, flip));
      const drawStraw = () => tgt.forEach((g) => g.drawStraw(frame.color, W, H, FX, FY, flip));
      const drawDust = () => {
        for (const k of specks) {
          const c = k.c || DUST[Math.min(3, Math.floor((k.age / k.life) * 4))], lx = Math.round(k.x), py = FY + Math.round(k.y);
          for (let i = 0; i < (k.big ? 2 : 1); i++) {
            const px = flip ? FX - lx - i - 1 : FX + lx + i;
            if (px >= 0 && py >= 0 && px < W && py < H) frame.color[py * W + px] = c;
          }
        }
      };
      const FX = X - (frame.ox | 0), FY = Y - (frame.oy | 0);
      if (!body) {
        if (active) fx.draw(frame, "back");
        drawTargets();
        if (active) fx.draw(frame, "front");
        drawStraw();
        return;
      }
      const rx = Math.round(q.x ?? 0), ry = Math.round(q.y ?? 0), BX = FX + (flip ? -rx : rx), BY = FY + ry;
      const r = posed(q), mirror = flip;
      const paint = (i, color) => {
        const px = mirror ? BX - r.xs[i] - 1 : BX + r.xs[i], py = BY + r.ys[i];
        if (px < 0 || py < 0 || px >= W || py >= H) return;
        frame.color[py * W + px] = color;
        // he stays crisp in front of his own after-images
        if (ghosts.length) frame.light[py * W + px] = 0;
      };
      const drawGhosts = () => {
        for (const g of ghosts) {
          // after-images are light, not paint: they brighten what's behind them and leave nothing muddy
          const gr = posed(g.q), gx = FX + (flip ? -Math.round(g.q.x ?? 0) : Math.round(g.q.x ?? 0)), gy = FY + Math.round(g.q.y ?? 0), k = 0.5 * (1 - g.age / GHOST_LIFE);
          const gm = flip, r0 = (gc & 255) * k, g0 = ((gc >>> 8) & 255) * k, b0 = ((gc >>> 16) & 255) * k;
          for (let i = 0; i < gr.n; i++) {
            const px = gm ? gx - gr.xs[i] - 1 : gx + gr.xs[i], py = gy + gr.ys[i];
            if (px < 0 || py < 0 || px >= W || py >= H) continue;
            const j = py * W + px, d = frame.light[j];
            frame.light[j] = (255 << 24) | (Math.min(255, ((d >>> 16) & 255) + b0) << 16) | (Math.min(255, ((d >>> 8) & 255) + g0) << 8) | Math.min(255, (d & 255) + r0);
          }
        }
      };
      const shadow = () => {
        const sy = FY, cx = FX + (flip ? -rx : rx), hw = 10 + (Math.abs(q.ffx - q.fbx) >> 1) - Math.min(8, Math.abs(ry) >> 1);
        if (sy < 0 || sy >= H) return;
        for (let dy = 0; dy < 2; dy++)
          for (let x = -hw + dy * 2; x <= hw - dy * 2; x++) {
            const px = cx + x, i = (sy + dy) * W + px;
            if (px < 0 || px >= W || sy + dy >= H) continue;
            frame.color[i] = (frame.color[i] & 0xffffff) | (Math.max(frame.color[i] >>> 24, 110) << 24);
          }
      };
      if (!a.onBody) {
        // the effect doesn't care about the body: back, body, front
        if (active) fx.draw(frame, "back");
        drawTargets();
        shadow();
        drawGhosts();
        for (let i = 0; i < r.n; i++) paint(i, r.color[i]);
        if (active) fx.draw(frame, "front");
        drawStraw();
        drawDust();
        return;
      }
      // the effect paints the standing body: draw it there, then carry each body pixel to where the pose put it
      const { a: A, b: B } = scratchFor(frame);
      clearFrame(A);
      clearFrame(B);
      if (active) fx.draw(A, "back");
      B.color.set(A.color);
      B.light.set(A.light);
      const tt = meta.loop ? (t < 0 ? 0 : t % D) : clamp(t, 0, D), alpha = active ? actorAlphaOf(mod, tt, fx.options) : 1;
      drawActor(painterFor(B).place(FX, FY, flip), fx.options.actor ?? stockActor(2), alpha);
      if (active) fx.draw(B, "front");
      const follow = a.follow ?? 1, lean = (q.lean ?? 0) * follow, cr = (q.crouch ?? 0) * follow;
      // what's up on the body goes with it; what's on the floor stays on the floor
      const shiftOf = (ly) => {
        const k = clamp((-11 - ly) / 7, 0, 1), f = clamp((-1 - ly) / 6, 0, 1);
        return [Math.round(lean * k + rx * f), Math.round(cr * k + ry * f)];
      };
      const rest = (sx, sy) => {
        const c = (flip ? FX - sx - 1 : sx - FX) + 12, r0 = sy - FY + 38;
        return c >= 0 && r0 >= 0 && c < 24 && r0 < 38 && REST_MASK[r0 * 24 + c] === 1;
      };
      const C = frame.color, Ls = frame.light;
      const copy = (buf, sx, sy, s) => {
        const [dx, dy] = shiftOf(sy - FY), px = sx + (flip ? -dx : dx), py = sy + dy;
        if (px < 0 || py < 0 || px >= W || py >= H) return;
        const i = py * W + px;
        if (buf === Ls) {
          const d = Ls[i];
          Ls[i] = (255 << 24) | (Math.min(255, ((d >>> 16) & 255) + ((s >>> 16) & 255)) << 16) | (Math.min(255, ((d >>> 8) & 255) + ((s >>> 8) & 255)) << 8) | Math.min(255, (d & 255) + (s & 255));
        } else if (s >>> 24 === 255 || !C[i]) C[i] = s;
        else {
          const k = (s >>> 24) / 255, d = C[i];
          const ch = (n) => Math.round(((s >>> n) & 255) * k + ((d >>> n) & 255) * (1 - k));
          C[i] = (Math.max(s >>> 24, d >>> 24) << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0);
        }
      };
      drawTargets();
      shadow();
      for (let sy = 0; sy < H; sy++)
        for (let sx = 0; sx < W; sx++) {
          const c = A.color[sy * W + sx];
          if (c) copy(C, sx, sy, c);
        }
      drawGhosts();
      const restIndex = (s) => {
        const c = s % 24, r0 = (s / 24) | 0, sx = flip ? FX - (c - 12) - 1 : FX + c - 12, sy = FY + r0 - 38;
        return sx >= 0 && sy >= 0 && sx < W && sy < H ? sy * W + sx : -1;
      };
      for (let i = 0; i < r.n; i++) {
        const s = r.src[i] >= 0 ? NEAREST[r.src[i]] : -1;
        if (s < 0) {
          if (alpha > 0.5) paint(i, r.color[i]);
          continue;
        }
        const j = restIndex(s), v = j >= 0 ? B.color[j] : REST_PX[s];
        if (!v) continue;
        // the effect left this bit of body alone, or changed it: carry the change, on top of this pixel's own shading
        paint(i, v === REST_PX[s] ? r.color[i] : carry(v, REST_PX[s], r.color[i]));
      }
      for (let sy = 0; sy < H; sy++)
        for (let sx = 0; sx < W; sx++) {
          const j = sy * W + sx;
          if (B.color[j] && B.color[j] !== A.color[j] && !rest(sx, sy)) copy(C, sx, sy, B.color[j]);
          if (B.light[j] & 0xffffff) copy(Ls, sx, sy, B.light[j]);
        }
      drawStraw();
      drawDust();
    },
    /** Let a loop end: it fades out and done() goes true. */
    stop() {
      fx.stop();
      stopped = true;
    },
    /** One-shots end when the last pose is over. */
    done() {
      return stopped ? fx.done() : t >= span.to && stop <= 0;
    },
  };
  poseNow();
  return out;
}

/**
 * An act as plain data, for a game with its own character: how long the wind-up and recovery are, when to freeze and shake,
 * what a target should do, and the poses themselves. Times are in the effect's own seconds: start the effect at 0.
 */
function actTiming(mod) {
  const a = mod.act;
  if (!a) return null;
  const { from, to } = actSpan(mod), D = mod.meta?.duration ?? 1;
  return {
    windup: -from,
    recovery: mod.meta?.loop ? 0 : Math.max(0, to - D),
    onBody: !!a.onBody,
    targets: (a.targets ?? (a.target ? [a.target] : [])).map((g) => g.x ?? 66),
    hits: (a.hits ?? []).map((h) => ({ t: h.t, freeze: h.stop ?? 0, shake: h.shake ?? 0, amp: h.amp ?? 0, push: h.target === false ? 0 : h.push ?? 1.2, skin: h.skin, at: h.at })),
    poses: (a.poses ?? []).map(([t, pose, how]) => ({ t, how: how ?? "smooth", pose })),
  };
}

/** The box an act needs in local space, so nothing gets cut off: { x0, y0, x1, y1 }, sampled over its poses. */
function actBounds(mod) {
  const a = mod.act, [w, h] = mod.meta.size, [ox, oy] = mod.meta.origin;
  let x0 = -ox, y0 = -oy, x1 = w - ox, y1 = h - oy;
  const see = (p) => {
    const r = posed(p), X = Math.round(p.x ?? 0), Y = Math.round(p.y ?? 0), a = r.x0, b = r.x1;
    x0 = Math.min(x0, a + X - 1); x1 = Math.max(x1, b + X + 1); y0 = Math.min(y0, r.y0 + Y - 1); y1 = Math.max(y1, r.y1 + Y + 1);
  };
  const k = a?.poses;
  if (k) {
    for (let t = k[0][0]; t <= k[k.length - 1][0]; t += 1 / 12) see(poseAt(k, t));
    for (const key of k) see(key[1]);
  } else see(STAND);
  for (const g of a?.targets ?? (a?.target ? [a.target] : [])) {
    const tx = g.x ?? 66;
    x0 = Math.min(x0, tx - 30); x1 = Math.max(x1, tx + 36); y0 = Math.min(y0, -56);
  }
  return { x0, y0, x1, y1 };
}

};
  __defs["core/poses.js"] = function (__e) {
__x(__e, "READY", () => READY);
// The stance acts start from. A pose only says what differs from standing easy (STAND in rig.js), in screen terms, px from
// the feet, y negative up. Give the hands and feet; the skeleton works out the rest.
//   x, y       where the feet are, from the effect's origin
//   crouch     hips lowered; lean  the spine bent forward (+) or back (-); hx, hy  the head rolled, nodded
//   fx, fy, fz the near (right) hand; bx, by, bz  the far (left) hand; ffx, ffy  the near foot; fbx, fby  the far foot
//   turn       how far the chest faces us, in radians (it follows the hands if you leave it out); yaw  the whole body turned
//              about its feet (0 faces right, pi faces left, in between towards us; a spin is really a spin)
//   twist      extra chest turn; armsFront  the far hand comes round in front of the chest
//   weapon, sa what the near hand holds and its angle on screen (radians, 0 points forward); two  both hands on it
//   wl, wz     foreshorten the weapon towards (or, wz -1, away from) the viewer: wl is its length on screen, 1 is full
//   pull, nocked  a bow drawn to the far hand, an arrow on the string
//   offWeapon, sb  a weapon in the far hand and its angle
//   toeF, toeB up on the toes; ghost  leave after-images
//
// How the body works. He faces right, three-quarters towards us, so his near shoulder is on the LEFT of the chest on screen and
// his far shoulder on the right: for arms raised or open to us, the near hand goes left (fx < 0) and the far hand right (bx > 0). A hand
// driving forward closes the chest and brings its shoulder round; a hand drawn back opens him up. Bones have fixed lengths: an arm reaches
// about 15 px from its shoulder (shoulders are near y = -29), a leg 17 px. Arms don't stretch, so step the body in rather than ask too much.
//
// How to hold things. Keep a little bend in the elbow. The blade lags the hand on a swing, so the wrist breaks and it whips. Long weapons
// rest in one hand with the butt on the floor and take the second hand to swing. Everything is in depth, so a weapon can swing round the front
// of him: turn the body (yaw) and the weapon goes with it.

const READY = { crouch: 3, fx: 11, fy: -21, bx: 9, by: -21, ffx: 7, fbx: -7 };

};
  __defs["core/chain.js"] = function (__e) {
__x(__e, "chain", () => chain);
__x(__e, "shiftKeys", () => shiftKeys);
__x(__e, "shiftHits", () => shiftHits);
// Moves: several effects played as one. A cue says which effect, when, where and for how long; a projectile is just an
// effect whose x is a function of time. It's an ordinary effect from the outside: it plays, recolors and exports.

const { createFx } = __req("core/fx.js");

/**
 * create(o) for a list of cues: { fx (an effect module), t (when it starts), until (cut it off here), x, y (numbers, or
 * functions of the move's time, local space), flip, ...any of that effect's options }.
 */
function chain(cues) {
  return (o) => {
    const list = cues.map(({ fx, t, until, x, y, flip, ...opts }, i) => ({ fx, t: t ?? 0, until: until ?? Infinity, x: x ?? 0, y: y ?? 0, flip: !!flip, opts: { ...opts, seed: (o.seed ?? 1) + i }, inst: null, over: false }));
    let t = 0;
    const at = (v) => (typeof v === "function" ? v(t) : v);
    const each = (p, layer) => {
      const { frame, tx, ty, fx: sign, cs, sn, fade, lightK } = p;
      for (const c of list) {
        if (!c.inst || c.over) continue;
        c.inst.options.x = tx + sign * at(c.x);
        c.inst.options.y = ty + at(c.y);
        c.inst.options.flip = sign < 0 !== c.flip;
        c.inst.draw(frame, layer);
      }
      // each one places the painter for itself: put it back for whoever draws next
      Object.assign(p, { tx, ty, fx: sign, cs, sn, fade, lightK });
    };
    return {
      update(dt) {
        t += dt;
        for (const c of list) {
          if (c.over || t < c.t) continue;
          if (!c.inst) c.inst = createFx(c.fx, c.opts);
          else c.inst.update(dt);
          if (t >= c.until || (c.inst.done() && !c.fx.meta?.loop)) c.over = true;
        }
      },
      drawBack: (p) => each(p, "back"),
      draw: (p) => each(p, "front"),
    };
  };
}

/** Reuse an act's keys in a longer move: later by dt, moved along by dx, with anything else laid over each pose. */
const shiftKeys = (keys, dt, { dx = 0, ...over } = {}) => keys.map(([t, pose, how]) => [t + dt, { ...pose, ...over, x: (pose.x ?? 0) + dx }, how]);
/** The same for hits. */
const shiftHits = (hits, dt) => hits.map((h) => ({ ...h, t: h.t + dt }));

};
  __defs["core/index.js"] = function (__e) {
__star(__e, __req("core/math.js"));
__star(__e, __req("core/color.js"));
__star(__e, __req("core/particles.js"));
__star(__e, __req("core/shapes.js"));
__x(__e, "Particles", () => __req("core/sim.js").Particles);
__x(__e, "Bits", () => __req("core/sim.js").Bits);
__x(__e, "Lights", () => __req("core/sim.js").Lights);
__x(__e, "Blazes", () => __req("core/sim.js").Blazes);
__x(__e, "P", () => __req("core/sim.js").P);
__x(__e, "PF", () => __req("core/sim.js").PF);
__x(__e, "B", () => __req("core/sim.js").B);
__x(__e, "GRAVITY", () => __req("core/sim.js").GRAVITY);
__x(__e, "FIRE_RAMP", () => __req("core/sim.js").FIRE_RAMP);
__x(__e, "SMOKE_RAMP", () => __req("core/sim.js").SMOKE_RAMP);
__x(__e, "sparkle", () => __req("core/sim.js").sparkle);
__x(__e, "flare", () => __req("core/sim.js").flare);
__x(__e, "band", () => __req("core/sim.js").band);
__x(__e, "crystal", () => __req("core/sim.js").crystal);
__x(__e, "Painter", () => __req("core/painter.js").Painter);
__x(__e, "FONTS", () => __req("core/font.js").FONTS);
__x(__e, "textWidth", () => __req("core/font.js").textWidth);
__x(__e, "createFrame", () => __req("core/fx.js").createFrame);
__x(__e, "clearFrame", () => __req("core/fx.js").clearFrame);
__x(__e, "createFx", () => __req("core/fx.js").createFx);
__x(__e, "composite", () => __req("core/fx.js").composite);
__x(__e, "painterFor", () => __req("core/fx.js").painterFor);
__x(__e, "resolveOptions", () => __req("core/fx.js").resolveOptions);
__x(__e, "stockActor", () => __req("core/actor.js").stockActor);
__x(__e, "drawActor", () => __req("core/actor.js").drawActor);
__x(__e, "actorAlphaOf", () => __req("core/actor.js").actorAlphaOf);
__x(__e, "HERO", () => __req("core/actor.js").HERO);
__x(__e, "HERO2", () => __req("core/actor.js").HERO2);
__x(__e, "HERO_PAL", () => __req("core/actor.js").HERO_PAL);
__x(__e, "DUMMY_PAL", () => __req("core/actor.js").DUMMY_PAL);
__x(__e, "backdrop", () => __req("core/scene.js").backdrop);
__x(__e, "BACKDROPS", () => __req("core/scene.js").BACKDROPS);
__x(__e, "createAct", () => __req("core/act.js").createAct);
__x(__e, "actBounds", () => __req("core/act.js").actBounds);
__x(__e, "actSpan", () => __req("core/act.js").actSpan);
__x(__e, "actTiming", () => __req("core/act.js").actTiming);
__x(__e, "poseAt", () => __req("core/act.js").poseAt);
__x(__e, "lerpPose", () => __req("core/act.js").lerpPose);
__x(__e, "Target", () => __req("core/act.js").Target);
__x(__e, "STAND", () => __req("core/act.js").STAND);
__x(__e, "SKINS", () => __req("core/act.js").SKINS);
__x(__e, "posed", () => __req("core/act.js").posed);
__x(__e, "skeleton", () => __req("core/rig.js").skeleton);
__x(__e, "posedParts", () => __req("core/rig.js").posedParts);
__x(__e, "READY", () => __req("core/poses.js").READY);
__x(__e, "chain", () => __req("core/chain.js").chain);
__x(__e, "shiftKeys", () => __req("core/chain.js").shiftKeys);
__x(__e, "shiftHits", () => __req("core/chain.js").shiftHits);
// pixelfx core: everything an effect imports comes from here.
















};
  __defs["fx/melee/sword-slash.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The crescent, echo, trail, glint and spark recipe is adapted from Sprite Fusion's open-source slash
// (https://www.spritefusion.com/pixel-art-vfx/slash), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, P, Rng, fit, sparkle, clamp, smooth, ease, TAU, READY } = __req("core/index.js");

const meta = {
  name: "Sword slash",
  desc: "A tilted crescent whips round in two frames, cools from white to deep blue as it trails off, glints at the tip and throws sparks.",
  tags: ["melee", "slash", "sword", "combat", "directional", "one-shot"],
  size: [136, 104],
  origin: [44, 92],
  duration: 0.75,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#212f6b", "#2c58aa", "#3a8bd8", "#62c8f4", "#b8c9e8", "#e8f1ff", "#ffffff"],
    sparks: ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"],
    radius: 42,
    seed: 2,
  },
};

const GUARD = { ...READY, weapon: "sword", fx: 12, fy: -21, sa: -0.85 };
// the blade goes back past his head, then lags behind the hand on the way through, so the wrist breaks and it whips
const WIND = { ...GUARD, x: -8, crouch: 4, lean: -4, fx: -7, fy: -35, sa: -2.65, bx: 9, by: -25, armsFront: true, ffx: 9, fbx: -8 };
const CUT = { ...GUARD, x: 0, crouch: 2, lean: 3, fx: 16, fy: -37, sa: -1.45, bx: -7, by: -24, ffx: 11, fbx: -10, ghost: 1 };
const DOWN = { ...GUARD, x: 2, crouch: 5, lean: 5, fx: 20, fy: -21, sa: 0.62, bx: -9, by: -24, ffx: 13, fbx: -10, toeB: true };
const act = {
  target: { x: 58 },
  poses: [
    [-0.55, { ...GUARD, x: -8 }],
    [-0.3, WIND],
    [-0.08, { ...WIND, crouch: 5, lean: -5 }],
    [0, CUT, "snap"],
    [0.06, DOWN, "snap"],
    [0.3, { ...DOWN, x: 3, crouch: 6 }],
    [0.58, { ...GUARD, x: 1, crouch: 3, fx: 15, fy: -21, sa: 0.1, bx: -5, by: -21, ffx: 9, fbx: -7 }],
    [0.86, { ...GUARD, x: -8 }],
  ],
  hits: [{ t: 0.06, stop: 0.14, shake: 0.18, amp: 2, push: 2.8, straw: 18 }],
  dust: [{ t: 0.06, x: 16, n: 7, dir: 1 }, { t: 0.06, x: -11, n: 4, dir: -1 }],
};

// a point on the slash's tilted ellipse
function onArc(s, r, a) {
  const lx = Math.cos(a) * r, ly = Math.sin(a) * r * s.sy, c = Math.cos(s.rot), n = Math.sin(s.rot);
  return [s.cx + lx * c - ly * n, s.cy + lx * n + ly * c];
}

// the smear: thickest just behind the leading edge, tapering to a hair at the tail, white on the outer rim,
// cooling down the ramp with age and towards the tail; the tail dissolves through the dither
function crescent(p, s, ta, L, W, age) {
  if (Math.abs(L) < 0.02 || W < 0.3) return;
  const R = s.ramp, n = R.length, dir = Math.sign(L), span = Math.abs(L), c = Math.cos(s.rot), sn = Math.sin(s.rot), B = s.R + 2;
  p.shade(s.cx - B, s.cy - B, s.cx + B, s.cy + B, (x, y, out) => {
    const dx = x - s.cx, dy = y - s.cy, lx = dx * c + dy * sn, ly = (-dx * sn + dy * c) / s.sy, r = Math.hypot(lx, ly);
    if (r > s.R + 0.5 || r < s.R - W - 1) return;
    let u = (dir * (Math.atan2(ly, lx) - ta)) % TAU;
    if (u < 0) u += TAU;
    if (u > span) return;
    const v = u / span, w = W * Math.pow(Math.sin(Math.PI * Math.pow(v, 2.2)), 0.6);
    if (w < 0.35) return;
    const q = (s.R - r) / w;
    if (q < 0 || q > 1) return;
    // brightest step at the rim while it's young, then darker steps inward, with age and towards the tail
    const ci = q < 0.22 && age < 0.5 ? 0 : Math.round(q * (n - 1) * 0.75 + age * 2.4 - v * 0.8 + 0.4);
    out.c = R[n - 1 - clamp(ci, 0, n - 1)];
    out.a = Math.min(1, v / 0.4);
  });
  for (let u = 0; u <= span; u += 0.3) {
    const [x, y] = onArc(s, s.R - W * 0.4, ta + dir * u);
    p.glow(x, y, 5 + W, R[n - 3], 0.22 * (1 - age) * (u / span));
  }
}

function drawSlash(p, s, t) {
  const u = t - s.t0;
  if (u < 0) return;
  const span = s.a1 - s.a0, head = ease.outExpo(clamp(u / s.sweep)), tail = smooth(s.sweep + s.hold, s.sweep + s.hold + s.trail, u);
  const age = clamp(u / (s.sweep + s.hold + s.trail));
  if (tail < 1) crescent(p, s, s.a0 + span * tail, span * (head - tail), s.W * (1 - tail * 0.55), age);
  // a dotted trace of the blade's path lingers where the smear has already gone
  const th = 0.7 * (1 - clamp((u - s.sweep - s.hold) / (s.trail + 0.2)));
  if (tail > 0.02 && th > 0)
    for (let k = 0; k <= tail; k += 0.6 / (Math.abs(span) * s.R)) {
      const [x, y] = onArc(s, s.R - 0.5, s.a0 + span * k);
      p.dot(x, y, s.ramp[1], th * (0.4 + 0.6 * k));
    }
}

function tipOf(s) {
  const [x, y] = onArc(s, s.R - s.W * 0.3, s.a1), [x2, y2] = onArc(s, s.R - s.W * 0.3, s.a1 + Math.sign(s.a1 - s.a0) * 0.05);
  const l = Math.hypot(x2 - x, y2 - y) || 1;
  return { x, y, dx: (x2 - x) / l, dy: (y2 - y) / l };
}

function create(o) {
  const C = fit(o.palette, 7), Rg = new Rng(o.seed), ps = new Particles({ rng: Rg, ground: () => 0, sparks: o.sparks });
  const R0 = o.radius, a0 = -2.55, a1 = 0.95;
  // the main smear, and a thinner echo just inside it a beat behind
  const A = { cx: 6, cy: -26, R: R0, sy: 0.6, rot: -0.38, a0, a1, W: 12, t0: 0, sweep: 0.06, hold: 0.06, trail: 0.24, ramp: C };
  const E = { ...A, R: R0 * (33 / 42), W: R0 * (4.5 / 42), a0: a0 + (a1 - a0) * 0.1, a1: a1 - (a1 - a0) * (0.15 / 3.5), t0: 0.017, hold: 0.03, trail: 0.2, ramp: C.slice(0, 6) };
  const tip = tipOf(A);
  let t = 0, landed = false;
  return {
    update(dt) {
      t += dt;
      if (!landed && t >= A.sweep) {
        landed = true;
        // sparks off the edge where it stops, and bright shavings flung off the arc
        for (let i = 0; i < 10; i++) {
          const a = Math.atan2(tip.dy, tip.dx) + Rg.range(-0.5, 0.5), sp = Rg.range(150, 400);
          ps.spawn(P.SPARK, tip.x, tip.y, Math.cos(a) * sp, Math.sin(a) * sp, Rg.range(0.12, 0.35));
        }
        for (let i = 0; i < 16; i++) {
          const a = a0 + (a1 - a0) * Rg.range(0.3, 1), [x, y] = onArc(A, A.R, a);
          const ox = x - A.cx, oy = y - A.cy, l = Math.hypot(ox, oy) || 1, sp = Rg.range(30, 100);
          ps.spawn(P.MOTE, x, y, (ox / l) * sp, (oy / l) * sp - 10, Rg.range(0.25, 0.55), C[4 + Rg.int(0, 1)], 0.6);
        }
      }
      ps.update(dt);
    },
    draw(p) {
      drawSlash(p, E, t);
      drawSlash(p, A, t);
      // the tip glints as the edge arrives
      const g = t - A.sweep * 0.6;
      if (g > 0 && g < 0.22) sparkle(p, tip.x, tip.y, 9 * ease.outBack(Math.min(1, g / 0.05)) * (1 - g / 0.22), C[5], C[3], 0.6);
      // light rides the head of the swing
      if (t < 0.3) {
        const [x, y] = onArc(A, A.R - 4, A.a0 + (A.a1 - A.a0) * ease.outExpo(clamp(t / A.sweep)));
        p.glow(x, y, 40, C[3], 0.5 * (1 - t / 0.3));
      }
      ps.draw(p);
    },
  };
}

};
  __defs["fx/melee/_lib.js"] = function (__e) {
__x(__e, "through", () => through);
__x(__e, "onSwing", () => onSwing);
__x(__e, "travel", () => travel);
__x(__e, "plane", () => plane);
__x(__e, "smear", () => smear);
__x(__e, "trace", () => trace);
__x(__e, "glowAlong", () => glowAlong);
__x(__e, "slash", () => slash);
__x(__e, "shavings", () => shavings);
__x(__e, "stone", () => stone);
__x(__e, "rock", () => rock);
__x(__e, "cracks", () => cracks);
__x(__e, "star", () => star);
__x(__e, "sliver", () => sliver);
__x(__e, "along", () => along);
__x(__e, "swing", () => swing);
__x(__e, "slashEnd", () => slashEnd);
// Shared by the melee effects: swings on a tilted circle (the smear, its dotted trace), floor cracks, rocks.
// The crescent and trace recipe is adapted from Sprite Fusion's open-source slash
// (https://www.spritefusion.com/pixel-art-vfx/slash), MIT License, Copyright (c) 2026 Hugo Duprez.
// Files starting with _ are helpers, not effects.

const { P, clamp, smooth, ease, hex, mix, scale, rgb, WHITE, TAU } = __req("core/index.js");

/**
 * A swing: a circle of radius R around (cx, cy), squashed to sy across its plane (1 stands up facing us, 0.16
 * lies on the floor) and turned by rot, swept from angle a0 in direction dir (+1 turns clockwise on screen).
 * k lifts the band into a shallow cone: a point dr inside the rim sits k * dr higher, so a level ring shows its
 * near half broad and its far half thin, like a blade angled down from the hilt (keep k below sy).
 * Positions along it are u, radians from a0 in the swing's direction.
 */
const swing = (o) => ({ cx: 0, cy: 0, R: 30, sy: 1, rot: 0, a0: 0, dir: 1, k: 0, ...o });

/** A swing on radius R whose arc passes through (x, y) heading along angle th, that point `at` of the way along span. */
function through(x, y, th, dir, R, span, at = 0.55, extra = {}) {
  const a = th - (dir * Math.PI) / 2;
  return swing({ cx: x - Math.cos(a) * R, cy: y - Math.sin(a) * R, R, sy: 1, rot: 0, a0: a - dir * span * at, dir, span, ...extra });
}

/** The screen point at plane radius r, u radians along the swing. */
function onSwing(s, r, u) {
  const a = s.a0 + s.dir * u, lx = Math.cos(a) * r, ly = Math.sin(a) * r * s.sy - s.k * (s.R - r), c = Math.cos(s.rot), n = Math.sin(s.rot);
  return [s.cx + lx * c - ly * n, s.cy + lx * n + ly * c];
}

/** The on-screen unit direction the swing travels at u, and the in-plane angle there (sin < 0 is the far half). */
function travel(s, u) {
  const [x0, y0] = onSwing(s, s.R, u), [x1, y1] = onSwing(s, s.R, u + 0.01), l = Math.hypot(x1 - x0, y1 - y0) || 1;
  return { x: x0, y: y0, dx: (x1 - x0) / l, dy: (y1 - y0) / l, a: s.a0 + s.dir * u };
}

/** The plane radius and angle under a screen point (inverts onSwing, cone included). */
function plane(s, x, y) {
  const c = Math.cos(s.rot), n = Math.sin(s.rot), dx = x - s.cx, dy = y - s.cy, lx = dx * c + dy * n, ly = -dx * n + dy * c;
  if (!s.k) return [Math.hypot(lx, ly / s.sy), Math.atan2(ly / s.sy, lx)];
  // r sin(a) sy = m - k r, r cos(a) = lx  =>  r^2 (sy^2 - k^2) + 2 m k r - (lx^2 sy^2 + m^2) = 0
  const m = ly + s.k * s.R, A = s.sy * s.sy - s.k * s.k, B = 2 * m * s.k, Cc = lx * lx * s.sy * s.sy + m * m;
  const r = (-B + Math.sqrt(B * B + 4 * A * Cc)) / (2 * A);
  return [r, Math.atan2((m - s.k * r) / s.sy, lx)];
}

/**
 * Shade a swing's band from u0 to u1 (u1 - u0 at most a full turn), plane radius R + pad down to R - wMax - 1.
 * fn(u, r, out, a) shades each pixel: u along the swing, r its plane radius, a the in-plane angle. half: 0 the
 * whole band, -1 only the far half (behind a character), 1 only the near half.
 */
function smear(p, s, u0, u1, wMax, fn, half = 0, pad = 1) {
  if (u1 - u0 < 0.005) return;
  const c = Math.cos(s.rot), n = Math.sin(s.rot), A = s.R + pad + 1, Bn = A * s.sy + s.k * (wMax + 2);
  const hx = Math.hypot(A * c, Bn * n) + 1, hy = Math.hypot(A * n, Bn * c) + 1, rIn = s.R - wMax - 1;
  // each half only needs its side of the centre (plus what the tilt and the cone lift can reach across)
  const over = Math.abs(n) * A + s.k * (wMax + 2) + 2, y0 = half > 0 ? s.cy - over : s.cy - hy, y1 = half < 0 ? s.cy + over : s.cy + hy;
  p.shade(s.cx - hx, y0, s.cx + hx, y1, (x, y, out) => {
    const [r, a] = plane(s, x, y);
    if (r > s.R + pad || r < rIn) return;
    if (half && (Math.sin(a) < 0 ? -1 : 1) !== half) return;
    let u = (s.dir * (a - s.a0)) % TAU;
    if (u < 0) u += TAU;
    while (u < u0) u += TAU;
    if (u > u1) return;
    return fn(u, r, out, a);
  });
}

/** Dots along a swing at plane radius r from u0 to u1, every `step` px, alpha a(u) (dithered into a dotted trace). */
function trace(p, s, r, u0, u1, c, a, half = 0, step = 0.6) {
  const du = step / Math.max(4, r);
  for (let u = u0; u <= u1; u += du) {
    const g = s.a0 + s.dir * u;
    if (half && (Math.sin(g) < 0 ? -1 : 1) !== half) continue;
    const [x, y] = onSwing(s, r, u), k = typeof a === "function" ? a(u) : a;
    if (k > 0) p.dot(x, y, typeof c === "function" ? c(u) : c, k);
  }
}

/** Glow riding a swing from u0 to u1 (light along the arc). */
function glowAlong(p, s, r, u0, u1, rad, c, k, half = 0, step = 0.35) {
  for (let u = u0; u <= u1; u += step) {
    const g = s.a0 + s.dir * u;
    if (half && (Math.sin(g) < 0 ? -1 : 1) !== half) continue;
    const [x, y] = onSwing(s, r, u), kk = typeof k === "function" ? k(u) : k;
    if (kk > 0.004) p.glow(x, y, rad, c, kk);
  }
}

/**
 * A slash crescent along swing s (Sprite Fusion's recipe): the edge whips out over s.span radians in s.sweep s,
 * holds, then the tail follows over s.trail, thinning and cooling down s.ramp (dark to bright); a dotted trace
 * lingers where it passed. s: a swing plus { span, W, t0, sweep, hold, trail, ramp, hot (0..1 flashes it white),
 * lens (thickest in the middle, not just behind the edge) }.
 */
function slash(p, s, t, half = 0) {
  const u = t - s.t0;
  if (u < 0) return;
  const R = s.ramp, n = R.length, life = s.sweep + s.hold + s.trail, hot = s.hot ?? 0;
  const head = ease.outExpo(clamp(u / s.sweep)), tail = smooth(s.sweep + s.hold, life, u), age = clamp(u / life);
  const U = s.span * head, T = s.span * tail, W = s.W * (1 - tail * 0.55);
  if (tail < 1 && U - T > 0.01) {
    smear(p, s, T, U, W, (uu, r, out) => {
      const v = (uu - T) / (U - T), w = W * Math.pow(Math.sin(Math.PI * Math.pow(v, s.lens ? 1 : 2.2)), s.lens ? 0.75 : 0.6);
      if (w < 0.35) return;
      const q = (s.R - r) / w;
      if (q < 0 || q > 1) return;
      const ci = (q < 0.22 && age < 0.5) || q < hot * 0.7 ? 0 : Math.round(q * (n - 1) * 0.75 + age * 2.4 - v * 0.8 + 0.4 - hot * 3);
      out.c = R[n - 1 - clamp(ci, 0, n - 1)];
      out.a = Math.min(1, v / (s.lens ? 0.1 : 0.4));
    }, half);
    glowAlong(p, s, s.R - W * 0.4, T, U, 5 + W, R[n - 3], (uu) => (0.22 + hot * 0.3) * (1 - age) * ((uu - T) / (U - T)), half, 0.3);
  }
  const th = 0.7 * (1 - clamp((u - s.sweep - s.hold) / (s.trail + 0.2)));
  if (tail > 0.02 && th > 0) trace(p, s, s.R - 0.5, 0, T, R[2], (uu) => th * (0.4 + 0.6 * uu / s.span), half);
}

/** Where a slash's edge ends up, and which way it's travelling there. */
const slashEnd = (s) => travel({ ...s, R: s.R - s.W * 0.3 }, s.span);

/** Shavings flung off a slash's edge, outward from its circle (Sprite Fusion's slash). */
function shavings(ps, R, s, n, colors, from = 0.3) {
  for (let i = 0; i < n; i++) {
    const [x, y] = onSwing(s, s.R, s.span * R.range(from, 1)), ox = x - s.cx, oy = y - s.cy, l = Math.hypot(ox, oy) || 1, sp = R.range(30, 100);
    ps.spawn(P.MOTE, x, y, (ox / l) * sp, Math.min(25, (oy / l) * sp) - 10, R.range(0.25, 0.55), R.pick(colors), 0.6);
  }
}

/** Stone shades for rocks, grit and dust from one body color (as Sprite Fusion's explosion does). */
function stone(c) {
  c = hex(c);
  return { light: mix(scale(c, 1.35), WHITE, 0.08), body: c, shade: scale(c, 0.64), dust: mix(scale(c, 1.2), rgb(150, 140, 150), 0.3), dark: scale(c, 0.42) };
}

const OUTLINE = hex("#1a1422");
/** A tumbling rock (a Bits CHUNK): a lit side, a shaded side, an outline, fading at the end of its life. */
function rock(p, b, st) {
  const r = 0.6 + b.s * 0.75, fade = Math.min(1, b.life / 0.5), lx = Math.cos(b.a) * r * 0.4, ly = Math.sin(b.a) * r * 0.4;
  p.shade(b.x - r - 1, b.y - r - 1, b.x + r + 1, b.y + r + 1, (x, y, out) => {
    const dx = x - b.x, dy = y - b.y, d = Math.hypot(dx * 1.15, dy);
    if (d > r + 0.9) return;
    const lit = dx * lx + dy * ly;
    out.c = d > r ? OUTLINE : lit < -0.4 ? st.light : lit > 0.6 ? st.shade : st.body;
    out.a = fade;
  });
}

/**
 * Jagged cracks splitting the floor from x0: each runs out along the floor's edge and zig-zags down into its
 * face (y from 0 to about depth), with short forks. n cracks alternate sides (bias > 0 sends more forward).
 * Returns [{ pts, at (0..1 how far out it starts), fork }]. Built once from an Rng.
 */
function cracks(R, x0, n, reach, depth = 7, bias = 0.3) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const side = R.chance(0.5 + bias * 0.5) ? 1 : -1, L = reach * R.range(0.45, 1) * (i < 2 ? 1 : 0.7), pts = [[x0 + side * R.range(0, 1.5), 0]];
    let x = pts[0][0], y = 0;
    while (Math.abs(x - x0) < L && y < depth) {
      x += side * R.range(1.5, 3.5);
      y = Math.min(depth, Math.max(0, y + R.range(-0.6, 1.6) * (Math.abs(x - x0) > 3 ? 1 : 0.3)));
      pts.push([Math.round(x), Math.round(y)]);
      if (R.chance(0.18) && pts.length > 3 && y < depth - 2) {
        const f = [[Math.round(x), Math.round(y)]];
        let fx = x, fy = y;
        for (let j = R.int(1, 3); j > 0; j--) (fx += side * R.range(1, 3)), (fy += R.range(0.8, 2)), f.push([Math.round(fx), Math.round(Math.min(depth + 1, fy))]);
        out.push({ pts: f, at: Math.abs(x - x0) / reach, fork: true });
      }
    }
    out.push({ pts, at: 0, fork: false });
  }
  return out;
}

/**
 * An impact star (after Sprite Fusion's impact): tapered spikes [{ a, len, w }] around (x, y), drawn in three
 * passes (rim, body, core) with a hot disc in the middle. sc stretches, th thins.
 */
function star(p, x, y, spikes, sc, th, core, body, inner, rim) {
  for (const pass of [0, 1, 2])
    for (const s of spikes) {
      const c = Math.cos(s.a), sn = Math.sin(s.a), L = s.len * sc;
      for (let d = 0; d <= L; d += 0.5) {
        const hw0 = s.w * th * (1 - d / L) * Math.min(1, 0.5 + d / 3), hw = pass === 0 ? hw0 + 0.8 : pass === 1 ? hw0 : hw0 * 0.45;
        if (pass === 2 && d > L * 0.55) break;
        for (let o = -hw; o <= hw; o += 0.5) p.px(x + c * d - sn * o, y + sn * d + c * o, pass === 0 ? rim : pass === 1 ? (d < L * 0.35 ? inner : body) : core);
      }
    }
  const r = 2.4 * sc * Math.sqrt(th);
  p.circle(x, y, r + 0.8, inner);
  p.circle(x, y, r, core);
}

/** A thin arc flying out from (x, y): a sliver at radius r around angle a, arc radians long, dithered by k. */
function sliver(p, x, y, a, r, arc, c, k) {
  const n = Math.ceil(r * arc * 2.2);
  for (let j = 0; j <= n; j++) {
    const u = j / n - 0.5, th = a + u * arc, w = 1.4 * (1 - Math.abs(u) * 2);
    for (let o = -w * 0.5; o <= w * 0.5 + 0.01; o += 0.5) p.dot(x + Math.cos(th) * (r + o), y + Math.sin(th) * (r + o), c, k);
  }
}

/** Part of a polyline: the first `len` px of it. Calls fn(x0, y0, x1, y1, d) for each piece (d: distance along). */
function along(pts, len, fn) {
  let d = 0;
  for (let i = 1; i < pts.length && d < len; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], l = Math.hypot(x1 - x0, y1 - y0), f = Math.min(1, (len - d) / l);
    fn(x0, y0, x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, d);
    d += l;
  }
}


};
  __defs["fx/melee/uppercut.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The crescent recipe is adapted from Sprite Fusion's open-source slash, and the star from his impact
// (https://www.spritefusion.com/pixel-art-vfx), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, Rng, fit, hex, clamp, smooth, ease, TAU, WHITE, READY } = __req("core/index.js");
const { swing, onSwing, slash, slashEnd, star } = __req("fx/melee/_lib.js");

const meta = {
  name: "Uppercut",
  desc: "A crescent rises from the floor past the face, and at the top a comic impact star bursts: bold outline, hot core, burst lines, twinkles and sparks.",
  tags: ["melee", "uppercut", "punch", "rising", "launcher", "comic", "combat", "directional", "one-shot"],
  size: [132, 128],
  origin: [48, 110],
  duration: 0.85,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#3a1408", "#7a2a10", "#c4501a", "#f08a2a", "#ffc94a", "#fff2a8", "#ffffff"],
    outline: "#2a0a08",
    sparks: ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"],
    seed: 11,
  },
};

const FISTS = { ...READY, fx: 12, fy: -25, bx: 9, by: -27, crouch: 3, lean: 1 };
const COIL = { ...FISTS, crouch: 7, lean: 3, fx: 8, fy: -11, bx: 8, by: -27, ffx: 10, fbx: -9 };
const TOP = { ...FISTS, x: 1, y: -11, crouch: -1, lean: 2, fx: 12, fy: -42, bx: -6, by: -21, ffx: 8, ffy: -8, fbx: -3, fby: -2, toeB: true, ghost: 1 };
const act = {
  target: { x: 44 },
  poses: [
    [-0.42, FISTS],
    [-0.16, COIL],
    [0, { ...COIL, crouch: 8 }],
    [0.03, { ...FISTS, y: -4, crouch: 1, lean: 4, fx: 18, fy: -27, bx: -5, by: -23, ffx: 9, fbx: -7, toeB: true, ghost: 1 }, "snap"],
    [0.076, TOP, "snap"],
    [0.3, { ...TOP, y: -13, ghost: undefined }],
    [0.56, { ...TOP, y: 0, crouch: 2, fx: 13, fy: -31, ffx: 7, ffy: -6, fbx: -5, fby: -5, ghost: undefined }, "in"],
    [0.6, { ...FISTS, y: 0, crouch: 7, lean: 3, fx: 12, fy: -14, bx: -6, by: -16, ffx: 10, fbx: -9 }, "snap"],
    [0.98, FISTS],
  ],
  hits: [{ t: 0.076, stop: 0.13, shake: 0.18, amp: 2, push: -2.6, straw: 18, y: -34 }],
  dust: [{ t: 0.03, x: 8, n: 6 }, { t: 0.6, x: 0, n: 6 }],
};

function create(o) {
  const C = fit(o.palette, 7), INK = hex(o.outline), Rg = new Rng(o.seed), ps = new Particles({ rng: Rg, ground: () => 0, sparks: o.sparks }), lights = new Lights();
  // up from the floor in front, bowing forward past the face, to the top
  const A = swing({ cx: 8, cy: -25, R: 27, sy: 1, rot: 0, a0: 1.08, dir: -1, span: 2.5, W: 13, t0: 0.02, sweep: 0.07, hold: 0.05, trail: 0.22, ramp: C });
  const top = slashEnd(A), SX = top.x + 3, SY = top.y - 5, HIT = A.t0 + A.sweep * 0.8;
  const spikes = Array.from({ length: 10 }, (_, i) => ({ a: (i / 10) * TAU + Rg.range(-0.12, 0.12) - Math.PI / 2, len: (i % 2 ? 7 : 13) + Rg.range(0, 4), w: i % 2 ? 2.2 : 3 }));
  const bursts = Array.from({ length: 8 }, (_, i) => ({ a: (i / 8) * TAU + 0.2 + Rg.range(-0.15, 0.15), r0: Rg.range(15, 18), L: Rg.range(5, 9) }));
  let t = 0, hit = false, kicked = false;
  return {
    update(dt) {
      t += dt;
      if (!kicked) {
        kicked = true;
        // the fist comes up off the floor
        for (let i = 0; i < 4; i++) ps.spawn(P.DUST, 18 + Rg.range(-4, 4), -1, Rg.range(-30, 30), -Rg.range(5, 20), Rg.range(0.3, 0.55), "#6a6080", Rg.range(1.5, 2.6));
      }
      if (!hit && t >= HIT) {
        hit = true;
        lights.add(SX, SY, 56, C[4], 0.6, 0.4);
        lights.add(SX, SY, 18, WHITE, 0.7, 0.08);
        for (let i = 0; i < 16; i++) {
          const a = -Math.PI / 2 + Rg.range(-1.6, 1.6), sp = Rg.range(120, 320);
          ps.spawn(P.SPARK, SX, SY, Math.cos(a) * sp, Math.sin(a) * sp, Rg.range(0.15, 0.45));
        }
        for (let i = 0; i < 6; i++) {
          const a = Rg.range(0, TAU), d = Rg.range(14, 24);
          ps.spawn(P.STAR, SX + Math.cos(a) * d, SY + Math.sin(a) * d, Math.cos(a) * 20, Math.sin(a) * 20 - 10, Rg.range(0.25, 0.5), Rg.chance(0.5) ? C[5] : WHITE, Rg.range(1.4, 2.6), Rg.range(0.04, 0.18));
        }
      }
      ps.update(dt);
      lights.update(dt);
    },
    draw(p) {
      slash(p, A, t);
      // speed lines rising beside the crescent while it goes up
      const u = t - A.t0;
      if (u > 0 && u < 0.16)
        for (const [dx, y0, L] of [[A.cx + A.R + 7, -16, 18], [A.cx + A.R + 11, -30, 12], [A.cx - 4, -40, 10]]) {
          const k = u / 0.16, y = y0 - 30 * k;
          for (let d = 0; d < L; d += 1) p.dot(dx, y + d, d < 3 ? WHITE : d < L * 0.5 ? C[5] : C[3], (1 - d / L) * (1 - k));
        }
      if (u > 0 && u < A.sweep + 0.06) {
        const [x, y] = onSwing(A, A.R - 5, A.span * ease.outExpo(clamp(u / A.sweep)));
        p.glow(x, y, 34, C[3], 0.45 * (1 - u / (A.sweep + 0.06)));
      }
      // the comic star: pops past full size, holds, then shrinks away turning, with burst lines round it
      const q = t - HIT;
      if (q >= 0 && q < 0.36) {
        const pop = ease.outBack(clamp(q / 0.05), 2.6), out = 1 - smooth(0.16, 0.36, q), sc = pop * (0.35 + 0.65 * out), turn = q * 1.2;
        const sp = spikes.map((s) => ({ ...s, a: s.a + turn }));
        if (sc > 0.08) {
          star(p, SX, SY, sp, sc * 1.12, 1, INK, INK, INK, INK);
          star(p, SX, SY, sp, sc, 1, q < 0.05 ? WHITE : C[6], C[4], C[3], C[2]);
        }
        p.glow(SX, SY, 30, C[4], 0.45 * out);
      }
      if (q >= 0.02 && q < 0.24) {
        // a ring bursts out round the star, white to orange, breaking into dots
        const k = (q - 0.02) / 0.22, r = 7 + 17 * ease.outCubic(k), th = Math.max(1, 2.2 * (1 - k)), col = k < 0.25 ? WHITE : k < 0.5 ? C[5] : k < 0.75 ? C[4] : C[3];
        for (let a = 0; a < TAU; a += 0.6 / r) for (let o = 0; o < th; o += 0.5) p.dot(SX + Math.cos(a) * (r - o), SY + Math.sin(a) * (r - o), col, 1.15 - k);
      }
      if (q >= 0.02 && q < 0.2) {
        const k = (q - 0.02) / 0.18;
        for (const b of bursts) {
          const r0 = b.r0 + 10 * ease.outCubic(k), ca = Math.cos(b.a), sa = Math.sin(b.a);
          p.line(SX + ca * r0, SY + sa * r0, SX + ca * (r0 + b.L * (1 - k)), SY + sa * (r0 + b.L * (1 - k)), k < 0.4 ? WHITE : C[5], 1.1 - k);
        }
      }
      ps.draw(p);
      lights.draw(p);
    },
  };
}

};
  __defs["fx/melee/spin-slash.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The crescent shading, cooling ramp, dotted trace, glint and spark recipe is adapted from Sprite Fusion's
// open-source slash (https://www.spritefusion.com/pixel-art-vfx/slash), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, PF, Rng, fit, sparkle, clamp, smooth, ease, rand, TAU, WHITE, READY } = __req("core/index.js");
const { swing, onSwing, travel, smear, trace, glowAlong } = __req("fx/melee/_lib.js");

const meta = {
  name: "Spin slash",
  desc: "The blade whirls once round the waist on a tilted plane, behind the body and back in front; the closed ring flares white, dissolves into a dotted trace and throws sparks.",
  tags: ["melee", "slash", "spin", "sword", "aoe", "combat", "one-shot"],
  size: [208, 104],
  origin: [104, 84],
  duration: 0.8,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#16224a", "#1f4a86", "#2a7fc0", "#48b8ec", "#9fe2ff", "#e2f7ff", "#ffffff"],
    sparks: ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"],
    radius: 46,
    seed: 3,
  },
};

const STANCE = { ...READY, weapon: "sword", fx: 12, fy: -21, sa: -0.85 };
// he really turns: forward, away from us, facing back, towards us, and round to the front
const WOUND = { ...STANCE, crouch: 6, lean: -2, yaw: 1.1, fx: 13, fy: -20, sa: 0.3, bx: 6, by: -24, ffx: 8, fbx: -8 };
const WIDE = { ...STANCE, crouch: 5, lean: 3, fx: 21, fy: -21, sa: 0.05, bx: -9, by: -23, ffx: 11, fbx: -11 };
const act = {
  target: { x: 60 },
  poses: [
    [-0.46, STANCE],
    [-0.2, WOUND],
    [-0.02, { ...WOUND, crouch: 7, yaw: 1.3 }],
    [0, { ...WIDE, sa: -0.1, ghost: 1 }, "snap"],
    [0.05, { ...WIDE, yaw: -1.57, ghost: 1 }, "snap"],
    [0.09, { ...WIDE, yaw: -3.14, ghost: 1 }, "snap"],
    [0.13, { ...WIDE, yaw: -4.71, ghost: 1 }, "snap"],
    [0.17, WIDE, "snap"],
    [0.56, { ...WIDE, crouch: 4, lean: 2 }],
    [0.92, STANCE],
  ],
  hits: [{ t: 0.17, stop: 0.12, shake: 0.16, amp: 2, push: 2.4, straw: 16 }],
  dust: [{ t: 0, x: 0, n: 6 }, { t: 0.17, x: 12, n: 6, dir: 1 }],
};

const SW = 0.17; // the edge goes once round
const FLARE = 0.3; // the closed ring flares and dissolves
const turn = (t) => 1 - Math.pow(1 - clamp(t / SW), 1.6); // fraction of the turn the edge has made
const passedAt = (f) => SW * (1 - Math.pow(1 - clamp(f), 1 / 1.6)); // when the edge passed fraction f

function create(o) {
  const C = fit(o.palette, 7), n = C.length, Rg = new Rng(o.seed), R0 = o.radius;
  const ps = new Particles({ rng: Rg, ground: () => 0, sparks: o.sparks }), lights = new Lights();
  // the spin starts front-right, goes up the right side, behind the body, down the left and back across the front
  const A = swing({ cx: 0, cy: -17, R: R0, sy: 0.27, rot: -0.1, a0: 0.5, dir: -1, k: 0.15 });
  // a thinner echo just inside, a beat behind
  const E = { ...A, R: R0 * 0.8, k: 0.1 };
  const W = 16, WE = 5;
  // the far half sits deeper in the ramp
  const DIM = [C[0], C[0], C[1], C[2], C[3], C[4], C[5]];
  let t = 0, closed = false, lastU = 0;

  // the smear: thickest just behind the edge, thinning and cooling where the edge passed longer ago
  const body = (p, s, w0, lag, half, rim) => {
    const U = TAU * turn(t - lag), ramp = half < 0 ? DIM : C;
    if (U < 0.02 || t - lag > SW + 0.02) return;
    smear(p, s, 0, U, w0, (u, r, out) => {
      const age = t - lag - passedAt(u / TAU), lead = U - u;
      const w = w0 * Math.pow(clamp(lead / 0.85), 0.5) * (0.3 + 0.7 * Math.exp(-age / 0.075)) * Math.pow(clamp(u / 1.3), 0.7);
      if (w < 0.45) return;
      const q = (s.R - r) / w;
      if (q < 0 || q > 1) return;
      // white rim while fresh, then darker steps inward, with age and towards the tail
      const ci = rim && q < 0.26 && age < 0.06 ? 0 : Math.round(q * (n - 1) * 0.7 + age * 13 + (rim ? 0.4 : 1.4));
      out.c = ramp[n - 1 - clamp(ci, 0, n - 1)];
      out.a = Math.min(1, u / 1.1 + 0.2);
    }, half);
  };

  const ring = (p, half) => {
    // the swept smear and its echo
    body(p, E, WE, 0.025, half, false);
    body(p, A, W, 0, half, true);
    if (t < SW + 0.04) glowAlong(p, A, A.R - 5, 0, TAU * turn(t), 14, C[3], (u) => (half < 0 ? 0.2 : 0.3) * Math.exp(-(t - passedAt(u / TAU)) / 0.08), half);
    if (t < SW) return;
    // closed: the ring flares white, swells a little, thins, cools and breaks into dots
    const f = (t - SW) / FLARE, ramp = half < 0 ? DIM : C;
    if (f < 1) {
      const R = A.R + 6 * ease.outCubic(f), th = f < 0.13 ? 9 : Math.max(1, 6 * Math.pow(1 - f, 1.5) + 0.5), S = { ...A, R };
      const step = f < 0.13 ? 6 : f < 0.3 ? 5 : f < 0.55 ? 4 : 3;
      smear(p, S, 0, TAU, th, (u, r, out) => {
        const q = (R - r) / th;
        if (q < 0 || q > 1) return;
        out.c = f < 0.13 ? (q < 0.6 ? WHITE : ramp[5]) : q < 0.45 ? ramp[step] : ramp[step - 1];
        out.a = f < 0.4 ? 1 : 1.3 - f;
      }, half);
      glowAlong(p, S, R - 2, 0, TAU, 14, C[4], 0.32 * (1 - f) * (1 - f), half);
    }
    // a dotted trace of the blade's path lingers where the ring was, fading
    const k = 1 - clamp((t - SW - 0.06) / 0.4);
    if (k > 0) trace(p, A, A.R - 0.5, 0, TAU, ramp[4], (u) => clamp(k * 1.5 - rand(Math.floor(u * 30), 5) * 0.8) * 0.95, half);
  };

  return {
    update(dt) {
      t += dt;
      const U = TAU * turn(t);
      // shavings peel off the edge as it goes round, flung along its path
      if (t < SW) {
        for (let u = lastU; u < U; u += 0.3) {
          const tr = travel(A, u), ox = tr.x - A.cx, oy = tr.y - A.cy, l = Math.hypot(ox, oy) || 1, sp = Rg.range(40, 120);
          ps.spawn(P.MOTE, tr.x, tr.y, tr.dx * sp + (ox / l) * sp * 0.35, tr.dy * sp * 0.6 - Rg.range(5, 30), Rg.range(0.22, 0.45), C[4 + Rg.int(0, 1)], 0.55, 0, Math.sin(tr.a) < 0 ? PF.BACK : 0);
        }
        lastU = U;
      }
      if (!closed && t >= SW) {
        closed = true;
        lights.add(A.cx, A.cy + 4, 90, C[3], 0.4, 0.4);
        // sparks off the edge where it closes, and all round the ring along its turn
        const end = travel(A, TAU);
        for (let i = 0; i < 9; i++) {
          const a = Math.atan2(end.dy, end.dx) + Rg.range(-0.45, 0.35), sp = Rg.range(160, 360);
          ps.spawn(P.SPARK, end.x, end.y, Math.cos(a) * sp, Math.sin(a) * sp - Rg.range(20, 70), Rg.range(0.14, 0.36));
        }
        for (let i = 0; i < 16; i++) {
          const u = Rg.range(0, TAU), tr = travel(A, u), sp = Rg.range(110, 260);
          ps.spawn(P.SPARK, tr.x, tr.y, tr.dx * sp, tr.dy * sp - Rg.range(20, 80), Rg.range(0.12, 0.32), 0, 1, 0, Math.sin(tr.a) < 0 ? PF.BACK : 0);
        }
        // and twinkles left hanging on the ring
        for (let i = 0; i < 6; i++) {
          const u = Rg.range(0, TAU), [x, y] = onSwing(A, A.R + Rg.range(-1, 3), u);
          ps.spawn(P.STAR, x, y, 0, -Rg.range(2, 8), Rg.range(0.25, 0.5), Rg.chance(0.5) ? C[5] : WHITE, Rg.range(1.2, 2.6), Rg.range(0.04, 0.16), Math.sin(A.a0 + A.dir * u) < 0 ? PF.BACK : 0);
        }
      }
      ps.update(dt);
      lights.update(dt);
    },
    drawBack(p) {
      ring(p, -1);
      ps.draw(p, "back");
    },
    draw(p) {
      ring(p, 1);
      // the blade catches the light as it sets off, and glints again where the ring closes
      if (t < 0.06) {
        const [x, y] = onSwing(A, A.R - 3, 0);
        sparkle(p, x, y, 7 * (1 - t / 0.06), C[5], C[3], 0.5);
      }
      const g = t - SW * 0.85, tip = onSwing(A, A.R - 3, TAU);
      if (g > 0 && g < 0.24) sparkle(p, tip[0], tip[1], 10 * ease.outBack(Math.min(1, g / 0.05)) * (1 - g / 0.24), C[5], C[3], 0.6);
      // light rides the edge
      if (t < SW + 0.05) {
        const U = TAU * turn(t), [x, y] = onSwing(A, A.R - 5, U), far = Math.sin(A.a0 + A.dir * U) < 0;
        p.glow(x, y, far ? 26 : 38, C[3], (far ? 0.3 : 0.5) * (1 - smooth(SW - 0.04, SW + 0.05, t)));
      }
      ps.draw(p, "front");
      lights.draw(p);
    },
  };
}

};
  __defs["fx/melee/heavy-cleave.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The crescent and its cooling ramp are adapted from Sprite Fusion's open-source slash
// (https://www.spritefusion.com/pixel-art-vfx/slash), and the impact star, dust, grit and embers from his
// impact and explosion (https://www.spritefusion.com/pixel-art-vfx), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Bits, Lights, P, PF, B, Rng, fit, sparkle, band, clamp, smooth, ease, rand, TAU, WHITE, READY } = __req("core/index.js");
const { swing, onSwing, smear, trace, glowAlong, stone, rock, cracks, star, sliver, along } = __req("fx/melee/_lib.js");

const meta = {
  name: "Heavy cleave",
  desc: "A glint over the head, then a thick ember arc accelerates over the top into the floor: a white slam, glowing cracks, dust rolling both ways, grit and rising embers.",
  tags: ["melee", "slash", "cleave", "axe", "heavy", "ground", "fire", "combat", "directional", "one-shot"],
  size: [208, 116],
  origin: [68, 96],
  duration: 1.9,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#2a0c10", "#5c1414", "#a3241a", "#e0481c", "#ff8a2a", "#ffc23d", "#fff0a0", "#ffffff"],
    stone: "#4a3f69",
    seed: 5,
  },
};

const REST_ = { ...READY, weapon: "greatsword", two: true, sa: -1, fx: 11, fy: -21 };
const OVER = { ...REST_, x: -4, crouch: 2, lean: -2, fx: 1, fy: -42, sa: -2.45, ffx: 8, fbx: -7 };
const FLOOR = { ...REST_, x: 0, crouch: 7, lean: 6, fx: 17, fy: -21, sa: 0.72, ffx: 11, fbx: -10, toeB: true };
const act = {
  target: { x: 66 },
  poses: [
    [-0.42, { ...REST_, x: -4 }],
    [-0.3, { ...REST_, x: -3, crouch: 4, fx: 13, fy: -29, sa: -1.3 }],
    [-0.12, { ...OVER, crouch: 4 }],
    [0.2, { ...OVER, crouch: 3 }],
    [0.27, { ...REST_, x: -1, y: -2, crouch: 0, lean: 2, fx: 11, fy: -42, sa: -1.45, ffx: 10, ghost: 1 }, "snap"],
    [0.31, { ...REST_, x: 0, y: -1, crouch: 3, lean: 4, fx: 18, fy: -33, sa: -0.45, ffx: 12, ghost: 1 }, "snap"],
    [0.335, FLOOR, "snap"],
    [0.85, { ...FLOOR, crouch: 6, lean: 5 }],
    [1.3, { ...REST_, x: -2, crouch: 4, lean: 2, fx: 15, fy: -23, sa: 0.1 }],
    [1.7, { ...REST_, x: -4 }],
  ],
  hits: [{ t: 0.335, stop: 0.2, shake: 0.34, amp: 3, push: 3.2, straw: 28, y: -8 }],
  dust: [{ t: 0.335, x: 18, n: 8, dir: 1 }, { t: 0.335, x: -12, n: 5, dir: -1 }],
};

const RAISE = 0.2; // the glint over the head
const SWING = 0.135; // the arc accelerates over the top
const HIT = RAISE + SWING;
const HOLD = 0.05, TRAIL = 0.22;
const head = (t) => ease.inQuad(clamp((t - RAISE) / SWING)); // fraction of the arc the edge has made
const passedAt = (f) => RAISE + SWING * Math.sqrt(clamp(f)); // when the edge passed fraction f

function create(o) {
  const C = fit(o.palette, 8), n = C.length, R = new Rng(o.seed), st = stone(o.stone), floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[6], C[5], C[4], C[3]] }), bits = new Bits({ ground: floor }), lights = new Lights();
  // the arc: from behind the head, over the top, down into the floor in front
  const A = swing({ cx: 3, cy: -22, R: 37, sy: 0.88, rot: 0.32, a0: -2.45, dir: 1 });
  let U1 = 0;
  while (onSwing(A, A.R, U1)[1] < -0.5 && U1 < 4) U1 += 0.005;
  const E = { ...A, R: A.R * 0.76 }, W = 16, WE = 5;
  const [X] = onSwing(A, A.R - 2, U1), GLINT = onSwing(A, A.R - 3, 0);
  const lines = cracks(R, X, 4, 40, 7, 0.4);
  // the impact star: long spikes along the floor, shorter ones up
  const spikes = [-Math.PI, -2.7, -2.15, -1.62, -1.05, -0.45, 0].map((a, i) => ({ a: a + R.range(-0.08, 0.08), len: (i === 0 || i === 6 ? 20 : i === 3 ? 15 : 9) + R.range(0, 4), w: 1.6 + R.range(0, 0.6) }));
  const shards = [-2.5, -1.9, -1.2, -0.6].map((a) => ({ a: a + R.range(-0.15, 0.15), r: 8 + R.range(0, 3), v: R.range(80, 130), arc: R.range(0.35, 0.6) }));
  let t = 0, hit = false;

  const arc = (p, s, w0, lag, rim) => {
    const tt = t - lag, U = U1 * head(tt), T = U1 * smooth(HIT + HOLD, HIT + HOLD + TRAIL, tt);
    if (U < 0.02 || T >= U - 0.02) return;
    const gone = smooth(HIT + HOLD, HIT + HOLD + TRAIL, tt), shrink = 1 - 0.75 * gone;
    smear(p, s, T, U, w0, (u, r, out) => {
      const age = Math.max(0, tt - passedAt(u / U1)), v = (u - T) / (U - T);
      const w = w0 * shrink * Math.pow(Math.sin(Math.PI * Math.pow(v, 2.2)), 0.6);
      if (w < 0.4) return;
      const q = (s.R - r) / w;
      if (q < 0 || q > 1) return;
      const ci = rim && q < 0.22 && age < 0.12 ? 0 : Math.round(q * (n - 1) * 0.62 + age * 7 + Math.max(0, tt - HIT) * 10 - v * 0.8 + (rim ? 0.7 : 1.7));
      out.c = C[n - 1 - clamp(ci, 0, n - 1)];
      out.a = Math.min(1, v / 0.35) * (1.2 - gone);
    });
    if (rim) glowAlong(p, s, s.R - w0 * 0.4, T, U, 7 + w0 * 0.5, C[4], (u) => 0.26 * Math.exp(-Math.max(0, tt - passedAt(u / U1)) / 0.2) * ((u - T) / (U - T)));
  };

  return {
    update(dt) {
      t += dt;
      // heat gathers to the raised blade
      if (t < RAISE - 0.04 && R.chance(0.35)) {
        const a = R.range(0, TAU), D = R.range(14, 26), T = R.range(0.14, 0.2), v = (D * 3) / (Math.exp(3 * T) - 1);
        ps.spawn(P.STREAK, GLINT[0] + Math.cos(a) * D, GLINT[1] + Math.sin(a) * D, -Math.cos(a) * v, -Math.sin(a) * v, T, R.chance(0.5) ? C[5] : C[4]);
      }
      // embers shed off the edge as it comes over
      if (t > RAISE && t < HIT && R.chance(0.7)) {
        const u = U1 * head(t) * R.range(0.6, 1), [x, y] = onSwing(A, A.R - R.range(0, 6), u);
        ps.spawn(P.EMBER, x, y, R.range(-20, 20), R.range(-40, -10), R.range(0.5, 1.1), C[4], R.range(1, 2));
      }
      if (!hit && t >= HIT) {
        hit = true;
        lights.add(X, -6, 26, WHITE, 0.9, 0.1);
        lights.add(X, -12, 64, C[4], 0.5, 0.8);
        // sparks fan up off the floor, most of them forward
        for (let i = 0; i < 26; i++) {
          const a = -Math.PI / 2 + R.range(-1.2, 1.35), sp = R.range(140, 360);
          ps.spawn(P.SPARK, X, -1, Math.cos(a) * sp, Math.sin(a) * sp - 40, R.range(0.15, 0.5));
        }
        // dust rolls out both ways along the floor
        for (let i = 0; i < 20; i++) {
          const s = i % 2 ? -1 : 1;
          ps.spawn(P.SMOKE, X + s * R.range(0, 8), -R.range(2, 6), s * R.range(45, 135), -R.range(2, 12), R.range(1.0, 1.45), st.dust, R.range(5, 8.5), R.range(0, 0.07), PF.BIG);
        }
        for (let i = 0; i < 4; i++) ps.spawn(P.SMOKE, X + R.range(-4, 4), -R.range(3, 8), R.range(-15, 15), -R.range(40, 90), R.range(1.0, 1.45), st.dust, R.range(4, 6.5), R.range(0.02, 0.1), PF.BIG);
        for (let i = 0; i < 8; i++) ps.spawn(P.DUST, X + R.range(-4, 4), -R.range(1, 4), R.range(-60, 60), -R.range(8, 30), R.range(0.35, 0.7), st.dust, R.range(2, 3.5));
        // grit and a few stones thrown up, forward
        for (let i = 0; i < 44; i++) {
          const a = -Math.PI / 2 + R.range(-0.7, 1.0), sp = R.range(60, 230);
          ps.spawn(P.GRIT, X + R.range(-3, 3), -1, Math.cos(a) * sp, Math.sin(a) * sp, R.range(1.0, 1.5), R.pick([st.light, st.body, st.body, st.shade]), R.chance(0.35) ? 2 : 1);
        }
        for (let i = 0; i < 6; i++)
          bits.add({ kind: B.CHUNK, x: X + R.range(-3, 3), y: -2, vx: R.range(-50, 110), vy: -R.range(120, 260), g: 1, drag: 0.4, bounce: 0.3, life: R.range(1.15, 1.5), a: R.range(0, TAU), va: R.range(-14, 14), s: R.int(1, 2) });
        // embers lift off the cut
        for (let i = 0; i < 16; i++) ps.spawn(P.EMBER, X + R.range(-8, 8), -R.range(1, 6), R.range(-50, 60), -R.range(30, 110), R.range(0.7, 1.5), C[4], R.range(1, 2));
      }
      // the cracks breathe embers while they're hot
      if (hit && t < HIT + 0.6 && R.chance(0.12)) {
        const c = R.pick(lines), pt = R.pick(c.pts);
        ps.spawn(P.EMBER, pt[0], pt[1] - 1, R.range(-12, 12), -R.range(20, 50), R.range(0.5, 0.9), C[4], 1);
      }
      bits.update(dt);
      for (const b of bits.list)
        if (b.rest && !b.dusted) {
          b.dusted = true;
          for (let i = 0; i < 2; i++) ps.spawn(P.DUST, b.x + R.range(-1.5, 1.5), -0.5, R.sign() * R.range(8, 30), -R.range(2, 12), R.range(0.3, 0.6), st.dust, R.range(1.3, 2.4));
        }
      ps.update(dt);
      lights.update(dt);
    },
    drawBack(p) {
      const q = t - HIT;
      if (q >= 0) {
        // the floor under the blade: white hot, cooling through the ramp to soot
        const fade = 1 - smooth(1.0, 1.5, q);
        for (let y = 0; y <= 2; y++)
          for (let x = -9; x <= 9; x++) {
            const d = Math.hypot((x + 0.5) / 9, (y + 0.5) / 3.5);
            if (d > 1) continue;
            const T = Math.pow(clamp(1 - q / 0.8), 1.4) * (1.2 - d) - rand(x, y, 3) * 0.3;
            if (T > 0.08) p.dot(X + x, y, C[clamp(Math.round(T * 9), 1, 7)], fade);
            else p.dot(X + x, y, d < 0.5 ? st.dark : st.shade, (d < 0.9 - rand(x, y, 9) * 0.3 ? 1 : 1 - d) * fade);
          }
        // the shock runs out along the floor: the far half behind the fighter
        const k = q / 0.45;
        if (k < 1) band(p, X, 0.5, 6 + 46 * ease.outCubic(k), 0.16, Math.max(1, 3 * (1 - k)), 1.15 - k, [st.body, st.light, C[4], C[6]], (g) => Math.sin(g) < 0);
      }
      ps.draw(p, "back");
    },
    draw(p) {
      const q = t - HIT;
      // the glint over the head: the raised blade catching the light
      if (t < RAISE + 0.03) {
        const g = ease.outBack(clamp(t / 0.1)) * (1 + 0.15 * Math.sin(t * 60)) * (t > RAISE ? 1 - (t - RAISE) / 0.03 : 1);
        sparkle(p, GLINT[0], GLINT[1], 1 + 7 * g, C[6], C[4], 0.5);
        p.glow(GLINT[0], GLINT[1], 22, C[4], 0.3 * g);
      }
      if (q >= 0) {
        // cracks race out from the cut and split down into the floor: white hot, cooling down the ramp to dark
        const heat = Math.pow(clamp(1 - q / 1.2), 1.2), fade = 1 - smooth(1.15, 1.5, q);
        for (const c of lines) {
          const reach = 40 * ease.outCubic(clamp((q - c.at * 0.1) / 0.13)) * (c.fork ? 0.3 : 1);
          if (reach <= 0) continue;
          along(c.pts, reach, (x0, y0, x1, y1, d) => {
            const h = heat * (1 - d / 46) - (c.fork ? 0.12 : 0), col = h > 0.72 ? WHITE : h > 0.08 ? C[clamp(Math.round(h * 8), 1, 6)] : st.dark;
            if (y1 > 0.5) p.line(x0 + 1, y0, x1 + 1, y1, st.dark, fade);
            p.line(x0, y0, x1, y1, col, fade);
            if (h > 0.25 && (d | 0) % 6 < 2) p.glow(x1, y1, 6, C[4], 0.2 * h * fade);
          });
        }
        if (heat > 0) p.glow(X, -2, 34, C[4], 0.32 * heat * fade);
        // the near half of the shock ring
        const k = q / 0.45;
        if (k < 1) band(p, X, 0.5, 6 + 46 * ease.outCubic(k), 0.16, Math.max(1, 3 * (1 - k)), 1.15 - k, [st.body, st.light, C[4], C[6]], (g) => Math.sin(g) >= 0);
      }
      // the arc and its echo, then a dotted trace of embers where it has been
      arc(p, E, WE, 0.02, false);
      arc(p, A, W, 0, true);
      const tail = U1 * smooth(HIT + HOLD, HIT + HOLD + TRAIL, t), th = 0.8 * (1 - clamp((t - HIT - HOLD) / (TRAIL + 0.25)));
      if (tail > 0.02 && th > 0) trace(p, A, A.R - 0.5, 0, tail, C[3], (u) => th * (0.4 + 0.6 * u / U1));
      if (t > RAISE && t < HIT + 0.05) {
        const [x, y] = onSwing(A, A.R - 5, U1 * head(t));
        p.glow(x, y, 40, C[4], 0.5);
      }
      // the white slam: an impact star flat on the floor, then slivers flying off and a hot pool
      if (q >= 0 && q < 0.035) star(p, X, -1, spikes, 1, 1, WHITE, C[6], C[7], C[5]);
      else if (q >= 0.035 && q < 0.07) star(p, X, -1, spikes, 1.25, 0.55, C[7], C[6], C[6], C[4]);
      if (q >= 0.05 && q < 0.16) {
        const k = (q - 0.05) / 0.11;
        for (const s of shards) sliver(p, X, -1, s.a, s.r + s.v * (q - 0.05), s.arc * (1 - 0.4 * k), k < 0.4 ? C[6] : k < 0.7 ? C[5] : C[4], 1 - k);
      }
      if (q >= 0 && q < 0.2) {
        const pop = Math.exp(-q / 0.05);
        p.glow(X, -6, 30, C[5], 0.8 * pop);
        p.glow(X, -2, 10, WHITE, 0.7 * pop);
      }
      for (const b of bits.list) rock(p, b, st);
      ps.draw(p, "front");
      lights.draw(p);
    },
  };
}

};
  __defs["fx/melee/hammer-smash.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The rocks, grit, rolling dust and floor ring are adapted from Sprite Fusion's open-source explosion, and the
// dome from his ice nova (https://www.spritefusion.com/pixel-art-vfx), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Bits, Lights, P, PF, B, Rng, fit, band, clamp, smooth, ease, rand, hex, TAU, WHITE, READY } = __req("core/index.js");
const { swing, onSwing, smear, stone, rock, cracks, along } = __req("fx/melee/_lib.js");

const meta = {
  name: "Hammer smash",
  desc: "A hammer drops in front in a wedge of motion: a white slam with rays, a dome of force, a dent with cracks, rocks thrown up that bounce and settle, and dust.",
  tags: ["melee", "smash", "hammer", "heavy", "ground", "shockwave", "debris", "combat", "directional", "one-shot"],
  size: [208, 112],
  origin: [80, 92],
  duration: 2.0,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#141834", "#242c5c", "#38479a", "#5a72d0", "#8fa8f0", "#c4d4ff", "#eef3ff", "#ffffff"],
    stone: "#4a3f69",
    seed: 9,
  },
};

// both hands low on the shaft, the head resting on the floor in front; it comes up, over and down
const REST_ = { ...READY, weapon: "hammer", two: true, sa: 0.62, fx: 11, fy: -21, crouch: 3 };
const TOP = { ...REST_, x: -3, crouch: 0, lean: -3, fx: 3, fy: -41, sa: -2.1, ffx: 8, ffy: -8, fbx: -5, toeB: true };
const SLAM = { ...REST_, x: -1, crouch: 7, lean: 6, fx: 14, fy: -19, sa: 0.62, ffx: 11, fbx: -10 };
const act = {
  target: { x: 66 },
  poses: [
    [-0.72, { ...REST_, x: -3 }],
    [-0.44, { ...REST_, x: -3, crouch: 5, lean: -1, fx: 16, fy: -28, sa: -0.9 }],
    [-0.2, TOP],
    [-0.03, { ...TOP, y: -2 }],
    [0.06, { ...REST_, x: 0, y: -3, crouch: -1, lean: 2, fx: 13, fy: -41, sa: -1.2, ffx: 11, ffy: -8, ghost: 1 }, "snap"],
    [0.11, { ...REST_, x: 0, y: -1, crouch: 3, lean: 5, fx: 19, fy: -30, sa: -0.15, ffx: 13, ghost: 1 }, "snap"],
    [0.15, SLAM, "snap"],
    [0.62, { ...SLAM, crouch: 6, lean: 5 }],
    [1.02, { ...REST_, x: -2, crouch: 5, lean: 2, fx: 14, fy: -24, sa: 0.3 }],
    [1.4, { ...REST_, x: -3 }],
  ],
  hits: [{ t: 0.15, stop: 0.2, shake: 0.34, amp: 3, push: 3, straw: 26, y: -8 }],
  dust: [{ t: 0.15, x: 10, n: 8 }, { t: 0.15, x: -12, n: 5, dir: -1 }],
};

const SOOT = hex("#0d0a12"), HOT = ["#fff3a6", "#ffc23d", "#ff8a2a", "#c9281f"].map(hex);
const DROP = 0.15; // the hammer comes over and down, gathering speed
const head = (t) => {
  const x = clamp((t + 0.03) / (DROP + 0.03));
  return 0.28 * x + 0.72 * x * x;
};

function create(o) {
  const C = fit(o.palette, 8), n = C.length, R = new Rng(o.seed), st = stone(o.stone), floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor }), bits = new Bits({ ground: floor }), chips = new Bits({ ground: floor }), lights = new Lights();
  // the hammer head's path: round the shoulders, from overhead down to the floor in front
  const A = swing({ cx: 5, cy: -25, R: 32, sy: 1, rot: 0, a0: -2.25, dir: 1 });
  let U1 = 0;
  while (onSwing(A, A.R, U1)[1] < -0.5 && U1 < 4) U1 += 0.005;
  const HW = 13, [X] = onSwing(A, A.R - HW / 2, U1);
  const lines = cracks(R, X, 5, 24, 6, 0);
  const rays = [-0.95, -0.6, -0.3, -0.05, 0.22, 0.5, 0.85].map((d, i) => ({ a: -Math.PI / 2 + d + R.range(-0.06, 0.06), L: (i === 3 ? 34 : i === 2 || i === 4 ? 26 : i === 1 || i === 5 ? 18 : 12) * R.range(0.9, 1.1) }));
  let t = 0, hit = false;

  // the smear: the hammer head's path as a comet, a hard white leading face, tapering to a hair behind it,
  // cooling along the taper (edges first), with speed lines trailing along the arc
  const Rm = A.R - HW / 2;
  const wedge = (p) => {
    const h = head(t), U = U1 * h, after = smooth(DROP, DROP + 0.07, t), lagU = Math.max(0, U - (0.3 + 1.05 * h)), T = lagU + (U - lagU) * after * 0.8;
    if (U - T < 0.03 || after >= 1) return;
    const len = (U - T) * Rm;
    smear(p, A, T, U, HW + 1, (u, r, out) => {
      const lead = (U - u) * Rm, f = lead / len, w = HW * (lead < 3 ? 1 : Math.pow(1 - (lead - 3) / Math.max(1, len - 3), 0.85)) * (1 - after * 0.5);
      const off = (r - Rm) / (w / 2 + 0.01);
      if (w < 0.6 || Math.abs(off) > 1) return;
      let ci = lead < 2 ? 0 : Math.round(1 + f * 3.4 + Math.abs(off) * 1.4 - (off > 0.55 ? 1 : 0) + after * 3);
      if (ci > n - 3) return;
      out.c = C[n - 1 - Math.max(0, ci)];
    });
    // speed lines trail the head along the arc, dotted out at their ends
    if (after < 0.6)
      for (const [dr, l0, L] of [[-HW / 2 - 2, 3, 26], [-HW / 2 - 5, 9, 16], [HW / 2 + 2, 2, 30], [HW / 2 + 5, 8, 18], [-1, len + 2, 14], [3, len + 4, 9]]) {
        const r = Rm + dr;
        for (let d = l0; d < l0 + L * (1 - after); d += 0.5) {
          const u = U - d / r, k = (d - l0) / L;
          if (u < 0) break;
          p.dot(...onSwing(A, r, u), k < 0.25 ? C[6] : k < 0.6 ? C[5] : C[4], (1 - k) * (1 - after));
        }
      }
    const [hx, hy] = onSwing(A, Rm, U);
    p.glow(hx, hy, 34, C[4], 0.5 * (1 - smooth(DROP - 0.03, DROP, t)));
  };

  return {
    update(dt) {
      t += dt;
      if (!hit && t >= DROP) {
        hit = true;
        lights.add(X, -5, 16, WHITE, 0.35, 0.08);
        lights.add(X, -10, 64, C[4], 0.42, 0.6);
        // rocks thrown up out of the dent: they tumble, land, bounce and settle
        for (let i = 0; i < 15; i++) {
          const s = R.sign();
          bits.add({ kind: B.CHUNK, x: X + s * R.range(0, 5), y: -2, vx: s * R.range(20, 105), vy: -R.range(110, 300), g: 1, drag: 0.35, bounce: 0.38, life: R.range(1.25, 1.65), a: R.range(0, TAU), va: R.range(-16, 16), s: R.pick([1, 1, 2, 2, 3]) });
        }
        // hot chips struck off the stone: they bounce, settle and cool through the ramp
        for (let i = 0; i < 11; i++) {
          const a = -Math.PI / 2 + R.range(-1.2, 1.2), sp = R.range(90, 230);
          chips.add({ kind: B.SHARD, x: X + R.range(-4, 4), y: -2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.9, drag: 0.5, bounce: 0.35, life: R.range(0.9, 1.5), s: 1 });
        }
        for (let i = 0; i < 40; i++) {
          const a = -Math.PI / 2 + R.range(-1.1, 1.1), sp = R.range(50, 210);
          ps.spawn(P.GRIT, X + R.range(-4, 4), -1, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.9, 1.5), R.pick([st.light, st.body, st.body, st.shade]), R.chance(0.4) ? 2 : 1);
        }
        // force motes skid out along the floor, sparks off the stone
        for (let i = 0; i < 14; i++) {
          const s = i % 2 ? -1 : 1, sp = R.range(120, 260);
          ps.spawn(P.MOTE, X + s * 6, -R.range(1, 4), s * sp, -R.range(0, 30), R.range(0.18, 0.34), R.chance(0.5) ? C[6] : C[5], 0.8, R.range(0.02, 0.05));
        }
        for (let i = 0; i < 24; i++) {
          const a = -Math.PI / 2 + R.range(-1.4, 1.4), sp = R.range(150, 380);
          ps.spawn(P.SPARK, X + Math.cos(a) * 6, -2 + Math.sin(a) * 4, Math.cos(a) * sp, Math.sin(a) * sp - 30, R.range(0.12, 0.42), 0, 1, R.range(0.035, 0.08));
        }
        // dust rolls out both ways along the floor, and a puff lifts off the dent
        for (let i = 0; i < 20; i++) {
          const s = i % 2 ? -1 : 1;
          ps.spawn(P.SMOKE, X + s * R.range(2, 10), -R.range(2, 7), s * R.range(40, 125), -R.range(2, 14), R.range(0.95, 1.5), st.dust, R.range(6, 9), R.range(0.02, 0.08), PF.BIG);
        }
        for (let i = 0; i < 7; i++) ps.spawn(P.SMOKE, X + R.range(-6, 6), -R.range(3, 9), R.range(-20, 20), -R.range(30, 80), R.range(1.0, 1.4), st.dust, R.range(5, 7.5), R.range(0.04, 0.14), PF.BIG);
        for (let i = 0; i < 8; i++) ps.spawn(P.DUST, X + R.range(-6, 6), -R.range(1, 4), R.range(-70, 70), -R.range(8, 30), R.range(0.35, 0.7), st.dust, R.range(2, 3.5));
      }
      bits.update(dt);
      chips.update(dt);
      // settled rocks catch the light now and then
      if (hit && t > DROP + 0.4 && t < DROP + 1.2 && R.chance(0.08)) {
        const b = R.pick(bits.list);
        if (b && b.rest) ps.spawn(P.STAR, b.x + R.range(-1, 1), b.y - 1.5 - b.s, 0, -2, R.range(0.25, 0.45), R.chance(0.5) ? HOT[0] : WHITE, R.range(0.6, 1.6));
      }
      // rocks that land kick up a little dust
      for (const b of bits.list)
        if (b.rest && !b.dusted) {
          b.dusted = true;
          for (let i = 0; i < 3; i++) ps.spawn(P.DUST, b.x + R.range(-1.5, 1.5), -0.5, R.sign() * R.range(8, 35), -R.range(2, 14), R.range(0.3, 0.6), st.dust, R.range(1.3, 2.6));
        }
      ps.update(dt);
      lights.update(dt);
    },
    drawBack(p) {
      const q = t - DROP;
      if (q >= 0) {
        // the dent: the floor's top knocked down into a shallow pit, its surface lit at the bottom, chipped lips
        const fade = 1 - smooth(1.3, 1.7, q);
        for (let x = -11; x <= 11; x++) {
          const u = x / 10, d = Math.abs(x) > 10 ? 0 : Math.round(3.2 * (1 - u * u) + (rand(x, 4) - 0.5) * 0.8);
          for (let y = 0; y < d; y++) p.dot(X + x, y, y === 0 ? SOOT : st.dark, fade);
          if (d > 0) p.dot(X + x, d, Math.abs(x) < 7 ? st.light : st.body, fade);
          if (Math.abs(x) >= 8) p.dot(X + x, -1, Math.abs(x) >= 10 ? st.body : st.light, fade);
          if (Math.abs(x) === 9 && rand(x, 7) < 0.7) p.dot(X + x, -2, st.body, fade);
        }
        // the floor ring's far half
        const k = q / 0.5;
        if (k < 1) band(p, X, 0.5, 6 + 50 * ease.outCubic(k), 0.16, Math.max(1, 2 * (1 - k)), 1.15 - k, [st.body, C[3], C[5], C[7]], (g) => Math.sin(g) < 0);
      }
      ps.draw(p, "back");
    },
    draw(p) {
      const q = t - DROP;
      wedge(p);
      if (q >= 0) {
        // cracks split out of the dent: a white flash, then dark lines that fade with the dent
        const fade = 1 - smooth(1.3, 1.7, q);
        for (const c of lines) {
          const reach = 30 * ease.outCubic(clamp((q - c.at * 0.06) / 0.08)) * (c.fork ? 0.3 : 1);
          if (reach > 0)
            along(c.pts, reach, (x0, y0, x1, y1) => {
              if (q >= 0.12) p.line(x0, y0 + 3, x1, y1 + 3, st.shade, fade);
              p.line(x0, y0 + 2, x1, y1 + 2, q < 0.05 ? WHITE : q < 0.12 ? C[5] : SOOT, fade);
            });
        }
        // the near half of the floor ring
        const k = q / 0.5;
        if (k < 1) band(p, X, 0.5, 6 + 50 * ease.outCubic(k), 0.16, Math.max(1, 2 * (1 - k)), 1.15 - k, [st.body, C[3], C[5], C[7]], (g) => Math.sin(g) >= 0);
        // the dome of force swells off the floor, thins to dots and fades
        const d = (q - 0.045) / 0.4;
        if (d >= 0 && d < 1) {
          // solid steps through the shell (white rim, two blues inside); it dissolves as a whole at the end
          const r = 12 + 30 * ease.outCubic(d), th = Math.max(1, 3.6 * Math.pow(1 - d, 0.8)), a = d < 0.6 ? 1 : (1 - d) / 0.4;
          p.shade(X - r - 1, -r - 1, X + r + 1, 0, (x, y, out) => {
            const e = r - Math.hypot(x - X, y);
            if (e < 0 || e > th || y > -0.5) return;
            const v = e / th;
            out.c = d < 0.1 ? (v < 0.6 ? WHITE : C[6]) : v < 0.34 ? (d < 0.45 ? WHITE : C[6]) : v < 0.67 ? C[5] : C[4];
            out.a = a;
          });
          for (let i = 0; i < 7; i++) {
            const g = -Math.PI * (0.08 + (i / 6) * 0.84);
            p.glow(X + Math.cos(g) * r, Math.sin(g) * r, 14, C[4], 0.36 * (1 - d));
          }
        }
        // rays of light shoot up out of the slam
        if (q < 0.2)
          for (const ry of rays) {
            const d1 = ry.L * ease.outCubic(Math.min(1, q / 0.05)), d0 = ry.L * smooth(0.04, 0.2, q), ca = Math.cos(ry.a), sa = Math.sin(ry.a);
            if (d1 - d0 < 1) continue;
            p.line(X + ca * (2 + d0), -1 + sa * (2 + d0), X + ca * d1, -1 + sa * d1, (u) => (u < 0.5 ? WHITE : u < 0.8 ? C[6] : C[5]));
            p.glowLine(X + ca * d0, -1 + sa * d0, X + ca * d1, -1 + sa * d1, 4, C[5], 0.18 * (1 - q / 0.2));
          }
        // the white slam: a flat flash on the floor for two frames
        if (q < 0.07) {
          const hot = q < 0.035, rx = hot ? 16 : 12, ry = hot ? 3 : 2;
          p.ellipse(X, 0, rx + 2, ry + 1, hot ? C[6] : C[5]);
          p.ellipse(X, 0, rx, ry, hot ? WHITE : C[7]);
        }
        if (q < 0.2) {
          const pop = Math.exp(-q / 0.05);
          p.glow(X, -5, 26, C[5], 0.3 * pop);
        }
        // the struck stone stays warm for a moment
        p.glow(X, -1, 16, HOT[2], 0.28 * Math.exp(-q / 0.35));
      }
      for (const b of bits.list) rock(p, b, st);
      for (const b of chips.list) {
        const k = b.life / b.max, c = k > 0.7 ? HOT[0] : k > 0.45 ? HOT[1] : k > 0.25 ? HOT[2] : HOT[3];
        p.dot(b.x, b.y, c, Math.min(1, k * 4));
        if (!b.rest) p.dot(b.x - b.vx * 0.012, b.y - b.vy * 0.012, HOT[3], Math.min(1, k * 4));
        p.glow(b.x, b.y, 4, c, 0.35 * k);
      }
      ps.draw(p, "front");
      lights.draw(p);
    },
  };
}

};
  __defs["fx/melee/dagger-flurry.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The crescent, trace, glint and spark recipe is adapted from Sprite Fusion's open-source slash
// (https://www.spritefusion.com/pixel-art-vfx/slash), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, Rng, fit, sparkle, clamp, ease, WHITE, READY } = __req("core/index.js");
const { swing, slash, slashEnd, shavings, sliver } = __req("fx/melee/_lib.js");

const meta = {
  name: "Dagger flurry",
  desc: "A flurry of small quick crescents at every angle in front of the fighter, each with a flick of sparks, finished by one big cut that glints and bursts.",
  tags: ["melee", "slash", "dagger", "combo", "flurry", "fast", "combat", "directional", "one-shot"],
  size: [148, 104],
  origin: [36, 86],
  duration: 0.95,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#1b1630", "#3a2f63", "#6150a3", "#9480d8", "#c7b8f5", "#efe9ff", "#ffffff"],
    sparks: ["#ffffff", "#efe9ff", "#c7b8f5", "#9480d8"],
    seed: 12,
  },
};

const BASE = { ...READY, weapon: "dagger", offWeapon: "dagger", sa: -0.5, sb: -0.9, crouch: 4, lean: 3, ffx: 11, fbx: -9, fx: 12, fy: -24, bx: 9, by: -24 };
// a stab with one hand while the other comes back to the chest; the shoulders turn into each one
const near = (fx, fy, sa, o = {}) => ({ ...BASE, fx, fy, sa, bx: 4, by: -24, sb: -1, ...o });
const far = (bx, by, sb, o = {}) => ({ ...BASE, bx, by, sb, fx: 1, fy: -23, sa: -1, ...o });
const act = {
  target: { x: 60 },
  poses: [
    [-0.4, { ...BASE, x: -4 }],
    [-0.14, { ...BASE, x: -6, lean: -2, crouch: 5, fx: 2, fy: -22, sa: -1.2, bx: 2, by: -26, sb: -1.5 }],
    [-0.03, { ...BASE, x: -6, lean: -3, crouch: 6, fx: 1, fy: -21, sa: -1.2, bx: 1, by: -25, sb: -1.5 }],
    [0, near(20, -31, -0.5, { x: 2, ghost: 1 }), "snap"],
    [0.055, far(21, -23, 0.5, { x: 3 }), "snap"],
    [0.11, near(18, -36, -1, { x: 4 }), "snap"],
    [0.165, far(22, -31, -0.6, { x: 5 }), "snap"],
    [0.22, near(20, -22, 0.2, { x: 5 }), "snap"],
    [0.275, far(21, -27, 0.05, { x: 6 }), "snap"],
    [0.33, { ...BASE, x: 4, lean: -3, crouch: 5, fx: -1, fy: -33, sa: -2.5, bx: 2, by: -23, sb: -1.2 }, "snap"],
    [0.37, { ...BASE, x: 7, lean: 2, crouch: 4, fx: 16, fy: -34, sa: -1, bx: -7, by: -24, sb: -2.4, ghost: 1 }, "snap"],
    [0.43, { ...BASE, x: 9, lean: 6, crouch: 6, fx: 22, fy: -23, sa: 0.15, bx: -9, by: -24, sb: -2.6, ffx: 13, fbx: -10, toeB: true }, "snap"],
    [0.68, { ...BASE, x: 9, lean: 5, crouch: 5, fx: 21, fy: -22, sa: 0.2, bx: -8, by: -24, sb: -2.6 }],
    [1.05, { ...BASE, x: -4 }],
  ],
  hits: [
    { t: 0.05, stop: 0.015, push: 0.5, straw: 3, flash: 0.02 },
    { t: 0.105, stop: 0.015, push: -0.3, straw: 3, flash: 0.02 },
    { t: 0.16, stop: 0.015, push: 0.5, straw: 3, flash: 0.02 },
    { t: 0.215, stop: 0.015, push: -0.3, straw: 3, flash: 0.02 },
    { t: 0.27, stop: 0.015, push: 0.5, straw: 3, flash: 0.02 },
    { t: 0.325, stop: 0.015, push: -0.3, straw: 3, flash: 0.02 },
    { t: 0.42, stop: 0.12, shake: 0.18, amp: 2, push: 2.6, straw: 16 },
  ],
  dust: [{ t: 0.43, x: 20, n: 7, dir: 1 }, { t: 0, x: -6, n: 3, dir: -1 }],
};

const EVERY = 0.055;
// small cuts: where, how they're turned, which way they go
const CUTS = [
  [21, -27, -0.5, 1], [33, -16, 0.9, -1], [26, -38, 2.4, 1], [37, -30, -1.8, -1], [19, -17, 0.2, 1], [30, -24, 1.4, -1],
];

function create(o) {
  const C = fit(o.palette, 7), Rg = new Rng(o.seed), ps = new Particles({ rng: Rg, ground: () => 0, sparks: o.sparks }), lights = new Lights();
  const small = CUTS.map(([x, y, rot, dir], i) => swing({ cx: x, cy: y, R: Rg.range(12, 15), sy: Rg.range(0.55, 0.75), rot, a0: Rg.range(-2.8, -2.2), dir, span: Rg.range(2.3, 2.8), W: Rg.range(5.2, 6.4), t0: i * EVERY, sweep: 0.035, hold: 0.03, trail: 0.13, ramp: C }));
  // the finisher: one wide flat cut right across the front, left to right
  const big = swing({ cx: 24, cy: -26, R: 30, sy: 0.36, k: 0.24, rot: 0.12, a0: 3.0, dir: -1, span: 2.85, W: 11, t0: small.length * EVERY + 0.04, sweep: 0.055, hold: 0.06, trail: 0.24, ramp: C });
  const all = [...small, big], ends = all.map(slashEnd), done = all.map(() => false);
  const slivers = [-2.6, -1.5, -0.4, 0.7].map((a) => ({ a: a + Rg.range(-0.2, 0.2), r: Rg.range(4, 7), v: Rg.range(70, 110), arc: Rg.range(0.4, 0.7) }));
  let t = 0;
  return {
    update(dt) {
      t += dt;
      all.forEach((s, i) => {
        if (done[i] || t < s.t0 + s.sweep) return;
        done[i] = true;
        const e = ends[i], last = s === big;
        lights.add(e.x, e.y, last ? 56 : 26, C[3], last ? 0.6 : 0.4, last ? 0.4 : 0.14);
        if (last) lights.add(e.x, e.y, 16, WHITE, 0.7, 0.08);
        for (let k = 0; k < (last ? 12 : 3); k++) {
          const a = Math.atan2(e.dy, e.dx) + Rg.range(-0.5, 0.5), sp = Rg.range(100, last ? 340 : 220);
          ps.spawn(P.SPARK, e.x, e.y, Math.cos(a) * sp, Math.sin(a) * sp, Rg.range(0.1, last ? 0.35 : 0.22));
        }
        shavings(ps, Rg, s, last ? 14 : 4, [C[4], C[5]]);
        if (last) for (let k = 0; k < 5; k++) ps.spawn(P.STAR, s.cx + Rg.range(-22, 22), s.cy + Rg.range(-14, 14), 0, -4, Rg.range(0.2, 0.45), Rg.chance(0.5) ? C[5] : WHITE, Rg.range(1, 2.2), Rg.range(0.05, 0.25));
      });
      ps.update(dt);
      lights.update(dt);
    },
    draw(p) {
      for (const s of all) slash(p, s, t);
      all.forEach((s, i) => {
        const e = ends[i], g = t - s.t0 - s.sweep * 0.6, last = s === big, life = last ? 0.24 : 0.12;
        if (g > 0 && g < life) sparkle(p, e.x, e.y, (last ? 10 : 4) * ease.outBack(Math.min(1, g / 0.04)) * (1 - g / life), C[5], C[3], last ? 0.6 : 0.35);
        // light rides each edge while it's moving
        const u = t - s.t0;
        if (u > 0 && u < s.sweep + 0.1) {
          const h = slashEnd({ ...s, span: s.span * ease.outExpo(clamp(u / s.sweep)) });
          p.glow(h.x, h.y, last ? 40 : 22, C[3], (last ? 0.5 : 0.35) * (1 - u / (s.sweep + 0.1)));
        }
      });
      // the finisher throws slivers off its end
      const q = t - big.t0 - big.sweep;
      if (q > 0.02 && q < 0.14) {
        const k = (q - 0.02) / 0.12, e = ends[ends.length - 1];
        for (const s of slivers) sliver(p, e.x, e.y, s.a + Math.atan2(e.dy, e.dx), s.r + s.v * (q - 0.02), s.arc * (1 - 0.4 * k), k < 0.4 ? C[6] : k < 0.7 ? C[5] : C[4], 1 - k);
      }
      ps.draw(p);
      lights.draw(p);
    },
  };
}

};
  __defs["fx/melee/claw-swipe.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The shaded smear, its light and the dotted trace follow Sprite Fusion's open-source slash
// (https://www.spritefusion.com/pixel-art-vfx/slash), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Bits, Lights, P, B, Rng, fit, sparkle, clamp, smooth, ease, READY } = __req("core/index.js");
const { through, onSwing, travel, smear, trace, glowAlong } = __req("fx/melee/_lib.js");

const meta = {
  name: "Claw swipe",
  desc: "Three claw marks rake down one after another, white-hot, cooling through orange to red, then close up from both ends and leave a dotted scar, with hot flecks and drips.",
  tags: ["melee", "claw", "swipe", "beast", "scratch", "combat", "directional", "one-shot"],
  size: [128, 96],
  origin: [36, 84],
  duration: 0.9,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#2a0808", "#5c0f12", "#a51d1d", "#e2401f", "#ff8a2a", "#ffd166", "#fff3c4", "#ffffff"],
    sparks: ["#fff3c4", "#ffd166", "#ff8a2a", "#c42a1a"],
    seed: 8,
  },
};

const READY_ = { ...READY, weapon: "claw", offWeapon: "claw", sa: -0.4, sb: -0.9, crouch: 5, lean: 3, fx: 14, fy: -21, bx: 8, by: -25, ffx: 9, fbx: -8 };
const HIGH = { ...READY_, x: -6, crouch: 4, lean: -3, fx: 3, fy: -41, sa: -1.4, bx: 7, by: -18, sb: -0.3, ffx: 10 };
const act = {
  target: { x: 58 },
  poses: [
    [-0.46, { ...READY_, x: -6 }],
    [-0.2, HIGH],
    [-0.05, { ...HIGH, crouch: 5 }],
    [0, { ...READY_, x: 0, crouch: 3, lean: 4, fx: 19, fy: -36, sa: -0.9, bx: -7, by: -24, ghost: 1 }, "snap"],
    [0.05, { ...READY_, x: 2, crouch: 5, lean: 6, fx: 23, fy: -24, sa: 0.5, bx: -7, by: -24, ffx: 13, fbx: -10, toeB: true }, "snap"],
    [0.1, { ...READY_, x: 3, crouch: 7, lean: 7, fx: 22, fy: -12, sa: 1.2, bx: -7, by: -24, ffx: 13, fbx: -10, toeB: true }, "snap"],
    [0.42, { ...READY_, x: 3, crouch: 6, lean: 5, fx: 21, fy: -13, sa: 1.1, bx: -6, by: -22, ffx: 13, fbx: -10 }],
    [0.9, { ...READY_, x: -6 }],
  ],
  hits: [
    { t: 0.04, stop: 0.03, push: 0.9, straw: 5, y: -30, flash: 0.03 },
    { t: 0.08, stop: 0.03, push: 0.9, straw: 5, y: -26, flash: 0.03 },
    { t: 0.12, stop: 0.08, shake: 0.14, amp: 2, push: 1.4, straw: 9, y: -18 },
  ],
  dust: [{ t: 0.1, x: 12, n: 6, dir: 1 }],
};

const RAKE = 0.05; // each mark tears open
const STAGGER = 0.04;
const CLOSE0 = 0.16, CLOSE = 0.3; // then closes up from both ends

function create(o) {
  const C = fit(o.palette, 8), n = C.length, Rg = new Rng(o.seed), floor = () => 0;
  const ps = new Particles({ rng: Rg, ground: floor, sparks: o.sparks }), drips = new Bits({ ground: floor }), lights = new Lights();
  // three marks raking down and back, each a little lower and further out than the last
  const marks = [0, 1, 2].map((i) => {
    const s = through(31 + i * 8, -23 + i * 2, 1.84, 1, 40, 0.84 - i * 0.05, 0.5);
    return { s, t0: i * STAGGER, W: 4.2 - i * 0.4, open: false, end: travel(s, s.span) };
  });
  let t = 0;
  const heatAt = (m) => clamp(1 - (t - m.t0) / 0.42);
  return {
    update(dt) {
      t += dt;
      for (const m of marks) {
        if (!m.open && t >= m.t0 + RAKE * 0.7) {
          m.open = true;
          lights.add(m.end.x, m.end.y - 6, 34, C[4], 0.45, 0.3);
          // hot flecks thrown on along the rake, and drips running off the wound
          for (let i = 0; i < 7; i++) {
            const a = Math.atan2(m.end.dy, m.end.dx) + Rg.range(-0.5, 0.5), sp = Rg.range(110, 260);
            ps.spawn(P.SPARK, m.end.x, m.end.y, Math.cos(a) * sp, Math.sin(a) * sp, Rg.range(0.12, 0.32));
          }
          for (let i = 0; i < 5; i++) {
            const [x, y] = onSwing(m.s, m.s.R, m.s.span * Rg.range(0.15, 0.9));
            ps.spawn(P.MOTE, x, y, Rg.range(-60, -10), Rg.range(-30, 30), Rg.range(0.2, 0.4), Rg.chance(0.5) ? C[5] : C[4], 0.5);
          }
          for (let i = 0; i < 2; i++) {
            const [x, y] = onSwing(m.s, m.s.R - 1, m.s.span * Rg.range(0.35, 0.75));
            drips.add({ kind: B.DRIP, x, y, vx: Rg.range(-8, 8), vy: Rg.range(10, 40), g: 0.55, life: 1.2, c: C[3] });
          }
        }
      }
      drips.update(dt);
      ps.update(dt);
      lights.update(dt);
    },
    draw(p) {
      for (const m of marks) {
        const u = t - m.t0;
        if (u < 0) continue;
        const S = m.s.span, head = S * ease.outExpo(clamp(u / RAKE)), c = smooth(CLOSE0, CLOSE0 + CLOSE, u), lo = (S / 2) * c, hi = Math.min(head, S - (S / 2) * c);
        const heat = heatAt(m);
        if (hi - lo > 0.02) {
          // a lens: sharp at both ends, thickest in the middle; white-hot at the core, cooling outward and with time
          smear(p, m.s, lo, hi, m.W, (uu, r, out) => {
            const v = uu / S, w = m.W * Math.pow(Math.sin(Math.PI * v), 1.15) * (1 - 0.55 * c), off = Math.abs(r - (m.s.R - m.W / 2)) / (w / 2 + 0.01);
            if (w < 0.5 || off > 1) return;
            const ci = Math.round((1 - heat) * 5.2 + off * 1.6 + (head < S ? (S - uu) / S : 0) * 0.5);
            out.c = C[n - 1 - clamp(ci, 0, n - 2)];
          }, 0, 2);
          glowAlong(p, m.s, m.s.R - m.W / 2, lo, hi, 11, C[4], 0.42 * heat * heat, 0, 0.2);
        }
        // where it has closed, a dotted red scar lingers and fades
        const k = 0.8 * (1 - clamp((u - CLOSE0 - CLOSE * 0.5) / 0.4));
        if (c > 0.05 && k > 0) {
          trace(p, m.s, m.s.R - m.W / 2, 0.04 * S, lo, C[2], k);
          trace(p, m.s, m.s.R - m.W / 2, S - lo, 0.96 * S, C[2], k);
        }
        // the claw tip glints as it tears in
        const g = u - RAKE * 0.4;
        if (g > 0 && g < 0.16) sparkle(p, m.end.x, m.end.y, 5 * ease.outBack(Math.min(1, g / 0.04)) * (1 - g / 0.16), C[6], C[4], 0.4);
      }
      drips.draw(p);
      ps.draw(p);
      lights.draw(p);
    },
  };
}

};
  __defs["fx/melee/double-slash.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The crescent, trace, glint and spark recipe is adapted from Sprite Fusion's open-source slash
// (https://www.spritefusion.com/pixel-art-vfx/slash), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, Rng, fit, sparkle, flare, clamp, ease, WHITE, READY } = __req("core/index.js");
const { through, slash, slashEnd, shavings, sliver } = __req("fx/melee/_lib.js");

const meta = {
  name: "Double slash",
  desc: "A down cut, then an up cut that crosses it: the moment the X closes both strokes flash white, the crossing bursts with light and sparks, and a dotted X lingers.",
  tags: ["melee", "slash", "combo", "sword", "cross", "combat", "directional", "one-shot"],
  size: [164, 108],
  origin: [44, 92],
  duration: 0.8,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#2a0a22", "#5e1238", "#a01f4e", "#e0386a", "#ff86a6", "#ffd2dd", "#ffffff"],
    sparks: ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"],
    seed: 6,
  },
};

const STANCE = { ...READY, weapon: "sword", fx: 12, fy: -21, sa: -0.85 };
const HIGH = { ...STANCE, x: -7, crouch: 4, lean: -4, fx: -7, fy: -35, sa: -2.65, bx: 9, by: -25, armsFront: true, ffx: 9, fbx: -8 };
const LOW = { ...STANCE, x: 3, crouch: 6, lean: 6, fx: 22, fy: -20, sa: 0.62, bx: -8, by: -24, ffx: 13, fbx: -10, toeB: true };
const act = {
  target: { x: 62 },
  poses: [
    [-0.42, { ...STANCE, x: -7 }],
    [-0.18, HIGH],
    [-0.04, { ...HIGH, crouch: 5 }],
    [0, { ...STANCE, x: 0, crouch: 2, lean: 3, fx: 16, fy: -37, sa: -1.45, bx: -7, by: -24, ffx: 11, fbx: -9, ghost: 1 }, "snap"],
    [0.06, LOW, "snap"],
    [0.14, { ...LOW, x: 4, crouch: 6, lean: 5, fx: 20, fy: -17, sa: 0.85, ghost: 1 }],
    [0.17, { ...LOW, x: 5, crouch: 3, lean: 5, fx: 22, fy: -28, sa: 0.1, by: -18, toeB: true, ghost: 1 }, "snap"],
    [0.21, { ...LOW, x: 6, crouch: 1, lean: 6, fx: 19, fy: -37, sa: -0.95, by: -18, ffx: 13, fby: -6 }, "snap"],
    [0.5, { ...LOW, x: 6, crouch: 3, lean: 3, fx: 18, fy: -36, sa: -1.05, by: -19, ffx: 12 }],
    [0.92, { ...STANCE, x: -7 }],
  ],
  hits: [
    { t: 0.06, stop: 0.05, shake: 0.08, amp: 1, push: 1.4, straw: 8 },
    { t: 0.16, stop: 0.14, shake: 0.2, amp: 2, push: 2.8, straw: 18, y: -28 },
  ],
  dust: [{ t: 0.06, x: 16, n: 5, dir: 1 }, { t: 0.17, x: -8, n: 4, dir: -1 }],
};

const UP = 0.14; // the second cut starts
const R0 = 62;

const cut = (x, y, th, dir, span, extra) => through(x, y, th, dir, R0, span, 0.55, extra);

function create(o) {
  const C = fit(o.palette, 7), Rg = new Rng(o.seed), ps = new Particles({ rng: Rg, ground: () => 0, sparks: o.sparks }), lights = new Lights();
  const X = 34, Y = -23;
  const down = cut(X, Y, 0.72, 1, 0.84, { W: 10, t0: 0, sweep: 0.06, hold: 0.07, trail: 0.24, ramp: C, lens: true });
  const up = cut(X, Y, -0.66, -1, 0.84, { W: 11, t0: UP, sweep: 0.06, hold: 0.06, trail: 0.26, ramp: C, lens: true });
  const ends = [slashEnd(down), slashEnd(up)], slivers = [-2.4, -1.1, 0.2, 1.6].map((a) => ({ a: a + Rg.range(-0.2, 0.2), r: Rg.range(5, 8), v: Rg.range(70, 120), arc: Rg.range(0.4, 0.7) }));
  const CLOSE = UP + 0.012;
  let t = 0, cut1 = false, cut2 = false, closed = false;
  return {
    update(dt) {
      t += dt;
      if (!cut1 && t >= down.sweep) {
        cut1 = true;
        shavings(ps, Rg, down, 10, [C[4], C[5]]);
        for (let i = 0; i < 6; i++) {
          const a = Math.atan2(ends[0].dy, ends[0].dx) + Rg.range(-0.5, 0.5), sp = Rg.range(120, 300);
          ps.spawn(P.SPARK, ends[0].x, ends[0].y, Math.cos(a) * sp, Math.sin(a) * sp, Rg.range(0.12, 0.3));
        }
      }
      if (!closed && t >= CLOSE) {
        closed = true;
        lights.add(X, Y, 56, C[3], 0.45, 0.4);
        lights.add(X, Y, 18, WHITE, 0.6, 0.08);
        for (let i = 0; i < 18; i++) {
          const a = Rg.range(-Math.PI, Math.PI) * 0.8, sp = Rg.range(140, 360);
          ps.spawn(P.SPARK, X, Y, Math.cos(a) * sp, Math.sin(a) * sp - 40, Rg.range(0.14, 0.4));
        }
        for (let i = 0; i < 5; i++) ps.spawn(P.STAR, X + Rg.range(-14, 14), Y + Rg.range(-12, 12), 0, -4, Rg.range(0.2, 0.4), Rg.chance(0.5) ? C[5] : WHITE, Rg.range(1, 2.2), Rg.range(0.05, 0.2));
      }
      if (!cut2 && t >= UP + up.sweep) {
        cut2 = true;
        shavings(ps, Rg, up, 12, [C[4], C[5]]);
      }
      ps.update(dt);
      lights.update(dt);
    },
    draw(p) {
      // both strokes flash white for two frames when the X closes
      const flash = t >= CLOSE && t < CLOSE + 0.07 ? 1 : 0;
      down.hot = up.hot = flash;
      slash(p, down, t);
      slash(p, up, t);
      // glints at the ends of the strokes
      for (const [s, e] of [[down, ends[0]], [up, ends[1]]]) {
        const g = t - s.t0 - s.sweep * 0.6;
        if (g > 0 && g < 0.2) sparkle(p, e.x, e.y, 7 * ease.outBack(Math.min(1, g / 0.05)) * (1 - g / 0.2), C[5], C[3], 0.5);
      }
      // the crossing: a flare, slivers flying off it, light
      const q = t - CLOSE;
      if (q >= 0 && q < 0.26) {
        const k = q / 0.26;
        flare(p, X, Y, 22 * Math.pow(1 - k, 1.4), 1 - k, C);
        p.glow(X, Y, 34, C[4], 0.35 * (1 - k));
      }
      if (q >= 0.03 && q < 0.15) {
        const k = (q - 0.03) / 0.12;
        for (const s of slivers) sliver(p, X, Y, s.a, s.r + s.v * (q - 0.03), s.arc * (1 - 0.4 * k), k < 0.4 ? C[6] : k < 0.7 ? C[5] : C[4], 1 - k);
      }
      // light rides each edge as it goes
      for (const s of [down, up]) {
        const u = t - s.t0;
        if (u <= 0 || u >= 0.25) continue;
        const e = slashEnd({ ...s, span: s.span * ease.outExpo(clamp(u / s.sweep)) });
        p.glow(e.x, e.y, 40, C[3], 0.5 * (1 - u / 0.25));
      }
      ps.draw(p);
      lights.draw(p);
    },
  };
}

};
  __defs["fx/melee/thrust.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The speed lines are adapted from Sprite Fusion's open-source dash and the ray star from his sparkle
// (https://www.spritefusion.com/pixel-art-vfx), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, Rng, fit, sparkle, clamp, smooth, ease, TAU, WHITE, READY } = __req("core/index.js");

const meta = {
  name: "Thrust",
  desc: "A piercing stab: a bundle of streaks shoots out from the hand to a point, a long four-point star flares at the tip with a pierce ring, sparks and speed lines.",
  tags: ["melee", "thrust", "stab", "spear", "rapier", "pierce", "combat", "directional", "one-shot"],
  size: [196, 76],
  origin: [34, 62],
  duration: 0.75,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: {
    palette: ["#2a1608", "#6b3c10", "#b8701a", "#f0b42e", "#ffe27a", "#fff6cf", "#ffffff"],
    sparks: ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"],
    reach: 66,
    seed: 4,
  },
};

const STANCE = { ...READY, weapon: "sword", x: -14, fx: 12, fy: -21, sa: -0.3 };
// the hand comes back to the hip with the point forward, then the whole arm goes out along the blade
const BACK = { ...STANCE, crouch: 5, lean: -3, fx: -3, fy: -19, sa: -0.05, bx: 8, by: -30, armsFront: true, ffx: 10, fbx: -8 };
const LUNGE = { ...STANCE, crouch: 6, lean: 6, fx: 23, fy: -20, sa: 0, bx: -8, by: -24, ffx: 15, fbx: -11, toeB: true };
const act = {
  target: { x: 80 },
  poses: [
    [-0.46, STANCE],
    [-0.24, BACK],
    [-0.05, { ...BACK, crouch: 6, fx: -5 }],
    [0, { ...LUNGE, ghost: 1 }, "snap"],
    [0.07, LUNGE, "snap"],
    [0.3, { ...LUNGE, crouch: 5, lean: 5 }],
    [0.7, STANCE],
  ],
  hits: [{ t: 0.07, stop: 0.12, shake: 0.14, amp: 2, push: 2.8, straw: 16, y: -26 }],
  dust: [{ t: 0, x: -24, n: 6, dir: -1 }, { t: 0.07, x: 1, n: 6, dir: 1 }],
};

const OUT = 0.07; // the point arrives
const HOLD = 0.06, PULL = 0.2;

// a long four-point star: the forward and back arms long, up and down shorter, thick at the heart
function longStar(p, x, y, L, k, C) {
  if (L < 1) return;
  const arms = [[1, 0, L], [-1, 0, L * 0.7], [0, -1, L * 0.42], [0, 1, L * 0.42]];
  for (const [dx, dy, len] of arms)
    for (let d = 1; d <= len; d += 0.5) {
      const u = d / len, c = u < 0.3 ? WHITE : u < 0.65 ? C[5] : C[4];
      p.dot(x + dx * d, y + dy * d, c, u < 0.7 ? 1 : 1 - (u - 0.7) / 0.35);
      if (u < 0.25 && len > 6) (p.dot(x + dx * d - dy, y + dy * d + dx, C[5]), p.dot(x + dx * d + dy, y + dy * d - dx, C[5]));
    }
  for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) for (let d = 1; d <= Math.min(3, L * 0.14); d++) p.px(x + dx * d, y + dy * d, d < 2 ? C[5] : C[4]);
  p.px(x, y, WHITE);
  p.glow(x, y, 6 + L * 1.3, C[4], 0.35 * k);
  p.glow(x, y, 3 + L * 0.4, WHITE, 0.3 * k);
}

function create(o) {
  const C = fit(o.palette, 7), Rg = new Rng(o.seed), ps = new Particles({ rng: Rg, ground: () => 0, sparks: o.sparks }), lights = new Lights();
  const HX = 9, HY = -20, TX = HX + o.reach, TY = HY;
  // the bundle: streaks fanned at the hand, meeting at the point; the middle one hottest
  const streaks = [-7, -4, -2, 0, 2, 4, 7].map((off) => ({ off, x0: HX + 1 + Rg.range(0, 5) + Math.abs(off) * 0.6, t0: Rg.range(0, 0.02) + Math.abs(off) * 0.003, w: off === 0 ? 2 : 1, hot: off === 0, len: Rg.range(0.75, 1) }));
  const lines = [];
  let t = 0, struck = false;
  return {
    update(dt) {
      t += dt;
      // speed lines race forward beside the bundle while it shoots out and just after
      if (t < OUT + 0.08 && Rg.chance(0.5)) {
        const s = Rg.sign();
        lines.push({ x: HX + Rg.range(0, o.reach * 0.6), y: HY + s * Rg.range(7, 17), l: Rg.range(18, 42), v: Rg.range(200, 340), t });
      }
      for (let i = lines.length - 1; i >= 0; i--) if (t - lines[i].t > 0.24) lines.splice(i, 1);
      for (const l of lines) l.x += l.v * dt;
      if (!struck && t >= OUT) {
        struck = true;
        lights.add(TX, TY, 44, C[4], 0.45, 0.3);
        lights.add(TX, TY, 14, WHITE, 0.6, 0.06);
        for (let i = 0; i < 12; i++) {
          const a = Rg.range(-0.55, 0.45), sp = Rg.range(150, 330);
          ps.spawn(P.SPARK, TX, TY, Math.cos(a) * sp, Math.sin(a) * sp - 30, Rg.range(0.12, 0.35));
        }
        for (let i = 0; i < 10; i++) {
          const a = Rg.range(-0.9, 0.9) + (Rg.chance(0.3) ? Math.PI : 0), sp = Rg.range(40, 120);
          ps.spawn(P.MOTE, TX + Rg.range(-6, 2), TY + Rg.range(-2, 2), Math.cos(a) * sp, Math.sin(a) * sp, Rg.range(0.25, 0.5), Rg.chance(0.5) ? C[5] : C[4], 0.6);
        }
        for (let i = 0; i < 4; i++) ps.spawn(P.STAR, TX + Rg.range(-10, 8), TY + Rg.range(-9, 9), 0, -3, Rg.range(0.2, 0.4), Rg.chance(0.5) ? C[5] : WHITE, Rg.range(1, 2), Rg.range(0.06, 0.2));
      }
      ps.update(dt);
      lights.update(dt);
    },
    draw(p) {
      // the point catches the light before it goes
      if (t < 0.05) sparkle(p, HX + 2, HY, 5 * (1 - t / 0.05) + 1, C[5], C[3], 0.4);
      // speed lines: dotted, white at the head, dimming back along their length
      for (const l of lines) {
        const k = (t - l.t) / 0.24;
        for (let d = 0; d < l.l * (1 - k * 0.6); d++) p.dot(l.x - d, l.y, d < 3 ? WHITE : d < l.l * 0.4 ? C[5] : C[3], (1 - d / l.l) * (1 - k));
      }
      // the bundle: each streak shoots from the hand to the point, holds, then is drawn in to the point
      const pull = smooth(OUT + HOLD, OUT + HOLD + PULL, t);
      for (const s of streaks) {
        const u = clamp((t - s.t0) / OUT), head = ease.outExpo(u);
        if (u <= 0 || pull >= 1) continue;
        // the outer streaks stop short of the point and trail a little behind, so each reads on its own
        const y0 = HY + s.off, end = s.x0 + (TX - s.x0) * s.len, x1 = s.x0 + (end - s.x0) * head, xa = s.x0 + (end - s.x0) * Math.max(pull, head * 0.35 * (1 - s.len) * 3);
        const yAt = (x) => y0 + (TY - y0) * clamp((x - s.x0) / (TX - s.x0)) * 0.85;
        for (let x = xa; x <= x1; x += 0.5) {
          const v = (x - xa) / Math.max(1, x1 - xa), c = v > 0.88 ? WHITE : s.hot ? (v > 0.35 ? C[6] : C[5]) : v > 0.55 ? C[5] : v > 0.25 ? C[4] : C[3];
          p.dot(x, yAt(x), c, v < 0.12 ? v / 0.12 : 1);
          if (s.w > 1 && v > 0.1) p.dot(x, yAt(x) + 1, v > 0.6 ? C[5] : C[3], v < 0.2 ? v / 0.2 : 1);
        }
      }
      if (t < OUT + HOLD + PULL) p.glowLine(HX + (TX - HX) * pull, HY, HX + (TX - HX) * ease.outExpo(clamp(t / OUT)), TY, 6, C[4], 0.22 * (1 - pull));
      // the long star at the point, and a pierce ring shed from it
      const q = t - OUT;
      if (q >= 0 && q < 0.4) {
        const g = ease.outBack(clamp(q / 0.04), 2.4) * (1 - smooth(0.08, 0.4, q)) * (1 + 0.12 * Math.sin(q * 70));
        longStar(p, TX, TY, 24 * g, 1 - q / 0.4, C);
      }
      if (q >= 0 && q < 0.2) {
        const k = q / 0.2, rx = 2 + 7 * ease.outCubic(k), ry = 4 + 12 * ease.outCubic(k);
        for (let a = 0; a < TAU; a += 0.05) p.dot(TX + 4 + 10 * k + Math.cos(a) * rx, TY + Math.sin(a) * ry, k < 0.3 ? WHITE : C[5], 1.15 - k);
      }
      ps.draw(p);
      lights.draw(p);
    },
  };
}

};
  __defs["fx/impacts/hit-spark.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
// The two-tone spark spray and the light pop are adapted from Sprite Fusion's open-source impact
// (https://www.spritefusion.com/pixel-art-vfx/impact), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, Rng, fit, WHITE } = __req("core/index.js");

const meta = {
  name: "Hit spark",
  desc: "The everyday hit: a sharp, lopsided cross flare with one long ray along the blow round a white diamond core, then a cone of sparks and hot chips that fall and bounce.",
  tags: ["impact", "hit", "spark", "combat", "directional", "one-shot"],
  size: [136, 80],
  origin: [44, 64],
  duration: 0.5,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: ["#4a1712", "#c9281f", "#f2561d", "#ff8a2a", "#ffe26b", "#fff3a6", "#ffffff"], height: 20, aim: 0.1, seed: 4 },
};

// one ray of the cross: fat at the root, a hair at the tip, white cooling outward; from..to draws a stretch of it
function ray(p, x, y, a, L, w, C, from = 0) {
  const c = Math.cos(a), s = Math.sin(a);
  for (let d = from * L; d <= L; d += 0.5) {
    const u = d / L, hw = w * Math.pow(1 - u, 1.6);
    const col = u < 0.3 ? WHITE : u < 0.62 ? C[5] : u < 0.88 ? C[4] : C[3];
    p.px(x + c * d, y + s * d, col);
    if (hw > 0.45) for (let o = 0.5; o <= hw; o += 0.5) for (const e of [-o, o]) p.px(x + c * d - s * e, y + s * d + c * e, u < 0.3 && o < 1 ? C[5] : C[4]);
  }
}

// the core: a crisp white diamond with a pale rim
function diamond(p, x, y, r, C) {
  for (let dy = -r - 1; dy <= r + 1; dy++)
    for (let dx = -r - 1; dx <= r + 1; dx++) {
      const m = Math.abs(dx) + Math.abs(dy);
      if (m <= r) p.px(x + dx, y + dy, WHITE);
      else if (m === r + 1) p.px(x + dx, y + dy, C[3]);
    }
}

function create(o) {
  const C = fit(o.palette, 7), R = new Rng(o.seed), X = 0, Y = -o.height, A = o.aim, floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[6], C[5], C[4], C[2]] });
  const lights = new Lights();
  // the cross: a long thin ray along the blow, a stub behind, two unequal arms across, and a glint between
  const tilt = R.range(-0.08, 0.08);
  const rays = [
    { a: A + tilt, L: R.range(33, 37), w: 2.2 },
    { a: A + Math.PI + tilt, L: R.range(8, 10), w: 2.2 },
    { a: A - Math.PI / 2 + tilt, L: R.range(15, 18), w: 2.6 },
    { a: A + Math.PI / 2 + tilt, L: R.range(10, 12), w: 2.3 },
    { a: A - Math.PI / 4 + tilt, L: R.range(5, 7), w: 1 },
  ];

  lights.add(X, Y, 38, C[4], 0.35, 0.18);
  lights.add(X + Math.cos(A) * 10, Y + Math.sin(A) * 10, 22, C[5], 0.45, 0.1);
  lights.add(X, -2, 26, C[3], 0.22, 0.22);
  // a cone of sparks sprayed on along the blow: they fall, bounce off the floor and die
  for (let i = 0; i < 9; i++) {
    const a = A + R.range(-0.6, 0.6) - 0.15, v = R.range(170, 360);
    ps.spawn(P.SPARK, X + 1, Y, Math.cos(a) * v, Math.sin(a) * v - 40, R.range(0.25, 0.45), WHITE, 1, i > 6 ? R.range(0.01, 0.03) : 0);
  }
  // hot pixel chips knocked off, tumbling down to tick off the floor
  for (let i = 0; i < 6; i++) {
    const a = A + R.range(-1.1, 0.5) - 0.3, v = R.range(70, 170);
    ps.spawn(P.GRIT, X + 1, Y, Math.cos(a) * v, Math.sin(a) * v - R.range(30, 80), R.range(0.35, 0.45), R.pick([C[5], C[4], C[4], C[3]]), 1);
  }

  let t = 0;
  return {
    update(dt) {
      t += dt;
      ps.update(dt);
      lights.update(dt);
    },
    draw(p) {
      ps.draw(p);
      if (t < 0.025) {
        // the flash: the whole cross round the diamond
        for (const r of rays) ray(p, X, Y, r.a, r.L, r.w, C);
        diamond(p, X, Y, 4, C);
      } else if (t < 0.058) {
        // reaching further and thinning, the diamond still crisp
        for (const r of rays) ray(p, X, Y, r.a, r.L * 1.2, r.w * 0.55, C, 0.12);
        diamond(p, X, Y, 3, C);
      } else if (t < 0.092) {
        // only the long ray lingers, its root burning away
        const r = rays[0];
        ray(p, X, Y, r.a, r.L * 1.3, 0.6, [C[0], C[1], C[2], C[3], C[3], C[4]], 0.4);
      }
      const pop = Math.exp(-t / 0.045);
      if (pop > 0.02) {
        p.glow(X, Y, 22, C[4], 0.3 * pop);
        p.glow(X, Y, 7, WHITE, 0.15 * pop);
        p.glowLine(X, Y, X + Math.cos(A) * 26, Y + Math.sin(A) * 26, 4, C[5], 0.25 * pop);
      }
      lights.draw(p);
    },
  };
}

};
  __defs["fx/impacts/_lib.js"] = function (__e) {
__x(__e, "stone", () => stone);
__x(__e, "spikes", () => spikes);
__x(__e, "star", () => star);
__x(__e, "brokenRing", () => brokenRing);
__x(__e, "makeCracks", () => makeCracks);
__x(__e, "drawCracks", () => drawCracks);
__x(__e, "frontCrescent", () => frontCrescent);
__x(__e, "dustRing", () => dustRing);
__x(__e, "rock", () => rock);
__x(__e, "SOOT", () => SOOT);
__x(__e, "OUTLINE", () => OUTLINE);
__x(__e, "rockShape", () => rockShape);
// Shared by the impacts: the hit star, a ring that breaks into flying arcs, floor cracks that glow and cool,
// standing shock fronts, soft lumpy dust rings, faceted tumbling rocks, and the stone colors they share.
// The star and flying-arc recipes are adapted from Sprite Fusion's open-source impact
// (https://www.spritefusion.com/pixel-art-vfx/impact), and the stone colors from its explosion
// (https://www.spritefusion.com/pixel-art-vfx/explosion), MIT License, Copyright (c) 2026 Hugo Duprez.
// Files starting with _ are helpers, not effects.

const { clamp, rand, TAU, hex, mix, scale, rgb, WHITE } = __req("core/index.js");

const SOOT = hex("#0d0a12");
const OUTLINE = hex("#1a1422");
const LIGHT = Math.atan2(-1, -1); // light comes from the top left

/** Stone colors from one body color: light, body, shade, dust (lighter and greyer), lip (a lit broken edge). */
function stone(c) {
  c = hex(c);
  return { light: mix(scale(c, 1.35), WHITE, 0.08), body: c, shade: scale(c, 0.64), dust: mix(scale(c, 1.2), rgb(150, 140, 150), 0.3), lip: mix(scale(c, 1.55), WHITE, 0.12) };
}

/**
 * Spikes for a hit star: n of them round the circle, longer towards aim (fwd) and a little behind it (back).
 * len and w: [min, max] base length and root half-width; jag scales every other spike (short teeth between).
 */
function spikes(R, n, aim, { len = [7, 10], w = [1.5, 2.1], fwd = 1.8, back = 0.6, jag = 1, jit = 0.18 } = {}) {
  return Array.from({ length: n }, (_, i) => {
    const a = aim + (i / n) * TAU + R.range(-jit, jit), cb = Math.cos(a - aim);
    const L = R.range(len[0], len[1]) * (1 + fwd * Math.pow(Math.max(0, cb), 3) + back * Math.pow(Math.max(0, -cb), 3)) * (i % 2 ? jag : 1);
    return { a, len: L, w: R.range(w[0], w[1]) * (i % 2 ? Math.sqrt(jag) : 1) };
  });
}

/**
 * A hit star: tapered spikes in three passes (a rim, a body that's paler near the root, a hot core) round a
 * hot heart. sc stretches the spikes, th thins them, cols [rim, body, inner, core], a dithers it out.
 */
function star(p, x, y, list, sc, th, [rim, body, inner, core], a = 1, heart = 2.4) {
  for (let pass = 0; pass < 3; pass++)
    for (const s of list) {
      const c = Math.cos(s.a), sn = Math.sin(s.a), L = s.len * sc;
      for (let d = 0; d <= L; d += 0.5) {
        if (pass === 2 && d > L * 0.55) break;
        const hw0 = s.w * th * (1 - d / L) * Math.min(1, 0.5 + d / 3);
        const hw = pass === 0 ? hw0 + 0.8 : pass === 1 ? hw0 : hw0 * 0.45;
        const col = pass === 0 ? rim : pass === 1 ? (d < L * 0.35 ? inner : body) : core;
        for (let o = -hw; o <= hw; o += 0.5) p.dot(x + c * d - sn * o, y + sn * d + c * o, col, a);
      }
    }
  const r = heart * sc * Math.sqrt(th);
  p.circle(x, y, r + 0.8, inner, a);
  p.circle(x, y, r, core, a);
}

/**
 * A ring that breaks into arcs: segs [{ a (centre angle), gap (0..1), dr (how fast it flies out), w (thickness
 * scale, default 1) }] evenly round the ring. brk 0 draws a whole ring th thick; as brk grows each arc shrinks,
 * tapers at both ends into a crescent and drifts out at its own speed. c is the outer edge's color, c2 the
 * inner's; sy squashes it onto a plane; nothing is drawn below maxY (a floor).
 */
function brokenRing(p, x, y, r, th, segs, brk, c, c2 = c, k = 1, sy = 1, maxY = Infinity) {
  if (r <= 0 || k <= 0) return;
  const full = TAU / segs.length;
  for (const s of segs) {
    const span = full * (1 - s.gap * brk) + 0.02, rr = r * (1 + s.dr * brk), m = Math.max(4, Math.ceil(rr * span * 1.8));
    for (let j = 0; j <= m; j++) {
      const u = j / m, ang = s.a + (u - 0.5) * span, w = Math.max(0.5, th * (s.w ?? 1) * (1 - brk * Math.pow(Math.abs(2 * u - 1), 1.6)));
      const ca = Math.cos(ang), sa = Math.sin(ang);
      for (let o = -w / 2; o <= w / 2 + 0.01; o += 0.5) if (y + sa * (rr + o) * sy < maxY) p.dot(x + ca * (rr + o), y + sa * (rr + o) * sy, o > -0.26 ? c : c2, k);
    }
  }
}

// a jagged walk from (x, y) heading a for L px; each point is [x, y, distance along]
function walk(R, x, y, a, L, { jit = 0.55, steer = 0.45, step = [2, 4], maxY = Infinity, d0 = 0 } = {}) {
  const pts = [[x, y, d0]];
  let d = 0, cur = a;
  while (d < L - 0.01) {
    const s = Math.min(L - d, R.range(step[0], step[1]));
    cur += R.range(-jit, jit) + (a - cur) * steer;
    x += Math.cos(cur) * s;
    y = clamp(y + Math.sin(cur) * s, 0.5, maxY);
    d += s;
    pts.push([x, y, d0 + d]);
  }
  return pts;
}

/**
 * Cracks in the floor face below (0, 0): n jagged lines, alternately left and right, mostly shallow, a few
 * diving steeply, some forked. len [min, max], maxY how deep they may go, forks 0..1.
 */
function makeCracks(R, n, { len = [14, 40], dive = 0.85, maxY = 22, forks = 0.5, x0 = [1, 5] } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1, dip = 0.06 + Math.pow(R.next(), 1.7) * dive, L = R.range(len[0], len[1]) * (1 - (0.5 * dip) / (dive + 0.06));
    const a = side > 0 ? dip : Math.PI - dip, pts = walk(R, side * R.range(x0[0], x0[1]), R.range(0.5, 1.5), a, L, { maxY });
    const c = { pts, len: L, t0: R.range(0, 0.035), kids: [] };
    for (let j = 2; j < pts.length - 1; j++)
      if (R.chance(forks * 0.4)) {
        const [fx, fy, fd] = pts[j];
        c.kids.push(walk(R, fx, fy, a + R.sign() * R.range(0.45, 1), R.range(3, 9) * (1 - (0.5 * j) / pts.length), { maxY, d0: fd, jit: 0.7, step: [1.5, 3] }));
      }
    out.push(c);
  }
  return out;
}

/**
 * Draw cracks grown to g(c) px of their length. heat(d) 0..1 at distance d along a crack lights it from the
 * hot ramp (bright to dark) before it cools to dark; lip is the lit lower edge; k dithers them out.
 * Returns nothing; adds a glow along the hot parts.
 */
function drawCracks(p, cracks, g, heat, hot, dark, lip, k = 1) {
  if (k <= 0) return;
  const col = (d) => {
    const h = heat(d);
    return h > 0.75 ? hot[0] : h > 0.5 ? hot[1] : h > 0.3 ? hot[2] : h > 0.12 ? hot[3] : dark;
  };
  for (const c of cracks) {
    const G = g(c);
    if (G <= 0) continue;
    for (const path of [c.pts, ...c.kids]) {
      for (let i = 1; i < path.length; i++) {
        const [x0, y0, d0] = path[i - 1], [x1, y1, d1] = path[i];
        if (d0 >= G) break;
        const f = d1 > G ? (G - d0) / (d1 - d0) : 1, ex = x0 + (x1 - x0) * f, ey = y0 + (y1 - y0) * f;
        p.line(x0, y0 + 1, ex, ey + 1, lip, (u) => (rand(Math.round(x0 + (ex - x0) * u), Math.round(y0 + (ey - y0) * u), 5) < 0.3 ? k * 0.8 : 0));
        p.line(x0, y0, ex, ey, (u) => col(d0 + (d1 - d0) * f * u), k);
        const h = heat(d0);
        if (h > 0.12) p.glow((x0 + ex) / 2, (y0 + ey) / 2, 4 + h * 4, hot[2], 0.22 * h * k);
      }
    }
  }
}

/**
 * A standing crescent shock front on the floor (y = 0): it leans back from a leading edge low at x, dir 1
 * racing right ")", -1 left "(". h tall, w thick at its widest (thick where it meets the floor, a point at
 * the top); cols [edge, body, back] bright to dark; k dithers it out.
 */
function frontCrescent(p, x, dir, h, w, cols, k = 1) {
  if (h < 1 || w < 0.3 || k <= 0) return;
  const ry = h * 0.8, cy = -h * 0.2, rx = Math.max(2, h * 0.55);
  const x0 = dir > 0 ? x - rx - w - 1 : x - 1, x1 = dir > 0 ? x + 1 : x + rx + w + 1;
  p.shade(x0, -h - 1, x1, 0, (px, py, out) => {
    if (py > 0) return;
    const ey = (py - cy) / ry;
    if (ey <= -1 || ey >= 1) return;
    const e2 = 1 - ey * ey, edge = rx * Math.sqrt(e2) - rx, wt = w * Math.pow(e2, 0.45), q = (edge - (px - x) * dir) / Math.max(0.5, wt);
    if (q < 0 || q > 1) return;
    out.c = q < 0.28 ? cols[0] : q < 0.62 ? cols[1] : cols[2];
    out.a = k * (ey < -0.8 ? 0.7 : 1) * (q > 0.7 ? 1.25 - q * 0.8 : 1);
  });
}

/**
 * A soft, lumpy ring of dust round (cx, cy): radius r, w thick (lumps swell it), alpha k, translucent and lit
 * on its upper side. sy squashes it onto the floor; brk 0..1 tears it into clumps as it thins; ph varies it;
 * nothing is drawn below maxY; half -1 draws only the far half (above cy), 1 only the near half.
 */
function dustRing(p, cx, cy, r, w, k, c, { sy = 1, ph = 0, brk = 0, lit = 0.35, maxY = Infinity, half = 0 } = {}) {
  if (k <= 0.01 || r <= 0) return;
  const W = w * 1.6, lite = mix(c, WHITE, lit);
  for (let y = Math.floor(cy - (r + W) * sy) - 1; y <= Math.min(maxY - 1, Math.ceil(cy + (r + W) * sy) + 1); y++)
    for (let x = Math.floor(cx - r - W) - 1; x <= Math.ceil(cx + r + W) + 1; x++) {
      const dx = x + 0.5 - cx, dy = (y + 0.5 - cy) / sy, d = Math.hypot(dx, dy), g = Math.atan2(dy, dx);
      if ((half < 0 && dy >= 0) || (half > 0 && dy < 0)) continue;
      const lumpy = 0.6 + 0.3 * Math.sin(5 * g + ph) + 0.18 * Math.sin(11 * g + ph * 2.1) + 0.12 * Math.sin(17 * g + ph * 0.7);
      const wt = w * lumpy, off = Math.abs(d - r - w * 0.25 * Math.sin(7 * g + ph));
      if (off >= wt) continue;
      const tear = brk > 0 ? clamp((0.55 + 0.45 * Math.sin(6 * g + ph * 1.7) - brk) / 0.25) : 1;
      const a = k * (1 - Math.pow(off / wt, 2)) * tear;
      if (a > 0.01) p.blend(x, y, dy < 0 && d > r - wt * 0.3 ? lite : c, a);
    }
}

/** A rock's outline: n vertex radii round its centre. */
const rockShape = (R, n = 6) => Array.from({ length: n }, () => R.range(0.7, 1.12));

/**
 * A faceted rock tumbling at angle b.a: every facet shaded by how it faces the light, a lit top face, a dark
 * outline, dithering out over its last half second. b: { x, y, a, s (1..3), life, pts }, st: stone().
 */
function rock(p, b, st) {
  const r = 0.75 + b.s * 0.8, n = b.pts.length, fade = Math.min(1, b.life / 0.5), ca = Math.cos(b.a), sa = Math.sin(b.a);
  p.shade(b.x - r - 2, b.y - r - 2, b.x + r + 2, b.y + r + 2, (x, y, out) => {
    const dx = x - b.x, dy = y - b.y, u = dx * ca + dy * sa, v = -dx * sa + dy * ca, d = Math.hypot(u, v);
    let ang = Math.atan2(v, u);
    if (ang < 0) ang += TAU;
    const f = (ang / TAU) * n, i = Math.floor(f) % n, w = f - Math.floor(f), edge = r * (b.pts[i] * (1 - w) + b.pts[(i + 1) % n] * w);
    if (d > edge + 0.85) return;
    out.a = fade;
    if (d > edge) return OUTLINE;
    const lit = Math.cos(((i + 0.5) / n) * TAU + b.a - LIGHT);
    if (d < edge * 0.42) return lit > 0.55 ? st.light : st.body;
    return lit > 0.35 ? st.light : lit < -0.4 ? st.shade : st.body;
  });
}

};
  __defs["fx/impacts/crit-hit.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
// The star, its key frames and the spark spray are adapted from Sprite Fusion's open-source impact
// (https://www.spritefusion.com/pixel-art-vfx/impact), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Bits, Lights, P, B, Rng, fit, clamp, smooth, ease, TAU, WHITE } = __req("core/index.js");
const { spikes, star, brokenRing } = __req("fx/impacts/_lib.js");

const meta = {
  name: "Critical hit",
  desc: "A critical hit: a jagged starburst slams in white and overshoots, a ring breaks into flying arcs, sparks streak off, shards tumble to the floor under a big flare.",
  tags: ["impact", "hit", "crit", "critical", "combat", "directional", "one-shot"],
  size: [216, 136],
  origin: [84, 106],
  duration: 0.9,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: ["#2a0510", "#5c0a1c", "#a3142a", "#e0302c", "#ff7a2a", "#ffc23d", "#fff09a", "#ffffff"], height: 26, aim: 0.12, seed: 3 },
};

// the star's key frames: [from t, scale, thickness, alpha, colors (rim, body, inner, core) as steps of the ramp]
const KEYS = [
  [0, 1, 1, 1, [6, 7, 7, 7]],
  [0.025, 1.3, 1, 1, [2, 5, 6, 7]],
  [0.058, 1.05, 0.72, 1, [2, 4, 5, 6]],
  [0.092, 1.22, 0.3, 1, [1, 2, 3, 4]],
  [0.125],
];

// a lens flare: a long level streak, thick and white at the heart, a shorter upright one, on a bed of light
function flare(p, x, y, L, k, C) {
  for (const [dx, dy, len] of [[1, 0, L], [0, 1, L * 0.45], [0.7, 0.7, L * 0.16], [0.7, -0.7, L * 0.16]])
    for (const s of [-1, 1])
      for (let d = 1; d <= len; d++) {
        const u = d / len, a = u < 0.7 ? 1 : k * (1.6 - u);
        p.dot(x + s * dx * d, y + s * dy * d, u < 0.35 ? WHITE : u < 0.7 ? C[6] : C[5], a);
        if (dy === 0 && u < 0.42) for (const e of [-1, 1]) p.dot(x + s * d, y + e, u < 0.2 ? C[6] : C[5], u < 0.3 ? 1 : k);
      }
  p.glowLine(x - L, y, x + L, y, 6, C[6], 0.5 * k);
  p.glowLine(x, y - L * 0.45, x, y + L * 0.45, 4, C[6], 0.3 * k);
}

function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed), X = 0, Y = -o.height, A = o.aim, floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[7], C[6], C[5], C[3]] });
  const bits = new Bits({ ground: floor }), lights = new Lights();
  const sp = spikes(R, 14, A, { len: [11, 15], w: [1.8, 2.5], fwd: 1.4, back: 0.6, jag: 0.5 });
  [...sp].sort((a, b) => b.len - a.len).slice(0, 2).forEach((s) => (s.len *= 1.3));
  const segs = Array.from({ length: 7 }, (_, i) => {
    const a = A + (i / 7) * TAU;
    return { a, gap: R.range(0.55, 0.85), dr: R.range(0.08, 0.4) + 0.15 * Math.max(0, Math.cos(a - A)), w: 0.7 + 0.5 * Math.max(0, Math.cos(a - A)) };
  });

  lights.add(X, Y, 84, C[5], 0.6, 0.5);
  lights.add(X, Y, 30, WHITE, 0.7, 0.1);
  lights.add(X, -4, 44, C[4], 0.3, 0.45);
  // sparks: most sprayed on along the blow, a few kicked back
  for (let i = 0; i < 36; i++) {
    const back = R.chance(0.22), a = (back ? A + Math.PI : A) + R.range(-1, 1) * (back ? 0.6 : 0.8), v = R.range(170, 430) * (back ? 0.6 : 1);
    ps.spawn(P.SPARK, X, Y, Math.cos(a) * v, Math.sin(a) * v - 50, R.range(0.15, 0.5), WHITE, 1, R.chance(0.3) ? R.range(0, 0.04) : 0);
  }
  // shards: bright splinters that tumble down, bounce and settle
  for (let i = 0; i < 10; i++) {
    const a = A + R.range(-1, 1) * 1.1 - 0.35, v = R.range(110, 280);
    bits.add({ kind: B.SHARD, x: X, y: Y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, g: 0.8, drag: 0.7, bounce: 0.35, life: R.range(0.55, 0.85), a: R.range(0, TAU), va: R.range(-25, 25), s: R.range(2, 4.5), c: R.pick([C[7], C[6], C[6], C[5]]) });
  }
  // embers of light drifting up and off, and glints that pop round the ring after the hit
  for (let i = 0; i < 12; i++) {
    const a = A - Math.PI / 2 + R.range(-1.4, 1.4), v = R.range(35, 110);
    ps.spawn(P.MOTE, X + Math.cos(a) * 4, Y + Math.sin(a) * 4, Math.cos(a) * v, Math.sin(a) * v - 15, R.range(0.35, 0.7), R.pick([C[6], C[5], C[5]]), 0.6, R.range(0, 0.05));
  }
  for (let i = 0; i < 5; i++) {
    const a = R.range(0, TAU), d = R.range(14, 34);
    ps.spawn(P.STAR, X + Math.cos(a) * d, Y + Math.sin(a) * d * 0.8, 0, -4, R.range(0.22, 0.38), R.chance(0.5) ? C[6] : WHITE, R.range(1.6, 3), R.range(0.08, 0.32));
  }

  let t = 0;
  return {
    update(dt) {
      t += dt;
      ps.update(dt);
      bits.update(dt);
      lights.update(dt);
    },
    draw(p) {
      // the ring: it swells off the star, then breaks into arcs that fly on and cool
      const u = clamp((t - 0.03) / 0.37);
      if (t >= 0.03 && u < 1) {
        const r = 10 + 30 * ease.outCubic(u), brk = smooth(0.12, 0.6, u), th = Math.max(1, 3.6 * Math.pow(1 - u, 1.2));
        const i = u < 0.12 ? 7 : u < 0.3 ? 6 : u < 0.5 ? 5 : u < 0.75 ? 4 : 3;
        brokenRing(p, X, Y, r, th, segs, brk, C[i], C[Math.max(2, i - 2)], u < 0.6 ? 1 : (1 - u) / 0.4, 1, 0);
        if (u < 0.6) p.glowRing(X, Y, r, 6, C[5], 0.35 * Math.pow(1 - u / 0.6, 2));
      }
      bits.draw(p);
      ps.draw(p);
      // the flare blooms as the star collapses
      const f = (t - 0.04) / 0.28;
      if (f > 0 && f < 1) {
        flare(p, X, Y, 64 * Math.pow(1 - f, 1.3), 1 - f, C);
        p.glow(X, Y, 56, C[5], 0.4 * (1 - f));
      }
      // the starburst slams in: a white frame, an overshoot, a settle, then it breaks up
      for (let i = 0; i < KEYS.length - 1; i++)
        if (t >= KEYS[i][0] && t < KEYS[i + 1][0]) {
          const [, sc, th, a, cols] = KEYS[i];
          star(p, X, Y, sp, sc, th, cols.map((j) => C[j]), a, 2.6);
        }
      const pop = Math.exp(-t / 0.05);
      if (pop > 0.02) {
        p.glow(X, Y, 44, C[5], 0.4 * pop);
        p.glow(X, Y, 12, WHITE, 0.6 * pop);
      }
      lights.draw(p);
    },
  };
}

};
  __defs["fx/impacts/heavy-landing.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
__x(__e, "act", () => act);
// The rocks, grit and dust are adapted from Sprite Fusion's open-source explosion
// (https://www.spritefusion.com/pixel-art-vfx/explosion), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Bits, P, B, Rng, fit, band, clamp, smooth, ease, TAU, WHITE, mix, hex, READY } = __req("core/index.js");
const { stone, makeCracks, drawCracks, dustRing, rock, rockShape, SOOT } = __req("fx/impacts/_lib.js");

const meta = {
  name: "Heavy landing",
  desc: "A character lands hard: the floor dents and cracks under their feet, two rings of dust roll out along the floor one after the other, and pebbles hop away.",
  tags: ["impact", "landing", "ground", "stomp", "dust", "rocks", "actor", "one-shot"],
  size: [176, 80],
  origin: [88, 60],
  duration: 1.6,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: { palette: ["#1c1a24", "#2f2a3a", "#4a4258", "#6b6280", "#9088a4", "#bdb6cc", "#e6e1ee"], stone: "#4a3f69", seed: 14 },
};

const FALL = { turn: 0.8, y: -46, crouch: -1, lean: -1, fx: -9, fy: -42, bx: 10, by: -42, ffx: 6, ffy: -8, fbx: -3, fby: -3, toeB: true, ghost: 1 };
const HERO_ = { y: 0, crouch: 8, lean: 5, fx: 13, fy: -8, bx: -6, by: -23, ffx: 11, fbx: -10 };
const act = {
  poses: [
    [-0.26, FALL],
    [-0.01, { ...FALL, y: -6 }, "in"],
    [0, HERO_, "snap"],
    [0.55, { ...HERO_, crouch: 7 }],
    [0.95, { ...HERO_, crouch: 5, lean: 3, fx: 13, fy: -15, bx: -5, by: -20 }],
    [1.3, READY],
    [1.6, READY],
  ],
  hits: [{ t: 0.005, stop: 0.13, shake: 0.32, amp: 3 }],
};

// the dent: the floor's edge pressed into a shallow dish, scuffed lips either side
function dent(p, st, k) {
  for (let x = -10; x <= 9; x++) {
    const q = Math.abs(x + 0.5) / 10, dep = Math.round(1.8 * (1 - q * q));
    if (q < 0.82) {
      for (let y = 0; y < dep; y++) p.dot(x, y, SOOT, k);
      p.dot(x, dep, st.lip, k);
    } else p.dot(x, -1, q > 0.92 ? st.light : st.lip, k);
  }
}

function create(o) {
  const C = fit(o.palette, 7), st = stone(o.stone), R = new Rng(o.seed), floor = () => 0, D = meta.duration;
  // the rings' far halves go behind the character, the near halves and all the debris in front
  const back = new Particles({ rng: R, ground: floor }), front = new Particles({ rng: R, ground: floor });
  const bits = new Bits({ ground: floor }), cracks = makeCracks(R, 6, { len: [8, 20], dive: 0.7, maxY: 12, forks: 0.4, x0: [2, 6] });
  const DUST = mix(st.dust, C[5], 0.4), LIT = mix(DUST, WHITE, 0.3), PH = R.range(0, TAU);
  // puffs riding each ring out along the floor
  const ring = (n, v0, v1, size, delay) => {
    for (let i = 0; i < n; i++) {
      const g = (i / n) * TAU + R.range(-0.1, 0.1), v = R.range(v0, v1), far = Math.sin(g) < 0;
      (far ? back : front).spawn(P.DUST, Math.cos(g) * 4, Math.sin(g) * 0.7 - 1, Math.cos(g) * v, Math.sin(g) * v * 0.16 - R.range(2, 10), R.range(0.45, 0.8), R.chance(0.45) ? LIT : DUST, R.range(size[0], size[1]), delay + R.range(0, 0.03));
    }
  };
  ring(20, 140, 190, [2.2, 3.4], 0.01);
  ring(18, 70, 110, [3.4, 5.4], 0.12);
  // and a low cloud at the feet that rises a little and hangs
  for (let i = 0; i < 12; i++) {
    const s = R.sign(), up = i < 6;
    (i % 2 ? front : back).spawn(P.DUST, s * R.range(2, 10), -R.range(1, 4), s * R.range(10, 35) * (up ? 0.6 : 1), -(up ? R.range(25, 60) : R.range(4, 12)), R.range(0.55, 0.9), R.chance(0.5) ? LIT : DUST, R.range(3, 5), R.range(0.02, 0.1));
  }
  // pebbles that hop away along the floor, and grit
  for (let i = 0; i < 12; i++) {
    const s = R.sign(), v = R.range(50, 130);
    bits.add({ kind: B.CHUNK, x: s * R.range(3, 8), y: -1, vx: s * v, vy: -R.range(140, 230), g: 1, drag: 0.5, bounce: 0.55, life: R.range(1, 1.45), a: R.range(0, TAU), va: s * R.range(8, 16), s: R.chance(0.3) ? 2 : 1, pts: rockShape(R) });
  }
  for (let i = 0; i < 24; i++) {
    const s = R.sign(), a = -Math.PI / 2 + s * R.range(0.3, 1.2), v = R.range(60, 170);
    front.spawn(P.GRIT, s * R.range(2, 7), -1, Math.cos(a) * v, Math.sin(a) * v, R.range(0.6, 1.1), R.pick([st.light, st.body, st.lip]), R.chance(0.3) ? 2 : 1);
  }

  let t = 0;
  // the two dust rings themselves: soft bands on the floor, the second slower, lumpier and later
  const rings = (p, far) => {
    for (const [t0, dur, r1, w, k0, edge] of [[0.01, 0.45, 58, 4.5, 0.75, 1], [0.12, 0.85, 42, 6, 0.8, 0]]) {
      const g = (t - t0) / dur;
      if (g <= 0 || g >= 1) continue;
      const r = 6 + r1 * ease.outCubic(g);
      dustRing(p, 0, 0, r, w * (1 + g), k0 * Math.pow(1 - g, 1.2) * Math.min(1, g / 0.06), DUST, { sy: 0.2, ph: PH + t0 * 10, brk: g * 0.8, half: far ? -1 : 1 });
      // the fast ring's leading edge: a crisp lit band on the floor
      if (edge && g < 0.75) band(p, 0, 0.5, r + 2, 0.2, Math.max(1, 2.5 * (1 - g)), 1.1 - g / 0.75, [st.body, st.light, LIT, WHITE], (a) => Math.sin(a) < 0 === far);
    }
  };
  return {
    update(dt) {
      t += dt;
      for (const b of bits.list) b.pvy = b.vy;
      bits.update(dt);
      for (const b of bits.list)
        if (b.pvy > 80 && b.vy <= 0) {
          front.spawn(P.DUST, b.x, -0.5, R.sign() * R.range(6, 20), -R.range(2, 10), R.range(0.25, 0.45), DUST, R.range(1, 1.8));
          b.pvy = 0;
        }
      back.update(dt);
      front.update(dt);
    },
    drawBack(p) {
      const fade = 1 - smooth(D - 0.5, D - 0.1, t);
      dent(p, st, fade);
      drawCracks(p, cracks, (c) => c.len * ease.outCubic(clamp((t - c.t0) / 0.08)), () => 0, [WHITE, WHITE, WHITE, WHITE], SOOT, st.light, fade);
      rings(p, true);
      back.draw(p);
    },
    draw(p) {
      rings(p, false);
      front.draw(p);
      for (const b of bits.list) rock(p, b, st);
      // the thud: a flat streak of light along the floor for a frame or two
      if (t < 0.035) p.ellipse(0, 0, 15, 2.5, (d) => (d < 0.55 ? WHITE : C[6]));
      else if (t < 0.07) for (let x = -22; x <= 22; x++) p.dot(x, 0, Math.abs(x) < 10 ? WHITE : C[5], 1 - Math.abs(x) / 24);
      if (t < 0.12) p.glowLine(-20, 0, 20, 0, 8, C[6], 0.45 * (1 - t / 0.12));
    },
  };
}

};
  __defs["fx/projectiles/_lib.js"] = function (__e) {
__x(__e, "beat", () => beat);
__x(__e, "wake", () => wake);
__x(__e, "puff", () => puff);
__x(__e, "cloud", () => cloud);
__x(__e, "Smoke", () => Smoke);
__x(__e, "spark", () => spark);
__x(__e, "flashShape", () => flashShape);
__x(__e, "flash", () => flash);
__x(__e, "casing", () => casing);
__x(__e, "drawCasing", () => drawCasing);
__x(__e, "turnSprite", () => turnSprite);
__x(__e, "pixelShape", () => pixelShape);
// Shared by the projectile effects: a steady emitter for loops, motion in a projectile's own frame, soft smoke
// puffs, speed-stretched sparks, muzzle-flash lobes, brass casings that bounce, and outlined pixel shapes.
// The smoke puff, spark streak, flash lobe and casing recipes are adapted from Sprite Fusion's open-source
// muzzle-flash and explosion (https://www.spritefusion.com/pixel-art-vfx/muzzle-flash),
// MIT License, Copyright (c) 2026 Hugo Duprez. Files starting with _ are helpers, not effects.

const { clamp, mix, rand, rng, wrap, WHITE } = __req("core/index.js");

/**
 * Like cycle(), but particle i is born exactly at i * period / n: an emitter with a steady beat, so a trail
 * has no clumps or gaps. Loops seamlessly over period. fn(age, life, r, i), r the same rng every period.
 */
function beat(t, period, n, seed, life, fn) {
  for (let i = 0; i < n; i++) {
    const L = typeof life === "function" ? life(rng(seed, i, 911)) : life;
    for (let age = wrap(t - (i * period) / n + 1e-7, period); age < L; age += period) fn(age, L, rng(seed, i), i);
  }
}

/**
 * Where something is after `age` seconds in the frame of a projectile that flies right at V px/s: launched
 * from (x, y) at (vx, vy) relative to the still air, slowed toward the air by drag k (1/s), pulled by g.
 * The air streams left at V, so whatever it carries streams left too. Returns [x, y, vx, vy] (screen motion).
 */
function wake(x, y, vx, vy, age, V, k, g = 0) {
  const e = Math.exp(-k * age), f = (1 - e) / k, vt = g / k;
  return [x + vx * f - V * age, y + vt * age + (vy - vt) * f, vx * e - V, vt + (vy - vt) * e];
}

/**
 * A soft smoke puff: a body, a denser core sitting low, a lit cap on top while it's young (cap 0..1), and
 * light from a fire on one side (warm 0..1 of color wc, coming from angle wa).
 */
function puff(p, x, y, r, a, c, cap = 1, warm = 0, wc = 0, wa = 0) {
  if (a <= 0.01 || r < 0.5) return;
  p.disc(x, y, r, c, a * 0.45);
  p.disc(x + r * 0.05, y + r * 0.06, r * 0.74, c, a * 0.62);
  if (cap > 0.02) p.disc(x - r * 0.22, y - r * 0.3, r * 0.5, mix(c, WHITE, 0.14), a * 0.42 * cap);
  if (warm > 0.02) p.disc(x + Math.cos(wa) * r * 0.32, y + Math.sin(wa) * r * 0.32, r * 0.55, wc, a * 0.7 * warm);
}

/**
 * Puffs [{ x, y, r, a, b (brightness 0..1), w (fire light 0..1) }] merged into one translucent volume: each
 * puff is lit on top and shaded underneath, densities add up, and tone and density come out in clean steps, so
 * a trail reads as one billowing cloud with lit crowns instead of a string of beads. R: smoke ramp, dark to
 * bright; WR: the same smoke lit by fire (a ramp as long as R), which young puffs (w) lean to. clip(x, y) can
 * keep it off part of the canvas.
 */
function cloud(p, list, R, WR, { dens = 1.5, max = 0.86, clip, lit = 1 } = {}) {
  if (!list.length) return;
  let X0 = Infinity, Y0 = Infinity, X1 = -Infinity, Y1 = -Infinity;
  for (const q of list) {
    X0 = Math.min(X0, Math.floor(q.x - q.r)); X1 = Math.max(X1, Math.ceil(q.x + q.r));
    Y0 = Math.min(Y0, Math.floor(q.y - q.r)); Y1 = Math.max(Y1, Math.ceil(q.y + q.r));
  }
  const W = X1 - X0 + 3, H = Y1 - Y0 + 3, D = new Float32Array(W * H), L = new Float32Array(W * H), F = new Float32Array(W * H);
  X0--, Y0--;
  for (const q of list) {
    const r = q.r, r2 = r * r;
    for (let y = Math.floor(q.y - r); y <= Math.ceil(q.y + r); y++) {
      const dy = y + 0.5 - q.y;
      for (let x = Math.floor(q.x - r); x <= Math.ceil(q.x + r); x++) {
        const dx = x + 0.5 - q.x, d2 = (dx * dx + dy * dy) / r2;
        if (d2 >= 1) continue;
        // a ball's thickness: flat in the middle, steep at the rim, so every lump keeps its own crown
        const k = Math.sqrt(1 - d2) * q.a, i = (y - Y0) * W + (x - X0);
        D[i] += k;
        L[i] += k * q.b;
        F[i] += k * q.w * (0.5 + 0.5 * clamp(0.5 + dx / r));
      }
    }
  }
  // light the merged surface: where density climbs downward the cloud faces up and catches the light. The
  // gradient comes off a blurred copy, so only lump-sized features catch it, never the crossing rims
  const B = blur(blur(D, W, H, 1, 2), W, H, W, 2), n = R.length;
  p.each(X0 + 1, Y0 + 1, X1 + 1, Y1 + 1, (lx, ly, sx, sy) => {
    const cx = Math.floor(lx) - X0, cy = Math.floor(ly) - Y0;
    if (cx < 1 || cy < 1 || cx >= W - 1 || cy >= H - 1) return;
    const i = cy * W + cx, d = D[i];
    if (d < 0.05 || (clip && !clip(lx, ly))) return;
    const a = Math.min(max, Math.ceil((1 - Math.exp(-d * dens)) * 6) / 6);
    if (a < 0.15) return;
    const gy = B[i + W] - B[i - W], gx = B[i + 1] - B[i - 1], up = clamp(0.5 + Math.atan((gy * 0.9 + gx * 0.35) / (B[i] * 0.16 + 0.03)) * 0.42 * lit);
    const w = F[i] / d, j = clamp(Math.round((L[i] / d) * (0.3 + 0.7 * up) * (n - 1) + 0.25 + w * 1.5), 0, n - 1);
    p.blendPx(sx, sy, w > 0.03 ? mix(R[j], WR[j], Math.min(0.9, Math.ceil(w * 10) / 10)) : R[j], a);
  });
}

/**
 * Simulated smoke for one-shots, drawn with cloud(): add({ x, y, vx, vy, r0, r1, life, a, b, warm, drag, rise,
 * grow, curl, delay }). Puffs push out, slow (drag, 1/s), lift (rise, px/s²), sway, swell from r0 to r1, thin away
 * and darken as they age; warm (fire light) fades fast; curl (rad/s) keeps turning a puff's heading, so a chain of
 * them hooks round into a curl. puffs() gives the live list for cloud().
 */
class Smoke {
  constructor(rng) {
    this.R = rng;
    this.list = [];
    this.t = 0;
  }
  add(q) {
    this.list.push({ vx: 0, vy: 0, drag: 2.5, rise: 12, grow: 2, curl: 0, a: 0.6, b: 0.85, warm: 0, delay: 0, age: 0, seed: this.R.next() * 100, ...q });
  }
  get count() {
    return this.list.length;
  }
  update(dt) {
    this.t += dt;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const q = this.list[i];
      if (q.delay > 0) {
        q.delay -= dt;
        continue;
      }
      if ((q.age += dt) >= q.life) {
        this.list.splice(i, 1);
        continue;
      }
      if (q.curl) {
        const c = Math.cos(q.curl * dt), s = Math.sin(q.curl * dt), vx = q.vx;
        q.vx = vx * c - q.vy * s;
        q.vy = vx * s + q.vy * c;
      }
      q.vy -= q.rise * dt;
      q.vx += Math.sin(this.t * 1.3 + q.seed) * 8 * dt;
      q.vx -= q.vx * q.drag * dt;
      q.vy -= q.vy * q.drag * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
  }
  puffs() {
    const out = [];
    for (const q of this.list) {
      if (q.delay > 0) continue;
      const k = q.age / q.life;
      out.push({ x: q.x, y: q.y, r: q.r0 + (q.r1 - q.r0) * (1 - Math.exp(-q.grow * q.age)), a: q.a * Math.min(1, q.age * 30) * Math.pow(1 - k, 1.3), b: q.b * (1 - k * 0.5), w: q.warm * Math.exp(-q.age * 5) });
    }
    return out;
  }
}

// a box blur of radius r along one axis of a w x h field (step 1 for rows, w for columns)
function blur(src, w, h, step, r) {
  const out = new Float32Array(src.length), n = step === 1 ? w : h, lines = step === 1 ? h : w, k = 1 / (2 * r + 1);
  for (let l = 0; l < lines; l++) {
    const base = step === 1 ? l * w : l;
    let acc = 0;
    for (let j = -r; j <= r; j++) acc += j >= 0 && j < n ? src[base + j * step] : 0;
    for (let j = 0; j < n; j++) {
      out[base + j * step] = acc * k;
      const a = j - r, b = j + r + 1;
      if (a >= 0) acc -= src[base + a * step];
      if (b < n) acc += src[base + b * step];
    }
  }
  return out;
}

/**
 * A spark: a two-tone streak stretched along its screen velocity, its head cooling down S (hot, warm, cool,
 * tail colors) as k (life left, 1..0) falls, with a point of light.
 */
function spark(p, x, y, vx, vy, k, S, glow = 0.45, stretch = 0.022, max = 9) {
  const sp = Math.hypot(vx, vy) || 1, ux = vx / sp, uy = vy / sp, len = Math.min(max, 1 + sp * stretch);
  const head = k > 0.6 ? S[0] : k > 0.3 ? S[1] : S[2];
  p.line(x - ux * len, y - uy * len, x - ux * len * 0.4, y - uy * len * 0.4, k > 0.5 ? head : S[3]);
  p.line(x - ux * len * 0.45, y - uy * len * 0.45, x, y, head);
  p.glow(x, y, 3, head, glow * k);
}

/**
 * The lobes of one muzzle flash, drawn from rng r: a fat fireball at the muzzle, a spike forward, and a burst of
 * rays round it, longest forward, shortest blown back, each side on its own (diagonals, crossways, back),
 * so every shot is a different spiky star. Frame f 2 is the same shape cooled, shorter and thinner; the same r
 * sequence gives the same shape, so a shot keeps its shape across its frames.
 */
function flashShape(r, f, { size = 1, spike = [12, 20], diag = [5, 10], cross = [3, 6], back = [2, 4.5], core = 0.7 } = {}) {
  const k = f === 1 ? 1 : 0.6, w = f === 1 ? 1 : 0.72, S = size;
  const L = [
    { off: 0.5, a: r.range(-0.08, 0.08), len: r.range(5.5, 8) * S * k, wid: r.range(2.1, 2.6) * S * w, core: 0.5 * core },
    { off: 2, a: r.range(-0.07, 0.07), len: r.range(spike[0], spike[1]) * S * k, wid: r.range(1, 1.3) * S * w, core: 0.35 * core },
  ];
  const ray = (a, len, wid, on) => on && L.push({ off: r.range(0.5, 2), a, len: len * S * k, wid: wid * S * w, core: 0.25 * core });
  for (const s of [-1, 1]) {
    ray(s * r.range(0.3, 0.8), r.range(diag[0], diag[1]), r.range(1.1, 1.5), r.chance(0.85));
    ray(s * r.range(1.15, 1.7), r.range(cross[0], cross[1]), r.range(1, 1.3), r.chance(0.6));
    ray(s * r.range(2, 2.7), r.range(back[0], back[1]), 1, r.chance(0.7) && f === 1);
  }
  return L;
}
const profile = (l, u) => {
  const k = u / l.len;
  return l.wid * Math.pow(Math.max(0, 1 - k), 0.8) * Math.min(1, 0.45 + k * 3);
};

/**
 * Draw flash lobes L at (x, y) pointing along angle a: a white (or hot) core, a hot inner flame, a body and
 * a ragged rim, chosen by how deep a pixel sits inside its lobe. C: [core, inner, body, rim]. seed varies the
 * ragged edge. Returns the flash's reach.
 */
function flash(p, x, y, a, L, C, seed) {
  const c = Math.cos(a), s = Math.sin(a);
  let ext = 2;
  for (const l of L) ext = Math.max(ext, l.off + l.len + 2);
  p.shade(x - ext, y - ext, x + ext, y + ext, (px, py) => {
    const dx = px - x, dy = py - y, along = dx * c + dy * s, across = -dx * s + dy * c;
    let m = -9, hot = false, warm = false;
    for (const l of L) {
      const ca = Math.cos(l.a), sa = Math.sin(l.a), lu = (along - l.off) * ca + across * sa, lv = -(along - l.off) * sa + across * ca;
      if (lu < -1.5 || lu > l.len + 1) continue;
      const r = profile(l, Math.max(0, lu)), mm = r - Math.abs(lv);
      if (mm > m) m = mm;
      if (lu < l.len * l.core && Math.abs(lv) <= r * 0.5) hot = true;
      if (mm > r * 0.4) warm = true;
    }
    const dm = 1.6 - Math.hypot(along - 0.5, across);
    if (dm > m) m = dm;
    if (dm > 0.6) hot = true;
    m += (rand(Math.floor(px) * 73 + Math.floor(py) * 151, seed) - 0.5) * 0.5 * Math.min(1, ext / 14);
    if (m < -0.85) return;
    return m < 0 ? C[3] : hot ? C[0] : warm ? C[1] : C[2];
  });
  return ext;
}

/**
 * A brass casing thrown from (x, y) at (vx, vy) with spin va, falling under g onto a floor at y = floor:
 * it bounces (keeping `bounce` of its speed) until it's too slow, then slides to a stop. Closed form, so a
 * loop can draw it at any age. Returns { x, y, a (angle), rest, hit (seconds since the last bounce, or -1) }.
 */
function casing(x, y, vx, vy, va, age, g, floor, bounce = 0.42, a0 = 0) {
  let t0 = 0, a = a0, hit = -1;
  for (let n = 0; n < 6; n++) {
    // time to reach the floor from (x, y) moving (vx, vy)
    const d = floor - y, T = (-vy + Math.sqrt(Math.max(0, vy * vy + 2 * g * d))) / g;
    if (age - t0 < T) {
      const u = age - t0;
      return { x: x + vx * u, y: y + vy * u + 0.5 * g * u * u, a: a + va * u, rest: false, hit };
    }
    x += vx * T;
    a += va * T;
    t0 += T;
    hit = age - t0;
    const vin = vy + g * T;
    y = floor;
    if (vin * bounce < 45) {
      // too slow to hop again: slide to a stop, settling flat
      const u = age - t0, k = 7, s = (1 - Math.exp(-k * u)) / k;
      return { x: x + vx * 0.6 * s, y: floor, a: Math.round(a / Math.PI) * Math.PI, rest: true, hit };
    }
    vy = -vin * bounce;
    vx *= 0.55;
    va *= 0.6;
  }
  return { x, y: floor, a: Math.round(a / Math.PI) * Math.PI, rest: true, hit };
}

/** Draw a casing: a 3 px brass slug turned by its angle, lit on one end; a glint when it has just hit. */
function drawCasing(p, k, B, fade = 1) {
  const ca = Math.cos(k.a), sa = Math.sin(k.a), x = k.x, y = k.y - 0.5;
  p.dot(x - ca, y - sa, B[1], fade);
  p.dot(x, y, B[2], fade);
  p.dot(x + ca, y + sa, B[3], fade);
  if (k.hit >= 0 && k.hit < 0.07) {
    p.px(x + ca * 0.5, y - 1, WHITE);
    p.glow(x, y, 5, B[3], 0.55 * (1 - k.hit / 0.07));
  }
}

/**
 * A little sprite (rows of characters, pal mapping them to colors, "." empty) turned by ang about its pivot
 * (px, py in sprite pixels) placed at (x, y), sampled nearest-pixel so it stays hard-edged at any angle.
 */
function turnSprite(p, rows, pal, x, y, ang, px, py, a = 1) {
  const H = rows.length, W = rows[0].length, cs = Math.cos(ang), sn = Math.sin(ang), R = Math.hypot(Math.max(px, W - px), Math.max(py, H - py)) + 1;
  p.shade(x - R, y - R, x + R, y + R, (lx, ly, out) => {
    const dx = lx - x, dy = ly - y, i = Math.floor(dx * cs + dy * sn + px), j = Math.floor(-dx * sn + dy * cs + py);
    if (i < 0 || j < 0 || i >= W || j >= H) return;
    const c = pal[rows[j][i]];
    if (!c) return;
    out.c = c;
    out.a = a;
  });
}

/**
 * A pixel shape from a builder: build(set) calls set(px, py, ch) for every interior pixel; an outline ('o')
 * is added round it. Returns { rows, x0, y0 } ready for p.sprite at (x0, y0).
 */
function pixelShape(x0, y0, w, h, build) {
  const g = Array.from({ length: h }, () => Array(w).fill("."));
  const set = (px, py, ch) => {
    const i = px - x0, j = py - y0;
    if (i >= 0 && j >= 0 && i < w && j < h) g[j][i] = ch;
  };
  build(set);
  const solid = (i, j) => i >= 0 && j >= 0 && i < w && j < h && g[j][i] !== "." && g[j][i] !== "o";
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++)
      if (g[j][i] === "." && (solid(i - 1, j) || solid(i + 1, j) || solid(i, j - 1) || solid(i, j + 1))) g[j][i] = "o";
  return { rows: g.map((r) => r.join("")), x0, y0 };
}


};
  __defs["fx/projectiles/arrow.js"] = function (__e) {
__x(__e, "draw", () => draw);
__x(__e, "meta", () => meta);
const { fit, rand, sparkle, mix, hex, TAU, WHITE } = __req("core/index.js");
const { beat } = __req("fx/projectiles/_lib.js");

const meta = {
  name: "Arrow",
  desc: "An arrow in flight: a steel broadhead catching the light, a wooden shaft, fletching fluttering in the wind, streaks of air peeling off its head and swirling off its feathers.",
  tags: ["projectile", "arrow", "bow", "medieval", "directional", "loop"],
  size: [112, 32],
  origin: [92, 16],
  duration: 0.6,
  loop: true,
  fps: 30,
  bg: "sky",
  options: {
    palette: ["#7a1f2c", "#b8323c", "#e8e2d6", "#ffffff"],
    wood: ["#3a2414", "#6e4422", "#a8723c", "#d8a868"],
    steel: ["#2e3648", "#5a6680", "#9aa6ba", "#dfe7f2"],
    wind: "#b8c8e8",
    seed: 3,
  },
};

// the arrow, nose right, tip at (0, 0): fletching (three poses for the flutter), shaft, binding, broadhead
const HEAD = ["..LL....", "..sLLL..", "bbsSSSSW", "..dDDD..", "..DD...."];
const FLETCH = [
  ["AAa.........", ".aAAa.......", "..aaAAa.....", "nkkkkkkkkkkk", "..cCCc......", ".cCCc.......", "CCc........."],
  [".AAa........", "..aAAa......", "..aaAAAa....", "nkkkkkkkkkkk", "..cCCCc.....", "..cCCc......", ".CCc........"],
  ["AAAa........", "aAAa........", ".aaAAa......", "nkkkkkkkkkkk", "..ccCc......", "cCCc........", "CCc........."],
];

function draw(p, t, o) {
  const PL = fit(o.palette, 4), W = fit(o.wood, 4), ST = fit(o.steel, 4), wind = hex(o.wind), S = o.seed, D = meta.duration;
  const fr = Math.floor(t * 30 + 1e-6), ph = t / D, left = -meta.origin[0] + 2, LEN = 36;

  // streaks of air peeling off the head and the fletching, stretching back and thinning
  beat(t, D, 9, S, (r) => r.range(0.14, 0.26), (age, life, r) => {
    const k = age / life, top = r.chance(0.5) ? -1 : 1, from = r.chance(0.6) ? -3 : -LEN + 6;
    const x0 = from - age * r.range(160, 240), len = r.range(8, 16) * (0.5 + k), y = 0.5 + top * (r.range(3, 5) + k * r.range(1, 2.5));
    if (x0 - len < left) return;
    const c = k < 0.4 ? wind : mix(wind, hex("#2a2540"), (k - 0.4) * 1.2);
    p.line(x0, y, x0 - len, y, (u) => (u < 0.25 && k < 0.4 ? mix(wind, WHITE, 0.5) : c), (u) => (u < 0.65 ? 1 : (1 - u) / 0.35));
  });
  // little eddies spinning off the feathers
  beat(t, D, 6, S + 3, (r) => r.range(0.15, 0.25), (age, life, r) => {
    const k = age / life, cx = -LEN - 2 - age * r.range(100, 150), cy = 0.5 + r.sign() * r.range(2, 4), a = age * 30 + r.range(0, TAU), rr = 1.2 + k * 1.5;
    if (cx < left + 4) return;
    for (let i = 0; i < 4; i++) p.dot(cx + Math.cos(a + i * 0.5) * rr, cy + Math.sin(a + i * 0.5) * rr, wind, (1 - k) * (1 - i * 0.2));
  });

  // the shaft with a lit top line
  p.line(-LEN + 11, 0, -7, 0, W[2]);
  for (let x = -LEN + 14; x < -8; x += 6) p.px(x, 0, W[3]);
  // the fletching flutters through its poses, faster than the frame rate can quite catch
  const pose = FLETCH[Math.floor(rand(fr, S) * 3)];
  p.sprite(pose, { a: PL[2], A: PL[3], c: PL[0], C: PL[1], k: W[1], n: W[0] }, -LEN, -3);
  // the binding and the broadhead: a lit upper bevel, a shaded lower one, a white point
  p.sprite(HEAD, { L: ST[3], s: ST[2], S: ST[2], d: ST[0], D: ST[1], b: W[0], W: WHITE }, -7, -2);
  // a glint runs down the blade now and then
  const g = (ph * 2) % 1;
  if (g < 0.25) sparkle(p, -5 + g * 16, -1, 1 + Math.round(2 * Math.sin((g / 0.25) * Math.PI)), WHITE, ST[3], 0.25);
}

};
  __defs["fx/projectiles/energy-disc.js"] = function (__e) {
__x(__e, "draw", () => draw);
__x(__e, "meta", () => meta);
// The tangent spark streaks are adapted from Sprite Fusion's open-source energy and impact effects
// (https://www.spritefusion.com/pixel-art-vfx/energy), MIT License, Copyright (c) 2026 Hugo Duprez.
const { fit, rng, TAU, WHITE } = __req("core/index.js");
const { beat, wake, spark } = __req("fx/projectiles/_lib.js");

const meta = {
  name: "Energy disc",
  desc: "A sawblade of crackling energy spinning flat out as it flies: hooked teeth bright on their leading edges, a white hub, spiral arms churning, sparks flung off the teeth.",
  tags: ["projectile", "disc", "saw", "energy", "sci-fi", "directional", "loop"],
  size: [120, 52],
  origin: [92, 26],
  duration: 0.5,
  loop: true,
  fps: 30,
  bg: "sky",
  options: { palette: ["#0a0f2e", "#172a78", "#2550d0", "#3f8cff", "#7cc8ff", "#c8f0ff", "#ffffff"], size: 9, teeth: 8, speed: 220, seed: 5 },
};

function draw(p, t, o) {
  const C = fit(o.palette, 7), R = o.size, N = o.teeth, V = o.speed, S = o.seed, D = meta.duration, left = -meta.origin[0] + 2;
  const rot = (TAU * 3 * t) / D, seg = TAU / N, frac = (x) => x - Math.floor(x);

  // speed lines peeling off the rim, top and bottom, stretching back and cooling
  beat(t, D, 8, S + 4, (r) => r.range(0.12, 0.22), (age, life, r) => {
    const k = age / life, side = r.chance(0.5) ? -1 : 1, x0 = -2 - age * r.range(180, 260), len = r.range(8, 16) * (0.5 + k), y = side * (R + r.range(0.5, 3));
    if (x0 - len < left) return;
    p.line(x0, y, x0 - len, y, k < 0.35 ? C[5] : k < 0.7 ? C[4] : C[3], (u) => (u < 0.65 ? 1 : (1 - u) / 0.35));
  });
  p.glowLine(-2, 0, -26, 0, 8, C[3], 0.35);

  // sparks flung off the tooth tips along the spin, then left behind in the air
  const SP = [WHITE, C[5], C[4], C[3]];
  beat(t, D, 20, S, (r) => r.range(0.12, 0.3), (age, life, r) => {
    const a = rot - r.range(0, TAU) * 0 + r.range(0, TAU), tip = R + 3.5, x0 = Math.cos(a) * tip, y0 = Math.sin(a) * tip, v = r.range(120, 230);
    const [x, y, vx, vy] = wake(x0, y0, -Math.sin(a) * v, Math.cos(a) * v, age, V * 0.6, 2.4, 60);
    if (x > left + 8 && Math.abs(y) < 23) spark(p, x, y, vx, vy, 1 - age / life, SP, 0.45, 0.014, 7);
  });

  // the disc: a white hub in a dark collar, spiral arms of energy churning, a bright rim; past the rim, hooked
  // teeth that run white on their leading faces, and a dim blur ring where the teeth have just been
  p.shade(-R - 5, -R - 5, R + 5, R + 5, (x, y) => {
    const r = Math.hypot(x, y), th = Math.atan2(y, x);
    if (r > R + 4.6) return;
    if (r <= R) {
      if (r < 1.8) return WHITE;
      if (r < 2.9) return C[1];
      if (r > R - 1.1) return C[5];
      const arm = Math.sin(3 * (th - rot * 0.5) - r * 0.85);
      return arm > 0.65 ? C[5] : arm > 0.2 ? C[4] : arm > -0.3 ? C[3] : C[2];
    }
    const ph = frac((th - rot) / seg), h = 4.2 * Math.pow(ph, 1.4);
    if (r - R < h) return ph > 0.86 ? WHITE : ph > 0.6 ? C[6] : ph > 0.35 ? C[5] : C[4];
    if (r - R < 1.6) return C[2];
  });
  // filaments of energy crackling from the hub to the rim, new every frame
  const fr = Math.floor(t * 30 + 1e-6);
  for (let j = 0; j < 3; j++) {
    const g = rng(fr, j, S), a0 = g.range(0, TAU), pts = [];
    for (let i = 0; i <= 4; i++) {
      const rr = 2.5 + ((R - 3) * i) / 4, a = a0 + i * 0.25 + (i ? g.range(-0.35, 0.35) : 0);
      pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
    }
    p.polyline(pts, j ? C[6] : WHITE);
  }
  p.ring(0, 0, R + 0.5, 1, C[6]);
  // light: a soft pool, a hot hub, a glint riding the top of the rim
  p.glow(0, 0, 30, C[3], 0.4);
  p.glow(0, 0, 6, C[5], 0.35);
  p.glow(Math.cos(rot) * R, Math.sin(rot) * R, 5, C[6], 0.4);
}

};
  __defs["fx/projectiles/plasma-shot.js"] = function (__e) {
__x(__e, "draw", () => draw);
__x(__e, "meta", () => meta);
// The layered head, rim rays and trail light follow Sprite Fusion's open-source energy bolt and orb
// (https://www.spritefusion.com/pixel-art-vfx/energy), MIT License, Copyright (c) 2026 Hugo Duprez.
const { rng, fit, cycle, TAU, WHITE } = __req("core/index.js");
const { beat, wake, spark } = __req("fx/projectiles/_lib.js");

const meta = {
  name: "Plasma shot",
  desc: "A glowing plasma blob: hot knots churning in its core, a corona crackling over its skin, its tail necking into droplets that tear off, cool and wink out behind.",
  tags: ["projectile", "plasma", "energy", "sci-fi", "directional", "loop"],
  size: [144, 60],
  origin: [108, 30],
  duration: 0.8,
  loop: true,
  fps: 30,
  bg: "sky",
  options: {
    palette: ["#061a1c", "#0b3b34", "#0f6a4a", "#18a05a", "#3fd46a", "#8cf57e", "#d6ffc4", "#ffffff"],
    size: 6,
    speed: 200,
    seed: 3,
  },
};

function draw(p, t, o) {
  const C = fit(o.palette, 8), R = o.size, V = o.speed, S = o.seed, D = meta.duration, w = (TAU * t) / D;
  const fr = Math.floor(t * 30 + 1e-6), left = -meta.origin[0] + 2;

  // an ion streak left in the air behind it, rippling and cooling in steps
  const T0 = -R * 3.2, tail = (x) => Math.sin(x * 0.2 + w * 2) * (0.3 + ((T0 - x) / 44) * 1.8);
  for (let x = T0; x > T0 - 44; x -= 1) {
    const u = (T0 - x) / 44, y = tail(x);
    p.dot(x, y, u < 0.2 ? C[6] : u < 0.45 ? C[5] : C[4], u < 0.55 ? 1 : (1 - u) / 0.45);
    if (u < 0.3) p.px(x, y + 1, u < 0.15 ? C[5] : C[4]);
  }

  // the blob as a field of balls: a body, three hot knots churning round inside it at their own speeds, a wagging
  // tail, and droplets that cling to the tail's end until the air tears them off (the skin necks as they part)
  const balls = [{ x: 0, y: 0, r: R, h: 1, core: 0.8 }];
  for (let i = 0; i < 3; i++) {
    const a = w * [2, -3, 5][i] + (i * TAU) / 3, d = R * (0.5 + 0.1 * Math.sin(w * 3 + i * 2));
    balls.push({ x: Math.cos(a) * d - 0.4, y: Math.sin(a) * d * 0.8, r: R * 0.32, h: 1, core: 1 });
  }
  // the tail: thick and hot where it leaves the body, tapering and cooling to a point, its axis still glowing
  for (let i = 1; i <= 6; i++) {
    const x = -R * (0.5 + i * 0.42), wag = Math.sin(w * 2 - i * 0.9) * (0.3 + i * 0.28), r = R * (0.62 - i * 0.08);
    balls.push({ x, y: wag, r, h: 0.96 - i * 0.05, core: Math.sqrt((5.2 - i * 0.65) * 0.3) / r });
  }
  const drops = [];
  cycle(t, D, 11, S, (r) => r.range(0.34, 0.5), (age, life, r) => {
    const k = age / life, pull = r.range(450, 800), x = -R * 2.9 - 0.5 * pull * age * age - r.range(0, 16) * age;
    const y = Math.sin(w * 2 - 5.4 + age * 12) * 2 + r.range(-30, 30) * age * (0.4 + age);
    const rad = R * r.range(0.3, 0.48) * (1 - k * 0.6);
    drops.push({ x, y, r: rad, h: 0.97 * (1 - k * 0.75), core: Math.sqrt(Math.max(0, 1 - k * 1.3) * 7 * 0.3) / rad, k });
  });
  const all = balls.concat(drops);
  // the skin comes from a compact field (so the tail tapers and droplets neck cleanly as they part); the hot
  // bands inside come only from the body and its churning knots: a deep rim, the body, a bright inner, a pale
  // core, white where the knots run hottest
  p.shade(-R * 2.6 - 60, -R * 2 - 8, R * 1.6, R * 2 + 8, (x, y) => {
    let f = 0, heat = 0, hh = 0;
    for (const b of all) {
      const dx = x - b.x, dy = y - b.y, d2 = dx * dx + dy * dy, q = d2 / (4 * b.r * b.r);
      if (q < 1) {
        const c = ((1 - q) * (1 - q)) / 0.5625;
        f += c;
        heat += c * b.h;
      }
      if (b.core) hh += (b.core * b.core * b.r * b.r) / (d2 + 0.3);
    }
    if (f < 1) return;
    const lvl = hh > 10 ? 7 : hh > 4.6 ? 6 : hh > 2.2 ? 5 : f > 1.4 ? 4 : 3, cap = Math.round(2 + (heat / f) * 5.4);
    return C[Math.max(2, Math.min(x > R * 0.3 && lvl < 5 ? lvl + 1 : lvl, cap))];
  });

  // the corona: jagged arcs leaping off the skin and back, and rays flickering round the rim, new every frame
  for (let j = 0; j < 3; j++) {
    const g = rng(fr, j, S), a0 = g.range(-2.3, 2.3), span = g.range(0.45, 0.9) * g.sign(), n = 6, hgt = g.range(1.5, 3.5);
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + (span * i) / n, rr = R + 0.6 + hgt * Math.sin((Math.PI * i) / n) + (i % n ? g.range(-0.5, 0.5) : 0);
      pts.push([Math.cos(a) * rr - 0.4, Math.sin(a) * rr * 0.92]);
    }
    p.polyline(pts, j ? C[5] : C[6]);
    p.px(pts[3][0], pts[3][1], WHITE);
    p.glow(pts[3][0], pts[3][1], 6, C[5], 0.4);
  }
  for (let j = 0; j < 4; j++) {
    const g = rng(fr, j + 9, S), a = g.range(-2.2, 2.2), l = g.range(1.5, 4), r0 = R + 1;
    const x0 = Math.cos(a) * r0 - 0.4, y0 = Math.sin(a) * r0 * 0.92;
    p.line(x0, y0, x0 + Math.cos(a) * l, y0 + Math.sin(a) * l, j % 2 ? C[4] : C[5]);
  }
  // motes flung off the corona, streaking back
  const SP = [WHITE, C[6], C[5], C[3]];
  beat(t, D, 14, S + 5, (r) => r.range(0.12, 0.3), (age, life, r) => {
    const a = r.range(-2.4, 2.4), sp = r.range(60, 130), [x, y, vx, vy] = wake(Math.cos(a) * (R + 1), Math.sin(a) * (R + 1), Math.cos(a) * sp, Math.sin(a) * sp, age, V * 0.7, 4, 0);
    if (x > left + 4 && Math.abs(y) < 26) spark(p, x, y, vx, vy, 1 - age / life, SP, 0.4, 0.015, 6);
  });

  // light: a big soft pool, a hot heart that pulses with the churn, a point on every droplet
  const pulse = 0.85 + 0.15 * Math.sin(w * 4);
  p.glow(-2, 0, 34, C[3], 0.8 * pulse);
  p.glow(0, 0, 16, C[4], 0.35 * pulse);
  p.glow(1, 0, 7, C[6], 0.3 * pulse);
  p.glowLine(-R, 0, -R * 4.6, 0, 7, C[3], 0.3);
  for (const d of drops) {
    if (d.x < left + 4) continue;
    if (d.k < 0.6 && d.x < -R * 3.5) p.px(d.x, d.y, d.k < 0.3 ? C[7] : C[6]);
    p.glow(d.x, d.y, 3 + d.r * 2, C[2], 0.6 * (1 - d.k));
  }
}

};
  __defs["fx/arcane/star-fall.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
// The slanted streaks landing with a ring and a kick of bits follow Sprite Fusion's open-source rain
// (https://www.spritefusion.com/pixel-art-vfx/rain), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, Rng, PAL, fit, band, flare, sparkle, clamp, ease, TAU, WHITE } = __req("core/index.js");

const N = 11, SPREAD = 46, H = 124, SLANT = 0.38, TRAIL = 0.17;

const meta = {
  name: "Star fall",
  desc: "Stars streak down on long trails across an area, each landing with a white flash, a ring across the floor and a kick of sparks.",
  tags: ["arcane", "star", "meteor", "rain", "aoe", "magic", "ground", "one-shot"],
  size: [232, 172],
  origin: [124, 150],
  duration: 2.5,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: PAL.arcane, seed: 13 },
};

function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]] }), lights = new Lights();
  // where they land: spread over the area in a shuffled order, a little in front of or behind the line
  const xs = Array.from({ length: N }, (_, i) => -SPREAD + ((i + R.range(0.2, 0.8)) * 2 * SPREAD) / N);
  for (let i = N - 1; i > 0; i--) {
    const j = R.int(0, i);
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  const stars = xs.map((x, i) => {
    const y = R.range(-3, 2), h = H * R.range(0.85, 1);
    return { x, y, sx: x - h * SLANT, sy: y - h, t0: 0.04 + i * 0.105 + R.range(0, 0.05), T: R.range(0.3, 0.4), landed: false, big: R.chance(0.35), ph: R.range(0, TAU) };
  });
  const hits = [];
  let t = 0;
  const at = (s, tt) => {
    const q = clamp((tt - s.t0) / s.T), e = q * (0.35 + 0.65 * q);
    return [s.sx + (s.x - s.sx) * e, s.sy + (s.y - s.sy) * e, q];
  };

  function star(p, s) {
    const [x, y, q] = at(s, t);
    // the trail: a long tapered streak back up its path, white at the head, thinning into violet
    const n = 20;
    for (let k = n; k >= 1; k--) {
      const [ax, ay] = at(s, t - (k * TRAIL) / n), [bx, by] = at(s, t - ((k - 1) * TRAIL) / n), u = k / n;
      if (t - (k * TRAIL) / n < s.t0) continue;
      const c = u < 0.15 ? WHITE : u < 0.4 ? C[6] : u < 0.7 ? C[5] : C[4];
      // a second line beside the first near the head gives it body; the tail thins to a dithered thread
      if (u < (s.big ? 0.55 : 0.35)) p.line(ax + 1, ay, bx + 1, by, u < 0.2 ? C[6] : C[5], 1.1 - u * 1.4);
      p.line(ax, ay, bx, by, c, 1.3 - u);
      if (k % 3 === 0) p.glow(ax, ay, 7 * (1 - u) + 2, C[5], 0.3 * (1 - u));
    }
    // the head: a twinkling four-point star
    if (s.big) flare(p, x, y, 7 + 1.5 * Math.sin(t * 40 + s.ph), 0.8, C);
    else sparkle(p, x, y, 3.5 + Math.sin(t * 40 + s.ph), C[6], C[5], 0.6);
    p.circle(x, y, s.big ? 1.6 : 1.1, WHITE);
    p.glow(x, y, s.big ? 18 : 13, C[5], 0.6);
    p.glow(x, y, 5, WHITE, 0.35);
    return q;
  }

  function hit(p, h, far) {
    const k = (t - h.t) / 0.45;
    if (k < 0 || k >= 1) return;
    band(p, h.x, h.y, 3 + (h.big ? 22 : 16) * ease.outCubic(k), 0.26, Math.max(1, 2.5 * (1 - k)), 1.15 - k, [C[3], C[5], C[6], WHITE], (g) => Math.sin(g) < 0 === far, k < 0.2);
  }

  return {
    update(dt) {
      t += dt;
      for (const s of stars) {
        if (t < s.t0 || s.landed) continue;
        const [x, y, q] = at(s, t);
        if (R.chance(0.55)) ps.spawn(P.STAR, x + R.range(-1.5, 1.5), y + R.range(-1.5, 1.5), R.range(-12, 12), R.range(-8, 4), R.range(0.35, 0.7), R.pick([WHITE, C[6], C[5]]), R.chance(0.7) ? R.range(0.4, 0.9) : R.range(1.2, 1.8));
        if (q >= 1) {
          s.landed = true;
          hits.push({ x: s.x, y: s.y, t, big: s.big });
          lights.add(s.x, s.y - 12, s.big ? 46 : 38, C[5], 0.9, 0.32);
          lights.add(s.x, s.y - 3, 16, WHITE, 0.8, 0.08);
          for (let i = 0; i < (s.big ? 14 : 9); i++) {
            const a = -Math.PI / 2 + R.range(-1.35, 1.35), sp = R.range(50, 150);
            ps.spawn(P.SPARK, s.x, Math.min(-1, s.y - 1), Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.2, 0.5));
          }
          for (let i = 0; i < 4; i++) ps.spawn(P.STAR, s.x + R.range(-4, 4), s.y - R.range(2, 8), R.range(-15, 15), -R.range(10, 35), R.range(0.4, 0.8), R.pick([WHITE, C[6]]), R.range(0.8, 2));
        }
      }
      ps.update(dt);
      lights.update(dt);
    },
    drawBack(p) {
      // the area lit beneath while they fall
      const k = clamp(t / 0.3) * (1 - clamp((t - 1.7) / 0.7));
      if (k > 0) for (const x of [-36, 0, 36]) p.glow(x, -1, 40, C[4], 0.14 * k);
      for (const h of hits) hit(p, h, true);
      // a glowing mark where each landed, cooling away
      for (const h of hits) {
        const k2 = 1 - (t - h.t) / 0.7;
        if (k2 <= 0) continue;
        p.dot(h.x, h.y, k2 > 0.6 ? WHITE : C[6], k2 * 1.5);
        for (const dx of [-1, 1]) p.dot(h.x + dx, h.y, C[5], k2 * 1.2);
        p.glow(h.x, h.y - 1, 10, C[5], 0.35 * k2);
      }
      ps.draw(p, "back");
    },
    draw(p) {
      for (const s of stars) if (t >= s.t0 && !s.landed) star(p, s);
      for (const h of hits) {
        hit(p, h, false);
        const k = (t - h.t) / 0.22;
        if (k < 0 || k >= 1) continue;
        if (k < 0.35) p.circle(h.x, h.y - 2, 5 * (1 - k / 0.35) + 1, WHITE);
        flare(p, h.x, h.y - 2, (h.big ? 16 : 12) * Math.pow(1 - k, 1.5) + 2, 1 - k, C);
      }
      ps.draw(p, "front");
      lights.draw(p);
    },
  };
}

};
  __defs["fx/arcane/_lib.js"] = function (__e) {
__x(__e, "tone", () => tone);
__x(__e, "mote", () => mote);
__x(__e, "streak", () => streak);
__x(__e, "arc", () => arc);
__x(__e, "drawArc", () => drawArc);
__x(__e, "floorRing", () => floorRing);
__x(__e, "glyph", () => glyph);
__x(__e, "sigil", () => sigil);
__x(__e, "shades", () => shades);
__x(__e, "squeezed", () => squeezed);
__x(__e, "bayer", () => bayer);
__x(__e, "GLYPHS", () => GLYPHS);
__x(__e, "SIGILS", () => SIGILS);
// Shared by the arcane effects: a dithered light ramp, closed-form motes and streaks for loops, crackling
// arcs, floor rings and an original rune alphabet. Files starting with _ are helpers, not effects.
// The dithered ramp (tone) is adapted from Sprite Fusion's open-source black hole
// (https://www.spritefusion.com/pixel-art-vfx/black-hole), and the arc drawing from its energy
// (https://www.spritefusion.com/pixel-art-vfx/energy), MIT License, Copyright (c) 2026 Hugo Duprez.

const { scale, clamp, bolt, luma, WHITE } = __req("core/index.js");

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const CROSS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
/** The 4x4 ordered-dither threshold (0..1) of the pixel cell holding (x, y). */
const bayer = (x, y) => BAYER[((Math.floor(y) & 3) << 2) | (Math.floor(x) & 3)];

/**
 * Light intensity I (0..1) to a step of ramp R (dark to bright), dithering between neighbouring steps so a
 * gradient reads smooth at 1x; below lo it thins out through the dither and returns 0 (draw nothing).
 */
function tone(R, I, x, y, lo = 0.06, sharp = 0) {
  const b = bayer(x, y);
  if (I < lo && b > I / lo) return 0;
  const n = R.length - 1, f = clamp(I) * n;
  let i = Math.floor(f);
  // sharp (0..1) narrows the dithered zone between two steps, so broad areas stay clean and only edges dither
  const q = sharp > 0 ? clamp((f - i - 0.5) / (1 - sharp) + 0.5) : f - i;
  if (q > b) i = Math.min(n, i + 1);
  return R[i];
}

/** A drifting mote at (x, y) moving (vx, vy) px/s, drawn like the sim's MOTE: bright head, darker tail, light. */
function mote(p, x, y, vx, vy, c, size = 1, k = 1, glow = 0.4) {
  const sp = Math.hypot(vx, vy) || 1, ux = vx / sp, uy = vy / sp, len = Math.min(16, 0.5 + sp * 0.026) * size, a = k < 0.35 ? k / 0.35 : 1;
  if (len > 1.2) p.line(x - ux * len, y - uy * len, x - ux * len * 0.35, y - uy * len * 0.35, scale(c, 0.55), a);
  p.line(x - ux * len * 0.4, y - uy * len * 0.4, x, y, c, a);
  if (glow > 0) p.glow(x, y, 2.5 + size, c, glow * k);
}

/** Energy rushing in, drawn like the sim's STREAK: a white tip, a colored body, a dim dotted tail. */
function streak(p, x, y, vx, vy, c, a = 1, maxLen = 7, glow = 0.4) {
  const sp = Math.hypot(vx, vy) || 1, ux = vx / sp, uy = vy / sp, L = clamp(sp / 30, 1, maxLen);
  for (let d = L; d >= 0; d -= 0.5) p.dot(x - ux * d, y - uy * d, d < 1 ? WHITE : d < L * 0.5 ? c : scale(c, 0.6), (d < L * 0.5 ? 1 : 1.2 - d / L) * a);
  if (glow > 0) p.glow(x, y, 4, c, glow * a);
}

/**
 * A crackling arc from (x0, y0) to (x1, y1): a jagged main path plus forks, as [{ pts, w }]. r is an Rng, so
 * re-seed it every couple of frames for flicker.
 */
function arc(r, x0, y0, x1, y1, { jag = 0.3, forks = 1, forkLen = 0.5 } = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0), depth = Math.max(1, Math.min(5, Math.round(Math.log2(L / 1.5)))), main = bolt(r, x0, y0, x1, y1, { jag, depth });
  const out = [{ pts: main, w: 1 }];
  for (let k = 0; k < forks && main.length > 3; k++) {
    if (r.next() > 0.7) continue;
    const i = 1 + Math.floor(r.next() * (main.length - 2)), [x, y] = main[i], [px, py] = main[i - 1];
    const a = Math.atan2(y - py, x - px) + (r.next() < 0.5 ? -1 : 1) * (0.4 + r.next() * 0.6), l = L * forkLen * (0.4 + 0.6 * r.next()) * (1 - i / main.length);
    if (l > 1.5) out.push({ pts: bolt(r, x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, { jag: jag * 1.1, depth: Math.max(1, depth - 2) }), w: 0.55 });
  }
  return out;
}

/**
 * Draw arc paths the way Sprite Fusion draws its bolts: a dithered halo while it's fresh, a body beside the
 * core, a white core, light along the path. cols: { core, body, halo, glow }; k: 1 fresh .. 0 gone.
 */
function drawArc(p, paths, cols, k = 1, glowK = 0.5) {
  const steps = (fn) => {
    for (const path of paths)
      for (let i = 0; i < path.pts.length - 1; i++) {
        const [ax, ay] = path.pts[i], [bx, by] = path.pts[i + 1], l = Math.max(1, Math.hypot(bx - ax, by - ay));
        for (let d = 0; d <= l; d += 0.5) fn(ax + ((bx - ax) * d) / l, ay + ((by - ay) * d) / l, path, i, d === 0);
      }
  };
  if (k > 0.45) steps((x, y, path) => { if (path.w >= 1) for (const [dx, dy] of CROSS) p.dot(x + dx * 1.5, y + dy * 1.5, cols.halo, (k - 0.45) * 1.6); });
  if (k > 0.25) steps((x, y, path) => { if (path.w > 0.4) (p.dot(x + 1, y, cols.body), p.dot(x, y + 1, cols.body)); });
  steps((x, y, path, i, first) => {
    p.px(x, y, path.w >= 1 && k > 0.3 ? cols.core : cols.body);
    if (first && i % 3 === 0) p.glow(x, y, (path.w >= 1 ? 9 : 5) * (0.5 + k * 0.5), cols.glow, glowK * k * path.w);
  });
}

/**
 * A ring lying on the floor (or any tilted plane): centre (cx, cy), radius r, squashed by sy, 1 px thick at
 * any size. c and a may be functions of the angle g around it (sin(g) > 0 is the near side, towards the viewer).
 * keep(g) picks which part to draw: (g) => Math.sin(g) < 0 is the far half, for drawBack.
 */
function floorRing(p, cx, cy, r, sy, c, a = 1, keep = null) {
  if (r < 0.5) return;
  const fc = typeof c === "function", fa = typeof a === "function", ry = r * sy;
  p.shade(cx - r - 1, cy - ry - 1, cx + r + 1, cy + ry + 1, (x, y, o) => {
    const nx = (x - cx) / r, ny = (y - cy) / Math.max(0.3, ry), d = Math.hypot(nx, ny);
    if (d < 1e-6) return;
    const g = Math.hypot(nx / r, ny / Math.max(0.3, ry)) / d;
    if (Math.abs(d - 1) / g > 0.5) return;
    const ang = Math.atan2(ny, nx);
    if (keep && !keep(ang)) return;
    o.c = fc ? c(ang) : c;
    o.a = fa ? a(ang) : a;
  });
}

// An original rune alphabet: angular 3 x 5 glyphs that stay readable standing upright at 1x.
const GLYPHS = [
  [".#.", "#.#", ".#.", ".#.", "#.#"],
  ["#.#", "#.#", ".#.", "#.#", "#.#"],
  ["##.", "#.#", "##.", "#..", "#.."],
  ["#..", "#.#", "###", "#.#", "..#"],
  [".##", "#..", ".#.", "..#", "##."],
  ["###", ".#.", "###", ".#.", ".#."],
  ["#.#", "###", "#.#", "..#", "..#"],
  [".#.", ".##", ".#.", "##.", ".#."],
];

/**
 * Rune i standing on (x, y): its bottom row sits on y, centred on x. c body color, a alpha (dithered), under an
 * optional darker color drawn a pixel lower so the glyph has a little thickness.
 */
function glyph(p, i, x, y, c, a = 1, under = 0) {
  const g = GLYPHS[((i % GLYPHS.length) + GLYPHS.length) % GLYPHS.length], X = Math.round(x) - 1, Y = Math.round(y) - g.length + 1;
  if (under) p.sprite(g, {}, X, Y + 1, { tint: under, a });
  p.sprite(g, {}, X, Y, { tint: c, a });
}

// Larger original sigils, 5 x 7, for runes that fly or hover on their own.
const SIGILS = [
  ["..#..", ".#.#.", "#.#.#", "..#..", ".###.", "..#..", ".#.#."],
  ["#...#", ".#.#.", "..#..", ".###.", "..#..", ".#.#.", "#...#"],
  ["#....", "##...", "#.#..", "#..#.", "#.#..", "##...", "#...."],
  ["..#..", "#.#.#", ".###.", "..#..", "..#..", ".#.#.", "#...#"],
  ["#.#.#", "#.#.#", "#####", "..#..", "..#..", "..#..", ".###."],
  ["#...#", "##.##", "#.#.#", "#...#", "#.#.#", "##.##", "#...#"],
  ["..#..", ".#.#.", "#...#", ".#.#.", "..#..", "..#..", "..#.."],
  ["#..#.", "#.#..", "##...", "#....", "##...", "#.#..", "#..#."],
];

/** Sigil i centred on (x, y) in color c, ringed by a 1 px edge in a darker color so it reads against anything. */
function sigil(p, i, x, y, c, a = 1, edge = 0) {
  const g = SIGILS[((i % SIGILS.length) + SIGILS.length) % SIGILS.length], X = Math.round(x) - 2, Y = Math.round(y) - 3;
  if (edge) for (const [dx, dy] of CROSS) p.sprite(g, {}, X + dx, Y + dy, { tint: edge, a });
  p.sprite(g, {}, X, Y, { tint: c, a });
}

/** A character's silhouette shaded by how light each pixel is: 1 its dark outline, 2 mid, 3 light (0 empty). */
function shades(A) {
  const s = new Uint8Array(A.w * A.h);
  for (let i = 0; i < s.length; i++) if (A.mask.data[i]) s[i] = A.pixels ? (luma(A.pixels[i]) < 0.24 ? 1 : luma(A.pixels[i]) < 0.62 ? 2 : 3) : 2;
  return s;
}

/**
 * Silhouette A (an actor) squeezed to sx of its width about its middle and shifted by dx: body color on its
 * pixels, edge color on its dark outline pixels. sh is shades(A). The blink's squeeze, adapted from Sprite Fusion.
 */
function squeezed(p, A, sh, sx, body, edge, a = 1, dx = 0) {
  if (sx <= 0.02) return;
  const cx = A.x + A.w / 2, half = A.w / 2 + 1;
  for (let y = 0; y < A.h; y++)
    for (let x = Math.floor(cx - half * sx); x <= Math.ceil(cx + half * sx); x++) {
      const i = Math.round(cx + (x + 0.5 - cx) / sx - 0.5) - A.x, v = i < 0 || i >= A.w ? 0 : sh[y * A.w + i];
      if (v) p.dot(x + dx, A.y + y, v === 1 ? edge : body, a);
    }
}

};
  __defs["fx/arcane/rune-circle.js"] = function (__e) {
__x(__e, "drawBack", () => drawBack);
__x(__e, "draw", () => draw);
__x(__e, "meta", () => meta);
// The floor glow and the specks rising off it follow Sprite Fusion's open-source mana heal
// (https://www.spritefusion.com/pixel-art-vfx/heal), MIT License, Copyright (c) 2026 Hugo Duprez.
const { PAL, fit, cycle, smooth, ease, sparkle, TAU, WHITE } = __req("core/index.js");
const { floorRing, glyph, mote } = __req("fx/arcane/_lib.js");

// turning a quarter a loop keeps every part seamless: 16 ticks, a square, and 12 runes in a pattern of three
const D = 4, R = 46, RR = 39, RI = 23, RC = 7, SY = 0.3, NR = 12;

const meta = {
  name: "Rune circle",
  desc: "A rune circle turns on the floor in perspective: a carousel of runes lit by chasing light, a turning square, ticks, motes rising off it.",
  tags: ["arcane", "rune", "circle", "magic", "aura", "ground", "loop"],
  size: [136, 100],
  origin: [68, 80],
  duration: D,
  loop: true,
  fps: 30,
  bg: "ground",
  options: { palette: PAL.arcane, seed: 8 },
};

const at = (g, r) => [Math.cos(g) * r, Math.sin(g) * r * SY];
const gap = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

function circle(p, C, t, far) {
  const ph = t / D, spin = (ph * TAU) / 4, keep = far ? (g) => Math.sin(g) < 0 : (g) => Math.sin(g) >= 0;
  // two sparks of light chase round the outer ring, twice a loop
  const chase = ph * TAU * 2, lit = (g, w) => gap(g, chase) < w || gap(g, chase + Math.PI) < w;
  const tone = (g, hi, lo) => (Math.sin(g) < 0 ? lo : hi);
  floorRing(p, 0, 0, R, SY, (g) => (lit(g, 0.22) ? WHITE : lit(g, 0.5) ? C[6] : tone(g, C[6], C[5])), 1, keep);
  floorRing(p, 0, 0, RI, SY, (g) => tone(g, C[5], C[4]), 1, keep);
  floorRing(p, 0, 0, RC, SY, (g) => tone(g, C[6], C[5]), 1, keep);
  // studs set round the outside of the ring, turning with it
  for (let j = 0; j < 16; j++) {
    const g = spin + ((j + 0.5) * TAU) / 16;
    if (Math.sin(g) < 0 !== far) continue;
    const [x, y] = at(g, R + 3.5), hot = lit(g, 0.3);
    p.px(x, y, hot ? WHITE : tone(g, j % 2 ? C[5] : C[6], C[4]));
    if (j % 2 === 0) for (const [dx, dy] of [[1, 0], [-1, 0]]) p.px(x + dx, y + dy, hot ? C[6] : tone(g, C[4], C[3]));
  }
  // a square turning the other way inside the inner ring, its corners touching it
  const pts = [0, 1, 2, 3].map((k) => at(-spin + (k * TAU) / 4 + Math.PI / 4, RI));
  for (let k = 0; k < 4; k++) {
    let [ax, ay] = pts[k], [bx, by] = pts[(k + 1) % 4];
    if ((ay < 0) !== (by < 0)) {
      const u = ay / (ay - by), mx = ax + (bx - ax) * u;
      if ((ay < 0) === far) (bx = mx), (by = 0);
      else (ax = mx), (ay = 0);
    } else if ((ay < 0) !== far) continue;
    p.line(ax, ay, bx, by, far ? C[4] : C[5]);
  }
  // the runes stand in the band, riding round; bright at the front, dim behind, flaring as the light passes
  const gs = [...Array(NR).keys()].map((k) => [k, spin + ((k + 0.5) * TAU) / NR]).filter(([, g]) => Math.sin(g) < 0 === far);
  gs.sort((a, b) => Math.sin(a[1]) - Math.sin(b[1]));
  for (const [k, g] of gs) {
    const [x, y] = at(g, RR), hot = lit(g, 0.2), bob = Math.sin(ph * TAU * 4 + 4 * g) * 0.5;
    glyph(p, [0, 3, 5][k % 3], x, y - 1 + bob, hot ? WHITE : far ? C[5] : C[6], 1, hot ? C[5] : far ? C[2] : C[3]);
    p.glow(x, y - 3, hot ? 10 : 6, C[5], hot ? 0.5 : far ? 0.12 : 0.22);
    p.glow(x, y, 5, C[4], 0.15);
  }
}

// motes rising off the circle on a slow helix round its axis, swaying in; twinkles hanging over it
function motes(p, C, t, S, far) {
  cycle(t, D, 76, S * 5 + 1, (g) => g.range(1.1, 1.9), (age, life, r) => {
    const g0 = r.range(0, TAU), r0 = r.pick([R, R, RR, RR, RI]), q = age / life, g = g0 + q * r.range(0.6, 1.4);
    if (Math.sin(g) < 0 !== far) return;
    const rr = r0 * (1 - 0.35 * q), h = 2 + ease.outQuad(q) * r.range(26, 52), x = Math.cos(g) * rr, y = Math.sin(g) * rr * SY - h;
    const a = Math.min(1, q * 5) * (1 - smooth(0.65, 1, q)), big = r.chance(0.2);
    mote(p, x, y, -Math.sin(g) * rr * 0.8, -36 * (1 - q) - 10, r.chance(0.3) ? WHITE : r.chance(0.6) ? C[6] : C[5], big ? 1.1 : r.range(0.55, 0.9), a, big ? 0.5 : 0.3);
  });
  cycle(t, D, 14, S * 5 + 2, 0.45, (age, life, r) => {
    const g = r.range(0, TAU);
    if (Math.sin(g) < 0 !== far) return;
    const rr = r.range(8, R), x = Math.cos(g) * rr, y = Math.sin(g) * rr * SY - r.range(6, 34), k = Math.sin((age / life) * Math.PI);
    sparkle(p, x, y, 1 + 2.4 * k, C[6], C[5], 0.35 * k);
  });
}

function drawBack(p, t, o) {
  const C = fit(o.palette, 8), pulse = 0.85 + 0.15 * Math.sin((t / D) * TAU * 4);
  // the floor glows under the circle, and a soft light stands over it
  p.glow(0, 0, R * 1.4, C[4], 0.24 * pulse);
  for (const s of [-1, 1]) p.glow(s * R * 0.55, 1, R * 0.7, C[5], 0.12 * pulse);
  // a soft column of light standing over it, fading as it rises
  for (let h = 0; h < 66; h += 6) p.glow(0, -h, 26, C[4], 0.11 * pulse * (1 - h / 80));
  circle(p, C, t, true);
  motes(p, C, t, o.seed, true);
}

function draw(p, t, o) {
  const C = fit(o.palette, 8), chase = (t / D) * TAU * 2;
  circle(p, C, t, false);
  motes(p, C, t, o.seed, false);
  // the two sparks of light running round the ring
  for (const g of [chase, chase + Math.PI]) {
    const [x, y] = at(g, R);
    sparkle(p, x, y, 2.5 + Math.sin(t * 30) * 0.8, C[6], C[5], 0.5);
    p.glow(x, y, 14, C[5], 0.4);
  }
}

};
  __defs["fx/shadow/_lib.js"] = function (__e) {
__x(__e, "unlight", () => unlight);
__x(__e, "ringFast", () => ringFast);
__x(__e, "ringLight", () => ringLight);
__x(__e, "halo", () => halo);
__x(__e, "blackStar", () => blackStar);
__x(__e, "inStar", () => inStar);
__x(__e, "attract", () => attract);
__x(__e, "Puffs", () => Puffs);
__x(__e, "shard", () => shard);
__x(__e, "Drops", () => Drops);
__x(__e, "floorPool", () => floorPool);
__x(__e, "VOID", () => VOID);
__x(__e, "PK", () => PK);
// The flame puff (after sim.js's FIRE) and the swirling pull (attract) are adapted from Sprite Fusion's
// open-source black-hole (https://www.spritefusion.com/pixel-art-vfx/black-hole),
// MIT License, Copyright (c) 2026 Hugo Duprez.
//
// Shared bits for the shadow effects (files starting with _ are helpers, not effects): the void palette,
// light that black shapes cut, smoke lit from one side, violet flame, obsidian slivers, ink drops.

const { hex, mix, ramp, clamp, noise, WHITE, GRAVITY } = __req("core/index.js");

/** Dark magic, dark to bright: void black, deep violet, a white-lilac edge. */
const VOID = ["#06040b", "#150c26", "#2a1150", "#461a84", "#6f2cc0", "#9d5cec", "#cfa6ff", "#f6eaff"];

/**
 * Take the light back off every pixel in a local box where dark(x, y) is true, keeping a share keep (0..1):
 * call it last, so black shapes stay black under every glow, spark and ring drawn before.
 */
function unlight(p, x0, y0, x1, y1, dark, keep = 0) {
  const L = p.L, w = p.w, ox = p.ox, oy = p.oy;
  p.each(x0, y0, x1, y1, (x, y, sx, sy) => {
    if (!dark(x, y)) return;
    const i = (sy - oy) * w + (sx - ox), d = L[i];
    if (!d) return;
    if (keep <= 0) L[i] = 0;
    else L[i] = (255 << 24) | ((((d >>> 16) & 255) * keep) << 16) | ((((d >>> 8) & 255) * keep) << 8) | ((d & 255) * keep);
  });
}

// the pixel cells of the annulus r0 <= d < r1 round (x, y), row by row, jumping the hole: fn(cx, cy, d)
function annulus(x, y, r0, r1, fn) {
  const r02 = r0 > 0 ? r0 * r0 : -1, r12 = r1 * r1;
  for (let py = Math.floor(y - r1); py <= Math.ceil(y + r1); py++) {
    const cy = py + 0.5, dy = cy - y, dy2 = dy * dy;
    if (dy2 >= r12) continue;
    const xo = Math.sqrt(r12 - dy2), xi = dy2 < r02 ? Math.sqrt(r02 - dy2) : 0;
    for (let px = Math.floor(x - xo), x1 = Math.ceil(x + xo); px <= x1; px++) {
      const cx = px + 0.5, dx = cx - x;
      if (xi > 0 && dx > -xi && dx < xi) {
        px = Math.max(px, Math.floor(x + xi) - 1);
        continue;
      }
      const d2 = dx * dx + dy2;
      if (d2 < r12 && d2 >= r02) fn(cx, cy, Math.sqrt(d2));
    }
  }
}

/**
 * A ring from radius r - w out to r round (x, y), like p.ring (c and a may be functions of v: 0 inner to 1
 * outer, and angle) but visiting only the band's own pixels, so a big thin shock ring stays cheap.
 */
function ringFast(p, x, y, r, w, c, a = 1) {
  if (r <= 0) return;
  const r0 = Math.max(0, r - w), fc = typeof c === "function", fa = typeof a === "function";
  annulus(x, y, r0, r, (cx, cy, d) => {
    const v = (d - r0) / (r - r0 || 1), ang = fc || fa ? Math.atan2(cy - y, cx - x) : 0;
    p.dot(cx, cy, fc ? c(v, ang) : c, fa ? a(v, ang) : a);
  });
}

/** Light hugging a circle of radius R at (x, y), falling off over w either side, only where keep(x, y). */
function ringLight(p, x, y, R, w, c, k, keep = null) {
  if (w < 1 || k <= 0.004) return;
  const col = hex(c);
  annulus(x, y, Math.max(0, R - w), R + w, (cx, cy, d) => {
    if (keep && !keep(cx, cy)) return;
    const f = 1 - Math.abs(d - R) / w;
    p.light(cx, cy, col, f * f * k);
  });
}

/** A ring of light hugging a black disc: k at radius r0, falling to nothing at r1, and none inside r0. */
function halo(p, x, y, r0, r1, c, k) {
  if (r1 <= r0 || k <= 0.004) return;
  const col = hex(c), w = r1 - r0;
  annulus(x, y, Math.max(0, r0), r1, (cx, cy, d) => {
    const f = 1 - (d - r0) / w;
    p.light(cx, cy, col, f * f * k);
  });
}

/**
 * A black star rasterized once: four long arms (L) and four short ones, turned rot, at (0, cy), its cells
 * in a grid. { at(x, y) } says if a local point is black; draw(p, c, rim, skip) fills it and burns a rim on
 * the cells just outside it (except where skip(x, y)). The arms keep a 1 px black spine to their tips.
 */
function blackStar(cy, L, rot, short = 0.46, q = 0.32) {
  const R0 = Math.ceil(L) + 2, n = R0 * 2 + 1, data = new Uint8Array(n * n);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const x = i - R0 + 0.5, y = cy + j - R0 + 0.5;
      if (inStar(x, y, 0, cy, L, rot, q) || inStar(x, y, 0, cy, L * short, rot + Math.PI / 4, q)) data[j * n + i] = 1;
    }
  for (let a = 0; a < 4; a++)
    for (let d = 0, ca = Math.cos(rot + (a * Math.PI) / 2), sa = Math.sin(rot + (a * Math.PI) / 2); d < L - 1; d += 0.5) {
      const i = Math.floor(ca * d) + R0, j = Math.floor(sa * d) + R0;
      data[j * n + i] = 1;
    }
  const at = (x, y) => {
    const i = Math.floor(x) + R0, j = Math.floor(y - cy) + R0;
    return i >= 0 && j >= 0 && i < n && j < n && data[j * n + i] === 1;
  };
  return {
    R0,
    at,
    /** take the light off its black cells (call last, like unlight) */
    unlight(p) {
      const Lb = p.L, w = p.w, h = p.h, ox = p.ox, oy = p.oy;
      for (let j = 0; j < n; j++)
        for (let i = 0; i < n; i++) {
          if (!data[j * n + i]) continue;
          const x = i - R0 + 0.5, y = cy + j - R0 + 0.5, sx = p.cellX(x, y) - ox, sy = p.cellY(x, y) - oy;
          if (sx >= 0 && sy >= 0 && sx < w && sy < h) Lb[sy * w + sx] = 0;
        }
    },
    draw(p, c, rim, skip) {
      for (let j = 0; j < n; j++)
        for (let i = 0; i < n; i++) {
          const x = i - R0 + 0.5, y = cy + j - R0 + 0.5;
          if (data[j * n + i]) p.px(x, y, c);
          else if (rim && !skip(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) p.px(x, y, rim);
        }
    },
  };
}

/** Is (x, y) inside a four-point star at (cx, cy), arms L long, turned rot? q < 1 hollows the sides into thin spikes. */
function inStar(x, y, cx, cy, L, rot, q = 0.42) {
  if (L <= 0) return false;
  const c = Math.cos(rot), s = Math.sin(rot), dx = x - cx, dy = y - cy;
  const u = Math.abs(dx * c + dy * s) / L, v = Math.abs(-dx * s + dy * c) / L;
  // inside needs the smaller of u, v under 0.5^(1/q): most points fail that before any pow
  return u < 1 && v < 1 && Math.min(u, v) <= Math.pow(0.5, 1 / q) && Math.pow(u, q) + Math.pow(v, q) <= 1;
}

/**
 * Pull particles (anything with x, y, vx, vy) toward (x, y): gravity softened at r0, a swirl round it, drag
 * that grows inside reach. Those that reach r0 are eaten (removed); returns how many. w(q) weighs each one
 * (0 leaves it alone).
 */
function attract(list, x, y, G, reach, swirl, r0, dt, w = () => 1, vmax = Infinity) {
  let eaten = 0;
  for (let i = list.length - 1; i >= 0; i--) {
    const q = list[i], wt = w(q);
    if (!wt || q.delay > 0) continue;
    const dx = x - q.x, dy = y - q.y, d2 = dx * dx + dy * dy;
    if (d2 > reach * reach) continue;
    const d = Math.sqrt(d2) || 1;
    if (d < r0) {
      list.splice(i, 1);
      eaten++;
      continue;
    }
    const a = (G / (d2 + r0 * r0)) * Math.min(1, (reach - d) / (reach * 0.25)) * wt * dt, ux = dx / d, uy = dy / d;
    q.vx += (ux - uy * swirl) * a;
    q.vy += (uy + ux * swirl) * a;
    const drag = Math.min(0.2, (1 - d / reach) * 1.6 * dt);
    q.vx -= q.vx * drag;
    q.vy -= q.vy * drag;
    const v = Math.hypot(q.vx, q.vy);
    if (v > vmax) (q.vx *= vmax / v), (q.vy *= vmax / v);
  }
  return eaten;
}

/** Puff kinds: FLAME (a ball of flame cooling down a ramp), SOOT (dark smoke lit on the side facing a light). */
const PK = { FLAME: 0, SOOT: 1 };

/**
 * Violet flame and dark smoke. opts: { rng, flame: ramp white-hot to burnt out, soot: [fresh, old] smoke
 * colours, cap: the soot's dim lit top, rim: [hot, warm, dim] colours of its lit side, floor: (x) => y }.
 * spawn(kind, x, y, vx, vy, life, size, delay, smokes): smokes turns a dying flame into soot.
 * draw(p, kind, light): light = { x, y, k, reach } is what the soot's rims face (k 0 leaves them dark).
 */
class Puffs {
  constructor(o) {
    this.R = o.rng;
    this.list = [];
    this.t = 0;
    this.F = ramp(o.flame);
    this.soot = ramp(o.soot);
    this.cap = hex(o.cap);
    this.rim = ramp(o.rim);
    this.floor = o.floor ?? null;
  }
  spawn(k, x, y, vx, vy, life, size, delay = 0, smokes = false) {
    this.list.push({ k, x, y, vx, vy, life, max: life, size, delay, smokes, seed: this.R.next() * 100 });
  }
  get count() {
    return this.list.length;
  }
  update(dt) {
    this.t += dt;
    const t = this.t;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const q = this.list[i];
      if (q.delay > 0) {
        q.delay -= dt;
        continue;
      }
      if ((q.life -= dt) <= 0) {
        if (q.k === PK.FLAME && q.smokes) this.spawn(PK.SOOT, q.x, q.y - 1, q.vx * 0.5, q.vy * 0.5 - 6, this.R.range(0.9, 1.6), q.size * 1.25);
        this.list.splice(i, 1);
        continue;
      }
      if (q.k === PK.FLAME) {
        q.vy -= 95 * dt;
        q.vx += Math.sin(t * 17 + q.seed) * 30 * dt;
        q.vx -= q.vx * 5 * dt;
        q.vy -= q.vy * 3.2 * dt;
      } else {
        q.vy -= 18 * dt;
        q.vx += Math.sin(t * 1.3 + q.seed) * 8 * dt;
        q.vx -= q.vx * 1.6 * dt;
        q.vy -= q.vy * 1.3 * dt;
      }
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      // smoke rolls along the floor rather than through it
      if (this.floor && q.k === PK.SOOT) {
        const f = this.floor(q.x) - q.size * 0.6;
        if (q.y > f) (q.y = f), (q.vy = Math.min(0, q.vy)), (q.vx *= 1 - 2 * dt);
      }
    }
  }
  draw(p, kind, light = null) {
    const F = this.F, n = F.length;
    for (const q of this.list) {
      if (q.delay > 0 || q.k !== kind) continue;
      const k = q.life / q.max, age = 1 - k, x = q.x, y = q.y;
      if (q.k === PK.FLAME) {
        // a ball of flame: a darker rim, a lit core up and left, a tongue on top, a hot heart while young
        const heat = Math.min(0.999, Math.pow(age, 0.62) + (q.seed % 1) * 0.1), idx = Math.min(n - 2, Math.floor(heat * (n - 1)));
        const r = q.size * (0.55 + 0.45 * Math.min(1, age * 7)) * (1 - age * 0.55), c = F[idx];
        if (idx >= n - 3) p.disc(x, y, r, c, Math.min(1, k * 3) * 0.8);
        else {
          p.circle(x, y, r, F[Math.min(n - 1, idx + 2)]);
          p.circle(x - r * 0.16, y - r * 0.22, r * 0.78, c);
          if (r > 1.6) p.circle(x, y - r * 0.9, r * 0.42, c);
          if (idx <= 3 && r > 1.8) p.circle(x - r * 0.28, y - r * 0.34, r * 0.36, F[Math.max(0, idx - 1)]);
          if (idx < 6) p.glow(x, y, r * 2.4 + 2, c, 0.2 * k);
        }
        continue;
      }
      // soot: a soft body and a denser core, a dim cap on top, and lit from the side facing the light by two
      // discs pushed toward it (a soft wash over the near half, a brighter lip at its edge)
      const r = q.size * (0.65 + Math.min(1, age * 2.5) * 0.45 + age * 0.45);
      const a = Math.min(1, age * 10) * Math.min(1, k * 2.2) * 0.72, body = mix(this.soot[0], this.soot[1], age);
      // one pass for the body: thinner at the edge, denser in the core (two layers' worth)
      const edge = a * 0.5, core = 1 - (1 - a * 0.5) * (1 - a * 0.62);
      p.disc(x, y + r * 0.06, r, body, (d) => (d < 0.72 ? core : edge));
      const lk = light ? light.k : 0;
      if (lk < 0.5) p.disc(x - r * 0.2, y - r * 0.32, r * 0.48, this.cap, a * 0.32 * (1 - age * 0.7) * (1 - lk * 2));
      if (lk <= 0.02) continue;
      const lx = light.x - x, ly = light.y - y, dl = Math.sqrt(lx * lx + ly * ly) || 1, ux = lx / dl, uy = ly / dl;
      const lit = Math.min(1, light.k * clamp(1.3 - dl / light.reach)) * a;
      if (lit <= 0.02) continue;
      const [hot, warm, dim] = this.rim;
      p.disc(x + ux * r * 0.26, y + uy * r * 0.26, r * 0.72, dim, lit * 0.55);
      p.disc(x + ux * r * 0.5, y + uy * r * 0.5, r * 0.46, warm, lit * 0.5);
      if (r > 3) p.disc(x + ux * r * 0.68, y + uy * r * 0.68, r * 0.24, hot, lit * 0.4);
    }
  }
}

/**
 * An obsidian shard from core Bits ({ x, y, a, s, life }): a thin triangle pointing along its spin angle, a
 * dark violet body, the long edge facing the light at (lx, ly) lit (brighter with lk), the other in shadow,
 * a white glint at the tip while the light is strong. C is an 8-step palette.
 */
function shard(p, b, C, lx, ly, lk) {
  const fa = Math.min(1, b.life / 0.4), ca = Math.cos(b.a), sa = Math.sin(b.a), L = Math.max(2, b.s), W = Math.max(2, L * 0.55);
  const side = -sa * (lx - b.x) + ca * (ly - b.y) > 0 ? 1 : -1;
  const rim = lk > 0.6 ? C[6] : lk > 0.3 ? C[5] : lk > 0.08 ? C[4] : C[3], E = L / 2 + 1.5;
  p.shade(b.x - E, b.y - E, b.x + E, b.y + E, (x, y, out) => {
    const dx = x - b.x, dy = y - b.y, u = dx * ca + dy * sa, v = (-dx * sa + dy * ca) * side;
    if (u < -L / 2 - 0.4 || u > L / 2 + 0.4) return;
    const half = ((W / 2) * (L / 2 - u)) / L + 0.4;
    if (Math.abs(v) > half) return;
    out.a = fa;
    if (u > L / 2 - 1.3 && lk > 0.3) return WHITE;
    if (v > half - 1) return u > -L / 4 ? rim : C[Math.max(3, C.indexOf(rim) - 1)];
    return v < -half + 1 ? C[1] : C[2];
  });
  if (lk > 0.04) p.glow(b.x, b.y, 3 + L * 0.6, C[5], 0.2 * lk * fa);
}

/**
 * Ink drops: fly under gravity, land on the floor (y = floor(x)) and call onLand(x, y, speed).
 * add(x, y, vx, vy, size); update(dt); draw(p, body, shine) draws a dark drop with a lit top.
 */
class Drops {
  constructor(o = {}) {
    this.list = [];
    this.floor = o.floor ?? (() => 0);
    this.onLand = o.onLand ?? null;
    this.g = o.g ?? 0.8;
  }
  add(x, y, vx, vy, size = 1) {
    this.list.push({ x, y, vx, vy, size });
  }
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const d = this.list[i];
      d.vy += GRAVITY * this.g * dt;
      d.vx -= d.vx * 0.4 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      const f = this.floor(d.x);
      if (d.vy > 0 && d.y >= f) {
        this.onLand?.(d.x, f, d.vy, d.size);
        this.list.splice(i, 1);
      }
    }
  }
  draw(p, body, shine) {
    for (const d of this.list) {
      const up = d.vy < 0;
      p.px(d.x, d.y, body);
      if (d.size > 1.4) p.px(d.x, d.y + (up ? 1 : -1), body);
      p.px(d.x, d.y - (d.size > 1.4 && !up ? 1 : 0), shine);
    }
  }
}

/**
 * A dark pool opened in the floor, seen at a slant (radius rx, centred on the floor at x = 0): the far lip lit,
 * the near lip dark, ripples ({ x, t0, life, w }) running out across it, a sheen along the far side, a wet fringe.
 */
function floorPool(p, C, rx, t, ripples) {
  if (rx < 1) return;
  const ry = rx * 0.17 + 0.6;
  p.shade(-rx - 3, -ry - 2, rx + 3, ry + 2, (x, y) => {
    const dx = x / rx, dy = (y - 0.5) / ry, d = Math.sqrt(dx * dx + dy * dy);
    if (d > 1.18) return;
    if (d > 1) {
      if (dy < 0 && d < 1.09) return Math.abs(dx) < 0.55 ? C[6] : Math.abs(dx) < 0.85 ? C[5] : C[4];
      if (dy >= 0 && d < 1.09) return C[2];
      return y > -0.5 && noise(x * 0.7, 9) > 0.15 ? C[1] : undefined;
    }
    // ripples: ellipses on the slanted surface, kept about a pixel thick all the way round
    for (const r of ripples) {
      const age = t - r.t0, rr = age * 46 * r.w + 1, ex = x - r.x, ey = (y - 0.5) / 0.17, e = Math.sqrt(ex * ex + ey * ey) || 1;
      const g = Math.sqrt(ex * ex + (ey / 0.17) ** 2) / e;
      if (Math.abs(e - rr) < 0.55 * g && age < r.life) return age < r.life * 0.5 ? C[4] : C[3];
    }
    if (dy < -0.55 && dy > -0.85 && noise(x * 0.25 + t * 1.3, 4) > 0.2) return noise(x * 0.6 - t * 2, 6) > 0.55 ? C[5] : C[2];
    // the far inner wall catches the glow from below: violet just under the lip, falling to black
    if (dy < -0.35 && d > 0.72) return d > 0.9 ? C[3] : C[2];
    return d > 0.86 ? C[1] : C[0];
  });
}

};
  __defs["fx/shadow/hex-sigil.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
const { Particles, Bits, P, B, Rng, rng, fit, sparkle, clamp, smooth, ease, TAU, WHITE, mix } = __req("core/index.js");
const { VOID, Puffs, PK, ringFast } = __req("fx/shadow/_lib.js");

const meta = {
  name: "Hex sigil",
  desc: "A burning pen traces a cursed sigil in the air, its glyphs pop in one by one, then it flares white and crumbles into falling embers.",
  tags: ["shadow", "hex", "sigil", "rune", "curse", "magic", "circle", "one-shot"],
  size: [168, 128],
  origin: [84, 112],
  duration: 4.2,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 7 },
};

// the sigil's centre and radii; the beats: traced, glyphs pop, holds, flares, crumbles
const CY = -50, RO = 28, RI = 22, RC = 6, GLYPH = 1.62, FLARE = 2.6, BREAK = 2.74;

// the strokes, in the order the pen draws them, as points with the moment the pen passes each
function strokes(seed) {
  const paths = [], circle = (r, a0, n = 0) => Array.from({ length: (n || Math.ceil(r * TAU)) + 1 }, (_, i) => [Math.cos(a0 + (i / (n || Math.ceil(r * TAU))) * TAU) * r, CY + Math.sin(a0 + (i / (n || Math.ceil(r * TAU))) * TAU) * r]);
  paths.push(circle(RO, -Math.PI / 2));
  // a seven-pointed star, drawn in one stroke, three points round each time
  const star = [];
  for (let i = 0; i <= 7; i++) {
    const a = -Math.PI / 2 + ((i * 3) % 7) * (TAU / 7);
    star.push([Math.cos(a) * RI, CY + Math.sin(a) * RI]);
  }
  paths.push(star);
  paths.push(circle(RI, -Math.PI / 2));
  paths.push(circle(RC, Math.PI / 2));
  paths.push([[0, CY - 3.5], [2, CY], [0, CY + 3.5], [-2, CY], [0, CY - 3.5]]);
  // sample every half pixel, timing the pen along it: the outer circle fast, the star with more weight
  const pts = [], speeds = [420, 700, 550, 380, 300];
  let t = 0.12;
  paths.forEach((path, k) => {
    for (let i = 1; i < path.length; i++) {
      const [x0, y0] = path[i - 1], [x1, y1] = path[i], L = Math.hypot(x1 - x0, y1 - y0);
      for (let d = 0; d < L; d += 0.5) pts.push({ x: x0 + ((x1 - x0) * d) / L, y: y0 + ((y1 - y0) * d) / L, t: t + d / speeds[k] });
      t += L / speeds[k];
    }
    t += 0.04;
  });
  return { pts, end: t };
}

// seven small glyphs of our own: a spine and two or three branches on a 3x3 grid of nodes
function glyphs(seed) {
  return Array.from({ length: 7 }, (_, i) => {
    const r = rng(seed, i, 31), segs = [[[1, 0], [1, 2]]];
    for (let k = 0; k < 2 + (r.next() < 0.5 ? 1 : 0); k++) {
      const a = [r.int(0, 2), r.int(0, 2)], b = [Math.max(0, Math.min(2, a[0] + r.int(-1, 1))), Math.max(0, Math.min(2, a[1] + r.int(-1, 1)))];
      if (a[0] !== b[0] || a[1] !== b[1]) segs.push([a, b]);
    }
    const ang = -Math.PI / 2 + (i * TAU) / 7 + Math.PI / 7, rr = (RO + RI) / 2;
    return { x: Math.cos(ang) * rr, y: CY + Math.sin(ang) * rr, segs, t: GLYPH + i * 0.07 };
  });
}

function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed), floor = () => 0, S = strokes(o.seed), G = glyphs(o.seed);
  const ps = new Particles({ rng: R, ground: floor, sparks: [WHITE, C[7], C[6], C[5]] });
  const embers = new Particles({ rng: R, ground: floor, sparks: [C[7], C[6], C[5], C[4]] });
  const puffs = new Puffs({ rng: R, flame: [WHITE, C[7], C[6], C[5], C[4], C[3], C[2], C[1], C[0]], soot: [mix(C[3], C[2], 0.5), mix(C[2], C[1], 0.5)], cap: mix(C[4], C[2], 0.5), rim: [C[6], C[5], C[4]], floor });
  const bits = new Bits({ ground: floor }), lights = [];
  let t = 0, pi = 0, flared = false, broke = false;
  const pen = () => S.pts[Math.min(S.pts.length - 1, pi)];
  return {
    update(dt) {
      t += dt;
      // the pen: it spits sparks and drips burning embers as it writes
      while (pi < S.pts.length - 1 && S.pts[pi + 1].t <= t) pi++;
      if (t > 0.12 && t < S.end) {
        const q = pen();
        if (R.chance(dt * 70)) ps.spawn(P.SPARK, q.x, q.y, R.range(-70, 70), R.range(-100, 20), R.range(0.12, 0.35));
        if (R.chance(dt * 10)) embers.spawn(P.EMBER, q.x, q.y, R.range(-12, 12), R.range(5, 25), R.range(0.5, 0.9));
      }
      // power drawn into the sigil while it's written and held: streaks racing in to its heart
      if (t > 0.2 && t < FLARE - 0.05 && R.chance(dt * (8 + 14 * smooth(0.2, FLARE, t)))) {
        const a = R.range(0, TAU), D0 = R.range(40, 60), T = R.range(0.22, 0.32), v = (D0 * 3) / (Math.exp(3 * T) - 1);
        ps.spawn(P.STREAK, Math.cos(a) * D0, CY + Math.sin(a) * D0, -Math.cos(a) * v, -Math.sin(a) * v, T, R.chance(0.5) ? C[7] : C[6]);
      }
      for (const g of G)
        if (!g.popped && t >= g.t) {
          g.popped = true;
          lights.push({ x: g.x, y: g.y, r: 14, k: 0.7, life: 0.2, max: 0.2 });
          for (let i = 0; i < 4; i++) ps.spawn(P.SPARK, g.x, g.y, R.range(-60, 60), R.range(-70, 20), R.range(0.1, 0.25));
        }
      if (t >= FLARE && !flared) {
        flared = true;
        lights.push({ x: 0, y: CY, r: 96, k: 1.4, life: 0.45, max: 0.45 }, { x: 0, y: CY, r: 44, k: 1, life: 0.14, max: 0.14 });
        for (let i = 0; i < 24; i++) {
          const a = R.range(0, TAU), sp = R.range(60, 130);
          ps.spawn(P.SPARK, Math.cos(a) * 13, CY + Math.sin(a) * 13, Math.cos(a) * sp, Math.sin(a) * sp - 30, R.range(0.2, 0.45));
        }
      }
      if (t >= BREAK && !broke) {
        // it crumbles: every stroke breaks into burning fragments that tumble down and bounce
        broke = true;
        // pieces drop nearly straight at first, so the sigil's shape lingers as it falls apart
        for (let i = 0; i < S.pts.length - 1; i += 7) {
          const q = S.pts[i], n = S.pts[i + 1], a = Math.atan2(n.y - q.y, n.x - q.x);
          bits.add({ kind: B.SHARD, x: q.x, y: q.y, vx: R.range(-8, 8), vy: R.range(-12, 6), g: R.range(0.22, 0.45), drag: 0.6, bounce: 0.25, life: R.range(0.8, 1.2), a, va: R.range(-3, 3), s: R.range(2.5, 3.5), c: R.pick([C[7], C[6], C[6], C[5]]) });
          if (i % 27 === 0) embers.spawn(P.EMBER, q.x, q.y, R.range(-10, 10), -R.range(10, 40), R.range(0.6, 1.1));
        }
        for (const g of G) puffs.spawn(PK.SOOT, g.x, g.y, R.range(-6, 6), -R.range(8, 18), R.range(0.7, 1.1), R.range(3, 5));
        for (let i = 0; i < 8; i++) puffs.spawn(PK.SOOT, R.range(-20, 20), CY + R.range(-20, 20), R.range(-8, 8), -R.range(6, 16), R.range(0.8, 1.2), R.range(3, 6), R.range(0, 0.15));
      }
      for (let i = lights.length - 1; i >= 0; i--) if ((lights[i].life -= dt) <= 0) lights.splice(i, 1);
      bits.update(dt);
      ps.update(dt);
      embers.update(dt);
      puffs.update(dt);
    },
    drawBack(p) {
      puffs.draw(p, PK.SOOT, { x: 0, y: CY, k: broke ? 0.3 : 0, reach: 50 });
      const k = t < BREAK ? smooth(0.1, 0.6, t) : 1 - smooth(BREAK, BREAK + 0.6, t);
      if (k > 0) p.glow(0, CY, 52, C[4], 0.3 * k);
    },
    draw(p) {
      if (!broke) {
        // the traced lines: white where the pen just passed, cooling to violet; pulsing as it holds; white in the flare
        const hold = t > S.end ? 0.5 + 0.5 * Math.sin((t - S.end) * 9) : 0, white = t >= FLARE;
        for (const q of S.pts) {
          if (q.t > t) break;
          const age = t - q.t;
          p.px(q.x, q.y, white ? WHITE : age < 0.05 ? WHITE : age < 0.15 ? C[7] : age < 0.35 ? C[6] : hold > 0.75 ? C[6] : C[5]);
        }
        if (white) for (const q of S.pts) if (((q.x * 2) | 0) % 3 === 0) p.light(q.x, q.y, C[6], 0.5);
        // glyphs: each pops in white and settles
        for (const g of G) {
          if (t < g.t) continue;
          const age = t - g.t, col = white || age < 0.06 ? WHITE : age < 0.2 ? C[7] : hold > 0.75 ? C[7] : C[6];
          for (const [a, b] of g.segs) p.line(g.x - 2 + a[0] * 2, g.y - 2 + a[1] * 2, g.x - 2 + b[0] * 2, g.y - 2 + b[1] * 2, col);
          if (age < 0.18) ringFast(p, g.x, g.y, 2 + 4 * (age / 0.18), 1, age < 0.09 ? C[7] : C[5]);
          p.glow(g.x, g.y, 6, C[5], 0.25);
        }
        // the pen: a white-hot point with a little cross of light
        if (t > 0.12 && t < S.end + 0.05) {
          const q = pen();
          sparkle(p, q.x, q.y, 3 + Math.sin(t * 60), C[7], C[6], 0.6);
          p.glow(q.x, q.y, 16, C[6], 0.55);
        }
      }
      // the flare: a burst ring as it goes white
      const fu = (t - FLARE) / 0.35, bu = (t - FLARE) / 0.22;
      if (bu > 0 && bu < 1) sparkle(p, 0, CY, 18 * (1 - bu), C[7], C[5], 0.9 * (1 - bu));
      if (fu > 0 && fu < 1) ringFast(p, 0, CY, RO + 3 + 12 * ease.outCubic(fu), Math.max(1, 3 * (1 - fu)), fu < 0.4 ? WHITE : fu < 0.7 ? C[6] : C[4]);
      bits.draw(p);
      puffs.draw(p, PK.FLAME);
      ps.draw(p);
      embers.draw(p);
      for (const l of lights) {
        const q = l.life / l.max;
        p.glow(l.x, l.y, l.r * (0.6 + 0.4 * q), l.k > 1 ? C[5] : C[6], l.k * q * q);
      }
    },
  };
}

};
  __defs["fx/shadow/shadow-tendrils.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
const { Particles, P, Rng, fit, clamp, smooth, ease, noise, TAU, WHITE, mix } = __req("core/index.js");
const { VOID, Puffs, PK, Drops, floorPool } = __req("fx/shadow/_lib.js");

const meta = {
  name: "Shadow tendrils",
  desc: "A dark pool opens on the floor; tentacles with lit rims and hooked tips lash up out of it with a splash, writhe, and sink back as it closes.",
  tags: ["shadow", "tentacle", "tendril", "ground", "dark", "magic", "one-shot"],
  size: [208, 130],
  origin: [104, 106],
  duration: 3.2,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 3 },
};

const RX = 40, OPEN = 0.34, SHUT = 2.5, SINK = 0.5, LX = -0.6, LY = -0.8;

// a tentacle's spine at t: it rises out of the pool along its own curve, a wave writhes up it, its lean sways
// and sometimes whips, and its tip curls into a hook; points every 0.5 px with angle and half-width
function spine(T, t) {
  const e = clamp((t - T.t0) / 0.2), s1 = clamp((t - T.t1) / SINK);
  if (e <= 0 || s1 >= 1) return null;
  // it lashes up past its length and settles; going, it lifts a little, then slides back under
  const lift = 0.07 * Math.sin(Math.PI * clamp(s1 / 0.3)), down = ease.inOutCubic(clamp((s1 - 0.12) / 0.88));
  const rise = ease.outBack(e, 1.8) * (1 + lift) * (1 - down), hidden = (1 - rise) * T.L;
  const writhe = T.A * (0.25 + 0.75 * smooth(T.t0 + 0.08, T.t0 + 0.5, t));
  const hook = (0.04 + T.H * ease.outBack(clamp((t - T.t0 - 0.1) / 0.32), 2.5)) * (1 + 0.5 * s1) * (1 + 0.18 * Math.sin(t * 2.3 + T.ph));
  let lean = T.lean + 0.12 * Math.sin(t * 1.6 + T.ph);
  if (T.whip) lean += T.whip.a * Math.exp(-(((t - T.whip.t) / 0.14) ** 2));
  let th = -Math.PI / 2 + lean, x = T.x - Math.cos(th) * hidden, y = T.y - Math.sin(th) * hidden;
  const pts = [], n = Math.ceil(T.L / 0.5);
  for (let i = 0; i <= n; i++) {
    const s = i * 0.5, u = s / T.L;
    pts.push({ x, y, th, w: T.W * Math.pow(1 - u, 0.75) + 0.45, u, s });
    th += 0.5 * (writhe * Math.sin((s / T.lam) * TAU - T.om * t + T.ph) + T.curl * hook * smooth(0.58, 1, u));
    x += Math.cos(th) * 0.5;
    y += Math.sin(th) * 0.5;
  }
  return pts;
}

// a tentacle in cross-sections: a dark body with a lighter half toward the light, then the rims: bright where it
// faces the light (white where it faces it squarely), violet on the side the pool lights, suckers inside the hook
function tentacle(p, T, pts, C, t) {
  const surf = T.y;
  for (const q of pts) {
    if (q.y > surf) continue;
    const nx = -Math.sin(q.th), ny = Math.cos(q.th), ks = nx * LX + ny * LY >= 0 ? 1 : -1;
    for (let v = -q.w; v <= q.w; v += 0.5) {
      const x = q.x + nx * v, y = q.y + ny * v;
      const u = (v / q.w) * ks;
      if (y <= surf) p.px(x, y, u > 0.55 ? C[2] : u > -0.45 ? C[1] : C[0]);
    }
  }
  // a pulse of light runs up it as it lashes, then slower ones while it writhes
  const pulse = (t - T.t0) * 150, slow = (((t - T.t0) * 55) % (T.L * 1.8)) - 4;
  for (const q of pts) {
    if (q.y > surf) continue;
    const nx = -Math.sin(q.th), ny = Math.cos(q.th), f = nx * LX + ny * LY, ks = f >= 0 ? 1 : -1;
    const lit = ks * q.w, x0 = q.x + nx * lit, y0 = q.y + ny * lit, x1 = q.x - nx * lit, y1 = q.y - ny * lit;
    if (y1 <= surf) p.px(x1, y1, C[3]);
    if (y0 <= surf) p.px(x0, y0, Math.abs(f) > 0.8 && q.u > 0.15 ? C[7] : q.u > 0.85 ? C[6] : Math.abs(f) > 0.3 ? C[6] : C[5]);
    if (q.u > 0.62 && q.u < 0.93 && q.s % 3 < 0.5) p.px(q.x + nx * T.curl * q.w * 0.45, q.y + ny * T.curl * q.w * 0.45, C[4]);
    const dp = Math.min(Math.abs(q.s - pulse), Math.abs(q.s - slow) * 1.6);
    if (dp < 2.5) p.px(q.x, q.y, dp < 1 ? C[7] : C[5]);
  }
  // the tip catches the light, and light runs along it
  const tip = pts[pts.length - 1];
  if (tip.y <= surf) {
    p.px(tip.x, tip.y, WHITE);
    p.glow(tip.x, tip.y, 6, C[6], 0.25);
  }
  for (let i = 0; i < pts.length; i += 8) if (pts[i].y < surf) p.glow(pts[i].x, pts[i].y, 9, C[4], 0.1);
  const pq = pts[Math.min(pts.length - 1, Math.max(0, Math.round(pulse * 2)))];
  if (pulse < T.L && pq.y < surf) p.glow(pq.x, pq.y, 10, C[6], 0.45);
  // where it breaks the surface: a lit collar of ink
  const base = pts.find((q) => q.y <= surf);
  if (base) {
    const w = base.w + 1.5;
    p.line(base.x - w, surf, base.x + w, surf, C[5]);
    p.px(base.x - w - 1, surf + 0.5, C[3]);
    p.px(base.x + w + 1, surf + 0.5, C[3]);
  }
}

function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed), floor = () => 0;
  const DIM = [C[0], C[0], C[1], C[1], C[3], C[4], C[5], C[6]];
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[7], C[6], C[5], C[4]], haze: C[4] });
  const puffs = new Puffs({ rng: R, flame: [C[7], C[6], C[5], C[4], C[3], C[2], C[1], C[1], C[0]], soot: [mix(C[3], C[2], 0.55), mix(C[2], C[1], 0.5)], cap: mix(C[4], C[2], 0.5), rim: [C[6], C[5], C[4]], floor });
  const ripples = [], splats = [], lights = [];
  let t = 0, acc = 0;
  const rx = (tt) => RX * ease.outCubic(clamp(tt / OPEN)) * (1 - ease.inCubic(clamp((tt - SHUT) / 0.45)));
  const inPool = (x, tt) => Math.abs(x) < rx(tt) * 0.95;
  const drops = new Drops({
    onLand: (x, y, v, s) => {
      if (inPool(x, t)) ripples.push({ x, t0: t, life: 0.5, w: 0.6 });
      else splats.push({ x, t0: t, s });
    },
  });
  // seven tentacles in two rows: the back row taller and dimmer, hooks mostly curling inward
  const rows = [[-22, -2.5], [-8, -3], [7, -3], [21, -2.5], [-28, 2.5], [-1, 3], [27, 2.5]];
  const order = [3, 0, 5, 2, 4, 1, 6], last = [1, 5, 0, 6, 3, 2, 4];
  const tents = rows.map(([x, y], i) => {
    const back = y < 0, sx = Math.sign(x) || 1;
    return {
      x: x + R.range(-3, 3), y, back,
      L: back ? R.range(46, 62) : R.range(32, 46), W: back ? R.range(3.2, 4) : R.range(3.8, 4.6),
      lean: sx * (0.06 + Math.abs(x) / 120) + R.range(-0.06, 0.06), curl: R.chance(0.75) ? -sx : sx,
      lam: R.range(36, 50), om: R.range(4.5, 7) * R.sign(), ph: R.range(0, TAU), A: R.range(0.06, 0.085), H: R.range(0.15, 0.32),
      t0: 0.3 + order[i] * 0.045 + R.range(0, 0.03), t1: 1.5 + last[i] * 0.1 + R.range(0, 0.05),
      whip: R.chance(0.45) ? { t: R.range(0.9, 1.5), a: R.range(0.28, 0.45) * R.sign() } : null,
      up: false, down: false,
    };
  });

  function splash(x, y, n, power) {
    for (let i = 0; i < n; i++) drops.add(x + R.range(-2, 2), y - 1, R.range(-70, 70) * power, -R.range(90, 230) * power, R.chance(0.4) ? 2 : 1);
    ripples.push({ x, t0: t, life: 0.7, w: 1 });
    lights.push({ x, y: y - 7, r: 30, k: 0.6 * power, life: 0.25, max: 0.25 });
  }

  return {
    update(dt) {
      t += dt;
      for (const T of tents) {
        if (!T.up && t >= T.t0) {
          T.up = true;
          splash(T.x, T.y, 12, 1);
          for (let i = 0; i < 4; i++) ps.spawn(P.SPARK, T.x, T.y - 2, R.range(-80, 80), -R.range(120, 260), R.range(0.2, 0.45));
        }
        if (!T.down && t >= T.t1 + SINK * 0.8) {
          T.down = true;
          splash(T.x, T.y, 6, 0.6);
        }
        // glints run over the rims while they stand
        if (t > T.t0 + 0.2 && t < T.t1 && R.chance(dt * 1.6)) {
          const pts = spine(T, t), q = pts && pts[Math.floor(R.range(0.3, 0.95) * pts.length)];
          if (q && q.y < T.y) ps.spawn(P.STAR, q.x - Math.sin(q.th) * q.w, q.y + Math.cos(q.th) * q.w, 0, -4, R.range(0.25, 0.5), C[6], R.range(1, 2.2));
        }
      }
      // the pool breathes out wisps and motes while it's open
      const r = rx(t);
      if (r > 8 && t < SHUT - 0.4) {
        for (acc += dt * 9; acc > 1; acc--) puffs.spawn(PK.SOOT, R.range(-0.8, 0.8) * r, -R.range(1, 4), R.range(-8, 8), -R.range(14, 30), R.range(0.6, 0.85), R.range(3, 6));
        if (R.chance(dt * 16)) ps.spawn(P.MOTE, R.range(-0.8, 0.8) * r, -2, R.range(-8, 8), -R.range(30, 80), R.range(0.5, 1), R.pick([C[7], C[6], C[6], C[5]]), R.range(0.6, 1.1));
        if (R.chance(dt * 5)) ps.spawn(P.EMBER, R.range(-0.8, 0.8) * r, -3, R.range(-10, 10), -R.range(20, 45), R.range(0.6, 1), C[6]);
        if (R.chance(dt * 3)) ripples.push({ x: R.range(-0.7, 0.7) * r, t0: t, life: 0.6, w: 0.5 });
        // a violet haze hangs over the pool, lit from inside
        if (R.chance(dt * 7)) ps.spawn(P.VAPOUR, R.range(-0.7, 0.7) * r, -R.range(2, 8), R.range(-6, 6), -R.range(10, 22), R.range(0.6, 0.9), R.chance(0.5) ? C[3] : C[4], R.range(3, 6));
      }
      for (const a of [ripples, splats]) for (let i = a.length - 1; i >= 0; i--) if (t - a[i].t0 > (a[i].life ?? 0.6)) a.splice(i, 1);
      for (let i = lights.length - 1; i >= 0; i--) if ((lights[i].life -= dt) <= 0) lights.splice(i, 1);
      drops.update(dt);
      puffs.update(dt);
      ps.update(dt);
    },
    drawBack(p) {
      const r = rx(t), k = r / RX;
      floorPool(p, C, r, t, ripples);
      if (k > 0) {
        p.glow(0, -16, 86, C[4], 0.22 * k);
        p.glow(0, -8, r * 1.7 + 12, C[4], 0.32 * k * (0.9 + 0.1 * Math.sin(t * 5)));
        p.glow(0, 0, r * 1.15, C[5], 0.18 * k);
      }
      puffs.draw(p, PK.SOOT, { x: 0, y: 6, k: k, reach: 70 });
      ps.draw(p, "back");
      for (const T of tents) if (T.back) {
        const pts = spine(T, t);
        if (pts) tentacle(p, T, pts, DIM, t);
      }
    },
    draw(p) {
      for (const T of tents) if (!T.back) {
        const pts = spine(T, t);
        if (pts) tentacle(p, T, pts, C, t);
      }
      drops.draw(p, C[1], C[5]);
      for (const s of splats) {
        const a = 1 - (t - s.t0) / 0.6;
        p.dot(s.x, -0.5, C[1], a * 1.5);
        p.dot(s.x + 1, -0.5, C[2], a);
        if (s.s > 1) p.dot(s.x - 1, -0.5, C[2], a);
        p.dot(s.x, -1.5, C[5], a);
      }
      ps.draw(p, "front");
      for (const l of lights) {
        const q = l.life / l.max;
        p.glow(l.x, l.y, l.r * (0.6 + 0.4 * q), C[5], l.k * q * q);
      }
    },
  };
}

};
  __defs["fx/lightning/_lib.js"] = function (__e) {
__x(__e, "rand", () => rand);
__x(__e, "rng", () => rng);
__x(__e, "hash", () => hash);
__x(__e, "Rng", () => Rng);
__x(__e, "clamp", () => clamp);
__x(__e, "zigzag", () => zigzag);
__x(__e, "bowed", () => bowed);
__x(__e, "bend", () => bend);
__x(__e, "stroke", () => stroke);
__x(__e, "crackle", () => crackle);
__x(__e, "trace", () => trace);
__x(__e, "scorch", () => scorch);
__x(__e, "flight", () => flight);
__x(__e, "spark", () => spark);
__x(__e, "puff", () => puff);
__x(__e, "VOLT", () => VOLT);
__x(__e, "PLASMA", () => PLASMA);
__x(__e, "SOOT", () => SOOT);
__x(__e, "SOOT2", () => SOOT2);
__x(__e, "heat", () => heat);
__x(__e, "frameRng", () => frameRng);
// The bolt shape and the way a bolt is inked (a deep halo, a pale body, a white core, light along it) are
// adapted from Sprite Fusion's open-source lightning (https://www.spritefusion.com/pixel-art-vfx/lightning),
// MIT License, Copyright (c) 2026 Hugo Duprez.
//
// Shared by the lightning effects: bolts that fork and thin as they split, inked at the 2x character scale,
// thin crackles, bowed arcs, heat scorch, and trajectories for pure loops.

const { clamp, rand, rng, hash, Rng, GRAVITY, FIRE_RAMP, SMOKE_RAMP, hex, mix } = __req("core/index.js");

/** Default palette, dark to bright: deep violet shadow, electric blue, icy white. */
const VOLT = ["#120a33", "#2a1b78", "#4630c0", "#5a62f0", "#58a6ff", "#9ed8ff", "#e4f6ff", "#ffffff"];
/** Plasma sparks, head to tail: cyan that reads apart from the violet bolt. */
const PLASMA = ["#ffffff", "#c8f8ff", "#7ff3ff", "#1ab8e6"];
const SOOT = hex("#110c16"), SOOT2 = hex("#1c1522");

/**
 * A bolt from (x0, y0) to (x1, y1): midpoint displacement down to ~3 px segments (jag: how far the first
 * midpoint may swing, as a share of the length), with forks that split off along the way, each thinner (w)
 * and forking again up to two levels. Returns { paths: [{ pts: [[x, y], ...], w }] }, the trunk first.
 */
function zigzag(R, x0, y0, x1, y1, jag = 0.32, forks = 0.35, w = 1, depth = 0) {
  const out = { paths: [] }, L = Math.hypot(x1 - x0, y1 - y0);
  let pts = [[x0, y0], [x1, y1]], off = L * jag;
  while (pts.length < 2 + L / 3) {
    const nxt = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = Math.hypot(bx - ax, by - ay) || 1, o = R.range(-off, off);
      nxt.push([(ax + bx) / 2 + (-(by - ay) / l) * o, (ay + by) / 2 + ((bx - ax) / l) * o], [bx, by]);
    }
    pts = nxt;
    off *= 0.52;
  }
  out.paths.push({ pts, w });
  if (depth < 2)
    for (let i = 2; i < pts.length - 3; i++)
      if (R.chance(forks / (1 + depth) / Math.max(4, pts.length / 6))) {
        const [ax, ay] = pts[i], [bx, by] = pts[Math.min(pts.length - 1, i + 3)];
        const a = Math.atan2(by - ay, bx - ax) + R.sign() * R.range(0.35, 0.9), l = (L - (i / pts.length) * L) * R.range(0.25, 0.55);
        out.paths.push(...zigzag(R, ax, ay, ax + Math.cos(a) * l, ay + Math.sin(a) * l, jag * 1.1, forks, w * 0.55, depth + 1).paths);
      }
  return out;
}

/** A bolt bowed off the straight line by `bow` px at its middle (negative: up for a left-to-right arc). */
function bowed(R, x0, y0, x1, y1, bow, jag = 0.22, forks = 0.4) {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  const mx = (x0 + x1) / 2 + nx * bow + R.range(-2, 2), my = (y0 + y1) / 2 + ny * bow;
  const a = zigzag(R, x0, y0, mx, my, jag, forks), b = zigzag(R, mx, my, x1, y1, jag, forks);
  return { paths: [{ pts: [...a.paths[0].pts, ...b.paths[0].pts.slice(1)], w: 1 }, ...a.paths.slice(1), ...b.paths.slice(1)] };
}

/** Move every point of a bolt: fn(x, y) => [x, y]. */
function bend(b, fn) {
  return { paths: b.paths.map((q) => ({ w: q.w, pts: q.pts.map(([x, y]) => fn(x, y)) })) };
}

// ---- inking. Pixels are gathered in a grid at a level (higher wins), then drawn once each, so a fork's
// halo never covers the trunk's body and overlapping passes cost nothing extra.
const N = 1024, HALF = 512, GRID = new Uint8Array(N * N), HIT = [];
function mark(x, y, lvl) {
  const X = Math.floor(x) + HALF, Y = Math.floor(y) + HALF;
  if (X < 0 || Y < 0 || X >= N || Y >= N) return;
  const i = Y * N + X, v = GRID[i];
  if (!v) HIT.push(i);
  if (lvl > v) GRID[i] = lvl;
}
function stamp(x, y, r, lvl) {
  if (r <= 0.5) return mark(Math.round(x), Math.round(y), lvl);
  const r2 = r * r;
  for (let py = Math.floor(y - r); py <= Math.ceil(y + r); py++) {
    const dy = py + 0.5 - y;
    for (let px = Math.floor(x - r); px <= Math.ceil(x + r); px++) {
      const dx = px + 0.5 - x;
      if (dx * dx + dy * dy <= r2) mark(px, py, lvl);
    }
  }
}
/** Draw what was gathered: level n in cols[n - 1] at alpha alphas[n - 1] (dithered below 1). */
function flush(p, cols, alphas) {
  for (const i of HIT) {
    const v = GRID[i];
    GRID[i] = 0;
    const x = (i % N) - HALF, y = ((i / N) | 0) - HALF, a = alphas ? alphas[v - 1] : 1;
    if (a >= 1) p.px(x, y, cols[v - 1]);
    else if (a > 0) p.dot(x, y, cols[v - 1], a);
  }
  HIT.length = 0;
}
const walk = (pts, fn) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = Math.max(1, Math.hypot(bx - ax, by - ay));
    for (let d = 0; d <= l; d += 0.5) fn(ax + ((bx - ax) * d) / l, ay + ((by - ay) * d) / l, i);
  }
};

/**
 * A bolt at full power: a deep halo, a pale body, a white core on the trunk, light every few points. k is the
 * stroke's brightness (forks drop out below 0.5, the trunk thins below 0.6), s scales the thickness.
 * o: { hero (a white frame: the body goes white), light (glow strength), a (alpha), upTo (draw the trunk only
 * to this share of its length), core (radius of a thicker white core), minY (no glow above this y) }.
 */
function stroke(p, b, k, C, s = 1, o = {}) {
  if (k <= 0.02) return;
  const lk = o.light ?? 0.5;
  for (const q of b.paths) {
    const trunk = q.w >= 1;
    if (!trunk && k < 0.5) continue;
    const rh = (trunk ? (k > 0.6 ? 2.1 : 1.6) : 1.1) * s, rb = (trunk ? (k > 0.6 ? 1.3 : 0.8) : 0.5) * s;
    const pts = o.upTo !== undefined && trunk ? q.pts.slice(0, Math.max(2, Math.ceil(q.pts.length * o.upTo))) : q.pts;
    walk(pts, (x, y) => {
      stamp(x, y, rh, 1);
      stamp(x, y, rb, trunk ? 3 : 2);
      if (trunk && k > 0.3) o.core ? stamp(x, y, o.core, 4) : mark(x, y, 4);
    });
    for (let i = 0; i < pts.length - 1; i += 3) if (o.minY === undefined || pts[i][1] > o.minY) p.glow(pts[i][0], pts[i][1], (trunk ? 14 : 7) * s, C[4], lk * k * q.w);
  }
  const a = o.a ?? 1;
  flush(p, o.hero ? [C[3], C[6], C[7], C[7]] : [C[2], C[4], C[5], C[7]], [a, a, a, a]);
}

/**
 * A thin crackle: a 1 px core (white on the trunk while bright), a 2 px pale body, a dithered halo while k is
 * high, light along it. For short arcs that live a frame or two.
 */
function crackle(p, b, k, C, glowK = 0.5, a = 1) {
  if (k <= 0.02) return;
  for (const q of b.paths) {
    const thick = q.w >= 1;
    walk(q.pts, (x, y) => {
      if (k > 0.45 && thick) for (const [dx, dy] of CROSS) mark(x + dx * 1.5, y + dy * 1.5, 1);
      if (k > 0.25 && (thick || q.w > 0.4)) (mark(x + 1, y, 2), mark(x, y + 1, 2));
      mark(x, y, thick && k > 0.3 ? 4 : 3);
    });
    for (let i = 0; i < q.pts.length - 1; i += 3) p.glow(q.pts[i][0], q.pts[i][1], (thick ? 9 : 5) * (0.5 + k * 0.5), C[4], glowK * k * q.w);
  }
  flush(p, [C[3], C[5], C[5], C[7]], [Math.min(1, (k - 0.45) * 1.6) * a, a, a, a]);
}
const CROSS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/** A bolt's trunk as a 1 px line in one color (leaders, afterimages, cooling channels). */
function trace(p, pts, c, a = 1, from = 0, to = pts.length - 1) {
  for (let i = Math.max(0, from); i < Math.min(to, pts.length - 1); i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], c, a);
}

/**
 * Heat left on the floor: a flat ellipse, white-hot in the middle cooling through the fire ramp to soot.
 * T0 is the heat (1 fresh, 0 cold), fade takes the soot away.
 */
function scorch(p, cx, cy, rx, T0, fade = 1, ry = Math.max(2.5, rx * 0.12)) {
  if (fade <= 0) return;
  for (let y = Math.floor(cy); y <= cy + ry; y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, d = Math.sqrt(dx * dx + dy * dy);
      if (d > 1) continue;
      const n = rand(x, y, 41), T = T0 * (1.25 - d) - n * 0.35;
      if (T > 0.06) {
        const c = FIRE_RAMP[Math.min(FIRE_RAMP.length - 1, Math.floor((1 - Math.min(1, T)) * (FIRE_RAMP.length - 1)))];
        p.dot(x, y, c, fade);
        if ((x & 3) === 0) p.glow(x + 0.5, y, 6, c, 0.18 * T * fade);
      } else p.dot(x, y, d < 0.5 ? SOOT : SOOT2, (d < 0.95 - n * 0.3 ? 1 : 1 - d) * fade);
    }
}

/** A heat-ramp color for T (1 white-hot .. 0 cold), or 0 when it's cold. */
const heat = (T) => (T > 0.06 ? FIRE_RAMP[Math.min(FIRE_RAMP.length - 1, Math.floor((1 - Math.min(1, T)) * (FIRE_RAMP.length - 1)))] : 0);

/**
 * Where a spark launched at (x, y, vx, vy) is after `age` seconds, stepped like the simulation's SPARK (gravity,
 * drag, bouncing on a floor at `floor`), so pure loops get the same physics. Returns [x, y, vx, vy].
 */
function flight(x, y, vx, vy, age, { g = 0.45, drag = 2.2, floor = Infinity, bounce = 0.45 } = {}) {
  const dt = 1 / 120;
  for (let s = 0; s < age; s += dt) {
    const h = Math.min(dt, age - s);
    vy += GRAVITY * g * h;
    vx -= vx * drag * h;
    vy -= vy * drag * h;
    const ny = y + vy * h;
    x += vx * h;
    if (vy > 0 && y <= floor && ny >= floor) (vy = -vy * bounce), (vx *= 0.7), (y = floor - 0.25);
    else y = ny;
  }
  return [x, y, vx, vy];
}

/** A spark drawn the way the simulation draws one (a streak stretched by speed, a hot head, light), for pure loops. */
function spark(p, x, y, vx, vy, k, S) {
  const sp = Math.hypot(vx, vy) || 1, ux = vx / sp, uy = vy / sp, head = k > 0.6 ? S[0] : k > 0.3 ? S[1] : S[2], len = Math.min(9, 1 + sp * 0.022);
  p.line(x - ux * len, y - uy * len, x - ux * len * 0.4, y - uy * len * 0.4, k > 0.5 ? head : S[S.length - 1]);
  p.line(x - ux * len * 0.45, y - uy * len * 0.45, x, y, head);
  p.glow(x, y, 3, head, 0.45 * k);
}

/** A soft smoke puff at age u (0..1) of its life, drawn like the simulation's SMOKE, for pure loops. */
function puff(p, x, y, size, u, c) {
  const k = 1 - u, r = size * (0.65 + Math.min(1, u * 2.5) * 0.45 + u * 0.4), a = Math.min(1, u * 12) * Math.min(1, k * 2.4) * 0.58;
  if (a <= 0.01) return;
  const col = mix(c, SMOKE_RAMP[Math.min(SMOKE_RAMP.length - 1, Math.floor(u * SMOKE_RAMP.length))], u);
  p.disc(x, y, r, col, a * 0.45);
  p.disc(x + r * 0.05, y + r * 0.06, r * 0.74, col, a * 0.62);
  if (u < 0.5) p.disc(x - r * 0.22, y - r * 0.3, r * 0.5, mix(col, hex("#ffffff"), 0.12), a * 0.4 * (1 - u * 2));
}

/** A seeded generator for frame f of a loop (new shapes every frame, the same shapes every time). */
const frameRng = (seed, f, salt = 0) => rng(seed, salt, f);


};
  __defs["fx/lightning/zap-hit.js"] = function (__e) {
__x(__e, "create", () => create);
__x(__e, "meta", () => meta);
// The arc's halo-body-core inking, its flicker and the light that strobes as it dies follow Sprite Fusion's
// open-source lightning (https://www.spritefusion.com/pixel-art-vfx/lightning), MIT License, Copyright (c) 2026 Hugo Duprez.
const { Particles, Lights, P, Rng, fit, clamp, smooth, rng, TAU, WHITE, hex, mix } = __req("core/index.js");
const { VOLT, zigzag, stroke, crackle } = __req("fx/lightning/_lib.js");

const meta = {
  name: "Zap hit",
  desc: "A contact zap: an arc snaps in from the left, the hit point overloads into a knot of tiny crackling zigzags, a fern of burn marks glows outward, sparks jink away, ozone puffs.",
  tags: ["lightning", "electric", "hit", "impact", "combat", "directional", "one-shot"],
  size: [144, 112],
  origin: [76, 56],
  duration: 0.9,
  loop: false,
  fps: 30,
  bg: "dark",
  options: { palette: VOLT, seed: 3 },
};

const SNAP = 0.05, ASH = hex("#6a6680");

// the burn the current leaves on what it hit: a Lichtenberg fern, main fronds radiating, side fronds alternating
function fern(R) {
  const out = [];
  const grow = (x, y, a, len, w, d, depth) => {
    const pts = [[x, y, d]];
    let side = R.sign();
    for (let s = 0; s < len; s += 1.4) {
      a += R.range(-0.3, 0.3);
      x += Math.cos(a) * 1.4;
      y += Math.sin(a) * 1.4;
      d += 1.4;
      pts.push([x, y, d]);
      if (depth < 2 && s > 2 && R.chance(0.24)) {
        side = -side;
        grow(x, y, a + side * R.range(0.55, 1.05), (len - s) * R.range(0.3, 0.55), w * 0.6, d, depth + 1);
      }
    }
    out.push({ pts, w });
  };
  for (let i = 0; i < 6; i++) grow(0, 0, (i / 6) * TAU + R.range(-0.35, 0.35), R.range(18, 32), 1, 0, 0);
  return out;
}

function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed), ps = new Particles({ rng: R }), lights = new Lights();
  const tree = fern(R), Y0 = R.range(-14, 6);
  // sparks that jink: they fly out and jerk to a new heading every few hundredths of a second
  const kinked = Array.from({ length: 16 }, () => {
    const a = R.range(-1.2, 1.2) + (R.chance(0.7) ? 0 : Math.PI), sp = R.range(130, 250);
    return { x: 0, y: 0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: R.range(0.2, 0.36), age: -SNAP, next: R.range(0.02, 0.05), trail: [] };
  });
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit && t >= SNAP) {
        hit = true;
        lights.add(0, 0, 60, C[4], 0.7, 0.3);
        lights.add(0, 0, 14, WHITE, 0.5, 0.07);
        for (let i = 0; i < 3; i++) ps.spawn(P.SMOKE, R.range(-3, 5), R.range(-4, 2), R.range(-5, 8), -R.range(8, 16), R.range(0.55, 0.75), mix(ASH, C[4], 0.3), R.range(2.5, 3.8), R.range(0.08, 0.16));
      }
      for (const s of kinked) {
        if ((s.age += dt) < 0 || s.age >= s.life) continue;
        if ((s.next -= dt) <= 0) {
          s.next = R.range(0.025, 0.055);
          const sp = Math.hypot(s.vx, s.vy), a = Math.atan2(s.vy, s.vx) + R.sign() * R.range(0.6, 1.3);
          s.vx = Math.cos(a) * sp;
          s.vy = Math.sin(a) * sp;
          s.trail.push([s.x, s.y]);
          if (s.trail.length > 4) s.trail.shift();
        }
        s.vx -= s.vx * 3 * dt;
        s.vy -= s.vy * 3 * dt - 140 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
      ps.update(dt);
      lights.update(dt);
    },
    drawBack(p) {
      // the fern burns outward from the hit, glowing white, cooling through the palette, then fading
      if (t < SNAP) return;
      // it cools by stepping down the palette, and only the last embers dither away
      const cool = smooth(0.45, 0.85, t), fade = 1 - smooth(0.78, 0.88, t);
      for (const br of tree)
        for (let i = 1; i < br.pts.length; i++) {
          const [x0, y0] = br.pts[i - 1], [x, y, d] = br.pts[i], age = t - SNAP - d / 260;
          if (age < 0) break;
          const k = Math.exp(-age / 0.22) - cool * 0.3, c = k > 0.75 ? WHITE : k > 0.45 ? C[6] : k > 0.25 ? C[5] : k > 0.1 ? C[4] : k > -0.05 ? C[2] : C[1];
          p.line(x0, y0, x, y, c, fade);
          if (br.w >= 1 && d < 9) p.line(x0 + 1, y0, x + 1, y, k > 0.45 ? C[5] : C[2], fade);
          if ((i & 3) === 0 && k > 0) p.glow(x, y, 5, C[5], 0.35 * k * fade);
        }
      ps.draw(p, "back");
    },
    draw(p) {
      const f = Math.floor(t * 30 + 1e-4);
      // the arc snaps in from the left in two frames, holds and flickers, then lets go
      if (t < 0.32) {
        const r = rng(o.seed, 2, f), b = zigzag(r, -66, Y0, 0, 0, 0.22, 0.35), u = clamp(t / SNAP);
        const k = t < SNAP ? 1 : t < 0.2 ? (f % 2 ? 0.7 : 1) : 0.55 * (1 - (t - 0.2) / 0.12);
        stroke(p, u < 1 ? { paths: [b.paths[0]] } : b, k, C, t < SNAP + 0.034 ? 0.95 : 0.7, { upTo: u, hero: t >= SNAP && t < SNAP + 0.034 });
        if (u < 1) {
          const tp = b.paths[0].pts, [hx, hy] = tp[Math.floor(u * (tp.length - 1))];
          p.circle(hx, hy, 2, WHITE);
          p.glow(hx, hy, 14, C[5], 0.6);
        }
      }
      // the hit point overloads: a tight knot of tiny zigzags re-struck every frame round a white heart
      if (t >= SNAP && t < 0.45) {
        const a = (t - SNAP) / 0.4, r = rng(o.seed, 5, f), R0 = 8 * (1 - a * 0.6), m = Math.round(11 * (1 - a * 0.5));
        for (let i = 0; i < m; i++) {
          const ang = r.range(0, TAU), d0 = r.range(0.5, R0 * 0.5), ang2 = ang + r.range(-1.2, 1.2), d1 = r.range(R0 * 0.55, R0);
          crackle(p, zigzag(r, Math.cos(ang) * d0, Math.sin(ang) * d0, Math.cos(ang2) * d1, Math.sin(ang2) * d1, 0.5, 0), 0.75 * (1 - a) + 0.25, C, 0.25);
        }
        p.circle(0, 0, 3 * (1 - a) + 1, C[5]);
        p.circle(0, 0, 2 * (1 - a) + 0.5, WHITE);
        p.glow(0, 0, 20, C[4], 0.55 * (1 - a));
        if (t < SNAP + 0.07) p.glow(0, 0, 9, WHITE, 0.4);
      }
      // the sparks: a bright head, the zigzag behind it cooling
      for (const s of kinked) {
        if (s.age < 0 || s.age >= s.life) continue;
        const k = 1 - s.age / s.life, path = [...s.trail, [s.x, s.y]];
        for (let i = 0; i < path.length - 1; i++) p.line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1], i === path.length - 2 ? (k > 0.5 ? WHITE : C[6]) : k > 0.5 ? C[5] : C[4], 0.6 + 0.4 * (i / path.length));
        p.px(s.x, s.y, k > 0.4 ? WHITE : C[5]);
        p.glow(s.x, s.y, 4, C[5], 0.4 * k);
      }
      // the light strobes as it dies
      if (t >= SNAP) p.glow(0, 0, 40 * Math.max(0, 1 - t / 0.85), C[3], 0.45 * Math.exp(-(t - SNAP) * 5) * (f % 2 ? 0.7 : 1));
      ps.draw(p, "front");
      lights.draw(p);
    },
  };
}

};
  const fx = {}; ["melee/sword-slash","melee/uppercut","melee/spin-slash","melee/heavy-cleave","melee/hammer-smash","melee/dagger-flurry","melee/claw-swipe","melee/double-slash","melee/thrust","impacts/hit-spark","impacts/crit-hit","impacts/heavy-landing","projectiles/arrow","projectiles/energy-disc","projectiles/plasma-shot","arcane/star-fall","arcane/rune-circle","shadow/hex-sigil","shadow/shadow-tendrils","lightning/zap-hit"].forEach(k => { fx[k] = __req('fx/' + k + '.js'); });
  return { core: __req('core/index.js'), fx };
})();
