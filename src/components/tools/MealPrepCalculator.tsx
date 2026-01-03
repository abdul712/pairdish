/**
 * Weekly Meal Prep Calculator
 *
 * Plan and batch cook meals for the week ahead.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealTemplate {
  id: string;
  name: string;
  mealType: MealType;
  servings: number;
  prepTimeMinutes: number;
  canBatchPrep: boolean;
  shelfLifeDays: number;
  freezable: boolean;
  ingredients: string[];
  category: 'protein-heavy' | 'carb-heavy' | 'balanced' | 'light';
  dietary?: string[];
}

interface DayPlan {
  day: DayOfWeek;
  meals: {
    breakfast: string | null;
    lunch: string | null;
    dinner: string | null;
    snack: string | null;
  };
}

// Meal templates database
const mealTemplates: MealTemplate[] = [
  // Breakfast
  {
    id: 'overnight-oats',
    name: 'Overnight Oats',
    mealType: 'breakfast',
    servings: 1,
    prepTimeMinutes: 5,
    canBatchPrep: true,
    shelfLifeDays: 5,
    freezable: false,
    ingredients: ['oats', 'milk', 'yogurt', 'honey', 'berries'],
    category: 'carb-heavy',
    dietary: ['vegetarian'],
  },
  {
    id: 'egg-muffins',
    name: 'Egg Muffin Cups',
    mealType: 'breakfast',
    servings: 2,
    prepTimeMinutes: 10,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: true,
    ingredients: ['eggs', 'cheese', 'vegetables', 'salt', 'pepper'],
    category: 'protein-heavy',
    dietary: ['vegetarian', 'gluten-free', 'low-carb'],
  },
  {
    id: 'breakfast-burritos',
    name: 'Breakfast Burritos',
    mealType: 'breakfast',
    servings: 1,
    prepTimeMinutes: 15,
    canBatchPrep: true,
    shelfLifeDays: 3,
    freezable: true,
    ingredients: ['tortillas', 'eggs', 'cheese', 'sausage', 'peppers'],
    category: 'balanced',
  },
  {
    id: 'smoothie-packs',
    name: 'Smoothie Prep Packs',
    mealType: 'breakfast',
    servings: 1,
    prepTimeMinutes: 5,
    canBatchPrep: true,
    shelfLifeDays: 30,
    freezable: true,
    ingredients: ['frozen fruit', 'spinach', 'banana', 'protein powder'],
    category: 'light',
    dietary: ['vegetarian', 'gluten-free', 'dairy-free'],
  },
  {
    id: 'greek-yogurt-parfait',
    name: 'Greek Yogurt Parfait',
    mealType: 'breakfast',
    servings: 1,
    prepTimeMinutes: 3,
    canBatchPrep: true,
    shelfLifeDays: 3,
    freezable: false,
    ingredients: ['greek yogurt', 'granola', 'honey', 'berries'],
    category: 'protein-heavy',
    dietary: ['vegetarian'],
  },

  // Lunch
  {
    id: 'chicken-bowls',
    name: 'Chicken Rice Bowls',
    mealType: 'lunch',
    servings: 1,
    prepTimeMinutes: 30,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: true,
    ingredients: ['chicken breast', 'rice', 'broccoli', 'teriyaki sauce'],
    category: 'balanced',
    dietary: ['dairy-free', 'gluten-free'],
  },
  {
    id: 'mason-jar-salads',
    name: 'Mason Jar Salads',
    mealType: 'lunch',
    servings: 1,
    prepTimeMinutes: 15,
    canBatchPrep: true,
    shelfLifeDays: 5,
    freezable: false,
    ingredients: ['mixed greens', 'vegetables', 'chickpeas', 'dressing'],
    category: 'light',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    id: 'turkey-wraps',
    name: 'Turkey Wraps',
    mealType: 'lunch',
    servings: 1,
    prepTimeMinutes: 10,
    canBatchPrep: true,
    shelfLifeDays: 3,
    freezable: false,
    ingredients: ['tortilla', 'turkey', 'cheese', 'lettuce', 'tomato', 'mayo'],
    category: 'balanced',
  },
  {
    id: 'pasta-salad',
    name: 'Mediterranean Pasta Salad',
    mealType: 'lunch',
    servings: 2,
    prepTimeMinutes: 20,
    canBatchPrep: true,
    shelfLifeDays: 5,
    freezable: false,
    ingredients: ['pasta', 'feta', 'olives', 'cucumber', 'tomatoes', 'olive oil'],
    category: 'carb-heavy',
    dietary: ['vegetarian'],
  },
  {
    id: 'soup-containers',
    name: 'Soup Portions',
    mealType: 'lunch',
    servings: 1,
    prepTimeMinutes: 45,
    canBatchPrep: true,
    shelfLifeDays: 5,
    freezable: true,
    ingredients: ['broth', 'vegetables', 'protein', 'beans', 'herbs'],
    category: 'light',
    dietary: ['gluten-free'],
  },
  {
    id: 'grain-bowls',
    name: 'Grain Bowls',
    mealType: 'lunch',
    servings: 1,
    prepTimeMinutes: 25,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: false,
    ingredients: ['quinoa', 'roasted vegetables', 'chickpeas', 'tahini dressing'],
    category: 'balanced',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
  },

  // Dinner
  {
    id: 'sheet-pan-chicken',
    name: 'Sheet Pan Chicken & Veggies',
    mealType: 'dinner',
    servings: 4,
    prepTimeMinutes: 40,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: true,
    ingredients: ['chicken thighs', 'potatoes', 'carrots', 'onions', 'olive oil'],
    category: 'balanced',
    dietary: ['gluten-free', 'dairy-free'],
  },
  {
    id: 'beef-stir-fry',
    name: 'Beef Stir Fry',
    mealType: 'dinner',
    servings: 4,
    prepTimeMinutes: 25,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: true,
    ingredients: ['beef strips', 'bell peppers', 'broccoli', 'soy sauce', 'rice'],
    category: 'balanced',
    dietary: ['dairy-free'],
  },
  {
    id: 'baked-salmon',
    name: 'Baked Salmon & Asparagus',
    mealType: 'dinner',
    servings: 2,
    prepTimeMinutes: 25,
    canBatchPrep: true,
    shelfLifeDays: 3,
    freezable: false,
    ingredients: ['salmon fillets', 'asparagus', 'lemon', 'garlic', 'olive oil'],
    category: 'protein-heavy',
    dietary: ['gluten-free', 'dairy-free', 'low-carb'],
  },
  {
    id: 'turkey-meatballs',
    name: 'Turkey Meatballs',
    mealType: 'dinner',
    servings: 4,
    prepTimeMinutes: 35,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: true,
    ingredients: ['ground turkey', 'breadcrumbs', 'egg', 'marinara', 'pasta'],
    category: 'balanced',
  },
  {
    id: 'vegetable-curry',
    name: 'Vegetable Curry',
    mealType: 'dinner',
    servings: 6,
    prepTimeMinutes: 40,
    canBatchPrep: true,
    shelfLifeDays: 5,
    freezable: true,
    ingredients: ['chickpeas', 'coconut milk', 'vegetables', 'curry paste', 'rice'],
    category: 'carb-heavy',
    dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
  },
  {
    id: 'chicken-fajitas',
    name: 'Chicken Fajita Bowls',
    mealType: 'dinner',
    servings: 4,
    prepTimeMinutes: 30,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: true,
    ingredients: ['chicken', 'peppers', 'onions', 'rice', 'beans', 'salsa'],
    category: 'balanced',
    dietary: ['gluten-free', 'dairy-free'],
  },

  // Snacks
  {
    id: 'energy-balls',
    name: 'Energy Balls',
    mealType: 'snack',
    servings: 12,
    prepTimeMinutes: 15,
    canBatchPrep: true,
    shelfLifeDays: 7,
    freezable: true,
    ingredients: ['oats', 'peanut butter', 'honey', 'chocolate chips'],
    category: 'carb-heavy',
    dietary: ['vegetarian'],
  },
  {
    id: 'hummus-veggies',
    name: 'Hummus & Veggie Cups',
    mealType: 'snack',
    servings: 1,
    prepTimeMinutes: 10,
    canBatchPrep: true,
    shelfLifeDays: 5,
    freezable: false,
    ingredients: ['hummus', 'carrots', 'celery', 'bell pepper strips'],
    category: 'light',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    id: 'cheese-crackers',
    name: 'Cheese & Cracker Packs',
    mealType: 'snack',
    servings: 1,
    prepTimeMinutes: 5,
    canBatchPrep: true,
    shelfLifeDays: 5,
    freezable: false,
    ingredients: ['cheese cubes', 'whole grain crackers', 'grapes'],
    category: 'balanced',
    dietary: ['vegetarian'],
  },
  {
    id: 'protein-boxes',
    name: 'Protein Snack Boxes',
    mealType: 'snack',
    servings: 1,
    prepTimeMinutes: 5,
    canBatchPrep: true,
    shelfLifeDays: 4,
    freezable: false,
    ingredients: ['hard boiled eggs', 'nuts', 'cheese', 'fruit'],
    category: 'protein-heavy',
    dietary: ['vegetarian', 'gluten-free'],
  },
];

// Icons
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const SnowflakeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" x2="22" y1="12" y2="12"/>
    <line x1="12" x2="12" y1="2" y2="22"/>
    <path d="m20 16-4-4 4-4"/>
    <path d="m4 8 4 4-4 4"/>
    <path d="m16 4-4 4-4-4"/>
    <path d="m8 20 4-4 4 4"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="M12 5v14"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect width="12" height="8" x="6" y="14"/>
  </svg>
);

const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealPrepCalculator() {
  const [servingsPerMeal, setServingsPerMeal] = useState(1);
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(
    days.map(day => ({
      day,
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
    }))
  );
  const [selectedSlot, setSelectedSlot] = useState<{ day: DayOfWeek; meal: MealType } | null>(null);

  // Calculate total prep info
  const prepSummary = useMemo(() => {
    const selectedMeals: Map<string, number> = new Map();

    weekPlan.forEach(dayPlan => {
      Object.values(dayPlan.meals).forEach(mealId => {
        if (mealId) {
          selectedMeals.set(mealId, (selectedMeals.get(mealId) || 0) + 1);
        }
      });
    });

    let totalPrepTime = 0;
    const allIngredients: Set<string> = new Set();
    const mealDetails: Array<{ meal: MealTemplate; count: number; totalServings: number }> = [];

    selectedMeals.forEach((count, mealId) => {
      const meal = mealTemplates.find(m => m.id === mealId);
      if (meal) {
        const batchesNeeded = Math.ceil((count * servingsPerMeal) / meal.servings);
        totalPrepTime += meal.prepTimeMinutes * batchesNeeded;
        meal.ingredients.forEach(ing => allIngredients.add(ing));
        mealDetails.push({
          meal,
          count,
          totalServings: count * servingsPerMeal,
        });
      }
    });

    return {
      totalPrepTime,
      ingredients: Array.from(allIngredients).sort(),
      mealDetails,
      totalMeals: Array.from(selectedMeals.values()).reduce((a, b) => a + b, 0),
    };
  }, [weekPlan, servingsPerMeal]);

  const addMealToSlot = (mealId: string) => {
    if (!selectedSlot) return;

    setWeekPlan(prev =>
      prev.map(dayPlan =>
        dayPlan.day === selectedSlot.day
          ? {
              ...dayPlan,
              meals: { ...dayPlan.meals, [selectedSlot.meal]: mealId },
            }
          : dayPlan
      )
    );
    setSelectedSlot(null);
  };

  const removeMealFromSlot = (day: DayOfWeek, meal: MealType) => {
    setWeekPlan(prev =>
      prev.map(dayPlan =>
        dayPlan.day === day
          ? {
              ...dayPlan,
              meals: { ...dayPlan.meals, [meal]: null },
            }
          : dayPlan
      )
    );
  };

  const clearAll = () => {
    setWeekPlan(days.map(day => ({
      day,
      meals: { breakfast: null, lunch: null, dinner: null, snack: null },
    })));
  };

  const getMealById = (id: string) => mealTemplates.find(m => m.id === id);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const mealTypeColors: Record<MealType, string> = {
    breakfast: 'bg-amber-100 text-amber-800 border-amber-200',
    lunch: 'bg-green-100 text-green-800 border-green-200',
    dinner: 'bg-purple-100 text-purple-800 border-purple-200',
    snack: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Controls */}
      <div className="card bg-white mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1">Servings per meal</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServingsPerMeal(Math.max(1, servingsPerMeal - 1))}
                  className="w-8 h-8 rounded-lg border border-[var(--color-cream-dark)] hover:bg-[var(--color-cream)] transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{servingsPerMeal}</span>
                <button
                  onClick={() => setServingsPerMeal(Math.min(8, servingsPerMeal + 1))}
                  className="w-8 h-8 rounded-lg border border-[var(--color-cream-dark)] hover:bg-[var(--color-cream)] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-10 w-px bg-[var(--color-cream-dark)]" />

            <button
              onClick={clearAll}
              className="text-sm text-[var(--color-wine)] hover:underline"
            >
              Clear all meals
            </button>
          </div>

          {prepSummary.totalMeals > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <ClockIcon />
                <span>Total prep: <strong>{formatTime(prepSummary.totalPrepTime)}</strong></span>
              </div>
              <div className="text-[var(--text-muted)]">
                {prepSummary.totalMeals} meals planned
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="card bg-white mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon />
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Weekly Meal Plan
          </h2>
        </div>

        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-[var(--text-muted)] pb-3 w-24"></th>
              {days.map(day => (
                <th key={day} className="text-center text-sm font-medium text-[var(--text-primary)] pb-3 capitalize">
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map(mealType => (
              <tr key={mealType}>
                <td className="py-2 pr-2">
                  <span className={cn(
                    "inline-block px-2 py-1 text-xs font-medium rounded-full capitalize",
                    mealTypeColors[mealType]
                  )}>
                    {mealType}
                  </span>
                </td>
                {days.map(day => {
                  const dayPlan = weekPlan.find(d => d.day === day);
                  const mealId = dayPlan?.meals[mealType];
                  const meal = mealId ? getMealById(mealId) : null;

                  return (
                    <td key={day} className="py-2 px-1">
                      {meal ? (
                        <div className="group relative bg-[var(--color-cream)] rounded-lg p-2 text-center min-h-[60px] flex items-center justify-center">
                          <span className="text-xs text-[var(--text-primary)] line-clamp-2">
                            {meal.name}
                          </span>
                          <button
                            onClick={() => removeMealFromSlot(day, mealType)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <XIcon />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedSlot({ day, meal: mealType })}
                          className={cn(
                            "w-full min-h-[60px] rounded-lg border-2 border-dashed transition-colors flex items-center justify-center",
                            selectedSlot?.day === day && selectedSlot?.meal === mealType
                              ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)]"
                              : "border-[var(--color-cream-dark)] hover:border-[var(--color-wine)] hover:bg-[var(--color-cream)]"
                          )}
                        >
                          <PlusIcon />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Meal Selection Modal/Panel */}
      {selectedSlot && (
        <div className="card bg-white mb-6 border-2 border-[var(--color-wine)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Select {selectedSlot.meal} for {selectedSlot.day}
            </h3>
            <button
              onClick={() => setSelectedSlot(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <XIcon />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {mealTemplates
              .filter(m => m.mealType === selectedSlot.meal)
              .map(meal => (
                <button
                  key={meal.id}
                  onClick={() => addMealToSlot(meal.id)}
                  className="text-left p-3 rounded-lg border border-[var(--color-cream-dark)] hover:border-[var(--color-wine)] hover:bg-[var(--color-cream)] transition-colors"
                >
                  <div className="font-medium text-sm text-[var(--text-primary)] mb-1">
                    {meal.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <ClockIcon />
                      {meal.prepTimeMinutes}m
                    </span>
                    {meal.freezable && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <SnowflakeIcon />
                        Freezable
                      </span>
                    )}
                  </div>
                  {meal.dietary && meal.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {meal.dietary.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-green-50 text-green-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Prep Summary & Shopping List */}
      {prepSummary.totalMeals > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prep Schedule */}
          <div className="card bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Prep Schedule
              </h3>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm text-[var(--color-wine)] hover:underline"
              >
                <PrintIcon />
                Print
              </button>
            </div>

            <div className="space-y-3">
              {prepSummary.mealDetails.map(({ meal, count, totalServings }) => {
                const batchesNeeded = Math.ceil(totalServings / meal.servings);

                return (
                  <div
                    key={meal.id}
                    className="p-3 rounded-lg bg-[var(--color-cream)]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {meal.name}
                        </div>
                        <div className="text-sm text-[var(--text-muted)]">
                          {count}x this week • {totalServings} servings needed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-[var(--text-primary)]">
                          {batchesNeeded} batch{batchesNeeded !== 1 ? 'es' : ''}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {formatTime(meal.prepTimeMinutes * batchesNeeded)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-[var(--text-muted)]">
                        Lasts {meal.shelfLifeDays} days
                      </span>
                      {meal.freezable && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <SnowflakeIcon />
                          Freezable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-cream-dark)]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Total prep time:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {formatTime(prepSummary.totalPrepTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Shopping List */}
          <div className="card bg-white">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCartIcon />
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Shopping List
              </h3>
            </div>

            <div className="space-y-2">
              {prepSummary.ingredients.map(ingredient => (
                <label key={ingredient} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-cream)] cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[var(--color-cream-dark)]" />
                  <span className="text-[var(--text-primary)] capitalize">{ingredient}</span>
                </label>
              ))}
            </div>

            {prepSummary.ingredients.length === 0 && (
              <p className="text-[var(--text-muted)] text-center py-8">
                Add meals to your plan to generate a shopping list
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 card bg-[var(--color-cream)]">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Meal Prep Tips
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Prep Day Strategy</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Sunday is ideal for meal prep. Start with items that take longest (grains, proteins),
              then prep vegetables while they cook. Batch cooking saves 3-4 hours during the week.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Storage Tips</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Use glass containers for reheating. Keep dressings separate until serving.
              Label containers with dates. Freezer meals should be eaten within 2-3 months.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Variety Matters</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Prep base components (proteins, grains, veggies) that can be mixed into different
              meals. This prevents meal prep fatigue while keeping things interesting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
