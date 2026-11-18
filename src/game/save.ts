import type { ResonantInstance } from '../engine/types';

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'aetherwild.save.v1';
export const CORRUPT_KEY = 'aetherwild.save.corrupt';

export interface Settings {
  volume: number;
  textSpeed: number;
  instant: boolean;
  reduced: boolean;
  logAlways: boolean;
  confirm: string;
  cancel: string;
  menu: string;
}

export interface SaveV1 {
  version: 1;
  name: string;
  seed: number;
  mapId: string;
  x: number;
  y: number;
  facing: 'up' | 'down' | 'left' | 'right';
  choir: ResonantInstance[];
  vault: ResonantInstance[];
  tokens: Record<string, number>;
  gleams: number;
  seen: string[];
  flags: Record<string, boolean>;
  clears: string[];
  settings: Settings;
  steps: number;
  rivalBattles: number;
  ascended: string[];
  primeCleared: boolean;
}

export type LoadResult = {
  save: SaveV1 | null;
  corrupt: boolean;
  readonly: boolean;
};

const migrations: Record<number, (raw: SaveV1) => SaveV1> = {};

export function defaultSettings(): Settings {
  return {
    volume: 0.4,
    textSpeed: 2,
    instant: false,
    reduced: false,
    logAlways: true,
    confirm: 'KeyZ',
    cancel: 'KeyX',
    menu: 'KeyC',
  };
}

function store(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    return null;
  }
}

function asSave(raw: unknown, version: 1): SaveV1 | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Partial<SaveV1>;
  if (row.version !== version) return null;
  if (typeof row.mapId !== 'string') return null;
  if (!Array.isArray(row.choir)) return null;
  const settings = { ...defaultSettings(), ...(row.settings ?? {}) };
  return {
    version: 1,
    name: typeof row.name === 'string' ? row.name : 'AETHERWILD',
    seed: Number(row.seed) >>> 0,
    mapId: row.mapId,
    x: Number(row.x) || 1,
    y: Number(row.y) || 1,
    facing: row.facing === 'up' || row.facing === 'left' || row.facing === 'right' ? row.facing : 'down',
    choir: row.choir as ResonantInstance[],
    vault: Array.isArray(row.vault) ? row.vault as ResonantInstance[] : [],
    tokens: row.tokens && typeof row.tokens === 'object' ? { ...row.tokens } : {},
    gleams: Number(row.gleams) || 0,
    seen: Array.isArray(row.seen) ? row.seen.map(String) : [],
    flags: row.flags && typeof row.flags === 'object' ? { ...row.flags } : {},
    clears: Array.isArray(row.clears) ? row.clears.map(String) : [],
    settings,
    steps: Number(row.steps) || 0,
    rivalBattles: Number(row.rivalBattles) || 0,
    ascended: Array.isArray(row.ascended) ? row.ascended.map(String) : [],
    primeCleared: Boolean(row.primeCleared),
  };
}

export function loadSave(): LoadResult {
  const box = store();
  if (!box) return { save: null, corrupt: false, readonly: false };
  const raw = box.getItem(SAVE_KEY);
  if (!raw) return { save: null, corrupt: false, readonly: false };
  try {
    const parsed = JSON.parse(raw) as { version?: number };
    if (typeof parsed.version !== 'number') throw new Error('version');
    if (parsed.version > SAVE_VERSION) {
      const save = asSave({ ...parsed, version: 1 }, 1);
      return { save, corrupt: false, readonly: true };
    }
    let version = parsed.version;
    let current = parsed as SaveV1;
    while (version < SAVE_VERSION) {
      const step = migrations[version];
      if (!step) throw new Error('migration');
      current = step(current);
      version = current.version;
    }
    const save = asSave(current, 1);
    if (!save) throw new Error('shape');
    return { save, corrupt: false, readonly: false };
  } catch {
    box.setItem(CORRUPT_KEY, raw);
    return { save: null, corrupt: true, readonly: false };
  }
}

export function writeSave(save: SaveV1, readonlySave: boolean): void {
  if (readonlySave) return;
  const box = store();
  if (!box) return;
  box.setItem(SAVE_KEY, JSON.stringify(save));
}

export function encodeSave(save: SaveV1): string {
  const bytes = new TextEncoder().encode(JSON.stringify(save));
  let bin = '';
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin);
}

export function decodeSave(b64: string): SaveV1 {
  const bin = atob(b64.trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const parsed = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  const save = asSave(parsed, 1);
  if (!save) throw new Error('shape');
  return save;
}
