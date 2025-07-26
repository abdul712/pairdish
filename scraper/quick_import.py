#!/usr/bin/env python3
"""
Quick Import Script for PairDish
Imports pre-defined dish pairings to populate the database
"""

import os
import json
import time
import requests
from typing import Dict, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
WORKER_ENDPOINT = os.getenv('WORKER_ENDPOINT', 'https://pairdish.mabdulrahim.workers.dev/api/import-dishes')

# Pre-defined dish pairings based on culinary best practices
DISH_PAIRINGS = [
    {
        "main": "Chicken Biryani",
        "cuisine": "Indian",
        "sides": [
            "Cucumber Raita", "Garlic Naan", "Onion Salad", "Mint Chutney", 
            "Papadum", "Mango Lassi", "Pickled Vegetables", "Basmati Rice Pulao",
            "Dal Tadka", "Vegetable Korma", "Tandoori Roti", "Kachumber Salad",
            "Roasted Cashews", "Saffron Rice", "Aloo Gobi"
        ]
    },
    {
        "main": "Grilled Salmon",
        "cuisine": "International",
        "sides": [
            "Asparagus", "Lemon Rice", "Caesar Salad", "Roasted Potatoes",
            "Garlic Butter Green Beans", "Quinoa Salad", "Coleslaw", "Grilled Vegetables",
            "Mashed Sweet Potatoes", "Spinach Salad", "Wild Rice Pilaf", "Roasted Brussels Sprouts",
            "Cucumber Dill Salad", "Herb Roasted Carrots", "Caprese Salad"
        ]
    },
    {
        "main": "BBQ Ribs",
        "cuisine": "American",
        "sides": [
            "Coleslaw", "Baked Beans", "Corn on the Cob", "Mac and Cheese",
            "Potato Salad", "Cornbread", "French Fries", "Onion Rings",
            "Pickles", "Grilled Vegetables", "Sweet Potato Fries", "Garden Salad",
            "Jalapeño Poppers", "Fried Okra", "Watermelon Salad"
        ]
    },
    {
        "main": "Pasta Carbonara",
        "cuisine": "Italian",
        "sides": [
            "Caesar Salad", "Garlic Bread", "Bruschetta", "Caprese Salad",
            "Arugula Salad", "Focaccia", "Roasted Tomatoes", "Italian Green Beans",
            "Antipasto Platter", "Grilled Asparagus", "Minestrone Soup", "Olive Tapenade",
            "Roasted Red Peppers", "Zucchini Fritti", "Tiramisu"
        ]
    },
    {
        "main": "Beef Tacos",
        "cuisine": "Mexican",
        "sides": [
            "Mexican Rice", "Refried Beans", "Guacamole", "Pico de Gallo",
            "Corn Salad", "Chips and Salsa", "Black Beans", "Elote",
            "Cilantro Lime Rice", "Nachos", "Quesadillas", "Mexican Street Corn",
            "Churros", "Flan", "Margaritas"
        ]
    },
    {
        "main": "Pad Thai",
        "cuisine": "Thai",
        "sides": [
            "Spring Rolls", "Tom Yum Soup", "Papaya Salad", "Coconut Rice",
            "Thai Cucumber Salad", "Satay Skewers", "Mango Sticky Rice", "Tom Kha Gai",
            "Thai Fish Cakes", "Larb Salad", "Fried Wontons", "Thai Iced Tea",
            "Green Curry", "Pad See Ew", "Thai Basil Stir Fry"
        ]
    },
    {
        "main": "Roast Chicken",
        "cuisine": "International",
        "sides": [
            "Roasted Potatoes", "Green Beans", "Gravy", "Yorkshire Pudding",
            "Roasted Carrots", "Stuffing", "Cranberry Sauce", "Mashed Potatoes",
            "Garden Salad", "Roasted Root Vegetables", "Bread Rolls", "Corn Pudding",
            "Glazed Carrots", "Rice Pilaf", "Apple Sauce"
        ]
    },
    {
        "main": "Sushi",
        "cuisine": "Japanese",
        "sides": [
            "Miso Soup", "Edamame", "Seaweed Salad", "Tempura", "Gyoza",
            "Agedashi Tofu", "Sunomono", "Chicken Karaage", "Takoyaki",
            "Yakitori", "Shrimp Tempura", "Cucumber Salad", "Green Tea Ice Cream",
            "Mochi", "Sake"
        ]
    },
    {
        "main": "Lamb Curry",
        "cuisine": "Indian",
        "sides": [
            "Basmati Rice", "Naan Bread", "Raita", "Mango Chutney",
            "Papadum", "Samosas", "Bhindi Masala", "Aloo Paratha",
            "Dal Makhani", "Paneer Tikka", "Mint Chutney", "Onion Bhaji",
            "Lassi", "Kulfi", "Gulab Jamun"
        ]
    },
    {
        "main": "Pizza",
        "cuisine": "Italian",
        "sides": [
            "Caesar Salad", "Garlic Knots", "Buffalo Wings", "Mozzarella Sticks",
            "Breadsticks", "Antipasto Salad", "Bruschetta", "Fried Calamari",
            "Caprese Skewers", "Zucchini Sticks", "Greek Salad", "Jalapeño Poppers",
            "Onion Rings", "Tiramisu", "Gelato"
        ]
    },
    {
        "main": "Steak",
        "cuisine": "American",
        "sides": [
            "Baked Potato", "Asparagus", "Caesar Salad", "Garlic Mashed Potatoes",
            "Creamed Spinach", "Mac and Cheese", "Grilled Mushrooms", "Onion Rings",
            "Wedge Salad", "Roasted Brussels Sprouts", "Sweet Potato Fries", "Lobster Tail",
            "Red Wine Reduction", "Béarnaise Sauce", "Chocolate Lava Cake"
        ]
    },
    {
        "main": "Fish and Chips",
        "cuisine": "British",
        "sides": [
            "Mushy Peas", "Tartar Sauce", "Coleslaw", "Pickled Onions",
            "Curry Sauce", "Lemon Wedges", "Malt Vinegar", "Bread and Butter",
            "Baked Beans", "Chip Shop Curry", "Pickled Gherkins", "Garden Peas",
            "Onion Rings", "Scotch Egg", "Sticky Toffee Pudding"
        ]
    }
]

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug"""
    return name.lower().strip().replace(' ', '-').replace(',', '').replace("'", '')

def create_pairing_data(main_dish: str, cuisine: str, side_dishes: List[str]) -> Dict:
    """Create properly formatted pairing data"""
    return {
        'main_dish': {
            'name': main_dish,
            'slug': generate_slug(main_dish),
            'description': f"Delicious {main_dish} - a classic {cuisine} dish that's perfect for any occasion",
            'dish_type': 'main',
            'cuisine': cuisine,
            'seo_title': f"What to Serve with {main_dish} - 15 Best Side Dishes | PairDish",
            'seo_description': f"Discover the perfect side dishes to serve with {main_dish}. From traditional pairings to creative options, find the best accompaniments.",
            'keywords': [
                f"what to serve with {main_dish.lower()}",
                f"{main_dish.lower()} side dishes",
                f"best sides for {main_dish.lower()}",
                f"{main_dish.lower()} accompaniments"
            ]
        },
        'side_dishes': []
    }

def create_side_dish(name: str, main_dish: str) -> Dict:
    """Create side dish data"""
    dish_data = {
        'name': name,
        'slug': generate_slug(name),
        'description': f"Perfect side dish to complement {main_dish}",
        'dish_type': 'side',
        'dietary_tags': []
    }
    
    # Add dietary tags based on dish name
    name_lower = name.lower()
    if any(word in name_lower for word in ['salad', 'vegetable', 'veggie']):
        dish_data['dietary_tags'].append('vegetarian')
    if any(word in name_lower for word in ['rice', 'quinoa', 'beans', 'lentil']):
        dish_data['dietary_tags'].append('gluten-free')
    if 'vegan' in name_lower or 'tofu' in name_lower:
        dish_data['dietary_tags'].append('vegan')
    
    # Add simple recipe for some items
    if any(word in name_lower for word in ['salad', 'rice', 'sauce', 'dip']):
        dish_data['recipe'] = {
            'ingredients': [f"Fresh ingredients for {name}"],
            'instructions': [f"Prepare {name} according to taste"],
            'prep_time': 15,
            'cook_time': 10 if 'salad' in name_lower else 30,
            'servings': 4,
            'difficulty': 'easy' if 'salad' in name_lower else 'medium'
        }
    
    return dish_data

def send_to_api(data: Dict) -> bool:
    """Send data to the API"""
    try:
        response = requests.post(
            WORKER_ENDPOINT,
            json=data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            print(f"✅ Successfully imported: {data['main_dish']['name']}")
            return True
        else:
            print(f"❌ Failed to import {data['main_dish']['name']}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main execution"""
    print("=== PairDish Quick Import ===")
    print(f"API Endpoint: {WORKER_ENDPOINT}\n")
    
    success_count = 0
    total_count = len(DISH_PAIRINGS)
    
    for pairing in DISH_PAIRINGS:
        print(f"\nImporting: {pairing['main']} ({pairing['cuisine']})")
        
        # Create pairing data
        data = create_pairing_data(pairing['main'], pairing['cuisine'], pairing['sides'])
        
        # Add side dishes
        for side_name in pairing['sides'][:15]:  # Limit to 15 sides
            side_dish = create_side_dish(side_name, pairing['main'])
            data['side_dishes'].append(side_dish)
        
        print(f"  - {len(data['side_dishes'])} side dishes")
        
        # Send to API
        if send_to_api(data):
            success_count += 1
        
        # Small delay between requests
        time.sleep(1)
    
    print(f"\n=== Import Complete ===")
    print(f"Successfully imported: {success_count}/{total_count} dishes")
    print(f"\nYou can now visit:")
    print(f"  - API: {WORKER_ENDPOINT.replace('/api/import-dishes', '/api/dishes')}")
    print(f"  - Example: {WORKER_ENDPOINT.replace('/api/import-dishes', '/api/pairings/chicken-biryani')}")

if __name__ == "__main__":
    main()