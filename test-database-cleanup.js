// Test script to verify database cleanup
// Run with: node test-database-cleanup.js

const API_URL = 'https://pairdish.mabdulrahim.workers.dev';

async function testDatabaseState() {
  console.log('Testing PairDish Database State...\n');
  
  try {
    // Test 1: Check total number of dishes
    console.log('1. Fetching all dishes...');
    const dishesResponse = await fetch(`${API_URL}/api/dishes`);
    const dishesData = await dishesResponse.json();
    
    if (dishesData.success && dishesData.data) {
      console.log(`   ✓ Total dishes: ${dishesData.data.length}`);
      
      // Show first 5 dishes
      console.log('   First 5 dishes:');
      dishesData.data.slice(0, 5).forEach((dish, index) => {
        console.log(`     ${index + 1}. ${dish.name} (slug: ${dish.slug})`);
        console.log(`        Image: ${dish.image_url?.substring(0, 50)}...`);
      });
    }
    
    // Test 2: Check a specific dish pairing
    console.log('\n2. Testing specific dish pairing (15-bean-soup)...');
    const pairingResponse = await fetch(`${API_URL}/api/pairings/what-to-serve-with-15-bean-soup`);
    const pairingData = await pairingResponse.json();
    
    if (pairingData.success && pairingData.data) {
      console.log(`   ✓ Main dish: ${pairingData.data.main_dish.name}`);
      console.log(`   ✓ Number of pairings: ${pairingData.data.side_dishes.length}`);
      console.log(`   ✓ Main dish slug: ${pairingData.data.main_dish.slug}`);
      console.log(`   ✓ Main dish image: ${pairingData.data.main_dish.image_url?.substring(0, 50)}...`);
    }
    
    // Test 3: Check frontend transformation
    console.log('\n3. Testing frontend-compatible endpoint...');
    const frontendResponse = await fetch(`${API_URL}/dishes`);
    const frontendData = await frontendResponse.json();
    
    if (Array.isArray(frontendData) && frontendData.length > 0) {
      const firstDish = frontendData[0];
      console.log(`   ✓ First dish slug (should not have prefix): ${firstDish.slug}`);
      console.log(`   ✓ Has imageUrl field: ${firstDish.imageUrl ? 'Yes' : 'No'}`);
      console.log(`   ✓ Has category field: ${firstDish.category ? 'Yes' : 'No'}`);
    }
    
    // Test 4: Check URL construction
    console.log('\n4. Testing URL construction...');
    if (Array.isArray(frontendData) && frontendData.length > 0) {
      const testSlug = frontendData[0].slug;
      const expectedUrl = `/what-to-serve-with-${testSlug}`;
      console.log(`   ✓ Original slug: ${testSlug}`);
      console.log(`   ✓ Expected URL: ${expectedUrl}`);
      
      // Check if the URL would be double-prefixed
      if (testSlug.includes('what-to-serve-with-')) {
        console.log('   ⚠️  WARNING: Slug already contains prefix, URL will be double-prefixed!');
      } else {
        console.log('   ✓ URL construction looks correct');
      }
    }
    
  } catch (error) {
    console.error('Error testing database:', error);
  }
}

// Run the test
testDatabaseState();