import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    permissions: ['clipboard-read', 'clipboard-write'],
    locale: 'ko-KR',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
          reuseExistingServer: true,
          timeout: 120000,
        },
      }),
})
