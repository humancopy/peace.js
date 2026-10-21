const {defineConfig, devices} = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  // Kept in test-results/, which CI uploads when a run fails
  use: {trace: 'retain-on-failure', screenshot: 'only-on-failure'},
  projects: [{name: 'chromium', use: devices['Desktop Chrome']}],
});
