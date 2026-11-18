import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

const localVite = existsSync(new URL('../node_modules/vite/package.json', import.meta.url));
if (!localVite) {
  register('/tmp/aw-resolve.mjs', pathToFileURL('./'));
}

const { createServer } = await import('vite');
const entry = process.argv[2];
if (!entry) {
  console.error('usage: node tools/ssr.mjs <file.ts>');
  process.exit(1);
}
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
try {
  const mod = await server.ssrLoadModule(`/${entry.replace(/^\//, '')}`);
  if (typeof mod.main !== 'function') throw new Error(`${entry} has no main()`);
  await mod.main();
} finally {
  await server.close();
}
