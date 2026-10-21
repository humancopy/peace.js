const path = require('path');
const {test: base, expect} = require('@playwright/test');
const {start} = require('./server');

const CDN_CSS = 'https://cdn.jsdelivr.net/npm/peace.js@*/peace.min.css';

const HOME = 'https://peace.humancopy.net';

const BLACK ='rgb(0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';

const test = base.extend({
  // One static server per worker
  server: [async ({}, use) => {
    const server = await start();
    await use(server);
    await server.close();
  }, {scope: 'worker'}],

  baseURL: async ({server}, use) => use(server.url),

  // Every page answers the CDN stylesheet (used when peace.js is bundled) with the local peace.css, stays offline,
  // and fails the test on any page error or console warning
  page: async ({context, page, baseURL}, use) => {
    const problems = [], stubbed = new Set();
    page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
    page.on('console', message => {
      // Warnings about what we stubbed (like the empty webfont) are ours, not peace.js's
      if (['warning', 'error'].includes(message.type()) && ![...stubbed].some(url => message.text().includes(url))) {
        problems.push(`${message.type()}: ${message.text()}`);
      }
    });
    // Routed on the context so new tabs get them too. The last matching route wins, so the catch-all goes first
    await context.route(url => !url.href.startsWith(baseURL), route => {
      stubbed.add(route.request().url());
      return route.fulfill({status: 204});
    });
    await context.route(CDN_CSS, route => route.fulfill({path: path.join(__dirname, '..', 'peace.css')}));
    await context.route(`${HOME}/**`, route => route.fulfill({contentType: 'text/html', body: '<!doctype html><title>Peace</title>'}));
    await use(page);
    expect(problems, 'page errors and console warnings').toEqual([]);
  },
});

// Opens a page with the given head and body. Unless body says otherwise, peace.js
// goes at the end of <body> with the given attributes.
async function open(page, {head = '', body = '', attrs = '', script = `<script src="/peace.js" ${attrs}></script>`} = {}) {
  const html = `<!doctype html><html><head><meta charset="utf-8">${head}</head><body>${body.includes('<script') ? body : body + script}</body></html>`;
  await page.route('**/fixture.html', route => route.fulfill({contentType: 'text/html', body: html}));
  await page.goto('/fixture.html');
}

// Waits until the banner is styled by peace.css, so "black" is never just the browser default
async function ready(page, banner = page.locator('.peace').first()) {
  await expect(banner).toHaveCSS('opacity', '0.65');
}

async function expectColor(page, color) {
  await ready(page);
  await expect(page.locator('.peace a')).toHaveCSS('color', color);
}

module.exports = {test, expect, open, ready, expectColor, HOME, BLACK, WHITE};
