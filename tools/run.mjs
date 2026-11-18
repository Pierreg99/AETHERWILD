import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const local = existsSync(new URL('../node_modules/vite/package.json', import.meta.url));
const nm = local
  ? new URL('../node_modules/', import.meta.url).pathname
  : '/tmp/aw-nm/node_modules/';

const env = { ...process.env };
if (!local) {
  const loader = '--loader /tmp/aw-resolve.mjs';
  env.NODE_OPTIONS = env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ${loader}` : loader;
  env.ESBUILD_BINARY_PATH = env.ESBUILD_BINARY_PATH || '/tmp/esbuild';
}

const task = process.argv[2];
const rest = process.argv.slice(3);
const node = process.execPath;

const table = {
  dev: [node, [nm + 'vite/bin/vite.js', ...rest]],
  build: [node, [nm + 'vite/bin/vite.js', 'build', ...rest]],
  preview: [node, [nm + 'vite/bin/vite.js', 'preview', ...rest]],
  typecheck: [node, [nm + 'typescript/bin/tsc', '--noEmit', ...rest]],
  test: [node, [nm + 'vitest/vitest.mjs', 'run', ...rest]],
  e2e: [node, [nm + '@playwright/test/cli.js', 'test', ...rest]],
  ssr: [node, [new URL('./ssr.mjs', import.meta.url).pathname, ...rest]],
};

const chosen = table[task];
if (!chosen) {
  console.error(`unknown task ${task}`);
  process.exit(1);
}
const child = spawn(chosen[0], chosen[1], { stdio: 'inherit', env, cwd: new URL('..', import.meta.url).pathname });
child.on('exit', (code) => process.exit(code ?? 1));
