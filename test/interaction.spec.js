const {test, expect, open, ready, HOME} = require('./fixtures');

const PAGE = /\/fixture\.html$/;

// Opens a banner and waits for peace.css, which decides what a tap or click hits
async function banner(page, attrs) {
  await open(page, {attrs});
  await ready(page);
  return page.locator('.peace');
}

// Records every visit to the homepage, from this tab or a new one
function visits(context) {
  const urls = [];
  context.on('request', request => request.url().startsWith(HOME) && urls.push(request.url()));
  return urls;
}

// Nothing happening only proves something once a link had time to fire
async function staysPut(page, context, urls) {
  await page.waitForTimeout(500);
  expect(urls).toEqual([]);
  expect(context.pages()).toHaveLength(1);
  await expect(page).toHaveURL(PAGE);
}

test.describe('touch', () => {
  // A touch-only device matches (hover: none)
  test.use({hasTouch: true, isMobile: true});

  test('symbol, _blank: the first tap reveals the words, the second opens a new tab', async ({page, context}) => {
    const urls = visits(context);
    const peace = await banner(page, 'data-style="symbol"');
    await peace.locator('span').tap();
    await expect(peace).toHaveClass(/\bshow\b/);
    await staysPut(page, context, urls);

    const [tab] = await Promise.all([context.waitForEvent('page'), peace.locator('a').tap()]);
    await expect(tab).toHaveURL(`${HOME}/`);
    await expect(page).toHaveURL(PAGE);
  });

  test('symbol, _self: the first tap reveals the words, the second follows the link', async ({page, context}) => {
    const urls = visits(context);
    const peace = await banner(page, 'data-style="symbol" data-link="_self"');
    await peace.locator('span').tap();
    await expect(peace).toHaveClass(/\bshow\b/);
    await staysPut(page, context, urls);

    await peace.locator('a').tap();
    await expect(page).toHaveURL(`${HOME}/`);
    expect(context.pages()).toHaveLength(1);
  });

  test('symbol, _self: after the reveal, a tap anywhere on ☮ follows the link', async ({page}) => {
    // Narrow enough for the words to wrap, leaving gaps between their lines
    await page.setViewportSize({width: 320, height: 640});
    const peace = await banner(page, 'data-style="symbol" data-link="_self"');
    await peace.locator('span').tap();
    await expect(peace).toHaveClass(/\bshow\b/);

    // The top edge of the symbol, above the words' first line
    const box = await peace.locator('span').boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + 2);
    await expect(page).toHaveURL(`${HOME}/`);
  });

  test('symbol, data-link="false": taps reveal the words and go nowhere', async ({page, context}) => {
    const urls = visits(context);
    const peace = await banner(page, 'data-style="symbol" data-link="false"');
    await peace.locator('span').tap();
    await expect(peace).toHaveClass(/\bshow\b/);

    await peace.locator('a').tap();
    await staysPut(page, context, urls);
  });

  test('symbol: hover alone doesn\'t reveal the words', async ({page}) => {
    // iOS counts a tap that reveals content through hover as a hover only, and skips the click that adds .show
    const peace = await banner(page, 'data-style="symbol"');
    await peace.locator('span').hover();
    await page.waitForTimeout(400);
    await expect(peace.locator('a')).toHaveCSS('opacity', '0');
    await expect(peace.locator('span')).toHaveCSS('opacity', '1');
  });

  test('text, _self: a tap follows the link', async ({page}) => {
    const peace = await banner(page, 'data-link="_self"');
    await peace.locator('a').tap();
    await expect(page).toHaveURL(`${HOME}/`);
  });
});

test.describe('desktop', () => {
  test('symbol: hovering ☮ reveals the words', async ({page}) => {
    const peace = await banner(page, 'data-style="symbol"');
    await peace.locator('span').hover({force: true});
    await expect(peace.locator('a')).toHaveCSS('opacity', '1');
    await expect(peace.locator('span')).toHaveCSS('opacity', '0');
  });

  test('symbol, _self: one click on ☮ follows the link', async ({page}) => {
    const peace = await banner(page, 'data-style="symbol" data-link="_self"');
    // Click where the symbol is drawn, whatever sits on top of it
    const box = await peace.locator('span').boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page).toHaveURL(`${HOME}/`);
  });

  test('symbol, _self: one click on the edge of ☮ follows the link', async ({page}) => {
    const peace = await banner(page, 'data-style="symbol" data-link="_self"');
    const box = await peace.locator('span').boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + 2);
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
