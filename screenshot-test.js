const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Wait for any dynamic content
    await page.screenshot({ path: 'current-website.png', fullPage: true });
    console.log('Screenshot saved as current-website.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  }
  
  await browser.close();
})();