import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { HARMONICS } from '../src/engine/harmonics';
import { mulberry32 } from '../src/engine/rng';
import { blankWard } from '../src/engine/ward';
import type {
  AscensionCondition,
  Harmonic,
  HarmonicClass,
  Motif,
  MotifEffect,
  Rarity,
  ResonantSpecies,
  Stats,
} from '../src/engine/types';
import { makeMotifName, makeName } from '../src/generator/names';

const ROOT = new URL('..', import.meta.url).pathname;
const blocklist = readFileSync(new URL('../tools/ip-blocklist.txt', import.meta.url), 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

const taken = new Set<string>();
const rng = mulberry32(20261003);

function q(value: string): string {
  return JSON.stringify(value);
}

const PLANS = ['crystalline', 'colonial', 'geomorphic', 'filament', 'tidal', 'symmetric-mineral', 'laminar', 'porous', 'coiled', 'orbiting', 'lattice', 'bloom'] as const;

function buildMotifs(): Motif[] {
  const out: Motif[] = [];
  const push = (motif: Motif) => {
    if (taken.has(motif.name.toLowerCase())) throw new Error(`motif name clash ${motif.name}`);
    taken.add(motif.name.toLowerCase());
    out.push(motif);
  };
  const kindlingH: Harmonic[] = ['Cindersong', 'Brine', 'Stratum', 'Draft', 'Gloom', 'Biteroot', 'Rivet', 'Spark', 'Bile', 'Cindersong', 'Brine', 'Stratum'];
  for (let i = 0; i < 12; i++) {
    const harmonic = kindlingH[i] as Harmonic;
    push({
      id: `k${String(i + 1).padStart(2, '0')}`,
      name: makeMotifName(1000 + i, taken, blocklist),
      harmonic,
      cls: 'Kindling',
      power: 18 + (i % 4) * 3,
      accuracy: 100,
      cadenceCost: 1,
      harmony: 32 + (i % 6) * 4,
      effect: { kind: 'none' },
      description: `A soft ${harmonic} Kindling phrase used while attuning.`,
    });
  }
  const pulseEffects: MotifEffect[] = [
    { kind: 'status', status: 'Scorched', chance: 0.3 },
    { kind: 'status', status: 'Brambled', chance: 0.3 },
    { kind: 'status', status: 'Riven', chance: 0.3 },
    { kind: 'status', status: 'Dimmed', chance: 0.25 },
    { kind: 'drain', ratio: 0.5 },
    { kind: 'recoil', ratio: 0.3 },
    { kind: 'multihit', min: 2, max: 4 },
    { kind: 'stat', target: 'foe', stat: 'guard', stages: -1 },
    { kind: 'stat', target: 'self', stat: 'tempo', stages: 1 },
    { kind: 'heal', ratio: 0.35 },
  ];
  for (let i = 0; i < 18; i++) {
    const effect = pulseEffects[i % pulseEffects.length] as MotifEffect;
    const harmonic = HARMONICS[i % 9] as Harmonic;
    push({
      id: `p${String(i + 1).padStart(2, '0')}`,
      name: makeMotifName(2000 + i, taken, blocklist),
      harmonic,
      cls: 'Pulse',
      power: effect.kind === 'heal' || effect.kind === 'stat' ? 0 : 45 + (i % 5) * 6,
      accuracy: effect.kind === 'status' ? 90 : 100,
      cadenceCost: 2 + (i % 3),
      harmony: 8 + (i % 5),
      effect,
      description: `A Pulse phrase. ${effect.kind}.`,
    });
  }
  for (let i = 0; i < 14; i++) {
    const effect: MotifEffect = i % 2 === 0
      ? { kind: 'stat', target: 'self', stat: i % 4 === 0 ? 'guard' : 'edge', stages: 1 }
      : { kind: 'heal', ratio: 0.3 };
    push({
      id: `g${String(i + 1).padStart(2, '0')}`,
      name: makeMotifName(3000 + i, taken, blocklist),
      harmonic: HARMONICS[i % 9] as Harmonic,
      cls: 'Guard',
      power: 0,
      accuracy: 100,
      cadenceCost: 2,
      harmony: 12,
      effect,
      description: 'A Guard phrase that steadies the singer.',
    });
  }
  // 76 harmonic motifs: 9,9,9,9,8,8,8,8,8
  const extras = [9, 9, 9, 9, 8, 8, 8, 8, 8];
  let n = 0;
  HARMONICS.forEach((harmonic, index) => {
    const count = extras[index] ?? 8;
    for (let i = 0; i < count; i++) {
      n++;
      const effect: MotifEffect = i === 0
        ? { kind: 'status', status: (['Scorched', 'Brambled', 'Riven', 'Dimmed'] as const)[index % 4], chance: 0.2 }
        : i === 1
          ? { kind: 'stat', target: 'foe', stat: 'edge', stages: -1 }
          : { kind: 'none' };
      push({
        id: `h${String(n).padStart(2, '0')}`,
        name: makeMotifName(4000 + n, taken, blocklist),
        harmonic,
        cls: harmonic as HarmonicClass,
        power: 55 + (i % 5) * 8,
        accuracy: 95,
        cadenceCost: 2 + (i % 3),
        harmony: 6 + (i % 4),
        effect,
        description: `A ${harmonic} phrase with a clean attack line.`,
      });
    }
  });
  if (out.length !== 120) throw new Error(`motif count ${out.length}`);
  return out;
}

function statsFor(rarity: Rarity, salt: number): Stats {
  const bands: Record<Rarity, [number, number]> = {
    common: [440, 500],
    uncommon: [490, 545],
    rare: [530, 580],
    mythic: [565, 615],
  };
  const local = mulberry32(salt);
  const [lo, hi] = bands[rarity];
  const total = lo + local.int(hi - lo + 1);
  const vigor = 48 + local.int(58);
  const rest = [0, 0, 0, 0, 0];
  let left = total - vigor;
  for (let i = 0; i < 5; i++) {
    rest[i] = 28;
    left -= 28;
  }
  while (left > 0) {
    const i = local.int(5);
    rest[i] = (rest[i] ?? 28) + 1;
    left--;
  }
  return {
    vigor,
    focus: rest[0] ?? 30,
    guard: rest[1] ?? 30,
    spirit: rest[2] ?? 30,
    edge: rest[3] ?? 30,
    tempo: rest[4] ?? 30,
  };
}

function wardFor(primary: Harmonic, salt: number) {
  const local = mulberry32(salt);
  const base = { ...blankWard(0.95) };
  const keys = Object.keys(base) as Harmonic[];
  for (const key of keys) base[key] = Math.round((0.75 + local.next() * 0.35) * 100) / 100;
  base[primary] = Math.round((1.2 + local.next() * 0.25) * 100) / 100;
  const other = keys[(keys.indexOf(primary) + 3) % keys.length] as Harmonic;
  base[other] = Math.round((0.35 + local.next() * 0.25) * 100) / 100;
  return base;
}

const BIOMES: { id: string; name: string; harmonic: Harmonic | null; transition: boolean }[] = [
  { id: 'emberwake', name: 'Emberwake', harmonic: 'Cindersong', transition: false },
  { id: 'brinefen', name: 'Brinefen', harmonic: 'Brine', transition: false },
  { id: 'slabgarden', name: 'Slabgarden', harmonic: 'Stratum', transition: false },
  { id: 'galebreak', name: 'Galebreak', harmonic: 'Draft', transition: false },
  { id: 'duskveil', name: 'Duskveil', harmonic: 'Gloom', transition: false },
  { id: 'thornmere', name: 'Thornmere', harmonic: 'Biteroot', transition: false },
  { id: 'rivetworks', name: 'Rivetworks', harmonic: 'Rivet', transition: false },
  { id: 'arcfield', name: 'Arcfield', harmonic: 'Spark', transition: false },
  { id: 'blightmire', name: 'Blightmire', harmonic: 'Bile', transition: false },
  { id: 'ashford', name: 'Ashford', harmonic: null, transition: true },
  { id: 'saltstair', name: 'Saltstair', harmonic: null, transition: true },
];

const HOME: Record<Harmonic, string> = {
  Cindersong: 'emberwake',
  Brine: 'brinefen',
  Stratum: 'slabgarden',
  Draft: 'galebreak',
  Gloom: 'duskveil',
  Biteroot: 'thornmere',
  Rivet: 'rivetworks',
  Spark: 'arcfield',
  Bile: 'blightmire',
};

function conditionFor(line: number, stage: number, primary: Harmonic, home: string): AscensionCondition {
  const kind = (line + stage) % 5;
  if (kind === 0) return { kind: 'biome', biomeId: home };
  if (kind === 1) return { kind: 'motif_category', cls: 'Kindling', uses: 5 };
  if (kind === 2) return { kind: 'harmonic_affinity', harmonic: primary, wins: 8 };
  if (kind === 3) return { kind: 'bond_peak', resonance: 200 };
  return { kind: 'no_faint' };
}

function buildResonants(motifs: Motif[]): ResonantSpecies[] {
  const damaging = motifs.filter((m) => m.power > 0);
  const kindling = motifs.filter((m) => m.cls === 'Kindling');
  const out: ResonantSpecies[] = [];
  const byHarm = new Map<Harmonic, Motif[]>();
  for (const h of HARMONICS) byHarm.set(h, motifs.filter((m) => m.cls === h));

  const pushSpecies = (species: ResonantSpecies) => {
    if (taken.has(species.name.toLowerCase())) throw new Error(`name clash ${species.name}`);
    taken.add(species.name.toLowerCase());
    out.push(species);
  };

  for (let line = 0; line < 9; line++) {
    const primary = HARMONICS[line] as Harmonic;
    const secondary = HARMONICS[(line + 4) % 9] as Harmonic;
    let prev: string | null = null;
    for (let stage = 0; stage < 3; stage++) {
      const dex = line * 3 + stage + 1;
      const id = `r${String(dex).padStart(2, '0')}`;
      const rarity: Rarity = stage === 2 ? 'rare' : stage === 1 ? 'uncommon' : 'common';
      const pool = byHarm.get(primary) ?? [];
      const learn = [
        pool[stage % pool.length] ?? damaging[dex % damaging.length],
        kindling[line % kindling.length],
        damaging[(dex + 3) % damaging.length],
        pool[(stage + 2) % pool.length] ?? damaging[(dex + 5) % damaging.length],
      ];
      const ids = [...new Set(learn.map((m) => m!.id))];
      const home = HOME[primary];
      const nextId = stage < 2 ? `r${String(dex + 1).padStart(2, '0')}` : null;
      pushSpecies({
        id,
        dexNumber: dex,
        name: makeName(5000 + dex * 17, primary, taken, blocklist),
        primary,
        secondary: stage === 0 ? null : secondary,
        rarity,
        baseStats: statsFor(rarity, 8000 + dex),
        baseWard: wardFor(primary, 9000 + dex),
        catchDifficulty: 12 + stage * 18 + line,
        artSeed: 100 + dex * 13,
        learnset: ids.map((motifId, index) => ({ level: [1, 1, 12, 26][index] ?? 1, motifId })),
        ascension: nextId
          ? [{
            to: nextId,
            minLevel: stage === 0 ? 16 : 34,
            minResonance: 120,
            condition: conditionFor(line, stage, primary, home),
          }]
          : [],
        evolvesFrom: prev,
        flavor: `A ${rarity} ${primary} Resonant. Its ${PLANS[dex % PLANS.length]} body rings when the Lumenfall shifts.`,
        habitatBiomes: stage === 0 ? [home, 'ashford'] : [home],
        pitch: (['Low', 'Mid', 'High'] as const)[dex % 3],
      });
      prev = id;
    }
  }

  for (let n = 0; n < 51; n++) {
    const dex = 28 + n;
    const id = `r${String(dex).padStart(2, '0')}`;
    const primary = HARMONICS[n % 9] as Harmonic;
    const rarity: Rarity = n % 17 === 0 ? 'mythic' : n % 5 === 0 ? 'rare' : n % 2 === 0 ? 'uncommon' : 'common';
    const pool = byHarm.get(primary) ?? damaging;
    const learn = [
      pool[n % pool.length] ?? damaging[n % damaging.length],
      kindling[n % kindling.length],
      damaging[(n + 4) % damaging.length],
      pool[(n + 3) % pool.length] ?? damaging[(n + 8) % damaging.length],
    ];
    const ids = [...new Set(learn.map((m) => m!.id))];
    pushSpecies({
      id,
      dexNumber: dex,
      name: makeName(6000 + dex * 19, primary, taken, blocklist),
      primary,
      secondary: n % 3 === 0 ? null : HARMONICS[(n + 2) % 9] as Harmonic,
      rarity,
      baseStats: statsFor(rarity, 8100 + dex),
      baseWard: wardFor(primary, 9100 + dex),
      catchDifficulty: 15 + (n % 40),
      artSeed: 400 + dex * 11,
      learnset: ids.map((motifId, index) => ({ level: [1, 6, 14, 24][index] ?? 1, motifId })),
      ascension: [],
      evolvesFrom: null,
      flavor: `Recorded in the ${HOME[primary]}. The Index marks it ${rarity}.`,
      habitatBiomes: [HOME[primary], n % 2 === 0 ? 'saltstair' : 'ashford'],
      pitch: (['Low', 'Mid', 'High'] as const)[(dex + 1) % 3],
    });
  }
  if (out.length !== 78) throw new Error(`resonant count ${out.length}`);
  return out;
}

function motifLiteral(motifs: Motif[]): string {
  return `import type { Motif } from '../engine/types';\n\nexport const MOTIFS: readonly Motif[] = ${JSON.stringify(motifs, null, 2)};\n`;
}

function resonantLiteral(rows: ResonantSpecies[]): string {
  return `import type { ResonantSpecies } from '../engine/types';\n\nexport const RESONANTS: readonly ResonantSpecies[] = ${JSON.stringify(rows, null, 2)};\n`;
}

const MAPS = {
  ashfen: [
    '########################',
    '#@......n......,,,,,..>#',
    '#......####............#',
    '#..+...#..#..$..,,,,,..#',
    '#......####......A.....#',
    '#..n.....n........B....#',
    '#,,,,,,,,,,,,,,,,,,,,,,#',
    '########################',
  ],
  saltspan: [
    '########################',
    '#<....n.....~~~~..,,,,>#',
    '#..####....~~~~........#',
    '#..#V.#..$..n...C......#',
    '#..####........D.......#',
    '#......n.......E..,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,#',
    '########################',
  ],
  duskstair: [
    '########################',
    '#<..n.....F...........>#',
    '#.....####.....G.......#',
    '#..+..#..#..n..H.......#',
    '#.....#Z.#.............#',
    '#.....####.....n..*....#',
    '#,,,,,,,,,,,,,,,,,,,,,,#',
    '########################',
  ],
  hall: [
    '########################',
    '#n.n.n.n.n.n.n.n.n.n.n.#',
    '#n..n..n...............#',
    '#n.n.n.n.n.n.n.n.n.n.n.#',
    '#......................#',
    '#n.n.n.n.n.n.<.........#',
    '########################',
  ],
};

function buildWorld(species: ResonantSpecies[]) {
  const lines = species.filter((s) => s.dexNumber <= 27 && s.evolvesFrom === null).map((s) => s.id);
  const wardenHarm = HARMONICS.slice(0, 8);
  const wardens = wardenHarm.map((harmonic, i) => {
    const pool = species.filter((s) => s.primary === harmonic);
    const team = pool.slice(0, 3).map((s) => s.id);
    return {
      id: `w${i + 1}`,
      name: ['Sera Vellum', 'Orth Kite', 'Mael Quarne', 'Nim Brack', 'Ys Morrow', 'Cade Pinder', 'Lark Hexel', 'Tove Cairn'][i],
      harmonic,
      title: `${harmonic} Warden`,
      opener: pool[0]?.learnset[0]?.motifId ?? 'k01',
      team,
      levels: i === 7 ? [24, 26, 28] : [14 + i * 2, 16 + i * 2, 18 + i * 2],
    };
  });
  const primePool = species.filter((s) => s.primary === 'Bile').slice(0, 4).map((s) => s.id);
  const tokens = Array.from({ length: 30 }, (_, i) => {
    const kinds = ['heal', 'fullheal', 'clear', 'gleam', 'bond', 'key'] as const;
    const kind = kinds[i < 24 ? i % 5 : 5];
    return {
      id: `t${String(i + 1).padStart(2, '0')}`,
      name: ['Vigor Tonic', 'Chorus Salve', 'Stillwater', 'Gleam Mote', 'Bond Salt', 'Sanctum Seal', 'Cadence Bell', 'Ward Chalk', 'Lumen Shard', 'Ash Lozeng'][i % 10] + (i >= 10 ? ` ${i}` : ''),
      kind,
      price: 40 + i * 15,
      description: kind === 'heal' ? 'Restores a share of Vigor.'
        : kind === 'fullheal' ? 'Restores Vigor fully.'
          : kind === 'clear' ? 'Clears a status.'
            : kind === 'bond' ? 'Raises Resonance.'
              : kind === 'key' ? 'Opens a sealed way.'
                : 'A small traded gleam.',
    };
  });
  const npcNames = [
    'Ivo Vellum', 'Ner Kite', 'Quill Morrow', 'Hal Brack', 'Pim Quarne', 'Jori Pinder', 'Ora Hexel', 'Wes Cairn',
    'Bram Solen', 'Tamsin Vant', 'Edda Quill', 'Moss Arden', 'Saa Lumen', 'Nim Orry', 'Cade Yarrow', 'Lark Pim',
    'Ys Tove', 'Oren Vale', 'Sera Quill', 'Mael Pinder', 'Orth Cairn', 'Ner Hexel', 'Ivo Brack', 'Hal Kite',
    'Pim Morrow', 'Jori Vellum', 'Ora Quarne', 'Wes Solen', 'Bram Cairn', 'Tamsin Hexel', 'Edda Vant', 'Moss Kite',
    'Saa Brack', 'Nim Vale', 'Cade Orry', 'Lark Yarrow', 'Ys Pinder', 'Oren Hexel', 'Quill Cairn', 'Hal Solen',
  ];
  const npcs = npcNames.map((name, i) => ({
    id: `n${String(i + 1).padStart(2, '0')}`,
    name,
    lines: [
      `ui.npc.${i}.0`,
      `ui.npc.${i}.1`,
    ],
  }));
  return { lines, wardens, primePool, tokens, npcs };
}

function stringsFor(species: ResonantSpecies[], world: ReturnType<typeof buildWorld>): Record<string, string> {
  const s: Record<string, string> = {
    'ui.title': 'AETHERWILD',
    'ui.subtitle': 'Survey the song before it goes quiet',
    'ui.new': 'New survey',
    'ui.continue': 'Continue',
    'ui.settings': 'Settings',
    'ui.menu': 'Field notes',
    'ui.choir': 'Choir',
    'ui.index': 'Harmonic Index',
    'ui.tokens': 'Tokens',
    'ui.save': 'Save',
    'ui.quit': 'Title',
    'ui.back': 'Back',
    'ui.confirm': 'Confirm',
    'ui.cancel': 'Cancel',
    'ui.yes': 'Yes',
    'ui.no': 'No',
    'ui.fight': 'Motif',
    'ui.attune': 'Attune',
    'ui.flee': 'Slip away',
    'ui.switch': 'Switch',
    'ui.bag': 'Token',
    'ui.hum': 'Offer Hum',
    'ui.low': 'Low',
    'ui.mid': 'Mid',
    'ui.high': 'High',
    'ui.shop': 'Exchange',
    'ui.buy': 'Take',
    'ui.vault': 'Resonance Vault',
    'ui.deposit': 'Store',
    'ui.withdraw': 'Call',
    'ui.ascend': 'Ascend',
    'ui.export': 'Export record',
    'ui.import': 'Import record',
    'ui.reduced': 'Reduced motion',
    'ui.log': 'Phrase log always on',
    'ui.instant': 'Instant text',
    'ui.speed': 'Text speed',
    'ui.volume': 'Volume',
    'ui.choose': 'Choose a First Resonance',
    'ui.wild': 'A wild {name} is ringing.',
    'ui.win': '{name} falls quiet.',
    'ui.loss': 'Your Choir falls silent.',
    'ui.fled': 'The Resonant slips into the brush.',
    'ui.caught': '{name} joins the Choir. Resonance 70.',
    'ui.full': 'The Choir is full. {name} waits in the Vault.',
    'ui.level': '{name} reaches Choir Level {level}.',
    'ui.ascended': '{name} ascends into {next}.',
    'ui.sanctum': '{name} keeps the {harmonic} Sanctum.',
    'ui.clear': 'The Sanctum answers. The seal is yours.',
    'ui.prime': 'The Prime Voice waits at the end of the stair.',
    'ui.locked': 'Eight seals must ring before this door opens.',
    'ui.rival': 'Rival {name} steps into the path.',
    'ui.heal': 'A still pool restores the Choir.',
    'ui.empty': 'Nothing here yet.',
    'ui.corrupt': 'The record is damaged. It was kept aside. Begin a new survey?',
    'ui.readonly': 'This record is from a later survey and is read only.',
    'ui.gleams': 'Gleams',
    'ui.guard': 'Guard',
    'ui.vigor': 'Vigor',
    'ui.phrase': 'Phrase',
    'ui.spike': 'Spike',
    'ui.pitch': 'Profile',
    'ui.press': 'Z confirm  X cancel  Arrows move',
    'ui.waxing': 'Waxing',
    'ui.waning': 'Waning',
    'ui.end': 'The Conductor lowers their hands. The Index is whole enough to hold.',
    'ui.intro': 'You are an Attunement Surveyor. The Lumenfall is fracturing. Record what still sings.',
    'story.conductor': 'Silence would stop the fracture. I do not ask you to agree. I ask you to hear the cost.',
    'story.rival': 'I will climb the Choir beside you. Do not fall behind.',
  };
  world.npcs.forEach((npc, i) => {
    s[`ui.npc.${i}.0`] = `${npc.name} says the ${['Emberwake', 'Brinefen', 'Slabgarden', 'Galebreak', 'Duskveil'][i % 5]} still answers if you listen.`;
    s[`ui.npc.${i}.1`] = i % 7 === 0
      ? 'The Conductor wants quiet. I want the next Phrase.'
      : 'Ward is personal. Two Resonants of one Harmonic do not flinch the same way.';
  });
  s['ui.species.count'] = `${species.length} Index entries`;
  return s;
}

export async function main(): Promise<void> {
  for (const [id, rows] of Object.entries(MAPS)) {
    const width = rows[0]?.length ?? 0;
    for (const row of rows) {
      if (row.length !== width) throw new Error(`${id} row width ${row.length} != ${width}: ${row}`);
    }
  }
  const motifs = buildMotifs();
  const species = buildResonants(motifs);
  const world = buildWorld(species);
  const strings = stringsFor(species, world);
  mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true });
  writeFileSync(new URL('../src/data/motifs.ts', import.meta.url), motifLiteral(motifs));
  writeFileSync(new URL('../src/data/resonants.ts', import.meta.url), resonantLiteral(species));
  writeFileSync(new URL('../src/data/harmonics.ts', import.meta.url), `export { HARMONICS, HARMONIC_RELATIONS, globalMultiplier, validateMatrix } from '../engine/harmonics';\n`);
  writeFileSync(new URL('../src/data/wardenNames.ts', import.meta.url), `export const WARDENS = ${JSON.stringify(world.wardens, null, 2)} as const;\nexport const FIRST_RESONANCE = ${JSON.stringify(world.lines)} as const;\nexport const STARTER_CHOICES = ${JSON.stringify([world.lines[0], world.lines[2], world.lines[4]])} as const;\n`);
  writeFileSync(new URL('../src/data/zones.ts', import.meta.url), `export const BIOMES = ${JSON.stringify(BIOMES, null, 2)} as const;\nexport const MAPS = ${JSON.stringify(MAPS, null, 2)} as const;\nexport const ZONE_ORDER = ['ashfen', 'saltspan', 'duskstair'] as const;\n`);
  writeFileSync(new URL('../src/data/npcs.ts', import.meta.url), `export const NPCS = ${JSON.stringify(world.npcs, null, 2)} as const;\n`);
  const dialogue: Record<string, readonly string[]> = {};
  for (const npc of world.npcs) dialogue[npc.id] = npc.lines;
  writeFileSync(new URL('../src/data/dialogue.ts', import.meta.url), `export const DIALOGUE = ${JSON.stringify(dialogue, null, 2)} as const;\n`);
  writeFileSync(new URL('../src/data/story.ts', import.meta.url), `export const TOKENS = ${JSON.stringify(world.tokens, null, 2)} as const;\nexport const PRIME = ${JSON.stringify({ id: 'prime', name: 'Prime Voice Ivo Quarne', title: 'Prime Voice', harmonic: 'Bile', team: world.primePool, levels: [36, 38, 40, 42], opener: 'h70' }, null, 2)} as const;\nexport const RIVAL = ${JSON.stringify({ id: 'rival', name: 'Rival Nerris Vale', stages: world.lines.slice(0, 3) }, null, 2)} as const;\nexport const SANCTUM_RULES = ${JSON.stringify([
    { id: 'A', rule: { kind: 'harmonic-lock', harmonic: 'Cindersong' } },
    { id: 'B', rule: { kind: 'solo' } },
    { id: 'C', rule: { kind: 'non-harmonic-only' } },
    { id: 'D', rule: { kind: 'swap-at-half' } },
    { id: 'E', rule: { kind: 'bench-pool' } },
    { id: 'F', rule: { kind: 'phrase-limit', max: 8 } },
    { id: 'G', rule: { kind: 'endure', phrases: 3 } },
    { id: 'H', rule: { kind: 'reverse' } },
  ], null, 2)} as const;\n`);
  writeFileSync(new URL('../src/data/strings.ts', import.meta.url), `export const STRINGS = ${JSON.stringify(strings, null, 2)} as const;\nexport type StringId = keyof typeof STRINGS;\n`);
  process.stdout.write(`generated motifs=${motifs.length} resonants=${species.length} strings=${Object.keys(strings).length}\n`);
  void rng;
  void ROOT;
  void q;
}


