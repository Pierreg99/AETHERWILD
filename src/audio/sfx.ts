import { tone } from './synth';

export function sfxConfirm(): void {
  tone(520, 0.08, 'square', 0.08);
}

export function sfxCancel(): void {
  tone(220, 0.08, 'square', 0.06);
}

export function sfxHit(): void {
  tone(140, 0.1, 'sawtooth', 0.08);
  tone(90, 0.14, 'square', 0.05);
}

export function sfxHum(pitch: 'Low' | 'Mid' | 'High'): void {
  const freq = pitch === 'Low' ? 196 : pitch === 'Mid' ? 330 : 523;
  tone(freq, 0.22, 'triangle', 0.12);
}

export function sfxAttune(): void {
  tone(392, 0.15, 'sine', 0.1);
  tone(523, 0.2, 'sine', 0.08);
  tone(784, 0.28, 'triangle', 0.06);
}
