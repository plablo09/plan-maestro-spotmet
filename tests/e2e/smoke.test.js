import { test, expect } from '@playwright/test';

test('should have no console errors or warnings', async ({ page }) => {
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    // Ignore WebGL driver/performance warnings in headless environment
    if (text.includes('WebGL') || text.includes('GPU stall') || text.includes('GL Driver Message')) {
      return;
    }
    if (msg.type() === 'error' || msg.type() === 'warning') {
      logs.push(`[${msg.type().toUpperCase()}] ${text}`);
    }
  });

  page.on('pageerror', err => {
    // Ignore WebGL initialization errors in headless environment
    if (err.message.includes('Failed to initialize WebGL') || err.message.includes('webglcontextcreationerror')) {
      return;
    }
    logs.push(`[PAGE ERROR] ${err.message}`);
  });

  await page.goto('/');
  
  // Wait for the map to load and initial animations/renders
  await page.waitForTimeout(2000);

  expect(logs, `Console logs contained errors or warnings: ${logs.join(', ')}`).toHaveLength(0);
});
