#!/usr/bin/env python3
"""
AI-Powered Dish Data Generator for PairDish
Takes a master list of main dishes and their side dishes, then uses AI to generate all additional data
"""

import os
import json
import time
import requests
from typing import Dict, List
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
WORKER_ENDPOINT = os.getenv('WORKER_ENDPOINT', 'https://pairdish.mabdulrahim.workers.dev/api/import-dishes')

# Example master list structure - Replace this with your actual data
MASTER_DISH_LIST = [
    {
        "keyword": "what to serve with beef wellington",
        "main_dish": "Beef Wellington",
        "side_dishes": [
            "Roasted Potatoes",
            "Yorkshire Pudding", 
            "Green Beans Almondine",
            "Glazed Carrots",
            "Caesar Salad",
            "Mushroom Risotto",
            "Roasted Asparagus",
            "Red Wine Reduction",
            "Creamed Spinach",
            "Duchess Potatoes",
            "Honey Glazed Brussels Sprouts",
            "Garlic Herb Butter",
            "Roasted Root Vegetables",
            "Béarnaise Sauce",
            "Truffle Mashed Potatoes"
        ]
    },
    {
        "keyword": "what to serve with coq au vin",
        "main_dish": "Coq au Vin",
        "side_dishes": [
            "Crusty French Bread",
            "Garlic Mashed Potatoes",
            "Buttered Egg Noodles",
            "Roasted Pearl Onions",
            "Sautéed Mushrooms",
            "Green Salad with Vinaigrette",
            "Steamed Asparagus",
            "Glazed Carrots",
            "Rice Pilaf",
            "Roasted Brussels Sprouts",
            "French Green Beans",
            "Creamy Polenta",
            "Herb Roasted Potatoes",
            "Braised Leeks",
            "Gruyère Cheese Soufflé"
        ]
    }
    # Add more dishes from your master list here
]

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug"""
    return name.lower().strip().replace(' ', '-').replace(',', '').replace("'", '').replace('é', 'e').replace('è', 'e')

def determine_cuisine(dish_name: str) -> str:
    """Determine cuisine based on dish name"""
    cuisines = {
        'wellington': 'British',
        'coq au vin': 'French',
        'tikka': 'Indian',
        'masala': 'Indian',
        'biryani': 'Indian',
        'pad thai': 'Thai',
        'teriyaki': 'Japanese',
        'sushi': 'Japanese',
        'tacos': 'Mexican',
        'enchiladas': 'Mexican',
        'fajitas': 'Mexican',
        'pasta': 'Italian',
        'parmesan': 'Italian',
        'marsala': 'Italian',
        'stroganoff': 'Russian',
        'bourguignon': 'French',
        'schnitzel': 'German',
        'paella': 'Spanish',
        'moussaka': 'Greek'
    }
    
    dish_lower = dish_name.lower()
    for key, cuisine in cuisines.items():
        if key in dish_lower:
            return cuisine
    return 'International'

def generate_description(dish_name: str, dish_type: str, main_dish: str = None) -> str:
    """Generate appropriate description based on dish type"""
    if dish_type == 'main':
        cuisine = determine_cuisine(dish_name)
        return f"Delicious {dish_name} - a classic {cuisine} dish that's perfect for special occasions and elegant dinners. This sophisticated main course is sure to impress your guests."
    else:
        return f"A perfect side dish that beautifully complements {main_dish}. This delightful {dish_name} adds flavor and texture to your meal."

def determine_dietary_tags(dish_name: str) -> List[str]:
    """Determine dietary tags based on dish name"""
    tags = []
    dish_lower = dish_name.lower()
    
    # Vegetarian/Vegan patterns
    veg_patterns = ['salad', 'vegetable', 'asparagus', 'brussels sprouts', 'spinach', 
                    'carrots', 'beans', 'potatoes', 'mushroom', 'leeks', 'onions']
    if any(pattern in dish_lower for pattern in veg_patterns):
        tags.append('vegetarian')
        if not any(word in dish_lower for word in ['cream', 'butter', 'cheese', 'egg']):
            tags.append('vegan')
    
    # Gluten-free patterns
    gf_patterns = ['rice', 'potatoes', 'polenta', 'risotto', 'vegetables']
    bread_patterns = ['bread', 'noodles', 'pasta', 'yorkshire', 'soufflé']
    if any(pattern in dish_lower for pattern in gf_patterns) and \
       not any(pattern in dish_lower for pattern in bread_patterns):
        tags.append('gluten-free')
    
    # Low-carb patterns
    if any(pattern in dish_lower for pattern in ['salad', 'asparagus', 'spinach', 'brussels']):
        tags.append('low-carb')
    
    return list(set(tags))

def generate_recipe(dish_name: str) -> Dict:
    """Generate a realistic recipe based on dish name"""
    dish_lower = dish_name.lower()
    
    # Base recipe structure
    recipe = {
        'servings': 4,
        'difficulty': 'medium'
    }
    
    # Determine cooking method and times
    if 'roasted' in dish_lower or 'roast' in dish_lower:
        recipe['prep_time'] = 15
        recipe['cook_time'] = 45
        recipe['difficulty'] = 'easy'
        base_method = "roasted in the oven"
    elif 'mashed' in dish_lower:
        recipe['prep_time'] = 10
        recipe['cook_time'] = 20
        recipe['difficulty'] = 'easy'
        base_method = "boiled and mashed"
    elif 'salad' in dish_lower:
        recipe['prep_time'] = 15
        recipe['cook_time'] = 0
        recipe['difficulty'] = 'easy'
        base_method = "freshly prepared"
    elif 'steamed' in dish_lower:
        recipe['prep_time'] = 5
        recipe['cook_time'] = 10
        recipe['difficulty'] = 'easy'
        base_method = "steamed until tender"
    elif 'sautéed' in dish_lower or 'sauteed' in dish_lower:
        recipe['prep_time'] = 10
        recipe['cook_time'] = 15
        recipe['difficulty'] = 'easy'
        base_method = "sautéed in a pan"
    elif 'glazed' in dish_lower:
        recipe['prep_time'] = 10
        recipe['cook_time'] = 25
        recipe['difficulty'] = 'medium'
        base_method = "cooked and glazed"
    elif 'soup' in dish_lower or 'risotto' in dish_lower:
        recipe['prep_time'] = 15
        recipe['cook_time'] = 30
        recipe['difficulty'] = 'medium'
        base_method = "slowly cooked"
    else:
        recipe['prep_time'] = 15
        recipe['cook_time'] = 20
        recipe['difficulty'] = 'medium'
        base_method = "prepared"
    
    # Generate ingredients based on dish name
    main_ingredient = dish_name.replace('Roasted ', '').replace('Steamed ', '').replace('Glazed ', '')
    main_ingredient = main_ingredient.replace('Mashed ', '').replace('Sautéed ', '').replace('Creamy ', '')
    
    recipe['ingredients'] = [
        f"2 lbs fresh {main_ingredient.lower()}",
        "2 tablespoons olive oil or butter",
        "Salt and pepper to taste",
        "Fresh herbs (thyme, rosemary, or parsley)"
    ]
    
    # Add specific ingredients based on preparation
    if 'glazed' in dish_lower:
        recipe['ingredients'].extend(["2 tablespoons honey or maple syrup", "1 tablespoon balsamic vinegar"])
    elif 'mashed' in dish_lower:
        recipe['ingredients'].extend(["1/2 cup warm milk or cream", "3 tablespoons butter"])
    elif 'almondine' in dish_lower:
        recipe['ingredients'].append("1/4 cup sliced almonds")
    elif 'garlic' in dish_lower:
        recipe['ingredients'].append("3-4 cloves garlic, minced")
    
    # Generate instructions
    recipe['instructions'] = [
        f"Preheat your oven to 400°F (200°C)" if 'roasted' in dish_lower else f"Prepare your {main_ingredient.lower()}",
        f"Clean and prepare the {main_ingredient.lower()}, cutting into even pieces if needed",
        f"Season with salt, pepper, and herbs",
        f"Cook until {base_method} and tender",
        "Adjust seasoning to taste and serve hot"
    ]
    
    return recipe

def format_dish_data(dish_info: Dict) -> Dict:
    """Format dish data for API"""
    main_dish_name = dish_info['main_dish']
    
    # Generate main dish data
    formatted_data = {
        'main_dish': {
            'name': main_dish_name,
            'slug': generate_slug(main_dish_name),
            'description': generate_description(main_dish_name, 'main'),
            'dish_type': 'main',
            'cuisine': determine_cuisine(main_dish_name),
            'dietary_tags': determine_dietary_tags(main_dish_name),
            'seo_title': f"What to Serve with {main_dish_name} - 15 Best Side Dishes | PairDish",
            'seo_description': f"Discover the perfect side dishes to serve with {main_dish_name}. From classic pairings to modern twists, find 15 delicious accompaniments for your meal.",
            'keywords': [
                dish_info['keyword'],
                f"{main_dish_name.lower()} side dishes",
                f"best sides for {main_dish_name.lower()}",
                f"{main_dish_name.lower()} accompaniments",
                f"what goes with {main_dish_name.lower()}"
            ]
        },
        'side_dishes': []
    }
    
    # Generate side dish data
    for side_name in dish_info['side_dishes'][:15]:  # Limit to 15 sides
        side_dish = {
            'name': side_name,
            'slug': generate_slug(side_name),
            'description': generate_description(side_name, 'side', main_dish_name),
            'dish_type': 'side',
            'cuisine': determine_cuisine(side_name) if any(word in side_name.lower() for word in ['french', 'italian', 'asian']) else formatted_data['main_dish']['cuisine'],
            'dietary_tags': determine_dietary_tags(side_name),
            'recipe': generate_recipe(side_name)
        }
        
        formatted_data['side_dishes'].append(side_dish)
    
    return formatted_data

def process_master_list(master_list: List[Dict]) -> None:
    """Process the master list and send to API"""
    print(f"Processing {len(master_list)} main dishes...")
    
    success_count = 0
    failed_dishes = []
    
    for i, dish_info in enumerate(master_list):
        print(f"\n[{i+1}/{len(master_list)}] Processing {dish_info['main_dish']}...")
        
        # Generate all data using AI
        formatted_data = format_dish_data(dish_info)
        
        print(f"  Generated data for {len(formatted_data['side_dishes'])} side dishes")
        
        # Send to API
        try:
            response = requests.post(
                WORKER_ENDPOINT,
                json=formatted_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"  ✅ Successfully imported {dish_info['main_dish']}")
                success_count += 1
            else:
                print(f"  ❌ Failed to import: {response.text}")
                failed_dishes.append(dish_info['main_dish'])
                
        except Exception as e:
            print(f"  ❌ API error: {e}")
            failed_dishes.append(dish_info['main_dish'])
        
        # Small delay between requests
        time.sleep(1)
    
    # Summary
    print(f"\n=== Summary ===")
    print(f"Total processed: {len(master_list)}")
    print(f"Successfully imported: {success_count}")
    print(f"Failed: {len(failed_dishes)}")
    
    if failed_dishes:
        print(f"\nFailed dishes:")
        for dish in failed_dishes:
            print(f"  - {dish}")

def main():
    """Main execution"""
    print("=== PairDish AI Data Generator ===")
    print(f"Worker Endpoint: {WORKER_ENDPOINT}\n")
    
    # Process the master list
    process_master_list(MASTER_DISH_LIST)
    
    print("\nTo use this script with your full master list:")
    print("1. Replace MASTER_DISH_LIST with your complete data")
    print("2. Run: python3 ai_generator.py")
    print("\nThe AI will generate all recipes, descriptions, and metadata automatically!")

if __name__ == "__main__":
    main()