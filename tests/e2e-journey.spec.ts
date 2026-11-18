import { expect, test, type Page } from '@playwright/test';

const HUMS = ['Low', 'Mid', 'High', 'Cindersong', 'Biteroot', 'Stratum', 'Rivet', 'Brine', 'Spark', 'Draft', 'Gloom', 'Bile'];

type Snap = Record<string, string>;

async function read(page: Page): Promise<Snap> {
  return page.locator('#game').evaluate((canvas) => ({ ...canvas.dataset } as Record<string, string>));
}

async function press(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key);
  await page.waitForTimeout(50);
}

async function resolveBattle(page: Page, wantAttune: boolean, wantHeal = false): Promise<string> {
  for (let i = 0; i < 140; i++) {
    const ds = await read(page);
    if (ds.mode !== 'battle') return ds.result ?? '';
    if (ds.result === 'win' || ds.result === 'loss' || ds.result === 'fled' || ds.result === 'caught') {
      await press(page, 'z');
      await page.waitForTimeout(80);
      continue;
    }
    if (ds.phase === 'intro') {
      await press(page, 'z');
      continue;
    }
    if (ds.phase === 'attunement') {
      const idx = HUMS.indexOf(ds.spike ?? '');
      const cursor = Number(ds.cursor ?? '0');
      if (idx >= 0 && cursor < idx) await press(page, 'ArrowDown');
      else if (idx >= 0 && cursor > idx) await press(page, 'ArrowUp');
      else await press(page, 'z');
      continue;
    }
    if (ds.phase === 'forced-switch' || ds.menu === 'switch') {
      await press(page, 'z');
      continue;
    }
    if (ds.menu === 'token') {
      await press(page, wantHeal ? 'z' : 'x');
      continue;
    }
    if (
      wantHeal &&
      ds.wild !== '1' &&
      ds.phase === 'choose-action' &&
      ds.menu === 'root' &&
      Number(ds.tonic ?? '0') > 0 &&
      Number(ds.vigor ?? '1') * 2 < Number(ds.max ?? '1')
    ) {
      if (Number(ds.cursor ?? '0') < 2) await press(page, 'ArrowDown');
      else await press(page, 'z');
      continue;
    }
    if (wantAttune && ds.wild === '1' && ds.phase === 'choose-action' && ds.menu === 'root') {
      if (Number(ds.cursor ?? '0') < 1) await press(page, 'ArrowDown');
      else await press(page, 'z');
      continue;
    }
    if (ds.menu === 'motif' || ds.menu === 'root') {
      if (ds.menu === 'root' && Number(ds.cursor ?? '0') !== 0) await press(page, 'ArrowUp');
      else await press(page, 'z');
      continue;
    }
    await press(page, 'z');
  }
  const stuck = await read(page);
  throw new Error(`battle stuck ${stuck.phase} ${stuck.menu} ${stuck.result}`);
}

async function walk(page: Page, x: number, y: number): Promise<void> {
  for (let i = 0; i < 90; i++) {
    let ds = await read(page);
    if (ds.mode === 'battle') {
      await resolveBattle(page, false);
      ds = await read(page);
    }
    if (ds.mode === 'sanctum' || ds.mode === 'shop' || ds.mode === 'vault' || ds.mode === 'talk') {
      await press(page, 'x');
      continue;
    }
    if (ds.mode !== 'field') {
      await press(page, 'z');
      continue;
    }
    const cx = Number(ds.x);
    const cy = Number(ds.y);
    if (cx === x && cy === y) return;
    let key = 'ArrowDown';
    if (cx < x) key = 'ArrowRight';
    else if (cx > x) key = 'ArrowLeft';
    else if (cy > y) key = 'ArrowUp';
    await press(page, key);
    await page.waitForTimeout(140);
  }
  const ds = await read(page);
  throw new Error(`path stuck ${ds.map} ${ds.x},${ds.y} ${ds.mode}`);
}

test('survey journey', async ({ page }) => {
  await page.goto('/?e2e=1');
  const canvas = page.locator('#game');
  await expect(canvas).toHaveAttribute('data-mode', 'title');
  await press(page, 'z');
  await expect(canvas).toHaveAttribute('data-mode', 'starter');
  await press(page, 'z');
  await expect(canvas).toHaveAttribute('data-mode', 'field');
  await expect(canvas).toHaveAttribute('data-map', 'ashfen');
  await expect(canvas).toHaveAttribute('data-species', 'r01');

  await walk(page, 1, 5);
  for (let step = 0; step < 8; step++) {
    const here = await read(page);
    if (here.mode === 'battle') break;
    await press(page, 'ArrowDown');
    await page.waitForTimeout(180);
  }
  await expect.poll(async () => (await read(page)).mode).toBe('battle');
  const first = await resolveBattle(page, false);
  expect(first === 'win' || first === 'loss').toBeTruthy();

  let attuned = false;
  for (let i = 0; i < 120; i++) {
    const ds = await read(page);
    const ready = Number(ds.level) >= 24 && Number(ds.resonance) >= 120 && ds.ascended === '1' && attuned;
    if (ready && ds.mode === 'field') break;
    if (ds.mode === 'battle') {
      const result = await resolveBattle(page, !attuned);
      if (result === 'caught') attuned = true;
      continue;
    }
    if (ds.mode !== 'field') {
      await press(page, 'x');
      continue;
    }
    if (Number(ds.x) > 1) await press(page, 'ArrowLeft');
    else if (Number(ds.y) >= 6) await press(page, 'ArrowUp');
    else await press(page, 'ArrowDown');
    await page.waitForTimeout(150);
  }
  const grown = await read(page);
  expect(Number(grown.level)).toBeGreaterThanOrEqual(24);
  expect(Number(grown.resonance)).toBeGreaterThanOrEqual(120);
  expect(grown.ascended).toBe('1');
  expect(attuned).toBeTruthy();

  await walk(page, 1, 3);
  await walk(page, 3, 3);
  await walk(page, 1, 6);
  await walk(page, 17, 6);
  await walk(page, 17, 4);
  let cleared = false;
  for (let attempt = 0; attempt < 4 && !cleared; attempt++) {
    const here = await read(page);
    if (here.map !== 'ashfen' || here.x !== '17' || here.y !== '4') {
      await walk(page, 1, 6);
      await walk(page, 17, 6);
      await walk(page, 17, 4);
    }
    await press(page, 'z');
    await expect.poll(async () => (await read(page)).mode).toBe('sanctum');
    await press(page, 'z');
    const result = await resolveBattle(page, false, true);
    const after = await read(page);
    cleared = (after.clears ?? '').includes('A');
    if (!cleared && result === 'loss') {
      await walk(page, 1, 6);
      for (let extra = 0; extra < 8; extra++) {
        const ds = await read(page);
        if (ds.mode === 'battle') await resolveBattle(page, false);
        else if (Number(ds.y) >= 6) await press(page, 'ArrowUp');
        else await press(page, 'ArrowDown');
        await page.waitForTimeout(150);
      }
    }
  }
  const sealed = await read(page);
  expect(sealed.clears ?? '').toContain('A');

  if ((await read(page)).mode !== 'field') await press(page, 'z');
  await press(page, 'c');
  await expect.poll(async () => (await read(page)).mode).toBe('menu');
  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  await press(page, 'z');
  const saved = await read(page);
  const savedLevel = saved.level;
  const savedClears = saved.clears;
  const savedMap = saved.map;

  await page.goto('/?e2e=1');
  await expect(canvas).toHaveAttribute('data-mode', 'title');
  await expect(canvas).toHaveAttribute('data-continue', '1');
  await press(page, 'ArrowDown');
  await press(page, 'z');
  await expect.poll(async () => (await read(page)).mode).toBe('field');
  const restored = await read(page);
  expect(restored.map).toBe(savedMap);
  expect(restored.level).toBe(savedLevel);
  expect(restored.clears).toBe(savedClears);

  await walk(page, 22, 4);
  for (let i = 0; i < 20; i++) {
    const ds = await read(page);
    if (ds.map === 'saltspan') break;
    if (ds.mode === 'battle') await resolveBattle(page, false);
    else if (ds.mode === 'field') {
      if (Number(ds.x) < 22) await press(page, 'ArrowRight');
      else await press(page, 'ArrowUp');
      await page.waitForTimeout(150);
    } else await press(page, 'z');
  }
  await expect.poll(async () => (await read(page)).map).toBe('saltspan');
  if ((await read(page)).mode === 'battle') await resolveBattle(page, false);

  await walk(page, 2, 6);
  await walk(page, 22, 6);
  for (let i = 0; i < 20; i++) {
    const ds = await read(page);
    if (ds.map === 'duskstair') break;
    if (ds.mode === 'battle') await resolveBattle(page, false);
    else if (ds.mode === 'field' && ds.map === 'saltspan') {
      if (Number(ds.y) > 1) await press(page, 'ArrowUp');
      await page.waitForTimeout(150);
    } else await press(page, 'z');
  }
  await expect.poll(async () => (await read(page)).map).toBe('duskstair');
  if ((await read(page)).mode === 'battle') await resolveBattle(page, false);
  const end = await read(page);
  expect(end.map).toBe('duskstair');
  expect(end.mode === 'field' || end.mode === 'battle').toBeTruthy();
});
