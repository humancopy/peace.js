const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const {minify} = require('terser');
const {test, expect} = require('@playwright/test');

// Minified and gzipped, the way the CDN serves it
const BUDGET = 1050;

test('peace.js fits the size budget', async () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'peace.js'), 'utf8');
  const {code} = await minify(source, {compress: true, mangle: true});
  const size = zlib.gzipSync(code, {level: 9}).length;
  console.log(`peace.js: ${source.length} B source, ${code.length} B minified, ${size} B gzipped (budget ${BUDGET} B)`);
  test.info().annotations.push({type: 'size', description: `${size} B gzipped`});
  expect(size).toBeLessThanOrEqual(BUDGET);
});
