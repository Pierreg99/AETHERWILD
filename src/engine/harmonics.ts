import type { Harmonic, HarmonicClass } from './types';

/**
 * Ring order is a judgment call. The brief's strong/weak column uses aliases
 * that do not close into a balanced 9-set (Biteroot is named three times).
 * Each Harmonic is strong against the next two on this ring and weak against
 * the two sitting four and five steps ahead. Rows and columns both carry
 * exactly two strong and two weak marks.
 *
 * Story, reading "A scorches B":
 * Cindersong → Biteroot, Stratum
 * Biteroot → Stratum, Rivet
 * Stratum → Rivet, Brine
 * Rivet → Brine, Spark
 * Brine → Spark, Draft
 * Spark → Draft, Gloom
 * Draft → Gloom, Bile
 * Gloom → Bile, Cindersong
 * Bile → Cindersong, Biteroot
 */
export const HARMONICS: readonly Harmonic[] = [
  'Cindersong',
  'Biteroot',
  'Stratum',
  'Rivet',
  'Brine',
  'Spark',
  'Draft',
  'Gloom',
  'Bile',
] as const;

export const HARMONIC_CLASSES: readonly HarmonicClass[] = [
  'Kindling', 'Pulse', 'Guard', ...HARMONICS,
];

const INDEX: Record<Harmonic, number> = {
  Cindersong: 0,
  Biteroot: 1,
  Stratum: 2,
  Rivet: 3,
  Brine: 4,
  Spark: 5,
  Draft: 6,
  Gloom: 7,
  Bile: 8,
};

function at(i: number, delta: number): Harmonic {
  return HARMONICS[(i + delta) % HARMONICS.length] as Harmonic;
}

export interface HarmonicRelations {
  readonly strong: readonly Harmonic[];
  readonly weak: readonly Harmonic[];
}

export function relationsOf(h: Harmonic): HarmonicRelations {
  const i = INDEX[h];
  return {
    strong: [at(i, 1), at(i, 2)],
    weak: [at(i, 4), at(i, 5)],
  };
}

/** Explicit map, then the matrix is derived. Do not hand-type a 9×9 grid. */
export const HARMONIC_RELATIONS: Readonly<Record<Harmonic, HarmonicRelations>> = {
  Cindersong: relationsOf('Cindersong'),
  Biteroot: relationsOf('Biteroot'),
  Stratum: relationsOf('Stratum'),
  Rivet: relationsOf('Rivet'),
  Brine: relationsOf('Brine'),
  Spark: relationsOf('Spark'),
  Draft: relationsOf('Draft'),
  Gloom: relationsOf('Gloom'),
  Bile: relationsOf('Bile'),
};

export type MatrixCell = 0.5 | 1 | 2;

export function globalMultiplier(attack: Harmonic, defend: Harmonic): MatrixCell {
  const rel = HARMONIC_RELATIONS[attack];
  if (rel.strong.includes(defend)) return 2;
  if (rel.weak.includes(defend)) return 0.5;
  return 1;
}

export function harmonicMatrix(): MatrixCell[][] {
  return HARMONICS.map((atk) => HARMONICS.map((def) => globalMultiplier(atk, def)));
}

export interface MatrixReport {
  ok: boolean;
  errors: string[];
}

export function validateMatrix(): MatrixReport {
  const errors: string[] = [];
  const matrix = harmonicMatrix();
  for (let r = 0; r < 9; r++) {
    const row = matrix[r] ?? [];
    const strong = row.filter((c) => c === 2).length;
    const weak = row.filter((c) => c === 0.5).length;
    if (strong !== 2 || weak !== 2) {
      errors.push(`row ${HARMONICS[r]} strong=${strong} weak=${weak}`);
    }
    if (row[r] !== 1) errors.push(`self matchup for ${HARMONICS[r]}`);
  }
  for (let c = 0; c < 9; c++) {
    let strong = 0;
    let weak = 0;
    for (let r = 0; r < 9; r++) {
      const cell = matrix[r]?.[c];
      if (cell === 2) strong++;
      if (cell === 0.5) weak++;
    }
    if (strong !== 2 || weak !== 2) {
      errors.push(`col ${HARMONICS[c]} strong=${strong} weak=${weak}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

export function isHarmonicClass(cls: HarmonicClass): cls is Harmonic {
  return (HARMONICS as readonly string[]).includes(cls);
}

export function isHarmonic(value: string): value is Harmonic {
  return (HARMONICS as readonly string[]).includes(value);
}
