import { MOTIFS } from '../src/data/motifs';
import { NPCS } from '../src/data/npcs';
import { RESONANTS } from '../src/data/resonants';
import { PRIME, RIVAL, SANCTUM_RULES, TOKENS } from '../src/data/story';
import { WARDENS } from '../src/data/wardenNames';
import { BIOMES, MAPS } from '../src/data/zones';
import { HARMONICS, validateMatrix } from '../src/engine/harmonics';

const errors: string[] = [];
const motifIds = new Set(MOTIFS.map((motif) => motif.id));
const speciesIds = new Set(RESONANTS.map((species) => species.id));
const biomeIds = new Set<string>(BIOMES.map((biome) => biome.id));

if (MOTIFS.length !== 120) errors.push(`motifs ${MOTIFS.length}`);
const counts = { Kindling: 0, Pulse: 0, Guard: 0, harmonic: 0 };
for (const motif of MOTIFS) {
  if (motif.cls === 'Kindling' || motif.cls === 'Pulse' || motif.cls === 'Guard') counts[motif.cls] += 1;
  else counts.harmonic += 1;
  if (!HARMONICS.includes(motif.harmonic)) errors.push(`motif harmonic ${motif.id}`);
}
if (counts.Kindling !== 12 || counts.Pulse !== 18 || counts.Guard !== 14 || counts.harmonic !== 76) {
  errors.push(`class counts ${JSON.stringify(counts)}`);
}
if (motifIds.size !== MOTIFS.length) errors.push('duplicate motif ids');

if (RESONANTS.length !== 78) errors.push(`resonants ${RESONANTS.length}`);
const dex = new Set<number>();
const primaries = new Set<string>();
let ascensions = 0;
for (const species of RESONANTS) {
  if (species.dexNumber < 1 || species.dexNumber > 78 || dex.has(species.dexNumber)) errors.push(`dex ${species.id}`);
  dex.add(species.dexNumber);
  primaries.add(species.primary);
  if (species.evolvesFrom && !speciesIds.has(species.evolvesFrom)) errors.push(`evolvesFrom ${species.id}`);
  for (const stage of species.ascension) {
    ascensions += 1;
    if (!speciesIds.has(stage.to)) errors.push(`ascension ${species.id} -> ${stage.to}`);
  }
  for (const row of species.learnset) {
    if (!motifIds.has(row.motifId)) errors.push(`learnset ${species.id} ${row.motifId}`);
  }
  for (const biome of species.habitatBiomes) {
    if (!biomeIds.has(biome)) errors.push(`habitat ${species.id} ${biome}`);
  }
  for (const harmonic of HARMONICS) {
    if (typeof species.baseWard[harmonic] !== 'number') errors.push(`ward ${species.id} ${harmonic}`);
  }
}
if (primaries.size !== 9) errors.push(`primaries ${primaries.size}`);
if (ascensions !== 18) errors.push(`ascensions ${ascensions}`);

for (const warden of WARDENS) {
  if (!HARMONICS.includes(warden.harmonic as (typeof HARMONICS)[number])) errors.push(`warden ${warden.id}`);
  for (const id of warden.team) if (!speciesIds.has(id)) errors.push(`warden team ${id}`);
  if (!motifIds.has(warden.opener)) errors.push(`warden opener ${warden.opener}`);
}
for (const id of PRIME.team) if (!speciesIds.has(id)) errors.push(`prime ${id}`);
if (!motifIds.has(PRIME.opener)) errors.push('prime opener');
for (const id of RIVAL.stages) if (!speciesIds.has(id)) errors.push(`rival ${id}`);
if (SANCTUM_RULES.length !== 8) errors.push('sanctum rules');
if (TOKENS.length !== 30) errors.push(`tokens ${TOKENS.length}`);
if (NPCS.length < 40) errors.push(`npcs ${NPCS.length}`);
if (BIOMES.length !== 11) errors.push(`biomes ${BIOMES.length}`);

let npcTiles = 0;
for (const rows of Object.values(MAPS)) {
  const width = rows[0]?.length ?? 0;
  for (const row of rows) {
    if (row.length !== width) errors.push('ragged map');
    npcTiles += row.split('').filter((ch) => ch === 'n').length;
  }
}
if (npcTiles < 40) errors.push(`npc tiles ${npcTiles}`);

const matrix = validateMatrix();
if (!matrix.ok) errors.push(...matrix.errors);

export async function main(): Promise<void> {
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    throw new Error(`validate-content failed ${errors.length}`);
  }
  console.log(`validate-content ok motifs=${MOTIFS.length} resonants=${RESONANTS.length} ascensions=${ascensions} npcs=${NPCS.length} tiles=${npcTiles}`);
}
