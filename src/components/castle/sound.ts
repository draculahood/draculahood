"use client";

/*
 * The castle's sound, made live with WebAudio (no audio files): a low organ drone through a slowly breathing filter,
 * a draught of filtered noise, and a short bat screech when the count is disturbed. Off until the visitor enters.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let on = true;
const listeners = new Set<(on: boolean) => void>();

export const soundOn = () => on;
export function onSound(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

export function startSound() {
  if (ctx) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(on ? 0.5 : 0, ctx.currentTime + 4);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 3;
    filter.connect(master);
    // A minor-ish organ chord, slightly detuned so it beats slowly.
    for (const [f, type, v] of [
      [49, "sawtooth", 0.06],
      [49.4, "sawtooth", 0.06],
      [73.4, "triangle", 0.05],
      [116.5, "sine", 0.03],
      [146.8, "sine", 0.015],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = v;
      o.connect(g);
      g.connect(filter);
      o.start();
    }
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    // Draught: brown-ish noise through a wandering band-pass.
    const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      last = (last + 0.025 * (Math.random() * 2 - 1)) / 1.025;
      d[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 640;
    band.Q.value = 0.8;
    const ng = ctx.createGain();
    ng.gain.value = 0.42;
    noise.connect(band);
    band.connect(ng);
    ng.connect(master);
    noise.start();
    const wind = ctx.createOscillator();
    wind.frequency.value = 0.09;
    const wg = ctx.createGain();
    wg.gain.value = 300;
    wind.connect(wg);
    wg.connect(band.frequency);
    wind.start();
  } catch {
    ctx = null;
  }
}

export function toggleSound() {
  on = !on;
  if (ctx && master) master.gain.linearRampToValueAtTime(on ? 0.5 : 0, ctx.currentTime + 0.6);
  listeners.forEach((fn) => fn(on));
}

/** A short falling screech, played when the count is tapped. */
export function screech() {
  if (!ctx || !master || !on) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "square";
  o.frequency.setValueAtTime(1900, t);
  o.frequency.exponentialRampToValueAtTime(380, t + 0.5);
  const trem = ctx.createOscillator();
  trem.frequency.value = 22;
  const tg = ctx.createGain();
  tg.gain.value = 140;
  trem.connect(tg);
  tg.connect(o.frequency);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.12, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  o.connect(hp);
  hp.connect(g);
  g.connect(master);
  o.start(t);
  trem.start(t);
  o.stop(t + 0.65);
  trem.stop(t + 0.65);
}
