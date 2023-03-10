import { parentPort } from 'worker_threads';
import { chromium } from 'playwright';

export async function parseFunc() {
  const browser = await chromium.launch();

  const page = await browser.newPage();
  await page.goto(
    'https://www.samsung.com/us/home-appliances/refrigerators/all-refrigerators/',
  );
  await page.mouse.wheel(0, 1000);
  await page.waitForSelector('.ProductCard-root-3423567336');

  const links = await page.locator(`.ProductCard-root-3423567336`).all();

  for (const l of links) {
    const link = l.locator('a').first();
    await link.click();
    await page.waitForLoadState();
    const name = await page
      .locator('.product-details__info-title')
      .first()
      .innerText();
    const price = await page
      .locator(
        '/\/*[@id="anchor-nav-v2"]/div[2]/div[1]/div[3]/span[2]/span[3]/span',
      )
      .first()
      .innerText();
    const item = {
      company: 'samsung',
      category: 'refrigerators',
      name,
      price,
      additionSpec: {},
    };

    const { length } = await page.locator('.specs-item-name').all();

    for (let i = 1; i < length; i++) {
      const specName = await page
        .locator('.specs-item-name')
        .nth(i)
        .innerText();
      const specValue = await page
        .locator('.type-p2.sub-specs__item__value.light-weight')
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
