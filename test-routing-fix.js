// Test the routing fix for /what-to-serve-with-{slug} URLs
const fetch = require('node-fetch');

const baseUrl = 'https://pairdish.mabdulrahim.workers.dev';

async function testRouting() {
  console.log('Testing PairDish routing fix...\n');
  
  // Test cases
  const testUrls = [
    '/what-to-serve-with/15-bean-soup',
    '/what-to-serve-with/chicken-parmesan',
    '/what-to-serve-with/grilled-salmon'
  ];
  
  for (const url of testUrls) {
    console.log(`Testing ${url}...`);
    
    try {
      const response = await fetch(baseUrl + url);
      const status = response.status;
      const contentType = response.headers.get('content-type');
      
      console.log(`  Status: ${status}`);
      console.log(`  Content-Type: ${contentType}`);
      
      if (status === 200) {
        const html = await response.text();
        
        // Check if it's an HTML page
        if (html.includes('<!DOCTYPE html>')) {
          console.log('  ✓ Returns HTML page');
        }
        
        // Check if it contains the dish name
        if (html.includes('What to Serve with')) {
          console.log('  ✓ Contains dish header');
        }
        
        // Check if it has pairings section
        if (html.includes('Perfect Pairings')) {
          console.log('  ✓ Contains pairings section');
        }
      } else if (status === 404) {
        console.log('  ✗ Dish not found (404)');
      } else {
        console.log(`  ✗ Unexpected status: ${status}`);
      }
      
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Also test the API endpoints
  console.log('Testing API endpoints...\n');
  
  const apiEndpoints = [
    '/api/dishes/15-bean-soup',
    '/api/pairings/15-bean-soup'
  ];
  
  for (const endpoint of apiEndpoints) {
    console.log(`Testing ${endpoint}...`);
    
    try {
      const response = await fetch(baseUrl + endpoint);
      const status = response.status;
      const contentType = response.headers.get('content-type');
      
      console.log(`  Status: ${status}`);
      console.log(`  Content-Type: ${contentType}`);
      
      if (status === 200 && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`  ✓ Returns valid JSON`);
        
        if (data.success !== undefined) {
          console.log(`  ✓ Success: ${data.success}`);
        }
      }
      
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

// Run the test
testRouting().catch(console.error);