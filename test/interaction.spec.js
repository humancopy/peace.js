const {test, expect, open, ready, HOME} = require('./fixtures');

const PAGE = /\/fixture\.html$/;

// Opens a banner and waits for peace.css, which decides what a tap or click hits
async function banner(page, attrs) {
  await open(page, {attrs});
  await ready(page);
  return page.locator('.peace');
}

test.describe('touch', () => {
  // A touch-only device matches (hover: none)
  test.use({hasTouch: true, isMobile: true});

  test('symbol, _blank: the first tap reveals the words, the second opens a new tab', async ({page, context}) => {
    const peace = await banner(page, 'data-style="symbol"');
    await peace.locator('span').tap();
    await expect(peace).toHaveClass(/\bshow\b/);
    await expect(page).toHaveURL(PAGE);
    expect(context.pages()).toHaveLength(1);

    const [tab] = await Promise.all([context.waitForEvent('page'), peace.locator('a').tap()]);
    await expect(tab).toHaveURL(`${HOME}/`);
    await expect(page).toHaveURL(PAGE);
  });

  test('symbol, _self: the first tap reveals the words, the second follows the link', async ({page, context}) => {
    const peace = await banner(page, 'data-style="symbol" data-link="_self"');
    await peace.locator('span').tap();
    await expect(peace).toHaveClass(/\bshow\b/);
    await expect(page).toHaveURL(PAGE);

    await peace.locator('a').tap();
    await expect(page).toHaveURL(`${HOME}/`);
    expect(context.pages()).toHaveLength(1);
  });

  test('symbol, data-link="false": taps reveal the words and go nowhere', async ({page, context}) => {
    const peace = await banner(page, 'data-style="symbol" data-link="false"');
    await peace.locator('span').tap();
    await expect(peace).toHaveClass(/\bshow\b/);

    await peace.locator('a').tap();
    await expect(page).toHaveURL(PAGE);
    expect(context.pages()).toHaveLength(1);
  });

  test('text, _self: a tap follows the link', async ({page}) => {
    const peace = await banner(page, 'data-link="_self"');
    await peace.locator('a').tap();
    await expect(page).toHaveURL(`${HOME}/`);
  });
});

test.describe('desktop', () => {
  test('symbol, _self: one click on ☮ follows the link', async ({page}) => {
    const peace = await banner(page, 'data-style="symbol" data-link="_self"');
    // Click where the symbol is drawn, whatever sits on top of it
    const box = await peace.locator('span').boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page).toHaveURL(`${HOME}/`);
  });

  test('symbol, _self: Tab and Enter follow the link', async ({page}) => {
    await banner(page, 'data-style="symbol" data-link="_self"');
    await page.keyboard.press('Tab');
    await expect(page.locator('.peace a')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${HOME}/`);
  });
});
