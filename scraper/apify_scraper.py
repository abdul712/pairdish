#!/usr/bin/env python3
"""
PairDish Apify Scraper
Scrapes recipe and pairing data from various sources and sends to Cloudflare Worker
"""

import os
import json
import time
import requests
from typing import Dict, List, Optional
from datetime import datetime
from apify_client import ApifyClient
from urllib.parse import quote

# Configuration
APIFY_TOKEN = os.getenv('APIFY_TOKEN', 'YOUR_APIFY_TOKEN_HERE')
WORKER_ENDPOINT = os.getenv('WORKER_ENDPOINT', 'http://localhost:8787/api/import-dishes')
BATCH_SIZE = 50  # Number of items to send in each batch

# Initialize Apify client
client = ApifyClient(APIFY_TOKEN)

# Common dish queries to scrape
DISH_QUERIES = [
    "what to serve with chicken biryani",
    "what to serve with lamb curry",
    "what to serve with beef stroganoff",
    "what to serve with chicken tikka masala",
    "what to serve with pad thai",
    "what to serve with sushi",
    "what to serve with pizza",
    "what to serve with pasta carbonara",
    "what to serve with tacos",
    "what to serve with bbq ribs",
    # Add more queries as needed
]

# Recipe sites to scrape
RECIPE_SITES = {
    'allrecipes': {
        'base_url': 'https://www.allrecipes.com/search?q=',
        'actor_id': 'dtrungtin/allrecipes-scraper'
    },
    'foodnetwork': {
        'base_url': 'https://www.foodnetwork.com/search/',
        'actor_id': 'web.harvester/recipes-scraper'
    }
}

def normalize_dish_name(name: str) -> str:
    """Normalize dish name for consistency"""
    return name.lower().strip().replace('  ', ' ')

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from dish name"""
    return name.lower().strip().replace(' ', '-').replace(',', '')

def extract_main_dish_from_query(query: str) -> str:
    """Extract the main dish name from a search query"""
    # Remove "what to serve with" prefix
    if query.startswith("what to serve with "):
        return query[19:]
    return query

def parse_recipe_data(raw_data: Dict, source: str) -> Optional[Dict]:
    """Parse raw recipe data into standardized format"""
    try:
        # Basic parsing - customize based on actual scraper output
        dish_name = raw_data.get('title', raw_data.get('name', ''))
        if not dish_name:
            return None
            
        return {
            'name': dish_name,
            'slug': generate_slug(dish_name),
            'description': raw_data.get('description', raw_data.get('summary', '')),
            'image_url': raw_data.get('image', raw_data.get('imageUrl', '')),
            'cuisine': raw_data.get('cuisine', ''),
            'dish_type': determine_dish_type(dish_name),
            'dietary_tags': extract_dietary_tags(raw_data),
            'recipe': {
                'ingredients': raw_data.get('ingredients', []),
                'instructions': raw_data.get('instructions', []),
                'prep_time': raw_data.get('prepTime', 0),
                'cook_time': raw_data.get('cookTime', 0),
                'servings': raw_data.get('servings', 4),
                'difficulty': raw_data.get('difficulty', 'medium'),
                'nutrition': raw_data.get('nutrition', {}),
                'source_url': raw_data.get('url', '')
            }
        }
    except Exception as e:
        print(f"Error parsing recipe data: {e}")
        return None

def determine_dish_type(dish_name: str) -> str:
    """Determine dish type based on name"""
    name_lower = dish_name.lower()
    if any(word in name_lower for word in ['salad', 'rice', 'bread', 'vegetable', 'potato']):
        return 'side'
    elif any(word in name_lower for word in ['cake', 'pie', 'pudding', 'ice cream']):
        return 'dessert'
    elif any(word in name_lower for word in ['soup', 'dip', 'appetizer']):
        return 'appetizer'
    elif any(word in name_lower for word in ['juice', 'smoothie', 'tea', 'coffee']):
        return 'beverage'
    return 'main'

def extract_dietary_tags(data: Dict) -> List[str]:
    """Extract dietary tags from recipe data"""
    tags = []
    
    # Check various fields for dietary information
    if data.get('vegetarian') or 'vegetarian' in str(data).lower():
        tags.append('vegetarian')
    if data.get('vegan') or 'vegan' in str(data).lower():
        tags.append('vegan')
    if data.get('glutenFree') or 'gluten-free' in str(data).lower():
        tags.append('gluten-free')
    if data.get('dairyFree') or 'dairy-free' in str(data).lower():
        tags.append('dairy-free')
    
    return tags

def scrape_with_apify(query: str, site: str = 'allrecipes') -> List[Dict]:
    """Run Apify actor to scrape recipes"""
    print(f"Scraping '{query}' from {site}...")
    
    try:
        # Get actor details
        actor_id = RECIPE_SITES[site]['actor_id']
        
        # Prepare input based on actor requirements
        actor_input = {
            'startUrls': [{'url': f"{RECIPE_SITES[site]['base_url']}{quote(query)}"}],
            'maxItems': 20,  # Limit results per query
            'extendOutputFunction': '''($) => {
                return {
                    ingredients: $('[itemprop="recipeIngredient"]').map((i, el) => $(el).text().trim()).get(),
                    instructions: $('[itemprop="recipeInstructions"]').map((i, el) => $(el).text().trim()).get(),
                    nutrition: {
                        calories: $('[itemprop="calories"]').text(),
                        protein: $('[itemprop="proteinContent"]').text()
                    }
                };
            }'''
        }
        
        # Run the actor
        run = client.actor(actor_id).call(run_input=actor_input)
        
        # Fetch results
        items = []
        for item in client.dataset(run['defaultDatasetId']).iterate_items():
            parsed_item = parse_recipe_data(item, site)
            if parsed_item:
                items.append(parsed_item)
        
        print(f"Scraped {len(items)} items for '{query}'")
        return items
        
    except Exception as e:
        print(f"Error scraping {site}: {e}")
        return []

def create_dish_pairings(main_dish: str, side_dishes: List[Dict]) -> Dict:
    """Create pairing structure for a main dish"""
    main_dish_name = extract_main_dish_from_query(main_dish)
    
    return {
        'main_dish': {
            'name': main_dish_name.title(),
            'slug': generate_slug(main_dish_name),
            'description': f"Delicious {main_dish_name} - a perfect main course",
            'dish_type': 'main',
            'seo_title': f"What to Serve with {main_dish_name.title()} - 15 Best Side Dishes",
            'seo_description': f"Discover the perfect side dishes to serve with {main_dish_name}. From classic pairings to creative options, find the best accompaniments.",
            'keywords': [
                f"what to serve with {main_dish_name}",
                f"{main_dish_name} side dishes",
                f"best sides for {main_dish_name}",
                f"{main_dish_name} accompaniments"
            ]
        },
        'side_dishes': side_dishes[:15],  # Limit to 15 side dishes
        'timestamp': datetime.utcnow().isoformat()
    }

def send_to_worker(data: Dict) -> bool:
    """Send scraped data to Cloudflare Worker"""
    try:
        response = requests.post(
            WORKER_ENDPOINT,
            json=data,
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': os.getenv('WORKER_API_KEY', '')  # Add authentication if needed
            },
            timeout=30
        )
        
        if response.status_code == 200:
            print(f"Successfully sent data for {data['main_dish']['name']}")
            return True
        else:
            print(f"Failed to send data: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"Error sending to worker: {e}")
        return False

def main():
    """Main scraping workflow"""
    print("Starting PairDish scraping process...")
    
    all_pairings = []
    
    # Scrape each dish query
    for query in DISH_QUERIES:
        print(f"\nProcessing: {query}")
        
        # Collect side dishes from multiple sources
        all_side_dishes = []
        
        for site in RECIPE_SITES.keys():
            side_dishes = scrape_with_apify(query, site)
            all_side_dishes.extend(side_dishes)
            
            # Rate limiting
            time.sleep(2)
        
        # Create pairing structure
        if all_side_dishes:
            pairing_data = create_dish_pairings(query, all_side_dishes)
            all_pairings.append(pairing_data)
            
            # Send to worker
            send_to_worker(pairing_data)
            
            # Save backup locally
            with open(f'backup_{pairing_data["main_dish"]["slug"]}.json', 'w') as f:
                json.dump(pairing_data, f, indent=2)
        
        # Rate limiting between queries
        time.sleep(5)
    
    print(f"\nCompleted scraping. Processed {len(all_pairings)} dish pairings.")
    
    # Save complete backup
    with open('all_pairings_backup.json', 'w') as f:
        json.dump(all_pairings, f, indent=2)

if __name__ == "__main__":
    main()