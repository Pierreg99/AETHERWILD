import { readFileSync } from 'node:fs';
import { MOTIFS } from '../src/data/motifs';
import { RESONANTS } from '../src/data/resonants';
import { blocked } from '../src/generator/names';

function list(): string[] {
  return readFileSync(new URL('./ip-blocklist.txt', import.meta.url), 'utf8').split('\n');
}

export async function main(): Promise<void> {
  const block = list();
  const errors: string[] = [];
  const speciesNames = new Set<string>();
  for (const species of RESONANTS) {
    const key = species.name.toLowerCase();
    if (speciesNames.has(key)) errors.push(`duplicate species ${species.name}`);
    speciesNames.add(key);
    const hit = blocked(species.name, block);
    if (hit) errors.push(`species ${species.name} hits ${hit}`);
    if (species.name.length < 4 || species.name.length > 16) errors.push(`species length ${species.name}`);
  }
  const motifNames = new Set<string>();
  for (const motif of MOTIFS) {
    const key = motif.name.toLowerCase();
    if (motifNames.has(key)) errors.push(`duplicate motif ${motif.name}`);
    motifNames.add(key);
    const hit = blocked(motif.name, block);
    if (hit) errors.push(`motif ${motif.name} hits ${hit}`);
  }
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    throw new Error(`name-check failed ${errors.length}`);
  }
  console.log(`name-check ok species=${speciesNames.size} motifs=${motifNames.size}`);
}
