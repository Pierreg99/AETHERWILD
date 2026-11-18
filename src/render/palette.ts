import type { Harmonic } from '../engine/types';

/** UI colours chosen for dark panels. Text is #f4efe4 on #141a24 (well above 4.5:1). */
export const INK = '#f4efe4';
export const MUTED = '#d5dbe4';
export const PANEL = '#141a24';
export const PANEL_EDGE = '#e7c56a';
export const GOOD = '#b7f0c4';
export const BAD = '#ffb4a8';
export const NIGHT = '#07080c';

export const HARMONIC_SWATCH: Record<Harmonic, string> = {
  Cindersong: '#e07a3d',
  Brine: '#3aa7c9',
  Stratum: '#c4a36a',
  Draft: '#d7efe8',
  Gloom: '#8b7cc9',
  Biteroot: '#6fbf73',
  Rivet: '#c5ced6',
  Spark: '#f0d35a',
  Bile: '#9cbf4a',
};

export function hsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

export function biomeInk(biome: string): string {
  const table: Record<string, string> = {
    emberwake: '#3a2218',
    brinefen: '#16343d',
    slabgarden: '#3a342c',
    galebreak: '#24343a',
    duskveil: '#241c33',
    thornmere: '#1c3324',
    rivetworks: '#2c3136',
    arcfield: '#332e16',
    blightmire: '#24301c',
    ashford: '#33241c',
    saltstair: '#1c2e33',
  };
  return table[biome] ?? '#1a1e24';
}
