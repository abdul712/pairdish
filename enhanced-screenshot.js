const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to the website...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    
    // Wait for the page to load and for images to start loading
    await page.waitForTimeout(5000);
    
    // Wait for images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images, img => 
          img.complete || new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        )
      );
    });
    
    // Scroll to load more content
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'final-website-screenshot.png', 
      fullPage: true,
      quality: 90
    });
    
    console.log('Enhanced screenshot saved as final-website-screenshot.png');
    
    // Also test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'final-website-mobile.png', 
      fullPage: true,
      quality: 90
    });
    
    console.log('Mobile screenshot saved as final-website-mobile.png');
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
  }
  
  await browser.close();
})();