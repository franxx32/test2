import { parentPort } from 'worker_threads';
import { chromium } from 'playwright';

export async function parseFunc() {

  const browser = await chromium.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(
    'https://www.bosch-home.com/us/productslist/refrigerators?sortAttribute=RETAIL_PRICE',
  );
  await page.waitForTimeout(2000);

  const links = await page
    .locator(`.o-producttilerebrush.js-o-producttilerebrush`)
    .all();

  for (const l of links) {
    const link = l.locator('a').first();
    await link.click();
    await page.waitForLoadState();
    const name = await page
      .locator('.fragment.std-header-1')
      .first()
      .innerText();
    const series = await page
      .locator('.fragment.std-header-6')
      .first()
      .innerText();
    const price = await page
      .locator(
        '/\/*[@id="content"]/div[2]/div[3]/form/div/div[2]/div[2]/div/div/p',
      )
      .first()
      .innerText();

    const item = {
      company: 'bosch',
      category: 'refrigerators',
      name: name + ' ' + series,
      price,
      additionSpec: {},
    };
    await page.waitForSelector('.technical-info-item-heading.js-search-text');

    const { length } = await page
      .locator('.technical-info-item-heading.js-search-text')
      .all();

    for (let i = 1; i < length; i++) {
      const specName = await page
        .locator('.technical-info-item-heading.js-search-text')
        .nth(i)
        .innerText();
      const specValue = await page
        .locator('.technical-info-item-content.js-search-text')
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
