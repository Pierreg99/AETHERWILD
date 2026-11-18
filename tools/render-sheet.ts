import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { RESONANTS } from '../src/data/resonants';
import { artParams } from '../src/render/creature-art';

export async function main(): Promise<void> {
  const server = await createServer({
    server: { host: '127.0.0.1', port: 5174, strictPort: true },
    logLevel: 'error',
  });
  await server.listen();
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await page.goto('http://127.0.0.1:5174/?sheet=1');
    await page.waitForSelector('#sheet-done', { state: 'attached' });
    const dataUrl = await page.locator('#game').evaluate((canvas) => canvas.toDataURL('image/png'));
    const b64 = dataUrl.split(',')[1] ?? '';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    writeFileSync(join(process.cwd(), 'atlas.png'), bytes);
    for (const id of ['r01', 'r28', 'r40']) {
      const species = RESONANTS.find((row) => row.id === id);
      if (!species) continue;
      const art = artParams(species.artSeed);
      console.log(`${species.id} ${species.name} plan=${art.plan} texture=${art.texture} facets=${art.facets} spines=${art.spines} limbs=${art.limbs} symmetry=${art.symmetry} palette=${art.palette.join(' ')}`);
    }
    console.log('render-sheet ok atlas.png');
  } finally {
    await browser.close();
    await server.close();
  }
}
