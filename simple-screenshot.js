const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { timeout: 30000 });
    await page.waitForTimeout(8000); // Wait for content to load
    
    // Take desktop screenshot
    await page.screenshot({ 
      path: 'final-design.png', 
      fullPage: true 
    });
    console.log('Final screenshot saved as final-design.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();