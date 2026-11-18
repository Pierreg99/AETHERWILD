import { audioContext, ensureAudio, masterGain } from './synth';

let timer: number | null = null;
let step = 0;
let current = '';

const THEMES: Record<string, readonly number[]> = {
  title: [220, 277, 330, 277],
  field: [196, 247, 294, 247, 330, 294],
  battle: [146, 174, 196, 146, 220, 196],
  sanctum: [164, 196, 246, 196],
  attune: [261, 311, 392, 311],
};

export function playTheme(name: string): void {
  if (name === current && timer !== null) return;
  current = name;
  const ac = ensureAudio();
  if (!ac) return;
  if (timer !== null) window.clearInterval(timer);
  const motif = THEMES[name] ?? THEMES.field ?? [220];
  step = 0;
  timer = window.setInterval(() => {
    const live = audioContext();
    const out = masterGain();
    if (!live || !out || live.state !== 'running') return;
    const freq = motif[step % motif.length] ?? 220;
    step += 1;
    const osc = live.createOscillator();
    const g = live.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.03, live.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, live.currentTime + 0.4);
    osc.connect(g);
    g.connect(out);
    osc.start();
    osc.stop(live.currentTime + 0.42);
  }, 520);
}

export function stopMusic(): void {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  current = '';
}
