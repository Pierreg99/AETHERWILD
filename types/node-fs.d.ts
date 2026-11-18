export function readFileSync(path: string | URL, enc: 'utf8'): string;
export function writeFileSync(path: string | URL, data: string | Uint8Array): void;
export function mkdirSync(path: string | URL, opts?: { recursive?: boolean }): void;
export function readdirSync(path: string, opts?: { withFileTypes?: boolean }): Dirent[];
export function existsSync(path: string): boolean;
export function statSync(path: string): { isDirectory(): boolean; isFile(): boolean };
export interface Dirent {
  name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}
