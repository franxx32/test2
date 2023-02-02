import { parentPort } from 'worker_threads';
import { chromium } from 'playwright';

export async function parseFunc() {
  const browser = await chromium.launch();

  const page = await browser.newPage();
  await page.goto('https://www.lg.com/us/refrigerators');
  const links = page
    .locator('/\/*[@id="resultAppendTarget"]/ul')
    .locator('.item.js-model.ga-model');

  for (const li of await links.all()) {
    const link = li.locator('a').first();
    await link.click();
    await page.waitForLoadState();
    await page.getByRole('link', { name: 'Specs' }).click();
    await page.waitForTimeout(2000);
    const name = await page
      .locator('.model-title-desktop-pdp-new')
      .first()
      .innerText();
    const price = await page
      .locator('.price-pdp-new.ga-price')
      .first()
      .innerText();

    const item = {
      company: 'lg',
      category: 'refrigerators',
      name,
      price,
      additionSpec: {},
    };

    const { length } = await page.locator('.dt_box').all();
    for (let i = 1; i < length; i++) {
      const specName = await page
        .locator('.dt_box')
        .nth(i)
        .innerText();
      const specValue = await page
        .locator('.dd_box')
        .nth(i)
        .innerText();
      item.additionSpec[specName] = specValue;
    }

    parentPort.postMessage(item);

    await page.goBack();
  }

  await browser.close();
}

parseFunc();
