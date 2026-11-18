import { mulberry32, type Rng } from '../engine/rng';
import type { Harmonic } from '../engine/types';

/** One syllable each. Nothing here is a dictionary word longer than 4 letters. */
export const SYLLABLES: readonly string[] = [
  'brin', 'tal', 'mor', 'vesh', 'kal', 'oru', 'dray', 'lum', 'sev', 'nixa',
  'pell', 'grav', 'tind', 'osk', 'wyn', 'ulm', 'zeph', 'myrr', 'quin', 'karu',
  'solm', 'vire', 'odel', 'nyx', 'thur',
];

export const SUFFIXES: Readonly<Record<Harmonic, readonly { text: string; syl: number }[]>> = {
  Cindersong: [{ text: 'ember', syl: 2 }, { text: 'flare', syl: 1 }, { text: 'coal', syl: 1 }],
  Brine: [{ text: 'tide', syl: 1 }, { text: 'melt', syl: 1 }, { text: 'drown', syl: 1 }],
  Stratum: [{ text: 'stone', syl: 1 }, { text: 'crag', syl: 1 }, { text: 'slab', syl: 1 }],
  Draft: [{ text: 'wing', syl: 1 }, { text: 'gust', syl: 1 }, { text: 'veil', syl: 1 }],
  Gloom: [{ text: 'shade', syl: 1 }, { text: 'hollow', syl: 2 }, { text: 'dusk', syl: 1 }],
  Biteroot: [{ text: 'thorn', syl: 1 }, { text: 'bloom', syl: 1 }, { text: 'frond', syl: 1 }],
  Rivet: [{ text: 'bolt', syl: 1 }, { text: 'rivet', syl: 2 }, { text: 'anvil', syl: 2 }],
  Spark: [{ text: 'arc', syl: 1 }, { text: 'flick', syl: 1 }, { text: 'charge', syl: 1 }],
  Bile: [{ text: 'spore', syl: 1 }, { text: 'venom', syl: 2 }, { text: 'blight', syl: 1 }],
};

export function titleCase(word: string): string {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
}

export function blocked(name: string, list: readonly string[]): string | null {
  const hay = name.toLowerCase();
  for (const raw of list) {
    const needle = raw.trim().toLowerCase();
    if (!needle || needle.startsWith('#')) continue;
    if (hay.includes(needle)) return needle;
  }
  return null;
}

/**
 * 2–3 syllables: one or two bank syllables plus a harmonic suffix.
 * Retries until the name is unique and clear of the blocklist.
 */
export function makeName(seed: number, harmonic: Harmonic, taken: ReadonlySet<string>, list: readonly string[]): string {
  for (let salt = 0; salt < 400; salt++) {
    const rng: Rng = mulberry32((seed + salt * 997) >>> 0);
    const bankCount = 1 + rng.int(2);
    const parts: string[] = [];
    let syl = 0;
    for (let i = 0; i < bankCount; i++) {
      const bit = rng.pick(SYLLABLES);
      parts.push(bit);
      syl += 1;
    }
    const options = SUFFIXES[harmonic].filter((suffix) => syl + suffix.syl <= 3 && syl + suffix.syl >= 2);
    const suffix = rng.pick(options.length > 0 ? options : SUFFIXES[harmonic].filter((s) => s.syl === 1));
    const name = titleCase(parts.join('') + suffix.text);
    if (taken.has(name.toLowerCase())) continue;
    if (blocked(name, list)) continue;
    if (name.length < 4 || name.length > 16) continue;
    return name;
  }
  throw new Error(`name generator exhausted for ${harmonic} @ ${seed}`);
}

export const MOTIF_WORDS: readonly string[] = [
  'Lilt', 'Knell', 'Canticle', 'Reprise', 'Drone', 'Chord', 'Anthem', 'Dirge',
  'Ostinato', 'Cadenza', 'Refrain', 'Verse', 'Carol', 'Motet', 'Chant', 'Roundel',
  'Descant', 'Threnody', 'Nocturne', 'Aubade', 'Paean', 'Canon', 'Fugue', 'Aria',
  'Keen', 'Croon', 'Trill', 'Susurr', 'Toll', 'Peal', 'Chime', 'Humnote',
];

export function makeMotifName(seed: number, taken: ReadonlySet<string>, list: readonly string[]): string {
  for (let salt = 0; salt < 500; salt++) {
    const rng = mulberry32((seed + salt * 131) >>> 0);
    const name = `${titleCase(rng.pick(SYLLABLES))} ${rng.pick(MOTIF_WORDS)}`;
    if (taken.has(name.toLowerCase())) continue;
    if (blocked(name, list)) continue;
    return name;
  }
  throw new Error(`motif name exhausted @ ${seed}`);
}
