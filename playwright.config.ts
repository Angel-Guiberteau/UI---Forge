import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/UI---Forge/',
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: process.env.CI ? 'off' : 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --base /UI---Forge/ --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/UI---Forge/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
