/**
 * Leftover Ingredient Recipe Matcher
 *
 * Input ingredients you have on hand and get recipe suggestions.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type MealType = 'any' | 'breakfast' | 'lunch' | 'dinner' | 'snack';
type Cuisine = 'any' | 'american' | 'italian' | 'mexican' | 'asian' | 'mediterranean';

interface Ingredient {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'fruit' | 'dairy' | 'grain' | 'pantry' | 'condiment';
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[]; // ingredient IDs
  mealType: MealType[];
  cuisine: Cuisine;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  dietary?: string[];
  instructions: string[];
}

// Ingredient database
const ingredientDatabase: Ingredient[] = [
  // Proteins
  { id: 'chicken', name: 'Chicken', category: 'protein' },
  { id: 'beef', name: 'Beef', category: 'protein' },
  { id: 'pork', name: 'Pork', category: 'protein' },
  { id: 'salmon', name: 'Salmon', category: 'protein' },
  { id: 'shrimp', name: 'Shrimp', category: 'protein' },
  { id: 'eggs', name: 'Eggs', category: 'protein' },
  { id: 'tofu', name: 'Tofu', category: 'protein' },
  { id: 'bacon', name: 'Bacon', category: 'protein' },
  { id: 'sausage', name: 'Sausage', category: 'protein' },
  { id: 'ham', name: 'Ham', category: 'protein' },

  // Vegetables
  { id: 'onion', name: 'Onion', category: 'vegetable' },
  { id: 'garlic', name: 'Garlic', category: 'vegetable' },
  { id: 'tomato', name: 'Tomatoes', category: 'vegetable' },
  { id: 'potato', name: 'Potatoes', category: 'vegetable' },
  { id: 'carrot', name: 'Carrots', category: 'vegetable' },
  { id: 'bell-pepper', name: 'Bell Peppers', category: 'vegetable' },
  { id: 'broccoli', name: 'Broccoli', category: 'vegetable' },
  { id: 'spinach', name: 'Spinach', category: 'vegetable' },
  { id: 'mushroom', name: 'Mushrooms', category: 'vegetable' },
  { id: 'zucchini', name: 'Zucchini', category: 'vegetable' },
  { id: 'corn', name: 'Corn', category: 'vegetable' },
  { id: 'celery', name: 'Celery', category: 'vegetable' },
  { id: 'lettuce', name: 'Lettuce', category: 'vegetable' },
  { id: 'cucumber', name: 'Cucumber', category: 'vegetable' },

  // Fruits
  { id: 'lemon', name: 'Lemon', category: 'fruit' },
  { id: 'lime', name: 'Lime', category: 'fruit' },
  { id: 'apple', name: 'Apples', category: 'fruit' },
  { id: 'banana', name: 'Bananas', category: 'fruit' },
  { id: 'avocado', name: 'Avocado', category: 'fruit' },

  // Dairy
  { id: 'milk', name: 'Milk', category: 'dairy' },
  { id: 'butter', name: 'Butter', category: 'dairy' },
  { id: 'cheese', name: 'Cheese', category: 'dairy' },
  { id: 'cream', name: 'Heavy Cream', category: 'dairy' },
  { id: 'sour-cream', name: 'Sour Cream', category: 'dairy' },
  { id: 'yogurt', name: 'Yogurt', category: 'dairy' },
  { id: 'parmesan', name: 'Parmesan', category: 'dairy' },

  // Grains
  { id: 'rice', name: 'Rice', category: 'grain' },
  { id: 'pasta', name: 'Pasta', category: 'grain' },
  { id: 'bread', name: 'Bread', category: 'grain' },
  { id: 'tortilla', name: 'Tortillas', category: 'grain' },
  { id: 'flour', name: 'Flour', category: 'grain' },
  { id: 'oats', name: 'Oats', category: 'grain' },
  { id: 'quinoa', name: 'Quinoa', category: 'grain' },

  // Pantry
  { id: 'olive-oil', name: 'Olive Oil', category: 'pantry' },
  { id: 'vegetable-oil', name: 'Vegetable Oil', category: 'pantry' },
  { id: 'chicken-broth', name: 'Chicken Broth', category: 'pantry' },
  { id: 'canned-tomatoes', name: 'Canned Tomatoes', category: 'pantry' },
  { id: 'beans', name: 'Beans (canned)', category: 'pantry' },
  { id: 'coconut-milk', name: 'Coconut Milk', category: 'pantry' },

  // Condiments
  { id: 'soy-sauce', name: 'Soy Sauce', category: 'condiment' },
  { id: 'hot-sauce', name: 'Hot Sauce', category: 'condiment' },
  { id: 'mayo', name: 'Mayonnaise', category: 'condiment' },
  { id: 'mustard', name: 'Mustard', category: 'condiment' },
  { id: 'salsa', name: 'Salsa', category: 'condiment' },
];

// Recipe database
const recipeDatabase: Recipe[] = [
  {
    id: 'scrambled-eggs',
    name: 'Fluffy Scrambled Eggs',
    description: 'Simple, creamy scrambled eggs perfect for breakfast',
    ingredients: ['eggs', 'butter', 'milk'],
    mealType: ['breakfast'],
    cuisine: 'american',
    prepTime: 2,
    cookTime: 5,
    servings: 2,
    difficulty: 'easy',
    dietary: ['vegetarian', 'gluten-free'],
    instructions: [
      'Crack eggs into a bowl, add a splash of milk, whisk well',
      'Melt butter in a non-stick pan over medium-low heat',
      'Add eggs, stir gently with spatula, forming soft curds',
      'Remove from heat when slightly underdone (they continue cooking)',
      'Season with salt and pepper'
    ]
  },
  {
    id: 'chicken-stir-fry',
    name: 'Quick Chicken Stir Fry',
    description: 'Fast and flavorful stir fry with tender chicken and crisp vegetables',
    ingredients: ['chicken', 'broccoli', 'bell-pepper', 'soy-sauce', 'garlic', 'vegetable-oil', 'rice'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'asian',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: 'easy',
    dietary: ['dairy-free'],
    instructions: [
      'Cut chicken into bite-sized pieces, season with salt',
      'Heat oil in wok or large pan over high heat',
      'Cook chicken until golden, set aside',
      'Stir fry vegetables with garlic until crisp-tender',
      'Return chicken, add soy sauce, toss to combine',
      'Serve over rice'
    ]
  },
  {
    id: 'pasta-carbonara',
    name: 'Classic Carbonara',
    description: 'Creamy Italian pasta with bacon and Parmesan',
    ingredients: ['pasta', 'bacon', 'eggs', 'parmesan', 'garlic'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'italian',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    instructions: [
      'Cook pasta in salted water until al dente',
      'Crisp bacon in pan, add minced garlic',
      'Whisk eggs with grated Parmesan',
      'Drain pasta, reserve some pasta water',
      'Toss hot pasta with bacon, then egg mixture off heat',
      'Add pasta water to achieve creamy consistency'
    ]
  },
  {
    id: 'quesadilla',
    name: 'Cheesy Quesadilla',
    description: 'Crispy tortilla filled with melted cheese',
    ingredients: ['tortilla', 'cheese', 'butter'],
    mealType: ['lunch', 'snack'],
    cuisine: 'mexican',
    prepTime: 2,
    cookTime: 5,
    servings: 1,
    difficulty: 'easy',
    dietary: ['vegetarian'],
    instructions: [
      'Place tortilla in dry pan over medium heat',
      'Add shredded cheese to one half',
      'Fold tortilla in half',
      'Cook until golden, flip, cook other side',
      'Serve with salsa or sour cream'
    ]
  },
  {
    id: 'chicken-quesadilla',
    name: 'Chicken Quesadilla',
    description: 'Loaded quesadilla with seasoned chicken and peppers',
    ingredients: ['tortilla', 'cheese', 'chicken', 'bell-pepper', 'onion', 'sour-cream'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'mexican',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    instructions: [
      'Sauté diced chicken with peppers and onions',
      'Season with cumin, chili powder, salt',
      'Place filling and cheese on tortilla',
      'Fold and cook until golden on both sides',
      'Serve with sour cream and salsa'
    ]
  },
  {
    id: 'fried-rice',
    name: 'Quick Fried Rice',
    description: 'Use up leftover rice in this savory dish',
    ingredients: ['rice', 'eggs', 'soy-sauce', 'vegetable-oil', 'onion', 'carrot', 'garlic'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'asian',
    prepTime: 10,
    cookTime: 10,
    servings: 4,
    difficulty: 'easy',
    dietary: ['dairy-free', 'vegetarian'],
    instructions: [
      'Heat oil in wok over high heat',
      'Scramble eggs, set aside',
      'Stir fry vegetables until tender',
      'Add cold rice, break up clumps',
      'Add soy sauce, return eggs, toss well',
      'Season to taste'
    ]
  },
  {
    id: 'tomato-soup',
    name: 'Creamy Tomato Soup',
    description: 'Comfort food classic, perfect with grilled cheese',
    ingredients: ['canned-tomatoes', 'onion', 'garlic', 'chicken-broth', 'cream', 'butter'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'american',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'easy',
    dietary: ['vegetarian', 'gluten-free'],
    instructions: [
      'Sauté onion and garlic in butter until soft',
      'Add canned tomatoes and broth',
      'Simmer for 20 minutes',
      'Blend until smooth',
      'Stir in cream, season with salt and pepper'
    ]
  },
  {
    id: 'grilled-cheese',
    name: 'Classic Grilled Cheese',
    description: 'Buttery, crispy, melty perfection',
    ingredients: ['bread', 'cheese', 'butter'],
    mealType: ['lunch', 'snack'],
    cuisine: 'american',
    prepTime: 2,
    cookTime: 6,
    servings: 1,
    difficulty: 'easy',
    dietary: ['vegetarian'],
    instructions: [
      'Butter one side of each bread slice',
      'Place one slice butter-side down in pan',
      'Add cheese, top with second slice butter-side up',
      'Cook over medium heat until golden',
      'Flip and cook other side until cheese melts'
    ]
  },
  {
    id: 'spinach-salad',
    name: 'Fresh Spinach Salad',
    description: 'Light and nutritious salad with bacon',
    ingredients: ['spinach', 'bacon', 'eggs', 'mushroom', 'onion'],
    mealType: ['lunch'],
    cuisine: 'american',
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    dietary: ['gluten-free', 'low-carb'],
    instructions: [
      'Hard boil eggs, cool and slice',
      'Crisp bacon, crumble',
      'Slice mushrooms and onion thinly',
      'Toss spinach with vegetables',
      'Top with eggs and bacon',
      'Drizzle with warm bacon dressing'
    ]
  },
  {
    id: 'banana-oatmeal',
    name: 'Banana Oatmeal',
    description: 'Hearty breakfast with natural sweetness',
    ingredients: ['oats', 'banana', 'milk', 'butter'],
    mealType: ['breakfast'],
    cuisine: 'american',
    prepTime: 2,
    cookTime: 5,
    servings: 1,
    difficulty: 'easy',
    dietary: ['vegetarian'],
    instructions: [
      'Combine oats and milk in pot',
      'Cook over medium heat, stirring occasionally',
      'Slice banana, add half to oats while cooking',
      'Add a pat of butter, stir',
      'Top with remaining banana slices'
    ]
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    description: 'Poached eggs in spiced tomato sauce',
    ingredients: ['eggs', 'canned-tomatoes', 'onion', 'bell-pepper', 'garlic', 'olive-oil'],
    mealType: ['breakfast', 'lunch', 'dinner'],
    cuisine: 'mediterranean',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    dietary: ['vegetarian', 'gluten-free'],
    instructions: [
      'Sauté onion and peppers in olive oil',
      'Add garlic, cook 1 minute',
      'Add tomatoes, season with cumin and paprika',
      'Simmer until slightly thickened',
      'Make wells, crack in eggs',
      'Cover and cook until eggs are set'
    ]
  },
  {
    id: 'beef-tacos',
    name: 'Ground Beef Tacos',
    description: 'Classic seasoned beef tacos',
    ingredients: ['beef', 'tortilla', 'onion', 'garlic', 'tomato', 'lettuce', 'cheese', 'sour-cream'],
    mealType: ['dinner'],
    cuisine: 'mexican',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    instructions: [
      'Brown beef with onion and garlic',
      'Add taco seasoning and water, simmer',
      'Warm tortillas',
      'Assemble with meat, lettuce, tomato, cheese',
      'Top with sour cream and salsa'
    ]
  },
  {
    id: 'garlic-shrimp',
    name: 'Garlic Butter Shrimp',
    description: 'Quick and elegant, ready in 10 minutes',
    ingredients: ['shrimp', 'garlic', 'butter', 'lemon', 'olive-oil'],
    mealType: ['dinner'],
    cuisine: 'mediterranean',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    difficulty: 'easy',
    dietary: ['gluten-free', 'low-carb'],
    instructions: [
      'Heat butter and oil in pan',
      'Add minced garlic, cook 30 seconds',
      'Add shrimp in single layer',
      'Cook 2 minutes per side until pink',
      'Squeeze lemon juice, season with salt'
    ]
  },
  {
    id: 'vegetable-soup',
    name: 'Hearty Vegetable Soup',
    description: 'Use up all your vegetables in this comforting soup',
    ingredients: ['potato', 'carrot', 'celery', 'onion', 'garlic', 'chicken-broth', 'canned-tomatoes'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'american',
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: 'easy',
    dietary: ['dairy-free', 'gluten-free'],
    instructions: [
      'Dice all vegetables into similar sizes',
      'Sauté onion, celery, carrot in pot',
      'Add garlic, cook 1 minute',
      'Add broth, tomatoes, potatoes',
      'Simmer until vegetables are tender',
      'Season to taste'
    ]
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    description: 'Simple, trendy, and delicious',
    ingredients: ['bread', 'avocado', 'lemon', 'olive-oil'],
    mealType: ['breakfast', 'snack'],
    cuisine: 'american',
    prepTime: 5,
    cookTime: 2,
    servings: 1,
    difficulty: 'easy',
    dietary: ['vegan', 'dairy-free'],
    instructions: [
      'Toast bread until golden',
      'Mash avocado with lemon juice',
      'Spread on toast',
      'Drizzle with olive oil',
      'Season with salt, pepper, red pepper flakes'
    ]
  },
  {
    id: 'egg-avocado-toast',
    name: 'Egg & Avocado Toast',
    description: 'Protein-packed breakfast toast',
    ingredients: ['bread', 'avocado', 'eggs', 'butter'],
    mealType: ['breakfast'],
    cuisine: 'american',
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: 'easy',
    dietary: ['vegetarian'],
    instructions: [
      'Toast bread until golden',
      'Fry or poach egg to preference',
      'Mash avocado, spread on toast',
      'Top with egg',
      'Season with salt and pepper'
    ]
  },
  {
    id: 'pasta-primavera',
    name: 'Pasta Primavera',
    description: 'Light pasta loaded with fresh vegetables',
    ingredients: ['pasta', 'zucchini', 'bell-pepper', 'tomato', 'garlic', 'olive-oil', 'parmesan'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'italian',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    dietary: ['vegetarian'],
    instructions: [
      'Cook pasta according to package',
      'Sauté vegetables in olive oil',
      'Add garlic, cook 1 minute',
      'Toss pasta with vegetables',
      'Top with Parmesan'
    ]
  },
  {
    id: 'coconut-curry',
    name: 'Quick Coconut Curry',
    description: 'Creamy, aromatic curry ready in 20 minutes',
    ingredients: ['chicken', 'coconut-milk', 'bell-pepper', 'onion', 'garlic', 'rice'],
    mealType: ['dinner'],
    cuisine: 'asian',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    dietary: ['dairy-free', 'gluten-free'],
    instructions: [
      'Sauté chicken until browned',
      'Add onion and pepper, cook until soft',
      'Add curry paste and garlic',
      'Pour in coconut milk, simmer',
      'Serve over rice'
    ]
  },
  {
    id: 'ham-cheese-omelette',
    name: 'Ham & Cheese Omelette',
    description: 'Classic diner-style omelette',
    ingredients: ['eggs', 'ham', 'cheese', 'butter', 'onion'],
    mealType: ['breakfast'],
    cuisine: 'american',
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: 'medium',
    dietary: ['gluten-free', 'low-carb'],
    instructions: [
      'Whisk eggs with salt and pepper',
      'Melt butter in non-stick pan',
      'Pour in eggs, let set slightly',
      'Add diced ham, onion, and cheese to one side',
      'Fold omelette in half, cook until cheese melts'
    ]
  },
  {
    id: 'bean-burrito',
    name: 'Quick Bean Burrito',
    description: 'Budget-friendly and filling',
    ingredients: ['beans', 'tortilla', 'cheese', 'rice', 'salsa', 'sour-cream'],
    mealType: ['lunch', 'dinner'],
    cuisine: 'mexican',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    difficulty: 'easy',
    dietary: ['vegetarian'],
    instructions: [
      'Warm beans in pan, mash slightly',
      'Warm tortillas',
      'Layer rice, beans, cheese, salsa on tortilla',
      'Fold into burrito',
      'Top with sour cream'
    ]
  },
];

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const ChefHatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/>
    <path d="M6 17h12"/>
  </svg>
);

export default function LeftoverMatcher() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealFilter, setMealFilter] = useState<MealType>('any');
  const [cuisineFilter, setCuisineFilter] = useState<Cuisine>('any');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  // Filter ingredients by search
  const filteredIngredients = useMemo(() => {
    if (!searchQuery) return ingredientDatabase;
    return ingredientDatabase.filter(ing =>
      ing.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Group ingredients by category
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, Ingredient[]> = {};
    filteredIngredients.forEach(ing => {
      if (!groups[ing.category]) groups[ing.category] = [];
      groups[ing.category].push(ing);
    });
    return groups;
  }, [filteredIngredients]);

  // Find matching recipes
  const matchingRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];

    const matches = recipeDatabase
      .map(recipe => {
        const matchedIngredients = recipe.ingredients.filter(ing =>
          selectedIngredients.includes(ing)
        );
        const matchPercentage = (matchedIngredients.length / recipe.ingredients.length) * 100;
        const missingIngredients = recipe.ingredients.filter(ing =>
          !selectedIngredients.includes(ing)
        );

        return {
          recipe,
          matchedCount: matchedIngredients.length,
          matchPercentage,
          missingIngredients,
          matchedIngredients
        };
      })
      .filter(match => {
        // At least 50% match or at least 2 ingredients matched
        const hasEnoughMatch = match.matchPercentage >= 50 || match.matchedCount >= 2;

        // Filter by meal type
        const matchesMeal = mealFilter === 'any' || match.recipe.mealType.includes(mealFilter);

        // Filter by cuisine
        const matchesCuisine = cuisineFilter === 'any' || match.recipe.cuisine === cuisineFilter;

        return hasEnoughMatch && matchesMeal && matchesCuisine;
      })
      .sort((a, b) => {
        // Sort by match percentage, then by fewer missing ingredients
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        return a.missingIngredients.length - b.missingIngredients.length;
      });

    return matches;
  }, [selectedIngredients, mealFilter, cuisineFilter]);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const clearIngredients = () => {
    setSelectedIngredients([]);
    setSearchQuery('');
  };

  const getIngredientName = (id: string) => {
    return ingredientDatabase.find(ing => ing.id === id)?.name || id;
  };

  const categoryLabels: Record<string, string> = {
    protein: 'Proteins',
    vegetable: 'Vegetables',
    fruit: 'Fruits',
    dairy: 'Dairy',
    grain: 'Grains & Carbs',
    pantry: 'Pantry Staples',
    condiment: 'Condiments'
  };

  const categoryColors: Record<string, string> = {
    protein: 'bg-red-100 text-red-700 border-red-200',
    vegetable: 'bg-green-100 text-green-700 border-green-200',
    fruit: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dairy: 'bg-blue-100 text-blue-700 border-blue-200',
    grain: 'bg-amber-100 text-amber-700 border-amber-200',
    pantry: 'bg-stone-100 text-stone-700 border-stone-200',
    condiment: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Ingredient Selection */}
        <div className="space-y-6">
          {/* Search */}
          <div className="card bg-white">
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
              What's in Your Kitchen?
            </h2>

            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ingredients..."
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent"
              />
            </div>

            {/* Selected ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    Selected ({selectedIngredients.length})
                  </span>
                  <button
                    onClick={clearIngredients}
                    className="text-xs text-[var(--color-wine)] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map(id => (
                    <button
                      key={id}
                      onClick={() => toggleIngredient(id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-wine)] text-white text-sm rounded-full hover:bg-[var(--color-wine-deep)] transition-colors"
                    >
                      {getIngredientName(id)}
                      <XIcon />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredient categories */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {Object.entries(groupedIngredients).map(([category, ingredients]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">
                    {categoryLabels[category] || category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map(ing => (
                      <button
                        key={ing.id}
                        onClick={() => toggleIngredient(ing.id)}
                        className={cn(
                          "px-3 py-1 text-sm border rounded-full transition-colors",
                          selectedIngredients.includes(ing.id)
                            ? "bg-[var(--color-wine)] text-white border-[var(--color-wine)]"
                            : categoryColors[ing.category]
                        )}
                      >
                        {ing.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="card bg-white">
            <h3 className="font-medium text-[var(--text-primary)] mb-3">Filters</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Meal Type</label>
                <select
                  value={mealFilter}
                  onChange={(e) => setMealFilter(e.target.value as MealType)}
                  className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
                >
                  <option value="any">Any Meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Cuisine</label>
                <select
                  value={cuisineFilter}
                  onChange={(e) => setCuisineFilter(e.target.value as Cuisine)}
                  className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
                >
                  <option value="any">Any Cuisine</option>
                  <option value="american">American</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="asian">Asian</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recipe Results */}
        <div>
          <div className="card bg-white min-h-[500px]">
            <div className="flex items-center gap-2 mb-4">
              <ChefHatIcon />
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Recipe Suggestions
              </h2>
            </div>

            {selectedIngredients.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p className="mb-2">Select ingredients from the left to see recipe suggestions</p>
                <p className="text-sm">Pick at least 2-3 ingredients for best results</p>
              </div>
            ) : matchingRecipes.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p className="mb-2">No recipes found with your ingredients</p>
                <p className="text-sm">Try adding more ingredients or adjusting filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-muted)]">
                  Found {matchingRecipes.length} recipe{matchingRecipes.length !== 1 ? 's' : ''}
                </p>

                {matchingRecipes.map(({ recipe, matchPercentage, missingIngredients, matchedIngredients }) => (
                  <div
                    key={recipe.id}
                    className="border border-[var(--color-cream-dark)] rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                      className="w-full p-4 text-left hover:bg-[var(--color-cream)] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                            {recipe.name}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {recipe.description}
                          </p>

                          <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                              <ClockIcon />
                              {recipe.prepTime + recipe.cookTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <UsersIcon />
                              {recipe.servings} servings
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full",
                              recipe.difficulty === 'easy' && "bg-green-100 text-green-700",
                              recipe.difficulty === 'medium' && "bg-yellow-100 text-yellow-700",
                              recipe.difficulty === 'hard' && "bg-red-100 text-red-700"
                            )}>
                              {recipe.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="ml-4 text-right">
                          <div className={cn(
                            "text-lg font-bold",
                            matchPercentage >= 80 ? "text-green-600" :
                            matchPercentage >= 60 ? "text-amber-600" : "text-[var(--text-secondary)]"
                          )}>
                            {Math.round(matchPercentage)}%
                          </div>
                          <div className="text-xs text-[var(--text-muted)]">match</div>
                        </div>
                      </div>

                      {/* Ingredient match indicators */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {recipe.ingredients.map(ingId => {
                          const hasIt = selectedIngredients.includes(ingId);
                          return (
                            <span
                              key={ingId}
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full",
                                hasIt
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-50 text-red-600"
                              )}
                            >
                              {hasIt ? <CheckIcon /> : <XIcon />}
                              {getIngredientName(ingId)}
                            </span>
                          );
                        })}
                      </div>
                    </button>

                    {/* Expanded recipe details */}
                    {expandedRecipe === recipe.id && (
                      <div className="p-4 bg-[var(--color-cream)] border-t border-[var(--color-cream-dark)]">
                        {missingIngredients.length > 0 && (
                          <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                            <p className="text-sm font-medium text-amber-800 mb-1">
                              You're missing:
                            </p>
                            <p className="text-sm text-amber-700">
                              {missingIngredients.map(id => getIngredientName(id)).join(', ')}
                            </p>
                          </div>
                        )}

                        {recipe.dietary && recipe.dietary.length > 0 && (
                          <div className="flex gap-2 mb-4">
                            {recipe.dietary.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-white border border-[var(--color-cream-dark)] rounded-full text-[var(--text-muted)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium text-[var(--text-primary)] mb-2">Instructions</h4>
                          <ol className="space-y-2">
                            {recipe.instructions.map((step, index) => (
                              <li key={index} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-wine)] text-white flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                                <span className="pt-0.5">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--color-cream-dark)]">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-sm font-medium text-[var(--text-primary)]">{recipe.prepTime} min</div>
                              <div className="text-xs text-[var(--text-muted)]">Prep</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[var(--text-primary)]">{recipe.cookTime} min</div>
                              <div className="text-xs text-[var(--text-muted)]">Cook</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[var(--text-primary)]">{recipe.servings}</div>
                              <div className="text-xs text-[var(--text-muted)]">Servings</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 card bg-[var(--color-cream)]">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Tips for Using Leftovers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Rice</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Leftover rice is perfect for fried rice—in fact, day-old rice works better
              because it's drier and won't get mushy. It's also great in soups, stuffed peppers,
              or rice pudding.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Roasted Chicken</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Shred leftover chicken for tacos, salads, or sandwiches. The bones make
              excellent stock—simmer with vegetable scraps for homemade chicken broth.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Vegetables</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Wilting vegetables are perfect for soups, stir-fries, or frittatas.
              Even vegetable scraps can be frozen and used for homemade stock later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
