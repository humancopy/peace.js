const fs = require('fs');
const path = require('path');
const {test, expect, open, src, ready, BLACK, WHITE} = require('./fixtures');

const PEACE = 'Peace, Paz, שלום, سلام, 平和, शांति, Paix, мир, Pace, Frieden';

test.describe('banner', () => {
  test('defaults: text style, auto theme, links home in a new window', async ({page}) => {
    await open(page);
    await ready(page);
    const banner = page.locator('body > .peace');
    await expect(banner).toHaveCount(1);
    await expect(banner).toHaveClass(/\bpeace\b.*\btext\b.*\bauto\b/);
    await expect(banner.locator('a')).toHaveText(PEACE);
    await expect(banner.locator('a')).toHaveAttribute('href', 'https://peace.humancopy.net');
    await expect(banner.locator('a')).toHaveAttribute('target', '_blank');
    await expect(banner.locator('span')).toHaveCount(0);
  });

  test('goes next to the <script> tag', async ({page}) => {
    await open(page, {body: `<main></main><div id="here"><script src="${src()}"></script></div>`});
    await ready(page);
    await expect(page.locator('#here > .peace')).toHaveCount(1);
    await expect(page.locator('.peace')).toHaveCount(1);
  });

  test('data-target picks the element by selector', async ({page}) => {
    await open(page, {body: '<div id="target"></div><footer></footer>', attrs: 'data-target="#target"'});
    await ready(page);
    await expect(page.locator('#target > .peace')).toHaveCount(1);
    await expect(page.locator('.peace')).toHaveCount(1);
  });

  test('data-link="_self" opens in the same window', async ({page}) => {
    await open(page, {attrs: 'data-link="_self"'});
    await ready(page);
    await expect(page.locator('.peace a')).toHaveAttribute('href', 'https://peace.humancopy.net');
    await expect(page.locator('.peace a')).toHaveAttribute('target', '_self');
  });

  test('data-link="false" has no link', async ({page}) => {
    await open(page, {attrs: 'data-link="false"'});
    await ready(page);
    await expect(page.locator('.peace a')).toHaveText(PEACE);
    await expect(page.locator('.peace a')).not.toHaveAttribute('href');
    await expect(page.locator('.peace a')).not.toHaveAttribute('target');
  });

  test('data-style="symbol" shows ☮ and reveals the text on click', async ({page}) => {
    await open(page, {attrs: 'data-style="symbol"'});
    await ready(page);
    const banner = page.locator('.peace');
    await expect(banner).toHaveClass(/\bsymbol\b/);
    await expect(banner.locator('span')).toHaveText('☮');
    await expect(banner).not.toHaveClass(/\bshow\b/);
    // The invisible link sits on top of the symbol, so fire the click on the symbol itself
    await banner.locator('span').dispatchEvent('click');
    await expect(banner).toHaveClass(/\bshow\b/);
  });
});

test.describe('peaceJS()', () => {
  const body = '<div id="a"></div><div id="b"></div><div id="c"></div><footer></footer>';

  test('data-auto="true" loads on its own', async ({page}) => {
    await open(page, {attrs: 'data-auto="true"'});
    await ready(page);
    await expect(page.locator('body > .peace')).toHaveCount(1);
  });

  // Anything but "true" turns autoloading off
  for (const value of ['no', '']) {
    test(`data-auto="${value}" waits for a manual call`, async ({page}) => {
      await open(page, {attrs: `data-auto="${value}"`});
      expect(await page.evaluate(() => typeof peaceJS)).toBe('function');
      await expect(page.locator('.peace')).toHaveCount(0);
      await page.evaluate(() => peaceJS());
      await ready(page);
      await expect(page.locator('body > .peace')).toHaveCount(1);
    });
  }

  // On a light page with a dark device: "device" goes white, "background" stays black
  for (const [attribute, option, color] of [['background', 'device', WHITE], ['device', 'background', BLACK]]) {
    test(`{dark: '${option}'} wins over data-dark="${attribute}"`, async ({page}) => {
      await page.emulateMedia({colorScheme: 'dark'});
      await open(page, {head: '<style>body{background:#fff}</style>', attrs: `data-auto="false" data-dark="${attribute}"`});
      await page.evaluate(dark => peaceJS({dark}), option);
      await ready(page);
      await expect(page.locator('.peace a')).toHaveCSS('color', color);
    });
  }

  test('data-auto="false" waits for a manual call', async ({page}) => {
    await open(page, {body, attrs: 'data-auto="false"'});
    expect(await page.evaluate(() => typeof peaceJS)).toBe('function');
    await expect(page.locator('.peace')).toHaveCount(0);

    await page.evaluate(() => peaceJS('#a'));
    await page.evaluate(() => peaceJS(document.getElementById('b')));
    await ready(page);
    await expect(page.locator('#a > .peace')).toHaveCount(1);
    await expect(page.locator('#b > .peace')).toHaveCount(1);
    await expect(page.locator('.peace')).toHaveCount(2);
  });

  test('{target} takes a selector or a DOM element', async ({page}) => {
    await open(page, {body, attrs: 'data-auto="false"'});
    await page.evaluate(() => peaceJS({target: '#a'}));
    await page.evaluate(() => peaceJS({target: document.getElementById('b')}));
    await ready(page);
    await expect(page.locator('#a > .peace')).toHaveCount(1);
    await expect(page.locator('#b > .peace')).toHaveCount(1);
    await expect(page.locator('.peace')).toHaveCount(2);
  });

  test('options win over data- attributes, which fill in the rest', async ({page}) => {
    await open(page, {body, attrs: 'data-auto="false" data-theme="green" data-link="_self" data-style="text"'});

    await page.evaluate(() => peaceJS({target: '#a', theme: 'blue', style: 'symbol', link: false}));
    const options = page.locator('#a > .peace');
    await ready(page, options);
    await expect(options).toHaveClass(/\bsymbol\b.*\bblue\b/);
    await expect(options.locator('a')).toHaveCSS('color', 'rgb(0, 0, 238)');
    await expect(options.locator('a')).not.toHaveAttribute('href');

    await page.evaluate(() => peaceJS('#b'));
    const attributes = page.locator('#b > .peace');
    await ready(page, attributes);
    await expect(attributes).toHaveClass(/\btext\b.*\bgreen\b/);
    await expect(attributes.locator('a')).toHaveCSS('color', 'rgb(0, 238, 0)');
    await expect(attributes.locator('a')).toHaveAttribute('target', '_self');
  });

  test('a target that matches nothing falls back to <footer>', async ({page}) => {
    await open(page, {body, attrs: 'data-auto="false"'});
    await page.evaluate(() => peaceJS('#missing'));
    await ready(page);
    await expect(page.locator('footer > .peace')).toHaveCount(1);
  });

  test('a target that matches nothing falls back to <body> without a <footer>', async ({page}) => {
    await open(page, {body: '<div id="a"></div>', attrs: 'data-auto="false"'});
    await page.evaluate(() => peaceJS('#missing'));
    await ready(page);
    await expect(page.locator('body > .peace')).toHaveCount(1);
  });

  // When peace.js is bundled into another file there is no <script src="…peace.js"> to read
  for (const [label, markup, where] of [['<footer>', '<main></main><footer></footer>', 'footer'], ['<body>', '<main></main>', 'body']]) {
    test(`bundled without its own <script> tag, peaceJS() goes to ${label}`, async ({page}) => {
      await page.route('**/bundle.js', route => route.fulfill({
        contentType: 'text/javascript',
        body: fs.readFileSync(path.join(__dirname, '..', src()), 'utf8'),
      }));
      await open(page, {body: `${markup}<script src="/bundle.js"></script>`});
      await expect(page.locator('.peace')).toHaveCount(0);
      await page.evaluate(() => peaceJS());
      await ready(page);
      await expect(page.locator(`${where} > .peace`)).toHaveCount(1);
      await expect(page.locator('.peace a')).toHaveCSS('color', BLACK);
      await expect(page.locator('link[rel=stylesheet]')).toHaveAttribute('href', /^https:\/\/cdn\.jsdelivr\.net\/npm\/peace\.js@[\d.]+\/dist\/peace\.min\.css$/);
    });
  }
});

// A file named peace.min.js, outside any peace.js folder, still finds its own <script> tag
test('a self-hosted /js/peace.min.js loads on its own and reads its data- attributes', async ({page, files}) => {
  await page.route('**/js/peace.min.*', route => route.fulfill({path: path.join(__dirname, '..', route.request().url().endsWith('.css') ? files.css : files.js)}));
  await open(page, {body: '<main></main><div id="here"></div>', script: '<script src="/js/peace.min.js" data-target="#here" data-theme="red" data-style="symbol"></script>'});
  await ready(page);
  await expect(page.locator('#here > .peace')).toHaveClass(/\bsymbol\b.*\bred\b/);
});

// Wherever the script is installed, its stylesheet comes from the same place
test.describe('stylesheet', () => {
  const CDN = /^https:\/\/cdn\.jsdelivr\.net\/npm\/peace\.js@[\d.]+\/dist\/peace\.min\.css$/;
  const cases = [
    // Self-hosted, with the address relative, absolute, or with a query or hash
    ['peace.js', '/peace.css'],
    ['/peace.js', '/peace.css'],
    ['/js/peace.js?v=2', '/js/peace.css?v=2'],
    ['/js/peace.js#top', '/js/peace.css#top'],
    ['/js/peace.min.js', '/js/peace.min.css'],
    ['/bower_components/peace.js/dist/peace.min.js', '/bower_components/peace.js/dist/peace.min.css'],
    // Self-hosted in folders named like CDN paths, which are still files
    ['/npm/peace.js', '/npm/peace.css'],
    ['/gh/humancopy/peace.js', '/gh/humancopy/peace.css'],
    ['/unpkg.com/peace.js', '/unpkg.com/peace.css'],
    // CDNs, by file name
    ['https://cdn.jsdelivr.net/npm/peace.js@2.0.0/dist/peace.min.js', 'https://cdn.jsdelivr.net/npm/peace.js@2.0.0/dist/peace.min.css'],
    ['https://cdn.jsdelivr.net/npm/peace.js@2.0.0/peace.min.js', 'https://cdn.jsdelivr.net/npm/peace.js@2.0.0/peace.min.css'],
    ['https://cdn.jsdelivr.net/gh/humancopy/peace.js@master/peace.js', 'https://cdn.jsdelivr.net/gh/humancopy/peace.js@master/peace.css'],
    ['https://unpkg.com/peace.js@2.0.0/dist/peace.min.js', 'https://unpkg.com/peace.js@2.0.0/dist/peace.min.css'],
    ['https://cdnjs.cloudflare.com/ajax/libs/peace.js/2.0.0/peace.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/peace.js/2.0.0/peace.min.css'],
    // CDNs, by package name alone, which has no file to swap: jsDelivr
    ['https://cdn.jsdelivr.net/npm/peace.js', CDN],
    ['https://cdn.jsdelivr.net/npm/peace.js@2.0.0', CDN],
    ['https://cdn.jsdelivr.net/npm/peace.js@2', CDN],
    ['https://cdn.jsdelivr.net/gh/humancopy/peace.js', CDN],
    ['https://cdn.jsdelivr.net/gh/humancopy/peace.js@master', CDN],
    ['https://unpkg.com/peace.js', CDN],
    ['https://unpkg.com/peace.js@2.0.0', CDN],
    ['https://cdn.jsdelivr.net/npm/peace.js?v=2', CDN],
    ['https://unpkg.com/peace.js#top', CDN],
  ];
  for (const [script, stylesheet] of cases) {
    test(`${script} loads ${stylesheet}`, async ({page, baseURL, files}) => {
      // Serve peace.js and peace.css at any of these addresses, other than the jsDelivr fallback the fixture already serves
      const ours = url => !CDN.test(url.href) && /peace/.test(url.pathname);
      await page.route(ours, route => route.fulfill({path: path.join(__dirname, '..', /\.css([?#]|$)/.test(route.request().url()) ? files.css : files.js)}));
      await open(page, {script: `<script src="${script}"></script>`});
      await ready(page);
      const href = await page.locator('link[rel=stylesheet]').getAttribute('href');
      if (stylesheet instanceof RegExp) expect(href).toMatch(stylesheet);
      else expect(href).toBe(new URL(stylesheet, baseURL).href);
    });
  }
});
