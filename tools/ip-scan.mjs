import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const skip = new Set([
  'tools/ip-blocklist.txt',
  'AETHERWILD-grok-4.7-prompt.md',
  'BRIEF.md',
  'atlas.png',
]);

const needles = readFileSync(new URL('./ip-blocklist.txt', import.meta.url), 'utf8')
  .split('\n')
  .map((line) => line.trim().toLowerCase())
  .filter((line) => line && !line.startsWith('#'));

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function hit(hay, needle) {
  if (needle.length <= 4) {
    const re = new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
    return re.test(hay);
  }
  return hay.toLowerCase().includes(needle);
}

const errors = [];
for (const path of walk(root)) {
  const rel = relative(root, path).replaceAll('\\', '/');
  if (skip.has(rel)) continue;
  if (/\.(png|jpg|jpeg|webp|woff2?|ttf|otf|mp3|ogg|wav)$/i.test(rel)) continue;
  let text = '';
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    continue;
  }
  if (text.includes('\0')) continue;
  for (const needle of needles) {
    if (hit(text, needle)) errors.push(`${rel}: ${needle}`);
  }
}

try {
  const log = execSync('git log --format=%s', { cwd: root, encoding: 'utf8' });
  for (const needle of needles) {
    if (hit(log, needle)) errors.push(`commit: ${needle}`);
  }
} catch {
  // No commits yet.
}

if (errors.length > 0) {
  for (const error of errors.slice(0, 40)) console.error(error);
  console.error(`ip-scan failed ${errors.length}`);
  process.exit(1);
}
console.log(`ip-scan ok needles=${needles.length}`);
