// Simple visual test script to verify the enhanced website
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testVisualEnhancement() {
  console.log('🎨 Testing enhanced visual design...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the enhanced website
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
    
    // Wait for images to load
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({
      path: 'enhanced-website-screenshot.png',
      fullPage: true
    });
    
    // Test responsive design
    await page.setViewport({ width: 768, height: 1024 });
    await page.screenshot({
      path: 'enhanced-website-mobile.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots captured successfully!');
    console.log('📸 Files saved:');
    console.log('   - enhanced-website-screenshot.png (Desktop)');
    console.log('   - enhanced-website-mobile.png (Mobile)');
    
    // Test key visual elements
    const elements = await page.evaluate(() => {
      return {
        heroTitle: document.querySelector('.hero-title')?.textContent,
        searchInput: document.querySelector('.search-input')?.placeholder,
        foodCards: document.querySelectorAll('.food-card').length,
        cuisineCards: document.querySelectorAll('.cuisine-card').length,
        imagesLoaded: document.querySelectorAll('img').length
      };
    });
    
    console.log('🔍 Visual elements found:');
    console.log(`   - Hero title: "${elements.heroTitle}"`);
    console.log(`   - Search placeholder: "${elements.searchInput}"`);
    console.log(`   - Food cards: ${elements.foodCards}`);
    console.log(`   - Cuisine cards: ${elements.cuisineCards}`);
    console.log(`   - Images loaded: ${elements.imagesLoaded}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testVisualEnhancement().catch(console.error);
