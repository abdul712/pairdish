/**
 * Dietary Restriction Meal Finder Component
 *
 * Find meals based on dietary restrictions and preferences.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisine: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  restrictions: string[]; // which dietary restrictions this meets
  ingredients: string[];
  description: string;
  tips?: string;
}

// Dietary Restrictions Data
const dietaryRestrictions: DietaryRestriction[] = [
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'No meat or fish',
    icon: '🥬',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products',
    icon: '🌱',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    id: 'gluten-free',
    name: 'Gluten-Free',
    description: 'No wheat, barley, or rye',
    icon: '🌾',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    id: 'dairy-free',
    name: 'Dairy-Free',
    description: 'No milk, cheese, or butter',
    icon: '🥛',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    id: 'nut-free',
    name: 'Nut-Free',
    description: 'No tree nuts or peanuts',
    icon: '🥜',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    id: 'low-carb',
    name: 'Low-Carb',
    description: 'Reduced carbohydrates',
    icon: '🍖',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    id: 'keto',
    name: 'Keto',
    description: 'Very low carb, high fat',
    icon: '🥑',
    color: 'bg-lime-100 text-lime-700 border-lime-200',
  },
  {
    id: 'paleo',
    name: 'Paleo',
    description: 'Whole foods, no grains or processed',
    icon: '🦴',
    color: 'bg-stone-100 text-stone-700 border-stone-200',
  },
  {
    id: 'pescatarian',
    name: 'Pescatarian',
    description: 'Vegetarian plus fish',
    icon: '🐟',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  },
  {
    id: 'low-sodium',
    name: 'Low-Sodium',
    description: 'Reduced salt',
    icon: '🧂',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  {
    id: 'whole30',
    name: 'Whole30',
    description: 'No sugar, alcohol, grains, legumes, dairy',
    icon: '✨',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    id: 'fodmap',
    name: 'Low-FODMAP',
    description: 'Reduces fermentable carbs',
    icon: '🫃',
    color: 'bg-teal-100 text-teal-700 border-teal-200',
  },
];

// Meal Database
const meals: Meal[] = [
  // Breakfast
  {
    id: 'avocado-toast',
    name: 'Avocado Toast with Eggs',
    type: 'breakfast',
    cuisine: 'American',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'nut-free'],
    ingredients: ['Bread', 'Avocado', 'Eggs', 'Lemon juice', 'Salt', 'Pepper', 'Red pepper flakes'],
    description: 'Creamy mashed avocado on toasted bread topped with perfectly fried eggs.',
    tips: 'Use gluten-free bread for gluten-free version.',
  },
  {
    id: 'smoothie-bowl',
    name: 'Berry Smoothie Bowl',
    type: 'breakfast',
    cuisine: 'American',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    ingredients: ['Frozen berries', 'Banana', 'Almond milk', 'Granola', 'Chia seeds', 'Honey'],
    description: 'Thick, creamy smoothie topped with fresh fruit and crunchy toppings.',
    tips: 'Use coconut yogurt for extra creaminess.',
  },
  {
    id: 'veggie-omelette',
    name: 'Veggie-Loaded Omelette',
    type: 'breakfast',
    cuisine: 'French',
    prepTime: 10,
    cookTime: 10,
    servings: 1,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'gluten-free', 'low-carb', 'keto', 'nut-free'],
    ingredients: ['Eggs', 'Bell peppers', 'Spinach', 'Mushrooms', 'Cheese', 'Butter', 'Herbs'],
    description: 'Fluffy omelette packed with sautéed vegetables and melted cheese.',
    tips: 'Skip cheese for dairy-free version.',
  },
  {
    id: 'chia-pudding',
    name: 'Overnight Chia Pudding',
    type: 'breakfast',
    cuisine: 'American',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'paleo', 'whole30'],
    ingredients: ['Chia seeds', 'Coconut milk', 'Maple syrup', 'Vanilla', 'Fresh berries'],
    description: 'Creamy, pudding-like texture with a mild, nutty flavor.',
    tips: 'Prep the night before for grab-and-go breakfast.',
  },
  {
    id: 'egg-muffins',
    name: 'Egg Muffin Cups',
    type: 'breakfast',
    cuisine: 'American',
    prepTime: 15,
    cookTime: 20,
    servings: 6,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'gluten-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free'],
    ingredients: ['Eggs', 'Bell peppers', 'Spinach', 'Onion', 'Salt', 'Pepper'],
    description: 'Portable, protein-packed breakfast cups perfect for meal prep.',
    tips: 'Store in fridge for up to 5 days.',
  },

  // Lunch
  {
    id: 'quinoa-salad',
    name: 'Mediterranean Quinoa Salad',
    type: 'lunch',
    cuisine: 'Mediterranean',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'],
    ingredients: ['Quinoa', 'Cucumber', 'Tomatoes', 'Red onion', 'Olives', 'Olive oil', 'Lemon juice', 'Herbs'],
    description: 'Light, refreshing salad with protein-rich quinoa and fresh vegetables.',
    tips: 'Add feta for vegetarian version.',
  },
  {
    id: 'lettuce-wraps',
    name: 'Asian Chicken Lettuce Wraps',
    type: 'lunch',
    cuisine: 'Asian',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: 'easy',
    restrictions: ['gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free'],
    ingredients: ['Ground chicken', 'Butter lettuce', 'Water chestnuts', 'Coconut aminos', 'Ginger', 'Garlic', 'Sesame oil'],
    description: 'Savory chicken filling wrapped in crisp lettuce leaves.',
    tips: 'Use coconut aminos instead of soy sauce for whole30.',
  },
  {
    id: 'buddha-bowl',
    name: 'Rainbow Buddha Bowl',
    type: 'lunch',
    cuisine: 'Asian-Fusion',
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    difficulty: 'medium',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    ingredients: ['Sweet potato', 'Chickpeas', 'Kale', 'Avocado', 'Quinoa', 'Tahini', 'Lemon'],
    description: 'Colorful bowl of roasted vegetables, grains, and creamy tahini dressing.',
    tips: 'Prep components ahead for quick assembly.',
  },
  {
    id: 'salmon-salad',
    name: 'Grilled Salmon Salad',
    type: 'lunch',
    cuisine: 'American',
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    difficulty: 'medium',
    restrictions: ['pescatarian', 'gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free'],
    ingredients: ['Salmon fillet', 'Mixed greens', 'Avocado', 'Cherry tomatoes', 'Cucumber', 'Olive oil', 'Lemon'],
    description: 'Omega-3 rich salmon atop a bed of fresh greens.',
    tips: 'Cook salmon to 145°F internal temperature.',
  },
  {
    id: 'zucchini-noodles',
    name: 'Zucchini Noodles with Pesto',
    type: 'lunch',
    cuisine: 'Italian',
    prepTime: 15,
    cookTime: 5,
    servings: 2,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'gluten-free', 'low-carb', 'keto'],
    ingredients: ['Zucchini', 'Basil pesto', 'Cherry tomatoes', 'Parmesan', 'Pine nuts', 'Olive oil'],
    description: 'Light, low-carb alternative to pasta with vibrant basil pesto.',
    tips: 'Don\'t overcook zoodles - they should stay slightly crunchy.',
  },

  // Dinner
  {
    id: 'cauliflower-steak',
    name: 'Roasted Cauliflower Steak',
    type: 'dinner',
    cuisine: 'American',
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    difficulty: 'medium',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free'],
    ingredients: ['Cauliflower', 'Olive oil', 'Garlic', 'Cumin', 'Paprika', 'Lemon', 'Herbs'],
    description: 'Thick slices of cauliflower roasted until golden and tender.',
    tips: 'Cut from center for the largest steaks.',
  },
  {
    id: 'lemon-herb-chicken',
    name: 'Lemon Herb Roasted Chicken',
    type: 'dinner',
    cuisine: 'Mediterranean',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    difficulty: 'medium',
    restrictions: ['gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free', 'low-sodium'],
    ingredients: ['Chicken thighs', 'Lemon', 'Garlic', 'Rosemary', 'Thyme', 'Olive oil', 'Salt', 'Pepper'],
    description: 'Juicy chicken with bright citrus and aromatic herbs.',
    tips: 'Use a meat thermometer - 165°F for safe chicken.',
  },
  {
    id: 'beef-stir-fry',
    name: 'Beef and Broccoli Stir-Fry',
    type: 'dinner',
    cuisine: 'Asian',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    restrictions: ['dairy-free', 'nut-free', 'low-carb'],
    ingredients: ['Beef sirloin', 'Broccoli', 'Soy sauce', 'Ginger', 'Garlic', 'Sesame oil', 'Cornstarch'],
    description: 'Classic takeout favorite made healthier at home.',
    tips: 'Slice beef against the grain for tenderness.',
  },
  {
    id: 'baked-salmon',
    name: 'Baked Salmon with Asparagus',
    type: 'dinner',
    cuisine: 'American',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    restrictions: ['pescatarian', 'gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free', 'low-sodium'],
    ingredients: ['Salmon fillets', 'Asparagus', 'Olive oil', 'Lemon', 'Garlic', 'Dill', 'Salt', 'Pepper'],
    description: 'Heart-healthy salmon and vegetables on one pan.',
    tips: 'Everything cooks together - easy cleanup!',
  },
  {
    id: 'stuffed-peppers',
    name: 'Turkey Stuffed Bell Peppers',
    type: 'dinner',
    cuisine: 'American',
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    difficulty: 'medium',
    restrictions: ['gluten-free', 'dairy-free', 'low-carb', 'paleo', 'whole30', 'nut-free'],
    ingredients: ['Bell peppers', 'Ground turkey', 'Cauliflower rice', 'Tomatoes', 'Onion', 'Garlic', 'Italian herbs'],
    description: 'Colorful peppers filled with savory turkey mixture.',
    tips: 'Use cauliflower rice to keep it low-carb.',
  },
  {
    id: 'vegetable-curry',
    name: 'Coconut Vegetable Curry',
    type: 'dinner',
    cuisine: 'Indian',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'medium',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'],
    ingredients: ['Mixed vegetables', 'Coconut milk', 'Curry paste', 'Ginger', 'Garlic', 'Onion', 'Cilantro'],
    description: 'Creamy, aromatic curry loaded with vegetables.',
    tips: 'Serve over cauliflower rice for low-carb.',
  },
  {
    id: 'pork-tenderloin',
    name: 'Herb-Crusted Pork Tenderloin',
    type: 'dinner',
    cuisine: 'French',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'medium',
    restrictions: ['gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free'],
    ingredients: ['Pork tenderloin', 'Dijon mustard', 'Rosemary', 'Thyme', 'Garlic', 'Olive oil'],
    description: 'Lean, tender pork with a fragrant herb crust.',
    tips: 'Let rest 5 minutes before slicing.',
  },

  // Snacks
  {
    id: 'hummus-veggies',
    name: 'Hummus with Veggie Sticks',
    type: 'snack',
    cuisine: 'Mediterranean',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'],
    ingredients: ['Hummus', 'Carrots', 'Celery', 'Cucumber', 'Bell peppers'],
    description: 'Protein-rich dip with crunchy, colorful vegetables.',
    tips: 'Make your own hummus for best results.',
  },
  {
    id: 'energy-balls',
    name: 'No-Bake Energy Balls',
    type: 'snack',
    cuisine: 'American',
    prepTime: 15,
    cookTime: 0,
    servings: 12,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    ingredients: ['Oats', 'Almond butter', 'Honey', 'Chocolate chips', 'Chia seeds', 'Flaxseed'],
    description: 'Portable, naturally sweetened energy bites.',
    tips: 'Roll into balls and refrigerate for 30 minutes.',
  },
  {
    id: 'guacamole',
    name: 'Fresh Guacamole',
    type: 'snack',
    cuisine: 'Mexican',
    prepTime: 10,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo', 'whole30', 'nut-free', 'low-sodium'],
    ingredients: ['Avocados', 'Lime juice', 'Cilantro', 'Onion', 'Tomato', 'Jalapeño', 'Salt'],
    description: 'Creamy, zesty dip perfect with vegetables or chips.',
    tips: 'Add lime juice to prevent browning.',
  },
  {
    id: 'deviled-eggs',
    name: 'Classic Deviled Eggs',
    type: 'snack',
    cuisine: 'American',
    prepTime: 15,
    cookTime: 12,
    servings: 6,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'gluten-free', 'low-carb', 'keto', 'nut-free'],
    ingredients: ['Eggs', 'Mayonnaise', 'Dijon mustard', 'Paprika', 'Chives', 'Salt', 'Pepper'],
    description: 'Protein-packed party favorite.',
    tips: 'Use older eggs for easier peeling.',
  },
  {
    id: 'stuffed-dates',
    name: 'Stuffed Medjool Dates',
    type: 'snack',
    cuisine: 'Middle Eastern',
    prepTime: 10,
    cookTime: 0,
    servings: 8,
    difficulty: 'easy',
    restrictions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    ingredients: ['Medjool dates', 'Almond butter', 'Dark chocolate', 'Sea salt'],
    description: 'Naturally sweet dates with creamy nut butter.',
    tips: 'Freeze for a fudge-like texture.',
  },
];

// Helper functions
const getMealTypeColor = (type: Meal['type']) => {
  const colors = {
    breakfast: 'bg-amber-100 text-amber-700',
    lunch: 'bg-green-100 text-green-700',
    dinner: 'bg-purple-100 text-purple-700',
    snack: 'bg-blue-100 text-blue-700',
  };
  return colors[type];
};

const getDifficultyColor = (difficulty: Meal['difficulty']) => {
  const colors = {
    easy: 'text-green-600',
    medium: 'text-amber-600',
    hard: 'text-red-600',
  };
  return colors[difficulty];
};

// Main Component
export default function DietaryMealFinder() {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [mealTypeFilter, setMealTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // Toggle restriction selection
  const toggleRestriction = (id: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Filter meals based on selections
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Must match ALL selected restrictions
      const matchesRestrictions =
        selectedRestrictions.length === 0 ||
        selectedRestrictions.every((r) => meal.restrictions.includes(r));

      const matchesMealType = mealTypeFilter === 'all' || meal.type === mealTypeFilter;

      const matchesSearch =
        searchTerm === '' ||
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.ingredients.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesRestrictions && matchesMealType && matchesSearch;
    });
  }, [selectedRestrictions, mealTypeFilter, searchTerm]);

  // Group by meal type
  const groupedMeals = useMemo(() => {
    const groups: Record<string, Meal[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    filteredMeals.forEach((meal) => {
      groups[meal.type].push(meal);
    });
    return groups;
  }, [filteredMeals]);

  const mealTypes = [
    { id: 'all', label: 'All Meals' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snacks' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Dietary Restrictions Selection */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Select Your Dietary Restrictions
        </h2>
        <div className="flex flex-wrap gap-2">
          {dietaryRestrictions.map((restriction) => (
            <button
              key={restriction.id}
              onClick={() => toggleRestriction(restriction.id)}
              className={cn(
                'px-3 py-2 rounded-lg border transition-all flex items-center gap-2',
                selectedRestrictions.includes(restriction.id)
                  ? cn(restriction.color, 'border-current')
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              )}
            >
              <span>{restriction.icon}</span>
              <span className="text-sm font-medium">{restriction.name}</span>
            </button>
          ))}
        </div>

        {selectedRestrictions.length > 0 && (
          <button
            onClick={() => setSelectedRestrictions([])}
            className="mt-3 text-sm text-[var(--color-wine)] hover:underline"
          >
            Clear all selections
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Search Meals
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, cuisine, or ingredient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none"
              />
            </div>
          </div>

          {/* Meal Type Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Meal Type
            </label>
            <div className="flex flex-wrap gap-1">
              {mealTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setMealTypeFilter(type.id)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    mealTypeFilter === type.id
                      ? 'bg-[var(--color-wine)] text-white'
                      : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{filteredMeals.length}</span>
          {' '}meals match your criteria
          {selectedRestrictions.length > 0 && (
            <span className="text-sm text-[var(--text-muted)]">
              {' '}(filtering by {selectedRestrictions.length} restriction{selectedRestrictions.length > 1 ? 's' : ''})
            </span>
          )}
        </p>
      </div>

      {/* Meal Results */}
      {filteredMeals.length === 0 ? (
        <div className="bg-[var(--color-cream)] rounded-xl p-8 text-center">
          <p className="text-4xl mb-3">😕</p>
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            No meals found
          </h3>
          <p className="text-[var(--text-secondary)]">
            Try selecting fewer dietary restrictions or adjusting your search.
          </p>
        </div>
      ) : mealTypeFilter === 'all' ? (
        // Grouped view
        <div className="space-y-8">
          {Object.entries(groupedMeals).map(([type, typeMeals]) => {
            if (typeMeals.length === 0) return null;
            return (
              <div key={type}>
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4 capitalize flex items-center gap-2">
                  {type === 'breakfast' && '🌅'}
                  {type === 'lunch' && '☀️'}
                  {type === 'dinner' && '🌙'}
                  {type === 'snack' && '🍿'}
                  {type} ({typeMeals.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {typeMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      isExpanded={expandedMeal === meal.id}
                      onToggle={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
                      selectedRestrictions={selectedRestrictions}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Flat view
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              isExpanded={expandedMeal === meal.id}
              onToggle={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
              selectedRestrictions={selectedRestrictions}
            />
          ))}
        </div>
      )}

      {/* Diet Info */}
      <div className="mt-12 bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">
          Understanding Dietary Restrictions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
              🌱
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Plant-Based</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Vegetarian, vegan, and pescatarian diets focus on plant foods with varying
              levels of animal product inclusion.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
              🚫
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Allergen-Free</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Gluten-free, dairy-free, and nut-free diets eliminate common allergens
              for health or medical reasons.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
              ⚡
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Lifestyle Diets</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Keto, paleo, and Whole30 are lifestyle choices focusing on specific
              macronutrient ratios or whole foods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Meal Card Component
function MealCard({
  meal,
  isExpanded,
  onToggle,
  selectedRestrictions,
}: {
  meal: Meal;
  isExpanded: boolean;
  onToggle: () => void;
  selectedRestrictions: string[];
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[var(--color-cream-dark)] overflow-hidden transition-shadow',
        isExpanded && 'shadow-md'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getMealTypeColor(meal.type))}>
                {meal.type}
              </span>
              <span className="text-xs text-[var(--text-muted)]">{meal.cuisine}</span>
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              {meal.name}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1">
              {meal.description}
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              'transition-transform flex-shrink-0 text-[var(--text-muted)]',
              isExpanded && 'rotate-180'
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        {/* Quick info */}
        <div className="flex items-center gap-4 mt-3 text-sm text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {meal.prepTime + meal.cookTime} min
          </span>
          <span className={cn('font-medium capitalize', getDifficultyColor(meal.difficulty))}>
            {meal.difficulty}
          </span>
          <span>{meal.servings} servings</span>
        </div>

        {/* Matching restrictions */}
        <div className="flex flex-wrap gap-1 mt-3">
          {meal.restrictions.slice(0, 5).map((r) => {
            const restriction = dietaryRestrictions.find((d) => d.id === r);
            if (!restriction) return null;
            const isSelected = selectedRestrictions.includes(r);
            return (
              <span
                key={r}
                className={cn(
                  'px-1.5 py-0.5 rounded text-xs border',
                  isSelected
                    ? restriction.color
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                )}
              >
                {restriction.icon} {restriction.name}
              </span>
            );
          })}
          {meal.restrictions.length > 5 && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
              +{meal.restrictions.length - 5} more
            </span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[var(--color-cream-dark)]">
          <div className="pt-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Ingredients</h4>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.map((ingredient) => (
                <span key={ingredient} className="px-2 py-1 bg-[var(--color-cream)] rounded text-sm text-[var(--text-secondary)]">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {meal.tips && (
            <div className="mt-4 bg-amber-50 rounded-lg p-3">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                {meal.tips}
              </p>
            </div>
          )}

          {/* All restrictions */}
          <div className="mt-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Suitable For</h4>
            <div className="flex flex-wrap gap-1">
              {meal.restrictions.map((r) => {
                const restriction = dietaryRestrictions.find((d) => d.id === r);
                if (!restriction) return null;
                return (
                  <span key={r} className={cn('px-2 py-1 rounded text-xs border', restriction.color)}>
                    {restriction.icon} {restriction.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
