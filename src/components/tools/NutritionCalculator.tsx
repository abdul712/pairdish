/**
 * Nutrition Calculator
 *
 * Paste recipe ingredients to get complete nutritional breakdown.
 * Features:
 * - Ingredient parsing with quantity, unit, and food detection
 * - USDA-based nutrition database
 * - Per-serving and total calculations
 * - Dietary labels (Low-Carb, High-Protein, etc.)
 * - Visual macro breakdown
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface NutritionFacts {
  calories: number;
  fat: number;
  saturatedFat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  protein: number;
  sodium: number;
  cholesterol: number;
}

interface FoodItem {
  id: string;
  name: string;
  aliases: string[];
  servingSize: string;
  servingGrams: number;
  nutrition: NutritionFacts;
}

interface ParsedIngredient {
  original: string;
  amount: number;
  unit: string;
  food: string;
  matchedFood: FoodItem | null;
  nutrition: NutritionFacts | null;
}

// Nutrition database (USDA-based, per 100g)
const FOOD_DATABASE: FoodItem[] = [
  // Proteins
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    aliases: ['chicken', 'boneless chicken', 'skinless chicken breast', 'chicken breasts'],
    servingSize: '100g',
    servingGrams: 100,
    nutrition: { calories: 165, fat: 3.6, saturatedFat: 1, carbohydrates: 0, fiber: 0, sugar: 0, protein: 31, sodium: 74, cholesterol: 85 },
  },
  {
    id: 'ground-beef',
    name: 'Ground Beef (80/20)',
    aliases: ['ground beef', 'beef', 'hamburger', 'minced beef', 'beef mince'],
    servingSize: '100g',
    servingGrams: 100,
    nutrition: { calories: 254, fat: 17, saturatedFat: 6.8, carbohydrates: 0, fiber: 0, sugar: 0, protein: 26, sodium: 75, cholesterol: 78 },
  },
  {
    id: 'salmon',
    name: 'Salmon',
    aliases: ['salmon fillet', 'atlantic salmon', 'salmon filet'],
    servingSize: '100g',
    servingGrams: 100,
    nutrition: { calories: 208, fat: 12, saturatedFat: 2.5, carbohydrates: 0, fiber: 0, sugar: 0, protein: 20, sodium: 59, cholesterol: 55 },
  },
  {
    id: 'eggs',
    name: 'Eggs',
    aliases: ['egg', 'large egg', 'whole egg', 'eggs large'],
    servingSize: '1 large (50g)',
    servingGrams: 50,
    nutrition: { calories: 72, fat: 5, saturatedFat: 1.6, carbohydrates: 0.4, fiber: 0, sugar: 0.2, protein: 6.3, sodium: 71, cholesterol: 186 },
  },
  {
    id: 'bacon',
    name: 'Bacon',
    aliases: ['bacon strips', 'pork bacon', 'streaky bacon'],
    servingSize: '2 slices (16g)',
    servingGrams: 16,
    nutrition: { calories: 86, fat: 7, saturatedFat: 2.3, carbohydrates: 0.2, fiber: 0, sugar: 0, protein: 5.5, sodium: 280, cholesterol: 18 },
  },
  {
    id: 'tofu',
    name: 'Tofu (Firm)',
    aliases: ['tofu', 'firm tofu', 'bean curd'],
    servingSize: '100g',
    servingGrams: 100,
    nutrition: { calories: 144, fat: 8.7, saturatedFat: 1.3, carbohydrates: 2.8, fiber: 1.9, sugar: 0.6, protein: 15.8, sodium: 14, cholesterol: 0 },
  },

  // Dairy
  {
    id: 'butter',
    name: 'Butter',
    aliases: ['unsalted butter', 'salted butter'],
    servingSize: '1 tbsp (14g)',
    servingGrams: 14,
    nutrition: { calories: 102, fat: 11.5, saturatedFat: 7.3, carbohydrates: 0, fiber: 0, sugar: 0, protein: 0.1, sodium: 2, cholesterol: 31 },
  },
  {
    id: 'milk-whole',
    name: 'Whole Milk',
    aliases: ['milk', 'whole milk', 'regular milk'],
    servingSize: '1 cup (244ml)',
    servingGrams: 244,
    nutrition: { calories: 149, fat: 8, saturatedFat: 4.6, carbohydrates: 12, fiber: 0, sugar: 12, protein: 8, sodium: 105, cholesterol: 24 },
  },
  {
    id: 'cheese-cheddar',
    name: 'Cheddar Cheese',
    aliases: ['cheddar', 'cheese', 'cheddar cheese', 'sharp cheddar'],
    servingSize: '1 oz (28g)',
    servingGrams: 28,
    nutrition: { calories: 113, fat: 9.3, saturatedFat: 5.9, carbohydrates: 0.4, fiber: 0, sugar: 0.1, protein: 7, sodium: 174, cholesterol: 28 },
  },
  {
    id: 'cream-cheese',
    name: 'Cream Cheese',
    aliases: ['cream cheese', 'philadelphia'],
    servingSize: '2 tbsp (28g)',
    servingGrams: 28,
    nutrition: { calories: 99, fat: 9.9, saturatedFat: 5.6, carbohydrates: 1.6, fiber: 0, sugar: 0.9, protein: 1.7, sodium: 85, cholesterol: 31 },
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt',
    aliases: ['greek yogurt', 'plain greek yogurt', 'yogurt'],
    servingSize: '1 cup (245g)',
    servingGrams: 245,
    nutrition: { calories: 146, fat: 3.8, saturatedFat: 2.5, carbohydrates: 7.8, fiber: 0, sugar: 7, protein: 20, sodium: 68, cholesterol: 13 },
  },
  {
    id: 'heavy-cream',
    name: 'Heavy Cream',
    aliases: ['heavy cream', 'whipping cream', 'heavy whipping cream'],
    servingSize: '1 tbsp (15ml)',
    servingGrams: 15,
    nutrition: { calories: 52, fat: 5.6, saturatedFat: 3.5, carbohydrates: 0.4, fiber: 0, sugar: 0.4, protein: 0.3, sodium: 6, cholesterol: 17 },
  },

  // Grains & Carbs
  {
    id: 'rice-white',
    name: 'White Rice (cooked)',
    aliases: ['rice', 'white rice', 'cooked rice', 'steamed rice'],
    servingSize: '1 cup (158g)',
    servingGrams: 158,
    nutrition: { calories: 206, fat: 0.4, saturatedFat: 0.1, carbohydrates: 45, fiber: 0.6, sugar: 0, protein: 4.3, sodium: 2, cholesterol: 0 },
  },
  {
    id: 'pasta',
    name: 'Pasta (cooked)',
    aliases: ['pasta', 'spaghetti', 'penne', 'linguine', 'fettuccine', 'noodles'],
    servingSize: '1 cup (140g)',
    servingGrams: 140,
    nutrition: { calories: 220, fat: 1.3, saturatedFat: 0.2, carbohydrates: 43, fiber: 2.5, sugar: 0.8, protein: 8.1, sodium: 1, cholesterol: 0 },
  },
  {
    id: 'bread-white',
    name: 'White Bread',
    aliases: ['bread', 'white bread', 'sandwich bread', 'slice bread'],
    servingSize: '1 slice (25g)',
    servingGrams: 25,
    nutrition: { calories: 66, fat: 0.9, saturatedFat: 0.2, carbohydrates: 12.7, fiber: 0.6, sugar: 1.4, protein: 2.3, sodium: 130, cholesterol: 0 },
  },
  {
    id: 'flour-ap',
    name: 'All-Purpose Flour',
    aliases: ['flour', 'all purpose flour', 'ap flour', 'white flour'],
    servingSize: '1 cup (125g)',
    servingGrams: 125,
    nutrition: { calories: 455, fat: 1.2, saturatedFat: 0.2, carbohydrates: 95, fiber: 3.4, sugar: 0.3, protein: 12.9, sodium: 3, cholesterol: 0 },
  },
  {
    id: 'oats',
    name: 'Oats (dry)',
    aliases: ['oats', 'rolled oats', 'oatmeal', 'old fashioned oats'],
    servingSize: '1/2 cup (40g)',
    servingGrams: 40,
    nutrition: { calories: 153, fat: 2.6, saturatedFat: 0.4, carbohydrates: 27, fiber: 4, sugar: 0.4, protein: 5.3, sodium: 2, cholesterol: 0 },
  },

  // Vegetables
  {
    id: 'broccoli',
    name: 'Broccoli',
    aliases: ['broccoli', 'broccoli florets'],
    servingSize: '1 cup (91g)',
    servingGrams: 91,
    nutrition: { calories: 31, fat: 0.3, saturatedFat: 0, carbohydrates: 6, fiber: 2.4, sugar: 1.5, protein: 2.5, sodium: 30, cholesterol: 0 },
  },
  {
    id: 'spinach',
    name: 'Spinach',
    aliases: ['spinach', 'baby spinach', 'fresh spinach'],
    servingSize: '1 cup (30g)',
    servingGrams: 30,
    nutrition: { calories: 7, fat: 0.1, saturatedFat: 0, carbohydrates: 1.1, fiber: 0.7, sugar: 0.1, protein: 0.9, sodium: 24, cholesterol: 0 },
  },
  {
    id: 'onion',
    name: 'Onion',
    aliases: ['onion', 'yellow onion', 'white onion', 'red onion', 'onions'],
    servingSize: '1 medium (110g)',
    servingGrams: 110,
    nutrition: { calories: 44, fat: 0.1, saturatedFat: 0, carbohydrates: 10, fiber: 1.9, sugar: 4.7, protein: 1.2, sodium: 4, cholesterol: 0 },
  },
  {
    id: 'garlic',
    name: 'Garlic',
    aliases: ['garlic', 'garlic cloves', 'cloves garlic', 'minced garlic'],
    servingSize: '1 clove (3g)',
    servingGrams: 3,
    nutrition: { calories: 4, fat: 0, saturatedFat: 0, carbohydrates: 1, fiber: 0.1, sugar: 0, protein: 0.2, sodium: 1, cholesterol: 0 },
  },
  {
    id: 'tomato',
    name: 'Tomato',
    aliases: ['tomato', 'tomatoes', 'roma tomato', 'cherry tomatoes'],
    servingSize: '1 medium (123g)',
    servingGrams: 123,
    nutrition: { calories: 22, fat: 0.2, saturatedFat: 0, carbohydrates: 4.8, fiber: 1.5, sugar: 3.2, protein: 1.1, sodium: 6, cholesterol: 0 },
  },
  {
    id: 'potato',
    name: 'Potato',
    aliases: ['potato', 'potatoes', 'russet potato', 'yukon gold'],
    servingSize: '1 medium (150g)',
    servingGrams: 150,
    nutrition: { calories: 110, fat: 0.1, saturatedFat: 0, carbohydrates: 26, fiber: 2.4, sugar: 1.2, protein: 3, sodium: 8, cholesterol: 0 },
  },
  {
    id: 'carrot',
    name: 'Carrot',
    aliases: ['carrot', 'carrots'],
    servingSize: '1 medium (61g)',
    servingGrams: 61,
    nutrition: { calories: 25, fat: 0.1, saturatedFat: 0, carbohydrates: 6, fiber: 1.7, sugar: 2.9, protein: 0.6, sodium: 42, cholesterol: 0 },
  },
  {
    id: 'bell-pepper',
    name: 'Bell Pepper',
    aliases: ['bell pepper', 'red pepper', 'green pepper', 'sweet pepper', 'peppers'],
    servingSize: '1 medium (119g)',
    servingGrams: 119,
    nutrition: { calories: 31, fat: 0.3, saturatedFat: 0, carbohydrates: 6, fiber: 2.1, sugar: 4.2, protein: 1, sodium: 4, cholesterol: 0 },
  },

  // Fruits
  {
    id: 'banana',
    name: 'Banana',
    aliases: ['banana', 'bananas'],
    servingSize: '1 medium (118g)',
    servingGrams: 118,
    nutrition: { calories: 105, fat: 0.4, saturatedFat: 0.1, carbohydrates: 27, fiber: 3.1, sugar: 14, protein: 1.3, sodium: 1, cholesterol: 0 },
  },
  {
    id: 'apple',
    name: 'Apple',
    aliases: ['apple', 'apples'],
    servingSize: '1 medium (182g)',
    servingGrams: 182,
    nutrition: { calories: 95, fat: 0.3, saturatedFat: 0, carbohydrates: 25, fiber: 4.4, sugar: 19, protein: 0.5, sodium: 2, cholesterol: 0 },
  },
  {
    id: 'lemon',
    name: 'Lemon',
    aliases: ['lemon', 'lemon juice', 'lemons'],
    servingSize: '1 medium (58g)',
    servingGrams: 58,
    nutrition: { calories: 17, fat: 0.2, saturatedFat: 0, carbohydrates: 5.4, fiber: 1.6, sugar: 1.5, protein: 0.6, sodium: 1, cholesterol: 0 },
  },

  // Oils & Fats
  {
    id: 'olive-oil',
    name: 'Olive Oil',
    aliases: ['olive oil', 'evoo', 'extra virgin olive oil'],
    servingSize: '1 tbsp (14g)',
    servingGrams: 14,
    nutrition: { calories: 119, fat: 13.5, saturatedFat: 1.9, carbohydrates: 0, fiber: 0, sugar: 0, protein: 0, sodium: 0, cholesterol: 0 },
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable Oil',
    aliases: ['vegetable oil', 'canola oil', 'cooking oil', 'oil'],
    servingSize: '1 tbsp (14g)',
    servingGrams: 14,
    nutrition: { calories: 124, fat: 14, saturatedFat: 1.1, carbohydrates: 0, fiber: 0, sugar: 0, protein: 0, sodium: 0, cholesterol: 0 },
  },
  {
    id: 'coconut-oil',
    name: 'Coconut Oil',
    aliases: ['coconut oil'],
    servingSize: '1 tbsp (14g)',
    servingGrams: 14,
    nutrition: { calories: 121, fat: 13.5, saturatedFat: 11.2, carbohydrates: 0, fiber: 0, sugar: 0, protein: 0, sodium: 0, cholesterol: 0 },
  },

  // Sweeteners
  {
    id: 'sugar',
    name: 'Sugar',
    aliases: ['sugar', 'white sugar', 'granulated sugar', 'cane sugar'],
    servingSize: '1 tbsp (12.5g)',
    servingGrams: 12.5,
    nutrition: { calories: 48, fat: 0, saturatedFat: 0, carbohydrates: 12.5, fiber: 0, sugar: 12.5, protein: 0, sodium: 0, cholesterol: 0 },
  },
  {
    id: 'honey',
    name: 'Honey',
    aliases: ['honey'],
    servingSize: '1 tbsp (21g)',
    servingGrams: 21,
    nutrition: { calories: 64, fat: 0, saturatedFat: 0, carbohydrates: 17, fiber: 0, sugar: 17, protein: 0.1, sodium: 1, cholesterol: 0 },
  },
  {
    id: 'brown-sugar',
    name: 'Brown Sugar',
    aliases: ['brown sugar', 'light brown sugar', 'dark brown sugar'],
    servingSize: '1 tbsp (14g)',
    servingGrams: 14,
    nutrition: { calories: 52, fat: 0, saturatedFat: 0, carbohydrates: 13.5, fiber: 0, sugar: 13.4, protein: 0, sodium: 4, cholesterol: 0 },
  },

  // Nuts & Seeds
  {
    id: 'almonds',
    name: 'Almonds',
    aliases: ['almonds', 'sliced almonds', 'almond'],
    servingSize: '1 oz (28g)',
    servingGrams: 28,
    nutrition: { calories: 164, fat: 14, saturatedFat: 1.1, carbohydrates: 6, fiber: 3.5, sugar: 1.2, protein: 6, sodium: 0, cholesterol: 0 },
  },
  {
    id: 'walnuts',
    name: 'Walnuts',
    aliases: ['walnuts', 'walnut'],
    servingSize: '1 oz (28g)',
    servingGrams: 28,
    nutrition: { calories: 185, fat: 18.5, saturatedFat: 1.7, carbohydrates: 3.9, fiber: 1.9, sugar: 0.7, protein: 4.3, sodium: 1, cholesterol: 0 },
  },

  // Condiments & Sauces
  {
    id: 'soy-sauce',
    name: 'Soy Sauce',
    aliases: ['soy sauce', 'shoyu'],
    servingSize: '1 tbsp (16g)',
    servingGrams: 16,
    nutrition: { calories: 9, fat: 0, saturatedFat: 0, carbohydrates: 0.8, fiber: 0.1, sugar: 0.1, protein: 1.3, sodium: 879, cholesterol: 0 },
  },
  {
    id: 'mayo',
    name: 'Mayonnaise',
    aliases: ['mayo', 'mayonnaise'],
    servingSize: '1 tbsp (14g)',
    servingGrams: 14,
    nutrition: { calories: 94, fat: 10, saturatedFat: 1.6, carbohydrates: 0.1, fiber: 0, sugar: 0.1, protein: 0.1, sodium: 88, cholesterol: 6 },
  },
  {
    id: 'ketchup',
    name: 'Ketchup',
    aliases: ['ketchup', 'catsup', 'tomato ketchup'],
    servingSize: '1 tbsp (17g)',
    servingGrams: 17,
    nutrition: { calories: 19, fat: 0, saturatedFat: 0, carbohydrates: 4.8, fiber: 0, sugar: 3.7, protein: 0.2, sodium: 154, cholesterol: 0 },
  },
  {
    id: 'mustard',
    name: 'Mustard',
    aliases: ['mustard', 'yellow mustard', 'dijon mustard'],
    servingSize: '1 tsp (5g)',
    servingGrams: 5,
    nutrition: { calories: 3, fat: 0.2, saturatedFat: 0, carbohydrates: 0.3, fiber: 0.1, sugar: 0.1, protein: 0.2, sodium: 56, cholesterol: 0 },
  },
];

// Unit conversion to grams
const UNIT_TO_GRAMS: Record<string, number> = {
  'g': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'oz': 28.35,
  'ounce': 28.35,
  'ounces': 28.35,
  'lb': 453.6,
  'lbs': 453.6,
  'pound': 453.6,
  'pounds': 453.6,
  'cup': 128, // approximate, varies by ingredient
  'cups': 128,
  'tbsp': 15,
  'tablespoon': 15,
  'tablespoons': 15,
  'tsp': 5,
  'teaspoon': 5,
  'teaspoons': 5,
  'ml': 1,
  'milliliter': 1,
  'l': 1000,
  'liter': 1000,
};

// Parse ingredient line
function parseIngredient(line: string): ParsedIngredient {
  const original = line.trim();

  // Regex patterns for parsing
  const amountRegex = /^([\d./]+(?:\s*[-–]\s*[\d./]+)?)\s*/;
  const unitRegex = /^(cups?|tbsp|tablespoons?|tsp|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|kg|ml|l|liters?|cloves?|slices?|pieces?|medium|large|small)\s+/i;

  let remaining = original.toLowerCase();
  let amount = 1;
  let unit = 'piece';

  // Extract amount
  const amountMatch = remaining.match(amountRegex);
  if (amountMatch) {
    const amountStr = amountMatch[1];
    // Handle fractions
    if (amountStr.includes('/')) {
      const parts = amountStr.split('/');
      if (parts.length === 2) {
        amount = parseFloat(parts[0]) / parseFloat(parts[1]);
      }
    } else if (amountStr.includes('-') || amountStr.includes('–')) {
      // Handle ranges (take average)
      const parts = amountStr.split(/[-–]/);
      amount = (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
    } else {
      amount = parseFloat(amountStr);
    }
    remaining = remaining.slice(amountMatch[0].length);
  }

  // Extract unit
  const unitMatch = remaining.match(unitRegex);
  if (unitMatch) {
    unit = unitMatch[1].toLowerCase();
    remaining = remaining.slice(unitMatch[0].length);
  }

  // Clean up food name
  const food = remaining
    .replace(/,.*$/, '') // Remove everything after comma
    .replace(/\(.*?\)/g, '') // Remove parenthetical notes
    .replace(/\s+/g, ' ')
    .trim();

  // Find matching food in database
  const matchedFood = FOOD_DATABASE.find(item =>
    item.name.toLowerCase() === food ||
    item.aliases.some(alias => alias.toLowerCase() === food || food.includes(alias.toLowerCase()))
  ) || null;

  // Calculate nutrition if matched
  let nutrition: NutritionFacts | null = null;
  if (matchedFood) {
    let grams = matchedFood.servingGrams * amount;

    // Convert unit to grams if known
    if (unit !== 'piece' && UNIT_TO_GRAMS[unit]) {
      grams = UNIT_TO_GRAMS[unit] * amount;
    }

    const multiplier = grams / 100; // Database is per 100g conceptually normalized
    const baseMultiplier = grams / matchedFood.servingGrams;

    nutrition = {
      calories: Math.round(matchedFood.nutrition.calories * baseMultiplier),
      fat: Math.round(matchedFood.nutrition.fat * baseMultiplier * 10) / 10,
      saturatedFat: Math.round(matchedFood.nutrition.saturatedFat * baseMultiplier * 10) / 10,
      carbohydrates: Math.round(matchedFood.nutrition.carbohydrates * baseMultiplier * 10) / 10,
      fiber: Math.round(matchedFood.nutrition.fiber * baseMultiplier * 10) / 10,
      sugar: Math.round(matchedFood.nutrition.sugar * baseMultiplier * 10) / 10,
      protein: Math.round(matchedFood.nutrition.protein * baseMultiplier * 10) / 10,
      sodium: Math.round(matchedFood.nutrition.sodium * baseMultiplier),
      cholesterol: Math.round(matchedFood.nutrition.cholesterol * baseMultiplier),
    };
  }

  return {
    original,
    amount,
    unit,
    food,
    matchedFood,
    nutrition,
  };
}

// Icons
const CalculatorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <line x1="8" x2="16" y1="6" y2="6"/>
    <line x1="16" x2="16" y1="14" y2="18"/>
    <path d="M16 10h.01"/>
    <path d="M12 10h.01"/>
    <path d="M8 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M8 14h.01"/>
    <path d="M12 18h.01"/>
    <path d="M8 18h.01"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

export default function NutritionCalculator() {
  const [ingredientsText, setIngredientsText] = useState('');
  const [servings, setServings] = useState(4);

  // Parse all ingredients
  const parsedIngredients = useMemo(() => {
    if (!ingredientsText.trim()) return [];

    return ingredientsText
      .split('\n')
      .filter(line => line.trim())
      .map(parseIngredient);
  }, [ingredientsText]);

  // Calculate totals
  const totals = useMemo(() => {
    const base: NutritionFacts = {
      calories: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
      protein: 0,
      sodium: 0,
      cholesterol: 0,
    };

    parsedIngredients.forEach(ing => {
      if (ing.nutrition) {
        base.calories += ing.nutrition.calories;
        base.fat += ing.nutrition.fat;
        base.saturatedFat += ing.nutrition.saturatedFat;
        base.carbohydrates += ing.nutrition.carbohydrates;
        base.fiber += ing.nutrition.fiber;
        base.sugar += ing.nutrition.sugar;
        base.protein += ing.nutrition.protein;
        base.sodium += ing.nutrition.sodium;
        base.cholesterol += ing.nutrition.cholesterol;
      }
    });

    return base;
  }, [parsedIngredients]);

  // Per serving
  const perServing = useMemo(() => ({
    calories: Math.round(totals.calories / servings),
    fat: Math.round(totals.fat / servings * 10) / 10,
    saturatedFat: Math.round(totals.saturatedFat / servings * 10) / 10,
    carbohydrates: Math.round(totals.carbohydrates / servings * 10) / 10,
    fiber: Math.round(totals.fiber / servings * 10) / 10,
    sugar: Math.round(totals.sugar / servings * 10) / 10,
    protein: Math.round(totals.protein / servings * 10) / 10,
    sodium: Math.round(totals.sodium / servings),
    cholesterol: Math.round(totals.cholesterol / servings),
  }), [totals, servings]);

  // Dietary labels
  const dietaryLabels = useMemo(() => {
    const labels: string[] = [];

    if (perServing.calories > 0) {
      const proteinCals = perServing.protein * 4;
      const carbCals = perServing.carbohydrates * 4;
      const fatCals = perServing.fat * 9;

      // High protein: >25% calories from protein
      if (proteinCals / perServing.calories > 0.25) {
        labels.push('High-Protein');
      }

      // Low carb: <20% calories from carbs
      if (carbCals / perServing.calories < 0.2) {
        labels.push('Low-Carb');
      }

      // Low fat: <30% calories from fat
      if (fatCals / perServing.calories < 0.3) {
        labels.push('Low-Fat');
      }

      // High fiber: >5g per serving
      if (perServing.fiber >= 5) {
        labels.push('High-Fiber');
      }

      // Low sodium: <140mg per serving
      if (perServing.sodium < 140) {
        labels.push('Low-Sodium');
      }
    }

    return labels;
  }, [perServing]);

  // Macro breakdown percentages
  const macroPercentages = useMemo(() => {
    const totalCals = perServing.calories || 1;
    const proteinCals = perServing.protein * 4;
    const carbCals = perServing.carbohydrates * 4;
    const fatCals = perServing.fat * 9;

    return {
      protein: Math.round((proteinCals / totalCals) * 100),
      carbs: Math.round((carbCals / totalCals) * 100),
      fat: Math.round((fatCals / totalCals) * 100),
    };
  }, [perServing]);

  const matchedCount = parsedIngredients.filter(i => i.matchedFood).length;
  const unmatchedCount = parsedIngredients.filter(i => !i.matchedFood && i.food).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-[var(--color-wine)]">
            <CalculatorIcon />
          </span>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Recipe Nutrition Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ingredients Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Paste your recipe ingredients (one per line):
            </label>
            <textarea
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder={`2 cups flour
3 large eggs
1/2 cup sugar
1 cup milk
2 tbsp butter
1 tsp vanilla`}
              className="w-full h-48 p-4 border border-[var(--color-cream-dark)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent font-mono text-sm"
            />

            {parsedIngredients.length > 0 && (
              <div className="mt-3 flex items-center gap-4 text-sm">
                {matchedCount > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckIcon />
                    {matchedCount} matched
                  </span>
                )}
                {unmatchedCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertIcon />
                    {unmatchedCount} not found
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Servings */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Number of servings:
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-10 h-10 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] flex items-center justify-center text-lg font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 text-center border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              />
              <button
                onClick={() => setServings(servings + 1)}
                className="w-10 h-10 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] flex items-center justify-center text-lg font-bold"
              >
                +
              </button>
            </div>

            {/* Dietary Labels */}
            {dietaryLabels.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">
                  Dietary Profile:
                </label>
                <div className="flex flex-wrap gap-1">
                  {dietaryLabels.map(label => (
                    <span key={label} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {parsedIngredients.length > 0 && matchedCount > 0 && (
        <>
          {/* Nutrition Facts Card */}
          <div className="card bg-white p-6 md:p-8 mb-8">
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4 text-center">
              Nutrition Facts
            </h3>
            <p className="text-sm text-[var(--text-muted)] text-center mb-6">
              Per Serving ({servings} servings total)
            </p>

            {/* Main calories */}
            <div className="text-center mb-6 pb-6 border-b-4 border-[var(--color-charcoal)]">
              <div className="text-5xl font-bold text-[var(--text-primary)]">
                {perServing.calories}
              </div>
              <div className="text-sm text-[var(--text-muted)]">Calories</div>
            </div>

            {/* Macro breakdown visual */}
            <div className="mb-6">
              <div className="flex h-6 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{ width: `${macroPercentages.protein}%` }}
                  title={`Protein: ${macroPercentages.protein}%`}
                />
                <div
                  className="bg-amber-500"
                  style={{ width: `${macroPercentages.carbs}%` }}
                  title={`Carbs: ${macroPercentages.carbs}%`}
                />
                <div
                  className="bg-red-400"
                  style={{ width: `${macroPercentages.fat}%` }}
                  title={`Fat: ${macroPercentages.fat}%`}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500"></span>
                  Protein {macroPercentages.protein}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-500"></span>
                  Carbs {macroPercentages.carbs}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-400"></span>
                  Fat {macroPercentages.fat}%
                </span>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="space-y-2 border-t border-[var(--color-cream-dark)] pt-4">
              <div className="flex justify-between py-1 border-b border-[var(--color-cream)]">
                <span className="font-semibold">Total Fat</span>
                <span>{perServing.fat}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--color-cream)] pl-4 text-sm">
                <span className="text-[var(--text-muted)]">Saturated Fat</span>
                <span>{perServing.saturatedFat}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--color-cream)]">
                <span className="font-semibold">Cholesterol</span>
                <span>{perServing.cholesterol}mg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--color-cream)]">
                <span className="font-semibold">Sodium</span>
                <span>{perServing.sodium}mg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--color-cream)]">
                <span className="font-semibold">Total Carbohydrates</span>
                <span>{perServing.carbohydrates}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--color-cream)] pl-4 text-sm">
                <span className="text-[var(--text-muted)]">Dietary Fiber</span>
                <span>{perServing.fiber}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--color-cream)] pl-4 text-sm">
                <span className="text-[var(--text-muted)]">Total Sugars</span>
                <span>{perServing.sugar}g</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold">Protein</span>
                <span>{perServing.protein}g</span>
              </div>
            </div>

            {/* Total for recipe */}
            <div className="mt-6 pt-4 border-t border-[var(--color-cream-dark)]">
              <div className="text-center text-sm text-[var(--text-muted)]">
                <strong>Total Recipe:</strong> {totals.calories} calories • {Math.round(totals.fat)}g fat • {Math.round(totals.carbohydrates)}g carbs • {Math.round(totals.protein)}g protein
              </div>
            </div>
          </div>

          {/* Ingredient Breakdown */}
          <div className="card bg-white p-6 md:p-8">
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Ingredient Breakdown
            </h3>

            <div className="space-y-3">
              {parsedIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    ing.matchedFood ? "bg-green-50" : "bg-amber-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      ing.matchedFood ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {ing.matchedFood ? <CheckIcon /> : <AlertIcon />}
                    </span>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">
                        {ing.original}
                      </div>
                      {ing.matchedFood && (
                        <div className="text-xs text-[var(--text-muted)]">
                          Matched: {ing.matchedFood.name}
                        </div>
                      )}
                      {!ing.matchedFood && ing.food && (
                        <div className="text-xs text-amber-600">
                          Not in database - nutrition not included
                        </div>
                      )}
                    </div>
                  </div>
                  {ing.nutrition && (
                    <div className="text-right text-sm">
                      <div className="font-semibold text-[var(--text-primary)]">
                        {ing.nutrition.calories} cal
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {ing.nutrition.protein}g P • {ing.nutrition.carbohydrates}g C • {ing.nutrition.fat}g F
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {unmatchedCount > 0 && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-700">
                  <strong>Note:</strong> {unmatchedCount} ingredient{unmatchedCount > 1 ? 's were' : ' was'} not recognized.
                  The nutrition totals only include matched ingredients. Try using simpler ingredient names
                  (e.g., "2 eggs" instead of "2 large free-range eggs").
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {parsedIngredients.length === 0 && (
        <div className="card bg-white p-8 text-center">
          <div className="text-4xl mb-4">🥗</div>
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            Paste Your Recipe
          </h3>
          <p className="text-[var(--text-muted)]">
            Enter your recipe ingredients above to calculate nutritional information.
            <br />
            One ingredient per line with amounts (e.g., "2 cups flour").
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Supported Ingredients
          </h3>
          <div className="text-sm text-[var(--text-secondary)] space-y-2">
            <p><strong>Proteins:</strong> Chicken, beef, salmon, eggs, bacon, tofu</p>
            <p><strong>Dairy:</strong> Milk, butter, cheese, cream, yogurt</p>
            <p><strong>Grains:</strong> Rice, pasta, bread, flour, oats</p>
            <p><strong>Vegetables:</strong> Broccoli, spinach, onion, garlic, potato</p>
            <p><strong>Fats:</strong> Olive oil, vegetable oil, coconut oil</p>
            <p><strong>Sweeteners:</strong> Sugar, honey, brown sugar</p>
          </div>
        </div>

        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Tips for Best Results
          </h3>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Use standard measurements (cups, tbsp, oz, grams)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Keep ingredient names simple ("chicken breast" not "organic free-range chicken")</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>One ingredient per line</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Results are estimates based on USDA data</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
