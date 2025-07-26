#!/usr/bin/env python3
"""
Simplified PairDish Scraper using Apify Web Scraper
This script uses Apify's generic web scraper to extract pairing data
"""

import os
import json
import time
import requests
from typing import Dict, List
from apify_client import ApifyClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
APIFY_TOKEN = os.getenv('APIFY_TOKEN')
WORKER_ENDPOINT = os.getenv('WORKER_ENDPOINT', 'http://localhost:8787/api/import-dishes')

# Initialize Apify client
client = ApifyClient(APIFY_TOKEN)

# Web Scraper actor ID (Apify's official web scraper)
WEB_SCRAPER_ACTOR = 'apify/web-scraper'

def generate_slug(text: str) -> str:
    """Generate URL-friendly slug"""
    return text.lower().strip().replace(' ', '-').replace(',', '').replace("'", '')

def scrape_allrecipes_pairings():
    """Scrape pairing data from AllRecipes or similar sites"""
    
    # Example: Scraping side dishes for chicken biryani
    actor_input = {
        "startUrls": [
            {
                "url": "https://www.allrecipes.com/search?q=what+to+serve+with+chicken+biryani",
                "method": "GET"
            }
        ],
        "keepUrlFragments": False,
        "linkSelector": "a[href*='/recipe/']",
        "pseudoUrls": [
            {
                "purl": "https://www.allrecipes.com/recipe/[.*]",
                "method": "GET"
            }
        ],
        "pageFunction": """
        async function pageFunction(context) {
            const { $, request, log } = context;
            
            // If on search results page
            if (request.url.includes('/search')) {
                log.info('Processing search results page');
                
                const results = [];
                $('.card__detailsContainer').each((i, el) => {
                    const title = $(el).find('.card__title').text().trim();
                    const description = $(el).find('.card__summary').text().trim();
                    const imageUrl = $(el).closest('.card').find('img').attr('data-src') || '';
                    
                    if (title) {
                        results.push({
                            type: 'search_result',
                            title,
                            description,
                            imageUrl
                        });
                    }
                });
                
                return { searchResults: results };
            }
            
            // If on recipe page
            if (request.url.includes('/recipe/')) {
                log.info('Processing recipe page');
                
                const recipe = {
                    type: 'recipe',
                    name: $('h1.headline').text().trim(),
                    description: $('.recipe-summary p').text().trim(),
                    imageUrl: $('.recipe-photo-wrap img').attr('src'),
                    ingredients: [],
                    instructions: [],
                    prepTime: $('.recipe-meta-item:contains("prep")').text().replace('prep:', '').trim(),
                    cookTime: $('.recipe-meta-item:contains("cook")').text().replace('cook:', '').trim(),
                    servings: $('.recipe-meta-item:contains("Servings")').text().replace('Servings:', '').trim()
                };
                
                // Extract ingredients
                $('.ingredients-item').each((i, el) => {
                    const ingredient = $(el).text().trim();
                    if (ingredient) recipe.ingredients.push(ingredient);
                });
                
                // Extract instructions
                $('.instructions-section-item .paragraph').each((i, el) => {
                    const instruction = $(el).text().trim();
                    if (instruction) recipe.instructions.push(instruction);
                });
                
                return recipe;
            }
            
            return null;
        }
        """,
        "proxyConfiguration": {
            "useApifyProxy": True
        },
        "maxPagesPerCrawl": 20,
        "maxRequestRetries": 3,
        "maxConcurrency": 5
    }
    
    print("Starting web scraper...")
    run = client.actor(WEB_SCRAPER_ACTOR).call(run_input=actor_input)
    
    # Collect results
    items = []
    for item in client.dataset(run['defaultDatasetId']).iterate_items():
        items.append(item)
    
    return items

def process_scraped_data(raw_items: List[Dict]) -> Dict:
    """Process raw scraped data into pairing format"""
    
    # Separate search results and recipes
    search_results = [item for item in raw_items if item.get('type') == 'search_result' or item.get('searchResults')]
    recipes = [item for item in raw_items if item.get('type') == 'recipe']
    
    # Create main dish data
    main_dish = {
        "name": "Chicken Biryani",
        "slug": "chicken-biryani",
        "description": "A fragrant and flavorful rice dish made with aromatic spices and tender chicken",
        "dish_type": "main",
        "cuisine": "Indian",
        "seo_title": "What to Serve with Chicken Biryani - 15 Best Side Dishes | PairDish",
        "seo_description": "Discover the perfect side dishes to serve with chicken biryani. From cooling raita to flavorful curries, find the best accompaniments for your meal.",
        "keywords": [
            "what to serve with chicken biryani",
            "chicken biryani side dishes",
            "best sides for biryani",
            "biryani accompaniments"
        ]
    }
    
    # Process side dishes
    side_dishes = []
    
    # From search results
    for result in search_results:
        if result.get('searchResults'):
            for item in result['searchResults'][:15]:  # Limit to 15
                side_dish = {
                    "name": item['title'],
                    "slug": generate_slug(item['title']),
                    "description": item['description'],
                    "image_url": item.get('imageUrl', ''),
                    "dish_type": "side",
                    "dietary_tags": extract_dietary_tags(item['title'] + ' ' + item['description'])
                }
                side_dishes.append(side_dish)
    
    # Add recipe details if available
    for recipe in recipes:
        # Find matching side dish and add recipe data
        for side_dish in side_dishes:
            if generate_slug(recipe['name']) == side_dish['slug']:
                side_dish['recipe'] = {
                    "ingredients": recipe.get('ingredients', []),
                    "instructions": recipe.get('instructions', []),
                    "prep_time": parse_time(recipe.get('prepTime', '')),
                    "cook_time": parse_time(recipe.get('cookTime', '')),
                    "servings": parse_servings(recipe.get('servings', '')),
                    "difficulty": "medium"
                }
                break
    
    return {
        "main_dish": main_dish,
        "side_dishes": side_dishes[:15]  # Ensure max 15
    }

def extract_dietary_tags(text: str) -> List[str]:
    """Extract dietary tags from text"""
    tags = []
    text_lower = text.lower()
    
    if 'vegetarian' in text_lower and 'non-vegetarian' not in text_lower:
        tags.append('vegetarian')
    if 'vegan' in text_lower:
        tags.append('vegan')
    if 'gluten-free' in text_lower or 'gluten free' in text_lower:
        tags.append('gluten-free')
    if 'dairy-free' in text_lower or 'dairy free' in text_lower:
        tags.append('dairy-free')
    
    return tags

def parse_time(time_str: str) -> int:
    """Parse time string to minutes"""
    try:
        # Remove non-numeric characters
        import re
        numbers = re.findall(r'\d+', time_str)
        if numbers:
            return int(numbers[0])
    except:
        pass
    return 0

def parse_servings(servings_str: str) -> int:
    """Parse servings string to number"""
    try:
        import re
        numbers = re.findall(r'\d+', servings_str)
        if numbers:
            return int(numbers[0])
    except:
        pass
    return 4

def send_to_worker(data: Dict) -> bool:
    """Send processed data to Cloudflare Worker"""
    try:
        response = requests.post(
            WORKER_ENDPOINT,
            json=data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            print(f"✓ Successfully sent data for {data['main_dish']['name']}")
            return True
        else:
            print(f"✗ Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error sending to worker: {e}")
        return False

def main():
    """Main execution"""
    print("=== PairDish Simple Scraper ===\n")
    
    if not APIFY_TOKEN:
        print("ERROR: Please set APIFY_TOKEN in .env file")
        return
    
    # Test with one dish first
    print("1. Scraping data from recipe sites...")
    raw_data = scrape_allrecipes_pairings()
    
    print(f"   Found {len(raw_data)} items")
    
    # Save raw data for debugging
    with open('raw_scraped_data.json', 'w') as f:
        json.dump(raw_data, f, indent=2)
    print("   Raw data saved to raw_scraped_data.json")
    
    # Process data
    print("\n2. Processing scraped data...")
    processed_data = process_scraped_data(raw_data)
    
    print(f"   Main dish: {processed_data['main_dish']['name']}")
    print(f"   Side dishes: {len(processed_data['side_dishes'])}")
    
    # Save processed data
    with open('processed_pairing_data.json', 'w') as f:
        json.dump(processed_data, f, indent=2)
    print("   Processed data saved to processed_pairing_data.json")
    
    # Send to worker
    print("\n3. Sending to Cloudflare Worker...")
    success = send_to_worker(processed_data)
    
    if success:
        print("\n✅ Scraping complete!")
    else:
        print("\n⚠️  Scraping complete but failed to send to worker")
        print("   Check your worker endpoint and try again")

if __name__ == "__main__":
    main()