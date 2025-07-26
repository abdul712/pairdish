#!/usr/bin/env python3
"""
PairDish Web Scraper using Apify
Scrapes recipe pairing data from various food websites
"""

import os
import json
import time
import requests
from typing import Dict, List, Optional
from datetime import datetime
from apify_client import ApifyClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
APIFY_TOKEN = os.getenv('APIFY_TOKEN')
WORKER_ENDPOINT = os.getenv('WORKER_ENDPOINT', 'https://pairdish.mabdulrahim.workers.dev/api/import-dishes')

# Initialize Apify client
client = ApifyClient(APIFY_TOKEN)

# Popular dishes to scrape pairings for
MAIN_DISHES = [
    {"name": "Chicken Biryani", "search": "what to serve with chicken biryani"},
    {"name": "Lamb Curry", "search": "what to serve with lamb curry"},
    {"name": "Beef Stroganoff", "search": "what to serve with beef stroganoff"},
    {"name": "Pad Thai", "search": "what to serve with pad thai"},
    {"name": "Pizza", "search": "what to serve with pizza"},
    {"name": "BBQ Ribs", "search": "what to serve with bbq ribs"},
    {"name": "Salmon", "search": "what to serve with salmon"},
    {"name": "Pasta Carbonara", "search": "what to serve with pasta carbonara"},
    {"name": "Tacos", "search": "what to serve with tacos"},
    {"name": "Fried Chicken", "search": "what to serve with fried chicken"},
    {"name": "Sushi", "search": "what to serve with sushi"},
    {"name": "Steak", "search": "what to serve with steak"},
    {"name": "Lasagna", "search": "what to serve with lasagna"},
    {"name": "Fish and Chips", "search": "what to serve with fish and chips"},
    {"name": "Pulled Pork", "search": "what to serve with pulled pork"},
]

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from dish name"""
    return name.lower().strip().replace(' ', '-').replace(',', '').replace("'", '')

def extract_cuisine(dish_name: str) -> str:
    """Extract cuisine type from dish name"""
    cuisines = {
        'biryani': 'Indian',
        'curry': 'Indian',
        'pad thai': 'Thai',
        'sushi': 'Japanese',
        'pasta': 'Italian',
        'pizza': 'Italian',
        'lasagna': 'Italian',
        'tacos': 'Mexican',
        'stroganoff': 'Russian',
        'bbq': 'American',
        'ribs': 'American'
    }
    
    dish_lower = dish_name.lower()
    for key, cuisine in cuisines.items():
        if key in dish_lower:
            return cuisine
    return 'International'

def extract_dietary_tags(text: str) -> List[str]:
    """Extract dietary tags from text"""
    tags = []
    text_lower = text.lower()
    
    dietary_keywords = {
        'vegetarian': ['vegetarian', 'veggie'],
        'vegan': ['vegan', 'plant-based'],
        'gluten-free': ['gluten-free', 'gluten free', 'no gluten'],
        'dairy-free': ['dairy-free', 'dairy free', 'no dairy'],
        'low-carb': ['low-carb', 'low carb', 'keto'],
        'healthy': ['healthy', 'nutritious', 'light']
    }
    
    for tag, keywords in dietary_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            tags.append(tag)
    
    return tags

def scrape_recipe_pairings():
    """Scrape recipe pairing suggestions using Apify Web Scraper"""
    
    # Use Apify's Web Scraper
    actor = client.actor("apify/web-scraper")
    
    all_results = []
    
    for main_dish in MAIN_DISHES:
        print(f"\nScraping pairings for: {main_dish['name']}")
        
        # Configure the scraper for recipe sites
        run_input = {
            "startUrls": [
                {"url": f"https://www.google.com/search?q={main_dish['search'].replace(' ', '+')}+recipe+side+dishes"}
            ],
            "linkSelector": "a[href*='recipe'], a[href*='food'], a[href*='dish']",
            "globs": [
                {"glob": "https://www.allrecipes.com/**"},
                {"glob": "https://www.foodnetwork.com/**"},
                {"glob": "https://www.seriouseats.com/**"},
                {"glob": "https://www.simplyrecipes.com/**"}
            ],
            "pseudoUrls": [],
            "pageFunction": """
            async function pageFunction(context) {
                const { $, request, log } = context;
                
                // Extract data based on common recipe site patterns
                const results = {
                    url: request.url,
                    title: $('h1').first().text().trim() || $('title').text().trim(),
                    description: $('meta[name="description"]').attr('content') || '',
                    sideDishes: []
                };
                
                // Try to find side dish recommendations
                const sidePatterns = [
                    'h2:contains("side"), h3:contains("side")',
                    'h2:contains("serve with"), h3:contains("serve with")',
                    'h2:contains("accompaniments"), h3:contains("accompaniments")',
                    '.recipe-card', '.recipe-item',
                    'li:contains("serve")'
                ];
                
                for (const pattern of sidePatterns) {
                    $(pattern).each((i, el) => {
                        const $el = $(el);
                        const text = $el.text().trim();
                        
                        // Look for list items or nearby content
                        $el.nextAll('ul, ol, p').first().find('li, a').each((j, item) => {
                            const dishName = $(item).text().trim();
                            if (dishName && dishName.length > 3 && dishName.length < 100) {
                                results.sideDishes.push({
                                    name: dishName,
                                    description: ''
                                });
                            }
                        });
                    });
                }
                
                // Also look for recipe links
                $('a[href*="recipe"]').each((i, el) => {
                    const $el = $(el);
                    const text = $el.text().trim();
                    if (text && text.length > 3 && text.length < 50 && !text.toLowerCase().includes('privacy')) {
                        results.sideDishes.push({
                            name: text,
                            description: $el.attr('title') || ''
                        });
                    }
                });
                
                // Deduplicate
                const seen = new Set();
                results.sideDishes = results.sideDishes.filter(dish => {
                    const key = dish.name.toLowerCase();
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
                
                return results;
            }
            """,
            "proxyConfiguration": {
                "useApifyProxy": True
            },
            "maxPagesPerCrawl": 10,
            "maxRequestsPerCrawl": 20,
            "maxConcurrency": 5,
            "pageLoadTimeoutSecs": 60,
            "pageFunctionTimeoutSecs": 60
        }
        
        try:
            # Run the actor
            print("  Running Apify actor...")
            run = actor.call(run_input=run_input)
            
            # Collect results
            items = []
            for item in client.dataset(run['defaultDatasetId']).iterate_items():
                if item.get('sideDishes'):
                    items.append(item)
            
            print(f"  Found {len(items)} pages with side dish suggestions")
            
            # Process and combine results
            all_side_dishes = []
            for item in items:
                for dish in item.get('sideDishes', []):
                    if dish['name']:
                        all_side_dishes.append(dish)
            
            # Deduplicate and limit to 15
            unique_dishes = {}
            for dish in all_side_dishes:
                key = dish['name'].lower().strip()
                if key not in unique_dishes:
                    unique_dishes[key] = dish
            
            side_dishes = list(unique_dishes.values())[:15]
            
            if side_dishes:
                result = {
                    'main_dish': main_dish,
                    'side_dishes': side_dishes,
                    'scraped_at': datetime.now().isoformat()
                }
                all_results.append(result)
                print(f"  Successfully found {len(side_dishes)} unique side dishes")
            else:
                print("  No side dishes found")
            
            # Rate limiting
            time.sleep(5)
            
        except Exception as e:
            print(f"  Error scraping {main_dish['name']}: {e}")
            continue
    
    return all_results

def format_for_api(scraped_data: Dict) -> Dict:
    """Format scraped data for the PairDish API"""
    main_dish = scraped_data['main_dish']
    
    formatted = {
        'main_dish': {
            'name': main_dish['name'],
            'slug': generate_slug(main_dish['name']),
            'description': f"Delicious {main_dish['name']} - a perfect main course for any occasion",
            'dish_type': 'main',
            'cuisine': extract_cuisine(main_dish['name']),
            'seo_title': f"What to Serve with {main_dish['name']} - 15 Best Side Dishes | PairDish",
            'seo_description': f"Discover the perfect side dishes to serve with {main_dish['name']}. From classic pairings to creative options, find the best accompaniments for your meal.",
            'keywords': [
                f"what to serve with {main_dish['name'].lower()}",
                f"{main_dish['name'].lower()} side dishes",
                f"best sides for {main_dish['name'].lower()}",
                f"{main_dish['name'].lower()} accompaniments",
                f"{main_dish['name'].lower()} pairings"
            ]
        },
        'side_dishes': []
    }
    
    # Format side dishes
    for i, side in enumerate(scraped_data['side_dishes']):
        side_name = side['name'].strip()
        formatted_side = {
            'name': side_name,
            'slug': generate_slug(side_name),
            'description': side.get('description', f"Perfect side dish to complement {main_dish['name']}"),
            'dish_type': 'side',
            'dietary_tags': extract_dietary_tags(side_name + ' ' + side.get('description', ''))
        }
        
        # Add basic recipe structure for some dishes
        if any(word in side_name.lower() for word in ['salad', 'rice', 'bread', 'potatoes']):
            formatted_side['recipe'] = {
                'ingredients': [f"Fresh ingredients for {side_name}"],
                'instructions': [f"Prepare {side_name} according to your favorite recipe"],
                'prep_time': 15,
                'cook_time': 20,
                'servings': 4,
                'difficulty': 'medium'
            }
        
        formatted['side_dishes'].append(formatted_side)
    
    return formatted

def send_to_worker(data: Dict) -> bool:
    """Send formatted data to Cloudflare Worker"""
    try:
        response = requests.post(
            WORKER_ENDPOINT,
            json=data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Successfully imported {data['main_dish']['name']}")
            print(f"   Response: {result.get('message', 'Success')}")
            return True
        else:
            print(f"❌ Failed to import {data['main_dish']['name']}")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error sending to worker: {e}")
        return False

def main():
    """Main execution"""
    print("=== PairDish Apify Web Scraper ===")
    print(f"Worker Endpoint: {WORKER_ENDPOINT}\n")
    
    if not APIFY_TOKEN:
        print("ERROR: Please set APIFY_TOKEN in .env file")
        return
    
    # Scrape data
    print("Starting web scraping process...")
    scraped_results = scrape_recipe_pairings()
    
    print(f"\nScraped data for {len(scraped_results)} dishes")
    
    # Process and send each result
    success_count = 0
    for result in scraped_results:
        print(f"\nProcessing {result['main_dish']['name']}...")
        
        # Format for API
        formatted_data = format_for_api(result)
        
        # Send to worker
        if send_to_worker(formatted_data):
            success_count += 1
        
        # Rate limiting between imports
        time.sleep(2)
    
    print(f"\n=== Summary ===")
    print(f"Total dishes processed: {len(scraped_results)}")
    print(f"Successfully imported: {success_count}")
    print(f"Failed: {len(scraped_results) - success_count}")
    
    # Save backup
    with open('scraped_pairings_backup.json', 'w') as f:
        json.dump(scraped_results, f, indent=2)
    print("\nBackup saved to scraped_pairings_backup.json")

if __name__ == "__main__":
    main()