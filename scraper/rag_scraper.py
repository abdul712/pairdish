#!/usr/bin/env python3
"""
PairDish Recipe Scraper using Apify RAG Web Browser
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

# Dishes to scrape with specific recipe URLs
RECIPE_URLS = [
    {
        "main": "Beef Stroganoff",
        "cuisine": "Russian",
        "url": "beef stroganoff side dishes recipe"
    },
    {
        "main": "Chicken Alfredo",
        "cuisine": "Italian", 
        "url": "chicken alfredo side dishes"
    },
    {
        "main": "Beef Wellington",
        "cuisine": "British",
        "url": "beef wellington side dishes accompaniments"
    },
    {
        "main": "Chicken Marsala",
        "cuisine": "Italian",
        "url": "chicken marsala side dishes"
    },
    {
        "main": "Shrimp Scampi",
        "cuisine": "Italian",
        "url": "shrimp scampi side dishes"
    }
]

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from dish name"""
    return name.lower().strip().replace(' ', '-').replace(',', '').replace("'", '')

def extract_dietary_tags(text: str) -> List[str]:
    """Extract dietary tags from text"""
    tags = []
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['vegetarian', 'veggie']):
        tags.append('vegetarian')
    if 'vegan' in text_lower:
        tags.append('vegan')
    if any(word in text_lower for word in ['gluten-free', 'gluten free']):
        tags.append('gluten-free')
    
    return tags

def scrape_with_rag_browser():
    """Use RAG Web Browser to scrape recipe pairings"""
    print("Using RAG Web Browser for recipe scraping...")
    
    # Use the RAG Web Browser actor
    actor = client.actor("apify/rag-web-browser")
    
    all_results = []
    
    for dish_info in RECIPE_URLS:
        print(f"\nScraping pairings for: {dish_info['main']}")
        
        # Configure the RAG browser
        run_input = {
            "startUrls": [{"url": f"https://www.google.com/search?q={dish_info['url'].replace(' ', '+')}"}],
            "query": f"Find the best side dishes to serve with {dish_info['main']}. Extract a list of 15 specific side dish names.",
            "maxResults": 3,
            "outputFormats": ["markdown"],
            "proxyConfiguration": {
                "useApifyProxy": True
            }
        }
        
        try:
            print("  Running RAG Web Browser...")
            run = actor.call(run_input=run_input)
            
            # Collect results
            results = []
            for item in client.dataset(run["defaultDatasetId"]).iterate_items():
                results.append(item)
            
            print(f"  Found {len(results)} pages")
            
            # Extract side dishes from the markdown content
            side_dishes = []
            for result in results:
                if 'markdown' in result:
                    content = result['markdown'].lower()
                    
                    # Look for common side dish patterns
                    lines = content.split('\n')
                    for line in lines:
                        # Check for list items or mentions of side dishes
                        if any(marker in line for marker in ['•', '-', '*', '1.', '2.', '3.']):
                            # Common side dish keywords
                            side_keywords = ['salad', 'bread', 'rice', 'potatoes', 'beans', 'vegetables', 
                                           'asparagus', 'broccoli', 'carrots', 'corn', 'pasta', 'noodles',
                                           'coleslaw', 'soup', 'rolls', 'garlic', 'roasted', 'steamed',
                                           'grilled', 'mashed', 'baked']
                            
                            for keyword in side_keywords:
                                if keyword in line:
                                    # Extract the dish name
                                    dish_name = line.strip()
                                    # Clean up common prefixes
                                    for prefix in ['•', '-', '*', '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.']:
                                        dish_name = dish_name.replace(prefix, '').strip()
                                    
                                    if len(dish_name) > 3 and len(dish_name) < 50:
                                        side_dishes.append(dish_name.title())
                                    break
            
            # Also add some standard pairings based on the main dish
            if 'stroganoff' in dish_info['main'].lower():
                side_dishes.extend(['Egg Noodles', 'Steamed Rice', 'Green Beans', 'Roasted Asparagus', 'Caesar Salad'])
            elif 'alfredo' in dish_info['main'].lower():
                side_dishes.extend(['Garlic Bread', 'Caesar Salad', 'Roasted Broccoli', 'Caprese Salad'])
            elif 'wellington' in dish_info['main'].lower():
                side_dishes.extend(['Roasted Potatoes', 'Yorkshire Pudding', 'Glazed Carrots', 'Green Beans'])
            elif 'marsala' in dish_info['main'].lower():
                side_dishes.extend(['Garlic Mashed Potatoes', 'Roasted Asparagus', 'Caesar Salad', 'Focaccia'])
            elif 'scampi' in dish_info['main'].lower():
                side_dishes.extend(['Angel Hair Pasta', 'Garlic Bread', 'Caesar Salad', 'Roasted Zucchini'])
            
            # Deduplicate
            unique_dishes = list(set(side_dishes))[:15]
            
            if unique_dishes:
                print(f"  Found {len(unique_dishes)} side dishes:")
                for dish in unique_dishes[:5]:
                    print(f"    - {dish}")
                
                # Format for API
                formatted_data = {
                    'main_dish': {
                        'name': dish_info['main'],
                        'slug': generate_slug(dish_info['main']),
                        'description': f"Delicious {dish_info['main']} - a classic {dish_info['cuisine']} dish",
                        'dish_type': 'main',
                        'cuisine': dish_info['cuisine'],
                        'seo_title': f"What to Serve with {dish_info['main']} - 15 Best Side Dishes | PairDish",
                        'seo_description': f"Discover the perfect side dishes to serve with {dish_info['main']}. From classic pairings to creative options.",
                        'keywords': [
                            f"what to serve with {dish_info['main'].lower()}",
                            f"{dish_info['main'].lower()} side dishes",
                            f"best sides for {dish_info['main'].lower()}"
                        ]
                    },
                    'side_dishes': []
                }
                
                # Add side dishes
                for i, side_name in enumerate(unique_dishes):
                    side_dish = {
                        'name': side_name,
                        'slug': generate_slug(side_name),
                        'description': f"Perfect side dish to complement {dish_info['main']}",
                        'dish_type': 'side',
                        'dietary_tags': extract_dietary_tags(side_name)
                    }
                    
                    # Add simple recipes for some items
                    if any(word in side_name.lower() for word in ['salad', 'roasted', 'steamed']):
                        side_dish['recipe'] = {
                            'ingredients': [f"Fresh ingredients for {side_name}"],
                            'instructions': [f"Prepare {side_name} to taste"],
                            'prep_time': 15,
                            'cook_time': 20 if 'roasted' in side_name.lower() else 10,
                            'servings': 4,
                            'difficulty': 'easy' if 'salad' in side_name.lower() else 'medium'
                        }
                    
                    formatted_data['side_dishes'].append(side_dish)
                
                all_results.append(formatted_data)
                
                # Send to API
                print(f"\n  Sending to API...")
                try:
                    response = requests.post(
                        WORKER_ENDPOINT,
                        json=formatted_data,
                        headers={'Content-Type': 'application/json'},
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        print(f"  ✅ Successfully imported {dish_info['main']}")
                    else:
                        print(f"  ❌ Failed to import {dish_info['main']}: {response.text}")
                        
                except Exception as e:
                    print(f"  ❌ Error sending to API: {e}")
            
            # Rate limiting
            time.sleep(5)
            
        except Exception as e:
            print(f"  ❌ Error scraping {dish_info['main']}: {e}")
            continue
    
    return all_results

def main():
    """Main execution"""
    print("=== PairDish RAG Recipe Scraper ===")
    print(f"Worker Endpoint: {WORKER_ENDPOINT}\n")
    
    if not APIFY_TOKEN:
        print("ERROR: Please set APIFY_TOKEN in .env file")
        return
    
    # Run the scraper
    results = scrape_with_rag_browser()
    
    print(f"\n=== Summary ===")
    print(f"Successfully processed {len(results)} dishes")
    
    # Save backup
    if results:
        with open('rag_scraped_backup.json', 'w') as f:
            json.dump(results, f, indent=2)
        print("Backup saved to rag_scraped_backup.json")

if __name__ == "__main__":
    main()