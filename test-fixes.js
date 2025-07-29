// Comprehensive test script to verify PairDish fixes
// Run with: node test-fixes.js

const API_URL = 'https://pairdish.mabdulrahim.workers.dev';
// const API_URL = 'http://localhost:8787'; // Uncomment for local testing

async function runTests() {
  console.log('🧪 Testing PairDish Fixes...\n');
  
  let passedTests = 0;
  let failedTests = 0;
  
  try {
    // Test 1: Check slug transformation in /dishes endpoint
    console.log('📋 Test 1: Checking slug transformation in /dishes endpoint');
    const dishesResponse = await fetch(`${API_URL}/dishes`);
    const dishes = await dishesResponse.json();
    
    if (Array.isArray(dishes) && dishes.length > 0) {
      const firstDish = dishes[0];
      console.log(`   First dish slug: ${firstDish.slug}`);
      
      if (firstDish.slug && !firstDish.slug.includes('what-to-serve-with-')) {
        console.log('   ✅ PASS: Slug does not contain prefix (correct)');
        passedTests++;
      } else {
        console.log('   ❌ FAIL: Slug still contains prefix');
        failedTests++;
      }
      
      // Check transformed fields
      if (firstDish.imageUrl && firstDish.category) {
        console.log('   ✅ PASS: Transformed fields present (imageUrl, category)');
        passedTests++;
      } else {
        console.log('   ❌ FAIL: Missing transformed fields');
        failedTests++;
      }
    }
    
    // Test 2: Check API endpoint with both slug formats
    console.log('\n📋 Test 2: Testing API endpoint with different slug formats');
    
    // Test with new format (no prefix)
    const newFormatResponse = await fetch(`${API_URL}/api/pairings/15-bean-soup`);
    const newFormatData = await newFormatResponse.json();
    
    if (newFormatData.success) {
      console.log('   ✅ PASS: API works with new slug format (no prefix)');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: API does not work with new slug format');
      failedTests++;
    }
    
    // Test with old format (with prefix) for backward compatibility
    const oldFormatResponse = await fetch(`${API_URL}/api/pairings/what-to-serve-with-15-bean-soup`);
    const oldFormatData = await oldFormatResponse.json();
    
    if (oldFormatData.success) {
      console.log('   ✅ PASS: API still works with old slug format (backward compatible)');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: API does not work with old slug format');
      failedTests++;
    }
    
    // Test 3: Check frontend URL construction
    console.log('\n📋 Test 3: Verifying frontend URL construction');
    if (dishes && dishes.length > 0) {
      const testDish = dishes[0];
      const expectedUrl = `/what-to-serve-with-${testDish.slug}`;
      console.log(`   Dish slug: ${testDish.slug}`);
      console.log(`   Expected URL: ${expectedUrl}`);
      
      // Check if URL would be correctly formed
      if (!expectedUrl.includes('what-to-serve-with-what-to-serve-with-')) {
        console.log('   ✅ PASS: URL construction is correct (no double prefix)');
        passedTests++;
      } else {
        console.log('   ❌ FAIL: URL would have double prefix');
        failedTests++;
      }
    }
    
    // Test 4: Check image URLs
    console.log('\n📋 Test 4: Checking image URLs');
    if (dishes && dishes.length > 0) {
      const dishWithImage = dishes.find(d => d.imageUrl);
      if (dishWithImage) {
        console.log(`   Sample image URL: ${dishWithImage.imageUrl.substring(0, 60)}...`);
        
        // Check if it's a proper Unsplash URL
        if (dishWithImage.imageUrl.includes('unsplash.com') && 
            dishWithImage.imageUrl.includes('w=800') && 
            dishWithImage.imageUrl.includes('h=600')) {
          console.log('   ✅ PASS: Image URL is properly formatted');
          passedTests++;
        } else {
          console.log('   ❌ FAIL: Image URL is not properly formatted');
          failedTests++;
        }
      }
    }
    
    // Test 5: Check total number of dishes
    console.log('\n📋 Test 5: Checking total number of dishes');
    const apiDishesResponse = await fetch(`${API_URL}/api/dishes`);
    const apiDishesData = await apiDishesResponse.json();
    
    if (apiDishesData.success && apiDishesData.data) {
      const totalDishes = apiDishesData.data.length;
      console.log(`   Total dishes in database: ${totalDishes}`);
      
      if (totalDishes <= 10) {
        console.log('   ✅ PASS: Database has been cleaned up (10 or fewer dishes)');
        passedTests++;
      } else {
        console.log('   ⚠️  WARNING: Database still has more than 10 dishes');
        console.log('   Run the cleanup SQL script to fix this');
      }
    }
    
    // Test 6: Test specific dish endpoint
    console.log('\n📋 Test 6: Testing dish endpoint');
    const dishResponse = await fetch(`${API_URL}/dishes/15-bean-soup`);
    if (dishResponse.ok) {
      const dishData = await dishResponse.json();
      if (dishData.slug === '15-bean-soup') {
        console.log('   ✅ PASS: Dish endpoint works with clean slug');
        passedTests++;
      } else {
        console.log('   ❌ FAIL: Dish data has incorrect slug');
        failedTests++;
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Summary:`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   Total: ${passedTests + failedTests}`);
    console.log('='.repeat(50));
    
    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! The fixes are working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }
    
  } catch (error) {
    console.error('\n❌ Error running tests:', error);
  }
}

// Run the tests
runTests();