/**
 * Protein Calculator Component
 *
 * Calculate daily protein needs and track intake.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface ProteinGoal {
  id: string;
  name: string;
  description: string;
  multiplierLow: number;
  multiplierHigh: number;
  icon: string;
}

interface ProteinSource {
  id: string;
  name: string;
  category: 'meat' | 'seafood' | 'dairy' | 'plant' | 'other';
  proteinPer100g: number;
  servingSize: number; // grams
  servingDescription: string;
}

// Activity Levels
const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', multiplier: 0.8 },
  { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', multiplier: 0.9 },
  { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', multiplier: 1.0 },
  { id: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.1 },
  { id: 'athlete', label: 'Athlete', description: 'Intense training twice daily', multiplier: 1.2 },
];

// Protein Goals
const proteinGoals: ProteinGoal[] = [
  {
    id: 'maintain',
    name: 'Maintain Weight',
    description: 'Preserve current muscle mass',
    multiplierLow: 0.8,
    multiplierHigh: 1.0,
    icon: '⚖️',
  },
  {
    id: 'muscle',
    name: 'Build Muscle',
    description: 'Maximize muscle growth',
    multiplierLow: 1.2,
    multiplierHigh: 1.7,
    icon: '💪',
  },
  {
    id: 'lose-weight',
    name: 'Lose Weight',
    description: 'Preserve muscle while cutting',
    multiplierLow: 1.0,
    multiplierHigh: 1.4,
    icon: '🔥',
  },
  {
    id: 'athletic',
    name: 'Athletic Performance',
    description: 'Support endurance training',
    multiplierLow: 1.2,
    multiplierHigh: 1.6,
    icon: '🏃',
  },
  {
    id: 'elderly',
    name: 'Healthy Aging',
    description: 'Combat age-related muscle loss',
    multiplierLow: 1.0,
    multiplierHigh: 1.3,
    icon: '🧓',
  },
];

// Protein Sources
const proteinSources: ProteinSource[] = [
  // Meat
  { id: 'chicken-breast', name: 'Chicken Breast', category: 'meat', proteinPer100g: 31, servingSize: 120, servingDescription: '1 breast (4 oz)' },
  { id: 'ground-beef', name: 'Ground Beef (90% lean)', category: 'meat', proteinPer100g: 26, servingSize: 113, servingDescription: '1 patty (4 oz)' },
  { id: 'turkey-breast', name: 'Turkey Breast', category: 'meat', proteinPer100g: 29, servingSize: 120, servingDescription: '4 oz' },
  { id: 'pork-tenderloin', name: 'Pork Tenderloin', category: 'meat', proteinPer100g: 26, servingSize: 113, servingDescription: '4 oz' },
  { id: 'steak', name: 'Beef Steak', category: 'meat', proteinPer100g: 27, servingSize: 170, servingDescription: '6 oz steak' },

  // Seafood
  { id: 'salmon', name: 'Salmon', category: 'seafood', proteinPer100g: 25, servingSize: 170, servingDescription: '1 fillet (6 oz)' },
  { id: 'tuna', name: 'Tuna (canned)', category: 'seafood', proteinPer100g: 26, servingSize: 85, servingDescription: '1 can (3 oz)' },
  { id: 'shrimp', name: 'Shrimp', category: 'seafood', proteinPer100g: 24, servingSize: 100, servingDescription: '10-12 large shrimp' },
  { id: 'cod', name: 'Cod', category: 'seafood', proteinPer100g: 23, servingSize: 113, servingDescription: '1 fillet (4 oz)' },

  // Dairy
  { id: 'greek-yogurt', name: 'Greek Yogurt', category: 'dairy', proteinPer100g: 10, servingSize: 170, servingDescription: '1 container (6 oz)' },
  { id: 'cottage-cheese', name: 'Cottage Cheese', category: 'dairy', proteinPer100g: 11, servingSize: 113, servingDescription: '1/2 cup' },
  { id: 'eggs', name: 'Eggs', category: 'dairy', proteinPer100g: 13, servingSize: 100, servingDescription: '2 large eggs' },
  { id: 'cheese', name: 'Cheese (cheddar)', category: 'dairy', proteinPer100g: 25, servingSize: 28, servingDescription: '1 oz slice' },
  { id: 'milk', name: 'Milk', category: 'dairy', proteinPer100g: 3.4, servingSize: 240, servingDescription: '1 cup (8 oz)' },

  // Plant-based
  { id: 'tofu', name: 'Tofu (firm)', category: 'plant', proteinPer100g: 17, servingSize: 126, servingDescription: '1/2 block (4.5 oz)' },
  { id: 'tempeh', name: 'Tempeh', category: 'plant', proteinPer100g: 20, servingSize: 100, servingDescription: '3.5 oz' },
  { id: 'lentils', name: 'Lentils (cooked)', category: 'plant', proteinPer100g: 9, servingSize: 198, servingDescription: '1 cup cooked' },
  { id: 'chickpeas', name: 'Chickpeas (cooked)', category: 'plant', proteinPer100g: 9, servingSize: 164, servingDescription: '1 cup cooked' },
  { id: 'black-beans', name: 'Black Beans (cooked)', category: 'plant', proteinPer100g: 9, servingSize: 172, servingDescription: '1 cup cooked' },
  { id: 'edamame', name: 'Edamame', category: 'plant', proteinPer100g: 11, servingSize: 155, servingDescription: '1 cup shelled' },
  { id: 'quinoa', name: 'Quinoa (cooked)', category: 'plant', proteinPer100g: 4.4, servingSize: 185, servingDescription: '1 cup cooked' },
  { id: 'almonds', name: 'Almonds', category: 'plant', proteinPer100g: 21, servingSize: 28, servingDescription: '1 oz (23 almonds)' },
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'plant', proteinPer100g: 25, servingSize: 32, servingDescription: '2 tbsp' },

  // Other
  { id: 'whey-protein', name: 'Whey Protein Powder', category: 'other', proteinPer100g: 80, servingSize: 30, servingDescription: '1 scoop (30g)' },
  { id: 'casein', name: 'Casein Protein Powder', category: 'other', proteinPer100g: 75, servingSize: 33, servingDescription: '1 scoop (33g)' },
  { id: 'plant-protein', name: 'Plant Protein Powder', category: 'other', proteinPer100g: 70, servingSize: 35, servingDescription: '1 scoop (35g)' },
];

// Calculate protein per serving
const getProteinPerServing = (source: ProteinSource): number => {
  return Math.round((source.proteinPer100g * source.servingSize) / 100);
};

// Main Component
export default function ProteinCalculator() {
  // User inputs
  const [weight, setWeight] = useState<number>(70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');

  // Tracker state
  const [trackedFoods, setTrackedFoods] = useState<{ id: string; servings: number }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Convert weight to kg if needed
  const weightKg = unit === 'lbs' ? weight * 0.453592 : weight;

  // Calculate protein needs
  const proteinNeeds = useMemo(() => {
    const selectedGoal = proteinGoals.find((g) => g.id === goal);
    const selectedActivity = activityLevels.find((a) => a.id === activityLevel);

    if (!selectedGoal || !selectedActivity) return { min: 0, max: 0, recommended: 0 };

    const activityMultiplier = selectedActivity.multiplier;
    const min = Math.round(weightKg * selectedGoal.multiplierLow * activityMultiplier);
    const max = Math.round(weightKg * selectedGoal.multiplierHigh * activityMultiplier);
    const recommended = Math.round((min + max) / 2);

    return { min, max, recommended };
  }, [weightKg, goal, activityLevel]);

  // Calculate tracked protein
  const trackedProtein = useMemo(() => {
    return trackedFoods.reduce((total, item) => {
      const source = proteinSources.find((s) => s.id === item.id);
      if (!source) return total;
      return total + getProteinPerServing(source) * item.servings;
    }, 0);
  }, [trackedFoods]);

  // Progress percentage
  const progressPercent = Math.min(100, Math.round((trackedProtein / proteinNeeds.recommended) * 100));

  // Filter protein sources
  const filteredSources = useMemo(() => {
    if (categoryFilter === 'all') return proteinSources;
    return proteinSources.filter((s) => s.category === categoryFilter);
  }, [categoryFilter]);

  // Add/update tracked food
  const addFood = (id: string) => {
    const existing = trackedFoods.find((f) => f.id === id);
    if (existing) {
      setTrackedFoods((prev) =>
        prev.map((f) => (f.id === id ? { ...f, servings: f.servings + 1 } : f))
      );
    } else {
      setTrackedFoods((prev) => [...prev, { id, servings: 1 }]);
    }
  };

  // Remove food
  const removeFood = (id: string) => {
    const existing = trackedFoods.find((f) => f.id === id);
    if (existing && existing.servings > 1) {
      setTrackedFoods((prev) =>
        prev.map((f) => (f.id === id ? { ...f, servings: f.servings - 1 } : f))
      );
    } else {
      setTrackedFoods((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'meat', label: 'Meat' },
    { id: 'seafood', label: 'Seafood' },
    { id: 'dairy', label: 'Dairy & Eggs' },
    { id: 'plant', label: 'Plant-Based' },
    { id: 'other', label: 'Supplements' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator */}
        <div className="space-y-6">
          {/* Weight Input */}
          <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Your Details
            </h2>

            <div className="space-y-4">
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Body Weight
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min={30}
                    max={300}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none text-lg"
                  />
                  <div className="flex rounded-lg border border-[var(--color-cream-dark)] overflow-hidden">
                    <button
                      onClick={() => setUnit('kg')}
                      className={cn(
                        'px-4 py-2 text-sm font-medium transition-colors',
                        unit === 'kg'
                          ? 'bg-[var(--color-wine)] text-white'
                          : 'bg-white text-[var(--text-secondary)] hover:bg-gray-50'
                      )}
                    >
                      kg
                    </button>
                    <button
                      onClick={() => setUnit('lbs')}
                      className={cn(
                        'px-4 py-2 text-sm font-medium transition-colors',
                        unit === 'lbs'
                          ? 'bg-[var(--color-wine)] text-white'
                          : 'bg-white text-[var(--text-secondary)] hover:bg-gray-50'
                      )}
                    >
                      lbs
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none"
                >
                  {activityLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Goal Selection */}
          <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Your Goal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {proteinGoals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-left transition-all',
                    goal === g.id
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                      : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine-light)]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{g.icon}</span>
                    <span className="font-medium text-[var(--text-primary)]">{g.name}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{g.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white">
            <h2 className="font-display text-lg font-semibold mb-4">
              Your Daily Protein Target
            </h2>
            <div className="text-center mb-4">
              <span className="text-5xl font-display font-bold">{proteinNeeds.recommended}</span>
              <span className="text-xl ml-2">grams/day</span>
            </div>
            <div className="flex justify-center gap-4 text-sm text-white/80">
              <span>Min: {proteinNeeds.min}g</span>
              <span>|</span>
              <span>Max: {proteinNeeds.max}g</span>
            </div>
            <p className="text-center text-sm text-white/70 mt-4">
              Based on {weightKg.toFixed(1)} kg body weight
            </p>
          </div>
        </div>

        {/* Protein Tracker */}
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Today's Intake
              </h2>
              {trackedFoods.length > 0 && (
                <button
                  onClick={() => setTrackedFoods([])}
                  className="text-sm text-[var(--color-wine)] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-2xl font-display font-bold text-[var(--text-primary)]">
                  {trackedProtein}g
                </span>
                <span className="text-[var(--text-muted)]">
                  of {proteinNeeds.recommended}g
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    progressPercent >= 100
                      ? 'bg-green-500'
                      : progressPercent >= 75
                      ? 'bg-lime-500'
                      : progressPercent >= 50
                      ? 'bg-amber-500'
                      : 'bg-[var(--color-wine)]'
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {progressPercent >= 100
                  ? 'Goal reached! 🎉'
                  : `${proteinNeeds.recommended - trackedProtein}g remaining`}
              </p>
            </div>

            {/* Tracked foods list */}
            {trackedFoods.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {trackedFoods.map((item) => {
                  const source = proteinSources.find((s) => s.id === item.id);
                  if (!source) return null;
                  const protein = getProteinPerServing(source) * item.servings;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-[var(--text-primary)]">
                          {source.name}
                        </span>
                        <span className="text-sm text-[var(--text-muted)] ml-2">
                          × {item.servings}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">{protein}g</span>
                        <button
                          onClick={() => removeFood(item.id)}
                          className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-[var(--text-muted)] py-4">
                Add foods below to track your protein intake
              </p>
            )}
          </div>

          {/* Protein Sources */}
          <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Add Foods
            </h2>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    categoryFilter === cat.id
                      ? 'bg-[var(--color-wine)] text-white'
                      : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Food list */}
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {filteredSources.map((source) => {
                const protein = getProteinPerServing(source);
                const tracked = trackedFoods.find((f) => f.id === source.id);
                return (
                  <button
                    key={source.id}
                    onClick={() => addFood(source.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left',
                      tracked
                        ? 'border-green-300 bg-green-50'
                        : 'border-transparent hover:bg-gray-50'
                    )}
                  >
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        {source.name}
                      </span>
                      <span className="block text-xs text-[var(--text-muted)]">
                        {source.servingDescription}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">{protein}g</span>
                      <div className="w-6 h-6 rounded-full bg-[var(--color-wine)] text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"/>
                          <path d="M12 5v14"/>
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Protein Tips */}
      <div className="mt-12 bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">
          Protein Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
              ⏰
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Spread It Out</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Aim for 20-40g of protein per meal. Your body can only use so much at once
              for muscle synthesis.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
              🥗
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Complete Proteins</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Animal proteins are complete. For plants, combine foods (rice + beans)
              to get all essential amino acids.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
              🎯
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Post-Workout</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Consume protein within 2 hours after exercise for optimal muscle recovery
              and growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
