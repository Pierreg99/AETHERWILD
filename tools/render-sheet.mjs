import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = new URL('..', import.meta.url);
const local = existsSync(new URL('./node_modules/vite/package.json', root));
const esbuild = local ? new URL('./node_modules/esbuild/bin/esbuild', root).pathname : '/tmp/esbuild';
const out = '/tmp/aw-sheet.mjs';
const built = spawnSync(
  esbuild,
  [
    'tools/render-sheet.ts',
    '--bundle',
    '--platform=node',
    '--format=esm',
    `--outfile=${out}`,
    '--external:@playwright/test',
    '--external:vite',
  ],
  { stdio: 'inherit', cwd: root.pathname },
);
if (built.status !== 0) process.exit(built.status ?? 1);
const loader = local ? [] : ['--loader', '/tmp/aw-resolve.mjs'];
const href = pathToFileURL(out).href;
const ran = spawnSync(
  process.execPath,
  [...loader, '--input-type=module', '-e', `import { main } from ${JSON.stringify(href)}; await main();`],
  { stdio: 'inherit', cwd: root.pathname },
);
process.exit(ran.status ?? 1);
