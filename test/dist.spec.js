const fs = require('fs');
const path = require('path');
const {test, expect} = require('@playwright/test');
const {build} = require('../scripts/build');

// The files in dist/ are committed for Bower, so they must match the source
test('dist/ is up to date, run `npm run build` if not', async () => {
  test.skip(test.info().project.name != 'source', 'checked once');
  for (const [name, content] of Object.entries(await build())) {
    expect(fs.readFileSync(path.join(__dirname, '..', name), 'utf8'), name).toBe(content);
  }
});
