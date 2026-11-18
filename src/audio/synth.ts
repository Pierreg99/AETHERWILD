let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let volume = 0.4;

function livePage(): boolean {
  return typeof navigator === 'undefined' || navigator.webdriver !== true;
}

export function audioContext(): AudioContext | null {
  return ctx;
}

export function setVolume(value: number): void {
  volume = Math.max(0, Math.min(1, value));
  if (master) master.gain.value = volume;
}

export function ensureAudio(): AudioContext | null {
  if (!livePage() || typeof window === 'undefined') return null;
  const Ctor = window.AudioContext;
  if (!Ctor) return null;
  try {
    if (!ctx) {
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  } catch {
    ctx = null;
    master = null;
    return null;
  }
  return ctx;
}

export function masterGain(): GainNode | null {
  return master;
}

export function tone(freq: number, dur = 0.12, type: OscillatorType = 'sine', gain = 0.2): void {
  const ac = ensureAudio();
  const out = masterGain();
  if (!ac || !out || ac.state !== 'running') return;
  try {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.connect(g);
    g.connect(out);
    osc.start();
    osc.stop(ac.currentTime + dur + 0.02);
  } catch {
    return;
  }
}
