const {defineConfig, devices} = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  // Kept in test-results/, which CI uploads when a run fails
  use: {trace: 'retain-on-failure', screenshot: 'only-on-failure'},
  // Every test runs on the source files and again on the minified ones in dist/
  projects: [
    {name: 'source', use: {...devices['Desktop Chrome'], files: {js: 'peace.js', css: 'peace.css'}}},
    {name: 'dist', use: {...devices['Desktop Chrome'], files: {js: 'dist/peace.min.js', css: 'dist/peace.min.css'}}},
  ],
});
