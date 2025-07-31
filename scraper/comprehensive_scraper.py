#!/usr/bin/env python3
"""
Comprehensive PairDish Recipe Scraper
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

# Additional dishes to scrape
ADDITIONAL_DISHES = [
    {"main": "Chicken Parmesan", "cuisine": "Italian", "search": "chicken parmesan side dishes"},
    {"main": "Beef Bourguignon", "cuisine": "French", "search": "beef bourguignon side dishes"},
    {"main": "Chicken Tikka Masala", "cuisine": "Indian", "search": "chicken tikka masala side dishes"},
    {"main": "Pork Chops", "cuisine": "American", "search": "pork chops side dishes"},
    {"main": "Meatloaf", "cuisine": "American", "search": "meatloaf side dishes"},
    {"main": "Chicken Cordon Bleu", "cuisine": "French", "search": "chicken cordon bleu side dishes"},
    {"main": "Pot Roast", "cuisine": "American", "search": "pot roast side dishes"},
    {"main": "Chicken Enchiladas", "cuisine": "Mexican", "search": "chicken enchiladas side dishes"},
    {"main": "Beef Brisket", "cuisine": "American", "search": "beef brisket side dishes"},
    {"main": "Chicken Teriyaki", "cuisine": "Japanese", "search": "chicken teriyaki side dishes"},
    {"main": "Prime Rib", "cuisine": "American", "search": "prime rib side dishes"},
    {"main": "Chicken Fajitas", "cuisine": "Mexican", "search": "chicken fajitas side dishes"},
    {"main": "Lobster Tail", "cuisine": "International", "search": "lobster tail side dishes"},
    {"main": "Stuffed Peppers", "cuisine": "International", "search": "stuffed peppers side dishes"},
    {"main": "Chicken Cacciatore", "cuisine": "Italian", "search": "chicken cacciatore side dishes"}
]

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug"""
    return name.lower().strip().replace(' ', '-').replace(',', '').replace("'", '')

def extract_dietary_tags(text: str) -> List[str]:
    """Extract dietary tags from text"""
    tags = []
    text_lower = text.lower()
    
    dietary_patterns = {
        'vegetarian': ['vegetarian', 'veggie', 'vegetables only'],
        'vegan': ['vegan', 'plant-based', 'no animal'],
        'gluten-free': ['gluten-free', 'gluten free', 'no gluten', 'rice', 'quinoa'],
        'dairy-free': ['dairy-free', 'dairy free', 'no dairy'],
        'low-carb': ['low-carb', 'low carb', 'keto', 'cauliflower'],
        'healthy': ['healthy', 'nutritious', 'light', 'fresh']
    }
    
    for tag, keywords in dietary_patterns.items():
        if any(keyword in text_lower for keyword in keywords):
            tags.append(tag)
    
    return list(set(tags))

def get_standard_sides(main_dish: str) -> List[str]:
    """Get standard side dishes based on main dish type"""
    dish_lower = main_dish.lower()
    
    if any(word in dish_lower for word in ['parmesan', 'marsala', 'cacciatore', 'alfredo']):
        return ['Garlic Bread', 'Caesar Salad', 'Roasted Vegetables', 'Caprese Salad', 'Focaccia']
    elif any(word in dish_lower for word in ['tikka', 'masala', 'curry']):
        return ['Basmati Rice', 'Naan Bread', 'Cucumber Raita', 'Mango Chutney', 'Papadum']
    elif any(word in dish_lower for word in ['enchiladas', 'fajitas', 'tacos']):
        return ['Spanish Rice', 'Refried Beans', 'Guacamole', 'Corn Salad', 'Tortilla Chips']
    elif any(word in dish_lower for word in ['teriyaki', 'sushi']):
        return ['Steamed Rice', 'Miso Soup', 'Edamame', 'Cucumber Salad', 'Tempura Vegetables']
    elif any(word in dish_lower for word in ['brisket', 'ribs', 'bbq']):
        return ['Coleslaw', 'Baked Beans', 'Cornbread', 'Mac and Cheese', 'Potato Salad']
    elif any(word in dish_lower for word in ['roast', 'prime rib', 'wellington']):
        return ['Roasted Potatoes', 'Yorkshire Pudding', 'Green Beans', 'Glazed Carrots', 'Horseradish Sauce']
    else:
        return ['Mashed Potatoes', 'Green Salad', 'Roasted Vegetables', 'Dinner Rolls', 'Rice Pilaf']

def scrape_dish_pairings(dish_info: Dict) -> Dict:
    """Scrape pairings for a single dish"""
    print(f"\nProcessing: {dish_info['main']}")
    
    # Use RAG Web Browser
    actor = client.actor("apify/rag-web-browser")
    
    run_input = {
        "query": dish_info['search'],
        "maxResults": 2,
        "outputFormats": ["markdown"],
        "proxyConfiguration": {
            "useApifyProxy": True
        }
    }
    
    try:
        run = actor.call(run_input=run_input)
        
        # Collect results
        results = []
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            results.append(item)
        
        # Extract side dishes
        side_dishes = []
        for result in results:
            if 'markdown' in result:
                content = result['markdown'].lower()
                
                # Look for side dish mentions
                side_keywords = [
                    'salad', 'bread', 'rice', 'potatoes', 'beans', 'vegetables',
                    'asparagus', 'broccoli', 'carrots', 'corn', 'pasta', 'noodles',
                    'soup', 'rolls', 'pilaf', 'coleslaw', 'quinoa', 'couscous'
                ]
                
                lines = content.split('\n')
                for line in lines:
                    for keyword in side_keywords:
                        if keyword in line and len(line) < 100:
                            # Clean and extract dish name
                            dish_name = line.strip()
                            for char in ['•', '-', '*', '#', '[', ']', '(', ')', '1.', '2.', '3.', '4.', '5.']:
                                dish_name = dish_name.replace(char, '')
                            dish_name = dish_name.strip().title()
                            
                            if 3 < len(dish_name) < 50 and 'http' not in dish_name.lower():
                                side_dishes.append(dish_name)
                                break
        
        # Add standard sides
        side_dishes.extend(get_standard_sides(dish_info['main']))
        
        # Deduplicate and limit
        unique_dishes = []
        seen = set()
        for dish in side_dishes:
            dish_clean = dish.strip()
            if dish_clean.lower() not in seen and dish_clean:
                seen.add(dish_clean.lower())
                unique_dishes.append(dish_clean)
        
        unique_dishes = unique_dishes[:15]
        
        print(f"  Found {len(unique_dishes)} side dishes")
        
        # Format for API
        formatted_data = {
            'main_dish': {
                'name': dish_info['main'],
                'slug': generate_slug(dish_info['main']),
                'description': f"Delicious {dish_info['main']} - a classic {dish_info['cuisine']} dish perfect for any occasion",
                'dish_type': 'main',
                'cuisine': dish_info['cuisine'],
                'seo_title': f"What to Serve with {dish_info['main']} - 15 Best Side Dishes | PairDish",
                'seo_description': f"Discover the perfect side dishes to serve with {dish_info['main']}. From traditional pairings to creative options, find the best accompaniments.",
                'keywords': [
                    f"what to serve with {dish_info['main'].lower()}",
                    f"{dish_info['main'].lower()} side dishes",
                    f"best sides for {dish_info['main'].lower()}",
                    f"{dish_info['main'].lower()} accompaniments"
                ]
            },
            'side_dishes': []
        }
        
        # Add side dishes with details
        for i, side_name in enumerate(unique_dishes):
            side_dish = {
                'name': side_name,
                'slug': generate_slug(side_name),
                'description': f"A perfect side dish to complement {dish_info['main']}",
                'dish_type': 'side',
                'cuisine': dish_info['cuisine'] if i < 5 else 'International',
                'dietary_tags': extract_dietary_tags(side_name)
            }
            
            # Add recipes for some dishes
            if any(word in side_name.lower() for word in ['salad', 'rice', 'potatoes', 'vegetables']):
                side_dish['recipe'] = {
                    'ingredients': [f"Fresh ingredients for {side_name}"],
                    'instructions': [
                        f"Prepare {side_name} according to your favorite recipe",
                        "Season to taste",
                        "Serve alongside the main dish"
                    ],
                    'prep_time': 15,
                    'cook_time': 20 if 'roasted' in side_name.lower() else 10,
                    'servings': 4,
                    'difficulty': 'easy' if 'salad' in side_name.lower() else 'medium'
                }
            
            formatted_data['side_dishes'].append(side_dish)
        
        return formatted_data
        
    except Exception as e:
        print(f"  Error: {e}")
        return None

def main():
    """Main execution"""
    print("=== PairDish Comprehensive Scraper ===")
    print(f"Worker Endpoint: {WORKER_ENDPOINT}")
    print(f"Dishes to process: {len(ADDITIONAL_DISHES)}\n")
    
    if not APIFY_TOKEN:
        print("ERROR: Please set APIFY_TOKEN in .env file")
        return
    
    success_count = 0
    failed_dishes = []
    
    for i, dish_info in enumerate(ADDITIONAL_DISHES):
        print(f"\n[{i+1}/{len(ADDITIONAL_DISHES)}] Processing {dish_info['main']}...")
        
        # Scrape the dish
        result = scrape_dish_pairings(dish_info)
        
        if result:
            # Send to API
            try:
                response = requests.post(
                    WORKER_ENDPOINT,
                    json=result,
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                
                if response.status_code == 200:
                    print(f"  ✅ Successfully imported {dish_info['main']}")
                    success_count += 1
                else:
                    print(f"  ❌ Failed to import: {response.text}")
                    failed_dishes.append(dish_info['main'])
                    
            except Exception as e:
                print(f"  ❌ API error: {e}")
                failed_dishes.append(dish_info['main'])
        else:
            failed_dishes.append(dish_info['main'])
        
        # Rate limiting
        time.sleep(3)
    
    # Summary
    print(f"\n=== Summary ===")
    print(f"Total processed: {len(ADDITIONAL_DISHES)}")
    print(f"Successfully imported: {success_count}")
    print(f"Failed: {len(failed_dishes)}")
    
    if failed_dishes:
        print(f"\nFailed dishes:")
        for dish in failed_dishes:
            print(f"  - {dish}")
    
    print(f"\nTotal dishes in database: Check {WORKER_ENDPOINT.replace('/api/import-dishes', '/api/dishes')}")

if __name__ == "__main__":
    main()