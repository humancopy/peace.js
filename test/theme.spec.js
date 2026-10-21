const {test, expect, open, expectColor, BLACK, WHITE} = require('./fixtures');

const DARK_MEDIA = '<style>body{background:#fff} @media (prefers-color-scheme: dark){body{background:#111}}</style>';
const BOTH_META = '<meta name="color-scheme" content="light dark">';

test.describe('auto theme', () => {
  test('light page on a dark device is black', async ({page}) => {
    await page.emulateMedia({colorScheme: 'dark'});
    await open(page, {head: '<style>body{background:#fff}</style>'});
    await expectColor(page, BLACK);
  });

  for (const [scheme, color] of [['dark', WHITE], ['light', BLACK]]) {
    test(`dark mode via @media on a ${scheme} device`, async ({page}) => {
      await page.emulateMedia({colorScheme: scheme});
      await open(page, {head: DARK_MEDIA});
      await expectColor(page, color);
    });

    test(`no background with meta "light dark" on a ${scheme} device`, async ({page}) => {
      await page.emulateMedia({colorScheme: scheme});
      await open(page, {head: BOTH_META});
      await expectColor(page, color);
    });
  }

  test(':root{color-scheme:dark} on a light device is white', async ({page}) => {
    await page.emulateMedia({colorScheme: 'light'});
    await open(page, {head: '<style>:root{color-scheme:dark}</style>'});
    await expectColor(page, WHITE);
  });

  test('meta "dark" on a light device is white', async ({page}) => {
    await page.emulateMedia({colorScheme: 'light'});
    await open(page, {head: '<meta name="color-scheme" content="dark">'});
    await expectColor(page, WHITE);
  });

  test('meta "light" on a dark device is black', async ({page}) => {
    await page.emulateMedia({colorScheme: 'dark'});
    await open(page, {head: '<meta name="color-scheme" content="light">'});
    await expectColor(page, BLACK);
  });

  for (const [scheme, color] of [['dark', WHITE], ['light', BLACK]]) {
    test(`data-dark="device" on a light page and a ${scheme} device`, async ({page}) => {
      await page.emulateMedia({colorScheme: scheme});
      await open(page, {head: '<style>body{background:#fff}</style>', attrs: 'data-dark="device"'});
      await expectColor(page, color);
    });
  }
});

test.describe('fixed themes', () => {
  const themes = {
    black: BLACK,
    white: WHITE,
    red: 'rgb(238, 0, 0)',
    green: 'rgb(0, 238, 0)',
    blue: 'rgb(0, 0, 238)',
  };
  for (const [theme, color] of Object.entries(themes)) {
    test(`data-theme="${theme}" on a dark page`, async ({page}) => {
      await page.emulateMedia({colorScheme: 'dark'});
      await open(page, {head: '<style>body{background:#000}</style>', attrs: `data-theme="${theme}"`});
      await expectColor(page, color);
    });
  }
});

test.describe('see-through backgrounds', () => {
  const cases = [
    ['#fff', 'rgba(0,0,0,.05)', BLACK],
    ['#fff', 'rgba(0,0,0,.8)', WHITE],
    ['#000', 'rgba(255,255,255,.1)', WHITE],
    ['#fff', 'oklch(0 0 0 / 0.8)', WHITE],
  ];
  for (const [body, footer, color] of cases) {
    test(`footer ${footer} over body ${body}`, async ({page}) => {
      await open(page, {
        head: `<style>body{background:${body}} footer{background:${footer}}</style>`,
        body: '<footer><script src="/peace.js"></script></footer>',
      });
      await expectColor(page, color);
    });
  }
});

test.describe('CSS Color 4 backgrounds', () => {
  const cases = [
    ['color(srgb 1 1 1)', 'light', BLACK],
    ['color(srgb 0 0 0)', 'light', WHITE],
    ['oklch(0.2 0.02 250)', 'light', WHITE],
    ['lab(10 0 0)', 'light', WHITE],
    ['oklch(0.97 0 0)', 'dark', BLACK],
    ['color(display-p3 0.95 0.95 0.9)', 'dark', BLACK],
  ];
  for (const [background, scheme, color] of cases) {
    test(`${background} on a ${scheme} device`, async ({page}) => {
      await page.emulateMedia({colorScheme: scheme});
      await open(page, {head: `<style>body{background:${background}}</style>`});
      await expectColor(page, color);
    });
  }
});

test.describe('live updates', () => {
  test('follows the device switching to dark after load', async ({page}) => {
    await page.emulateMedia({colorScheme: 'light'});
    await open(page, {head: DARK_MEDIA});
    await expectColor(page, BLACK);
    await page.emulateMedia({colorScheme: 'dark'});
    await expectColor(page, WHITE);
  });

  test('follows a dark mode class added to <body> after load', async ({page}) => {
    await open(page, {head: '<style>body{background:#fff} body.night{background:#000}</style>'});
    await expectColor(page, BLACK);
    await page.evaluate(() => document.body.classList.add('night'));
    await expectColor(page, WHITE);
  });
});
