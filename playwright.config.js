const {defineConfig, devices} = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  projects: [{name: 'chromium', use: devices['Desktop Chrome']}],
});
