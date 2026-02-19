import { defineConfig } from '@playwright/test';

const pythonCmd = process.env.CI ? 'python3' : './venv/bin/python';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:8000',
    headless: true,
  },
  webServer: {
    command: `PYTHONPATH=. ${pythonCmd} -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`,
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
