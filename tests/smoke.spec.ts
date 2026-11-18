import { expect, test } from '@playwright/test';

test('title boots', async ({ page }) => {
  await page.goto('/?e2e=1');
  const canvas = page.locator('#game');
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute('data-ready', '1');
  await expect(canvas).toHaveAttribute('data-mode', 'title');
  const box = await canvas.boundingBox();
  expect(box && box.width >= 480).toBeTruthy();
});
