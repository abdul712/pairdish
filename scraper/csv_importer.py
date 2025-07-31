#!/usr/bin/env python3
"""
CSV Importer for PairDish
Reads master dish list from CSV and uses AI to generate all additional content
"""

import os
import csv
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
CSV_FILE_PATH = 'master_dishes.csv'  # Update this path as needed

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug"""
    return name.lower().strip().replace(' ', '-').replace(',', '').replace("'", '').replace('é', 'e').replace('è', 'e').replace('&', 'and')

def extract_main_dish_from_keyword(keyword: str) -> str:
    """Extract main dish name from keyword like 'what to serve with beef wellington'"""
    keyword_lower = keyword.lower().strip()
    # Remove common prefixes
    prefixes = ['what to serve with ', 'what goes with ', 'what to eat with ', 'sides for ']
    for prefix in prefixes:
        if keyword_lower.startswith(prefix):
            dish_name = keyword[len(prefix):].strip()
            # Capitalize properly
            return ' '.join(word.capitalize() for word in dish_name.split())
    return keyword.title()

def determine_cuisine(dish_name: str) -> str:
    """Determine cuisine based on dish name"""
    cuisines = {
        # British
        'wellington': 'British', 'shepherd': 'British', 'cottage pie': 'British',
        'fish and chips': 'British', 'roast beef': 'British', 'yorkshire': 'British',
        
        # French
        'coq au vin': 'French', 'bourguignon': 'French', 'ratatouille': 'French',
        'cassoulet': 'French', 'cordon bleu': 'French', 'nicoise': 'French',
        
        # Italian
        'pasta': 'Italian', 'lasagna': 'Italian', 'risotto': 'Italian',
        'parmesan': 'Italian', 'marsala': 'Italian', 'alfredo': 'Italian',
        'carbonara': 'Italian', 'bolognese': 'Italian', 'piccata': 'Italian',
        
        # Indian
        'tikka': 'Indian', 'masala': 'Indian', 'biryani': 'Indian',
        'curry': 'Indian', 'tandoori': 'Indian', 'korma': 'Indian',
        'vindaloo': 'Indian', 'dal': 'Indian',
        
        # Asian
        'teriyaki': 'Japanese', 'sushi': 'Japanese', 'tempura': 'Japanese',
        'pad thai': 'Thai', 'satay': 'Thai', 'tom yum': 'Thai',
        'stir fry': 'Chinese', 'kung pao': 'Chinese', 'sweet and sour': 'Chinese',
        
        # Mexican
        'tacos': 'Mexican', 'enchiladas': 'Mexican', 'fajitas': 'Mexican',
        'burrito': 'Mexican', 'quesadilla': 'Mexican', 'carnitas': 'Mexican',
        
        # American
        'bbq': 'American', 'ribs': 'American', 'burger': 'American',
        'meatloaf': 'American', 'fried chicken': 'American', 'mac and cheese': 'American',
        'brisket': 'American', 'pulled pork': 'American',
        
        # Other
        'paella': 'Spanish', 'tapas': 'Spanish',
        'moussaka': 'Greek', 'souvlaki': 'Greek',
        'schnitzel': 'German', 'sauerbraten': 'German',
        'stroganoff': 'Russian', 'borscht': 'Russian'
    }
    
    dish_lower = dish_name.lower()
    for key, cuisine in cuisines.items():
        if key in dish_lower:
            return cuisine
    return 'International'

def generate_description(dish_name: str, dish_type: str, main_dish: str = None) -> str:
    """Generate detailed description based on dish type"""
    cuisine = determine_cuisine(dish_name)
    
    if dish_type == 'main':
        descriptions = [
            f"Indulge in this exquisite {dish_name}, a beloved {cuisine} classic that brings elegance and flavor to any dining table.",
            f"This traditional {dish_name} represents the finest of {cuisine} cuisine, offering a perfect balance of flavors and textures.",
            f"A sophisticated {cuisine} masterpiece, this {dish_name} combines time-honored techniques with premium ingredients.",
            f"Experience the rich culinary heritage of {cuisine} cuisine with this authentic {dish_name}, perfect for special occasions."
        ]
        return descriptions[hash(dish_name) % len(descriptions)]
    else:
        descriptions = [
            f"This delightful {dish_name} perfectly complements {main_dish}, adding wonderful texture and flavor to your meal.",
            f"A classic accompaniment that enhances the flavors of {main_dish}, this {dish_name} brings balance to your plate.",
            f"Elevate your {main_dish} with this expertly crafted {dish_name}, a side dish that truly completes the dining experience.",
            f"The perfect partner for {main_dish}, this {dish_name} adds a delicious dimension to your meal."
        ]
        return descriptions[hash(dish_name + str(main_dish)) % len(descriptions)]

def determine_dietary_tags(dish_name: str) -> List[str]:
    """Determine dietary tags based on dish name and ingredients"""
    tags = []
    dish_lower = dish_name.lower()
    
    # Vegetarian/Vegan patterns
    vegetarian_indicators = [
        'salad', 'vegetable', 'veggie', 'asparagus', 'broccoli', 'brussels',
        'spinach', 'carrots', 'beans', 'potatoes', 'mushroom', 'tomato',
        'pepper', 'corn', 'peas', 'cauliflower', 'cabbage', 'lettuce'
    ]
    
    non_vegetarian = ['chicken', 'beef', 'pork', 'lamb', 'fish', 'shrimp', 'bacon', 'meat']
    
    if any(veg in dish_lower for veg in vegetarian_indicators) and \
       not any(meat in dish_lower for meat in non_vegetarian):
        tags.append('vegetarian')
        
        # Check for vegan
        dairy_indicators = ['cream', 'butter', 'cheese', 'milk', 'yogurt']
        if not any(dairy in dish_lower for dairy in dairy_indicators):
            tags.append('vegan')
    
    # Gluten-free patterns
    gluten_free_indicators = ['rice', 'quinoa', 'potatoes', 'corn', 'polenta']
    gluten_indicators = ['bread', 'pasta', 'noodles', 'couscous', 'flour', 'breadcrumb']
    
    if any(gf in dish_lower for gf in gluten_free_indicators) and \
       not any(gluten in dish_lower for gluten in gluten_indicators):
        tags.append('gluten-free')
    
    # Low-carb patterns
    low_carb_indicators = ['salad', 'vegetables', 'meat', 'fish', 'cheese']
    high_carb_indicators = ['potato', 'rice', 'pasta', 'bread', 'noodles']
    
    if any(lc in dish_lower for lc in low_carb_indicators) and \
       not any(hc in dish_lower for hc in high_carb_indicators):
        tags.append('low-carb')
    
    # Healthy
    if any(healthy in dish_lower for healthy in ['salad', 'steamed', 'grilled', 'fresh']):
        tags.append('healthy')
    
    return list(set(tags))

def generate_recipe(dish_name: str) -> Dict:
    """Generate detailed recipe based on dish name and cooking method"""
    dish_lower = dish_name.lower()
    
    # Base recipe structure
    recipe = {
        'servings': 4,
        'difficulty': 'medium',
        'nutrition': {
            'calories': 150,
            'protein': 5,
            'carbs': 20,
            'fat': 7,
            'fiber': 3
        }
    }
    
    # Determine cooking method and adjust recipe accordingly
    if 'roasted' in dish_lower or 'roast' in dish_lower:
        recipe.update({
            'prep_time': 15,
            'cook_time': 45,
            'difficulty': 'easy',
            'ingredients': [
                f"2 lbs {dish_name.replace('Roasted ', '').lower()}",
                "3 tablespoons olive oil",
                "2 teaspoons salt",
                "1 teaspoon black pepper",
                "2 cloves garlic, minced",
                "Fresh herbs (rosemary, thyme)",
                "1 lemon, quartered (optional)"
            ],
            'instructions': [
                "Preheat your oven to 425°F (220°C)",
                f"Wash and prepare the {dish_name.replace('Roasted ', '').lower()}, cutting into even pieces",
                "Pat dry with paper towels",
                "Toss with olive oil, salt, pepper, and garlic",
                "Arrange in a single layer on a baking sheet",
                "Roast for 35-45 minutes, turning once halfway through",
                "Check for golden brown color and tender texture",
                "Garnish with fresh herbs and serve immediately"
            ]
        })
        
    elif 'mashed' in dish_lower:
        recipe.update({
            'prep_time': 10,
            'cook_time': 20,
            'difficulty': 'easy',
            'ingredients': [
                f"2 lbs {dish_name.replace('Mashed ', '').lower()}",
                "1/2 cup butter",
                "1/2 cup warm milk or cream",
                "Salt and white pepper to taste",
                "Optional: roasted garlic, chives, or herbs"
            ],
            'instructions': [
                f"Peel and cut {dish_name.replace('Mashed ', '').lower()} into even chunks",
                "Place in a large pot and cover with cold salted water",
                "Bring to a boil, then reduce heat and simmer for 15-20 minutes",
                "Test for doneness - should be easily pierced with a fork",
                "Drain thoroughly and return to the hot pot",
                "Add butter and mash until smooth",
                "Gradually add warm milk until desired consistency",
                "Season with salt and pepper, serve hot"
            ]
        })
        
    elif 'salad' in dish_lower:
        recipe.update({
            'prep_time': 15,
            'cook_time': 0,
            'difficulty': 'easy',
            'ingredients': [
                "Mixed salad greens or specific vegetables",
                "Olive oil and vinegar for dressing",
                "Salt and pepper to taste",
                "Optional toppings: nuts, cheese, croutons",
                "Fresh herbs for garnish"
            ],
            'instructions': [
                "Wash and dry all vegetables thoroughly",
                "Chop or tear into bite-sized pieces",
                "Prepare dressing by whisking oil and vinegar",
                "Toss salad with dressing just before serving",
                "Add any toppings and garnish with fresh herbs",
                "Serve immediately for best texture"
            ]
        })
        
    elif 'steamed' in dish_lower:
        recipe.update({
            'prep_time': 5,
            'cook_time': 10,
            'difficulty': 'easy',
            'ingredients': [
                f"{dish_name.replace('Steamed ', '')}",
                "Water for steaming",
                "Salt to taste",
                "Butter or olive oil for serving",
                "Lemon juice (optional)"
            ],
            'instructions': [
                "Set up steamer basket over boiling water",
                f"Prepare {dish_name.replace('Steamed ', '').lower()}",
                "Place in steamer basket, cover tightly",
                "Steam for 8-10 minutes until tender",
                "Season with salt and drizzle with butter",
                "Serve immediately while hot"
            ]
        })
        
    else:  # Default recipe
        recipe.update({
            'prep_time': 15,
            'cook_time': 25,
            'difficulty': 'medium',
            'ingredients': [
                f"Main ingredients for {dish_name}",
                "Seasonings and spices to taste",
                "Oil or butter for cooking",
                "Fresh herbs for garnish"
            ],
            'instructions': [
                f"Prepare all ingredients for {dish_name}",
                "Heat oil or butter in appropriate cookware",
                "Cook according to traditional method",
                "Season to taste during cooking",
                "Check for proper doneness",
                "Garnish and serve hot"
            ]
        })
    
    return recipe

def process_csv_row(row: Dict) -> Dict:
    """Process a single CSV row and generate complete dish data"""
    keyword = row['keyword'].strip()
    
    # Extract main dish name from keyword if not provided
    if 'main_dish' in row and row['main_dish']:
        main_dish_name = row['main_dish'].strip()
    else:
        main_dish_name = extract_main_dish_from_keyword(keyword)
    
    # Collect all side dishes from the row
    side_dishes = []
    for i in range(1, 16):  # side_dish_1 through side_dish_15
        key = f'side_dish_{i}'
        if key in row and row[key] and row[key].strip():
            side_dishes.append(row[key].strip())
    
    # Generate complete data structure
    cuisine = determine_cuisine(main_dish_name)
    
    formatted_data = {
        'main_dish': {
            'name': main_dish_name,
            'slug': generate_slug(main_dish_name),
            'description': generate_description(main_dish_name, 'main'),
            'dish_type': 'main',
            'cuisine': cuisine,
            'dietary_tags': determine_dietary_tags(main_dish_name),
            'seo_title': f"What to Serve with {main_dish_name} - {len(side_dishes)} Best Side Dishes | PairDish",
            'seo_description': f"Discover the perfect side dishes to serve with {main_dish_name}. From classic {cuisine} pairings to creative modern options, find the best accompaniments for your meal.",
            'keywords': [
                keyword,
                f"{main_dish_name.lower()} side dishes",
                f"best sides for {main_dish_name.lower()}",
                f"what goes with {main_dish_name.lower()}",
                f"{main_dish_name.lower()} accompaniments",
                f"{cuisine.lower()} side dishes"
            ]
        },
        'side_dishes': []
    }
    
    # Generate data for each side dish
    for side_name in side_dishes[:15]:  # Ensure max 15 sides
        side_dish = {
            'name': side_name,
            'slug': generate_slug(side_name),
            'description': generate_description(side_name, 'side', main_dish_name),
            'dish_type': 'side',
            'cuisine': determine_cuisine(side_name) if side_name else cuisine,
            'dietary_tags': determine_dietary_tags(side_name),
            'recipe': generate_recipe(side_name)
        }
        formatted_data['side_dishes'].append(side_dish)
    
    return formatted_data

def import_from_csv(csv_path: str) -> None:
    """Import dishes from CSV file"""
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return
    
    print(f"Reading CSV from: {csv_path}")
    
    success_count = 0
    failed_dishes = []
    processed_dishes = []
    
    # Read CSV file
    with open(csv_path, 'r', encoding='utf-8') as file:
        # Try to detect delimiter
        sample = file.read(1024)
        file.seek(0)
        sniffer = csv.Sniffer()
        delimiter = sniffer.sniff(sample).delimiter
        
        reader = csv.DictReader(file, delimiter=delimiter)
        rows = list(reader)
        
    print(f"Found {len(rows)} dishes in CSV\n")
    
    # Process each row
    for i, row in enumerate(rows):
        try:
            keyword = row.get('keyword', '').strip()
            if not keyword:
                print(f"Skipping row {i+1}: No keyword found")
                continue
            
            print(f"[{i+1}/{len(rows)}] Processing: {keyword}")
            
            # Generate all data
            formatted_data = process_csv_row(row)
            main_dish_name = formatted_data['main_dish']['name']
            side_count = len(formatted_data['side_dishes'])
            
            print(f"  Main dish: {main_dish_name}")
            print(f"  Side dishes: {side_count}")
            
            # Send to API
            try:
                response = requests.post(
                    WORKER_ENDPOINT,
                    json=formatted_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                
                if response.status_code == 200:
                    print(f"  ✅ Successfully imported")
                    success_count += 1
                    processed_dishes.append(main_dish_name)
                else:
                    print(f"  ❌ API error: {response.status_code} - {response.text}")
                    failed_dishes.append({'dish': main_dish_name, 'error': response.text})
                    
            except Exception as e:
                print(f"  ❌ Request error: {e}")
                failed_dishes.append({'dish': main_dish_name, 'error': str(e)})
            
            # Rate limiting
            time.sleep(0.5)
            
        except Exception as e:
            print(f"  ❌ Processing error: {e}")
            failed_dishes.append({'dish': f"Row {i+1}", 'error': str(e)})
    
    # Summary
    print(f"\n{'='*60}")
    print(f"IMPORT SUMMARY")
    print(f"{'='*60}")
    print(f"Total rows processed: {len(rows)}")
    print(f"Successfully imported: {success_count}")
    print(f"Failed: {len(failed_dishes)}")
    
    if failed_dishes:
        print(f"\nFailed imports:")
        for failure in failed_dishes:
            print(f"  - {failure['dish']}: {failure['error']}")
    
    # Save import log
    log_data = {
        'timestamp': datetime.now().isoformat(),
        'total_processed': len(rows),
        'successful': success_count,
        'failed': len(failed_dishes),
        'processed_dishes': processed_dishes,
        'failures': failed_dishes
    }
    
    with open('import_log.json', 'w') as f:
        json.dump(log_data, f, indent=2)
    
    print(f"\nImport log saved to: import_log.json")

def main():
    """Main execution"""
    print("=== PairDish CSV Importer ===")
    print(f"Worker Endpoint: {WORKER_ENDPOINT}")
    print(f"CSV File: {CSV_FILE_PATH}\n")
    
    # Check if CSV exists
    if not os.path.exists(CSV_FILE_PATH):
        print(f"ERROR: CSV file not found at {CSV_FILE_PATH}")
        print("\nPlease create a CSV file with the following format:")
        print("keyword,main_dish,side_dish_1,side_dish_2,...,side_dish_15")
        print('"what to serve with beef wellington","Beef Wellington","Roasted Potatoes",...')
        return
    
    # Import from CSV
    import_from_csv(CSV_FILE_PATH)
    
    print(f"\nTo check imported data:")
    print(f"  API: {WORKER_ENDPOINT.replace('/api/import-dishes', '/api/dishes')}")

if __name__ == "__main__":
    main()