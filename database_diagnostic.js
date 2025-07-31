#!/usr/bin/env node

/**
 * Database Diagnostic Tool for PairDish
 * This script helps diagnose database issues and provides fixes
 */

const API_BASE = 'https://pairdish.mabdulrahim.workers.dev';

async function checkDishes() {
  console.log('🔍 Checking dishes in database...\n');
  
  try {
    const response = await fetch(`${API_BASE}/api/debug/dishes`);
    const data = await response.json();
    
    if (!data.success) {
      console.error('❌ Failed to fetch dishes:', data.error);
      return;
    }
    
    console.log(`✅ Found ${data.total} dishes in database:\n`);
    
    if (data.dishes && data.dishes.length > 0) {
      console.table(data.dishes.map(d => ({
        ID: d.id,
        Name: d.name,
        Slug: d.slug,
        Type: d.dish_type
      })));
      
      // Check for cheese souffle specifically
      const cheeseSouffle = data.dishes.find(d => 
        d.name.toLowerCase().includes('souffle') || 
        d.slug.includes('souffle')
      );
      
      if (cheeseSouffle) {
        console.log(`\n✅ Found Cheese Souffle:`);
        console.log(`   Name: ${cheeseSouffle.name}`);
        console.log(`   Slug: ${cheeseSouffle.slug}`);
        console.log(`   URL: ${API_BASE}/what-to-serve-with/${cheeseSouffle.slug}`);
      } else {
        console.log(`\n⚠️  Cheese Souffle not found in the first 20 dishes`);
      }
    } else {
      console.log('⚠️  No dishes found in database!');
      console.log('\n💡 To fix this, run the following SQL script:');
      console.log('   wrangler d1 execute pairdish-db --file=seed_initial_data.sql');
    }
    
  } catch (error) {
    console.error('❌ Error checking dishes:', error.message);
  }
}

async function testSlugVariations(slug) {
  console.log(`\n🔍 Testing slug variations for: "${slug}"\n`);
  
  const variations = [
    slug,
    slug.replace(/^a-/, ''),
    `what-to-serve-with-${slug}`,
    slug.replace(/^(a|an|the)-/, '')
  ];
  
  for (const variation of variations) {
    try {
      const url = `${API_BASE}/what-to-serve-with/${variation}`;
      const response = await fetch(url, { redirect: 'manual' });
      
      if (response.status === 200) {
        console.log(`✅ Found with slug: "${variation}"`);
        console.log(`   URL: ${url}`);
        break;
      } else if (response.status === 301 || response.status === 302) {
        const location = response.headers.get('location');
        console.log(`↪️  Redirect from: "${variation}"`);
        console.log(`   To: ${location}`);
      } else {
        console.log(`❌ Not found: "${variation}" (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ Error testing "${variation}": ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 PairDish Database Diagnostic Tool\n');
  
  // Check what dishes exist
  await checkDishes();
  
  // Test specific slug variations
  await testSlugVariations('a-cheese-souffle');
  await testSlugVariations('cheese-souffle');
  
  console.log('\n💡 Recommendations:');
  console.log('1. If no dishes found, seed the database with: wrangler d1 execute pairdish-db --file=seed_initial_data.sql');
  console.log('2. The system now handles multiple slug formats and redirects to canonical URLs');
  console.log('3. Use the debug endpoint to see all dishes: GET /api/debug/dishes');
}

main().catch(console.error);