import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BANNED = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp3', '.wav', '.ogg', '.ttf', '.otf', '.woff', '.woff2'];
const root = new URL('..', import.meta.url).pathname;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

export async function main(): Promise<void> {
  const errors: string[] = [];
  for (const path of walk(join(root, 'src'))) {
    const lower = path.toLowerCase();
    if (BANNED.some((ext) => lower.endsWith(ext))) errors.push(`binary in src: ${relative(root, path)}`);
  }
  const publicDir = join(root, 'public');
  if (statSync(publicDir).isDirectory()) {
    for (const path of walk(publicDir)) {
      const rel = relative(root, path).replaceAll('\\', '/');
      if (rel !== 'public/favicon.svg') errors.push(`unexpected public file ${rel}`);
    }
  }
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  if (/fetch\s*\(/i.test(html)) errors.push('fetch in index.html');
  if (/https?:\/\//i.test(html)) errors.push('external url in index.html');
  const srcFiles = walk(join(root, 'src')).filter((path) => path.endsWith('.ts'));
  for (const path of srcFiles) {
    const text = readFileSync(path, 'utf8');
    if (/fetch\s*\(/.test(text)) errors.push(`fetch in ${relative(root, path)}`);
    if (/https?:\/\//.test(text)) errors.push(`external url in ${relative(root, path)}`);
  }
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    throw new Error(`asset-scan failed ${errors.length}`);
  }
  console.log('asset-scan ok');
}
