#!/usr/bin/env python3
"""
Test Apify scraper with just one dish
"""

import os
import json
import time
import requests
from typing import Dict, List
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

# Test with just one dish
TEST_DISHES = [
    {"name": "Beef Stroganoff", "search": "what to serve with beef stroganoff side dishes"}
]

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from dish name"""
    return name.lower().strip().replace(' ', '-').replace(',', '').replace("'", '')

def extract_cuisine(dish_name: str) -> str:
    """Extract cuisine type from dish name"""
    cuisines = {
        'stroganoff': 'Russian',
        'biryani': 'Indian',
        'curry': 'Indian',
        'pad thai': 'Thai',
        'sushi': 'Japanese',
        'pasta': 'Italian',
        'pizza': 'Italian',
        'lasagna': 'Italian',
        'tacos': 'Mexican',
        'bbq': 'American',
        'ribs': 'American'
    }
    
    dish_lower = dish_name.lower()
    for key, cuisine in cuisines.items():
        if key in dish_lower:
            return cuisine
    return 'International'

def test_apify_connection():
    """Test Apify connection"""
    print("Testing Apify connection...")
    try:
        # Test with a simple web scraper run
        actor = client.actor("apify/web-scraper")
        print("✅ Successfully connected to Apify")
        return True
    except Exception as e:
        print(f"❌ Failed to connect to Apify: {e}")
        return False

def simple_scrape():
    """Simple test scrape"""
    print("\nStarting simple scrape test...")
    
    # Use Apify's Google Search Scraper
    actor = client.actor("apify/google-search-scraper")
    
    main_dish = TEST_DISHES[0]
    print(f"Searching for: {main_dish['search']}")
    
    try:
        # Run the actor
        run_input = {
            "queries": main_dish['search'],  # Should be string, not array
            "maxPagesPerQuery": 1,
            "resultsPerPage": 10,
            "mobileResults": False,
            "languageCode": "en",
            "maxConcurrency": 1
        }
        
        print("Running Google Search Scraper...")
        run = actor.call(run_input=run_input)
        
        # Collect results
        results = []
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            results.append(item)
        
        print(f"Found {len(results)} search results")
        
        # Extract side dishes from search results
        side_dishes = []
        side_keywords = ['raita', 'naan', 'salad', 'rice', 'bread', 'sauce', 'vegetables', 'potatoes', 'beans', 'corn']
        
        for result in results[:5]:  # Check first 5 results
            title = result.get('title', '').lower()
            description = result.get('description', '').lower()
            
            # Look for side dish mentions
            for keyword in side_keywords:
                if keyword in title or keyword in description:
                    side_dishes.append({
                        'name': keyword.title(),
                        'source': result.get('url', '')
                    })
        
        # Deduplicate
        unique_sides = list({dish['name']: dish for dish in side_dishes}.values())
        
        print(f"Extracted {len(unique_sides)} potential side dishes")
        for side in unique_sides:
            print(f"  - {side['name']}")
        
        # Format for API
        if unique_sides:
            formatted_data = {
                'main_dish': {
                    'name': main_dish['name'],
                    'slug': generate_slug(main_dish['name']),
                    'description': f"Delicious {main_dish['name']} - a classic dish",
                    'dish_type': 'main',
                    'cuisine': extract_cuisine(main_dish['name']),
                    'seo_title': f"What to Serve with {main_dish['name']} - Best Side Dishes | PairDish",
                    'seo_description': f"Discover perfect side dishes for {main_dish['name']}",
                    'keywords': [f"what to serve with {main_dish['name'].lower()}"]
                },
                'side_dishes': []
            }
            
            # Add side dishes (limit to 5 for test)
            for side in unique_sides[:5]:
                formatted_data['side_dishes'].append({
                    'name': side['name'],
                    'slug': generate_slug(side['name']),
                    'description': f"Great side dish for {main_dish['name']}",
                    'dish_type': 'side',
                    'dietary_tags': []
                })
            
            # Send to worker
            print(f"\nSending to API: {WORKER_ENDPOINT}")
            try:
                response = requests.post(
                    WORKER_ENDPOINT,
                    json=formatted_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                
                if response.status_code == 200:
                    print("✅ Successfully sent to API")
                    print(f"Response: {response.json()}")
                else:
                    print(f"❌ API error: {response.status_code}")
                    print(f"Response: {response.text}")
                    
            except Exception as e:
                print(f"❌ Error sending to API: {e}")
        
    except Exception as e:
        print(f"❌ Scraping error: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Main execution"""
    print("=== PairDish Apify Test Scraper ===")
    print(f"Worker Endpoint: {WORKER_ENDPOINT}\n")
    
    if not APIFY_TOKEN:
        print("ERROR: Please set APIFY_TOKEN in .env file")
        return
    
    # Test connection
    if test_apify_connection():
        # Run simple scrape
        simple_scrape()
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    main()