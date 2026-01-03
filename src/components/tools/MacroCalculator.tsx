/**
 * Macro Balance Calculator Component
 *
 * Calculate ideal macronutrient ratios for various goals.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface MacroPreset {
  id: string;
  name: string;
  description: string;
  protein: number; // percentage
  carbs: number;
  fat: number;
  icon: string;
  color: string;
}

interface ActivityLevel {
  id: string;
  label: string;
  description: string;
  multiplier: number;
}

// Activity Levels for TDEE calculation
const activityLevels: ActivityLevel[] = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', multiplier: 1.2 },
  { id: 'light', label: 'Lightly Active', description: 'Exercise 1-3 days/week', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderately Active', description: 'Exercise 3-5 days/week', multiplier: 1.55 },
  { id: 'active', label: 'Very Active', description: 'Exercise 6-7 days/week', multiplier: 1.725 },
  { id: 'extreme', label: 'Extremely Active', description: 'Intense training twice/day', multiplier: 1.9 },
];

// Macro Presets
const macroPresets: MacroPreset[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Traditional balanced nutrition',
    protein: 25,
    carbs: 50,
    fat: 25,
    icon: '⚖️',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'low-carb',
    name: 'Low Carb',
    description: 'Reduced carbohydrates',
    protein: 30,
    carbs: 30,
    fat: 40,
    icon: '🥩',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'keto',
    name: 'Keto',
    description: 'Very low carb, high fat',
    protein: 20,
    carbs: 5,
    fat: 75,
    icon: '🥑',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'high-protein',
    name: 'High Protein',
    description: 'For muscle building',
    protein: 40,
    carbs: 35,
    fat: 25,
    icon: '💪',
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 'zone',
    name: 'Zone Diet',
    description: '40/30/30 ratio',
    protein: 30,
    carbs: 40,
    fat: 30,
    icon: '🎯',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Heart-healthy balance',
    protein: 20,
    carbs: 45,
    fat: 35,
    icon: '🫒',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'low-fat',
    name: 'Low Fat',
    description: 'Traditional weight loss',
    protein: 25,
    carbs: 55,
    fat: 20,
    icon: '🥗',
    color: 'bg-lime-100 text-lime-700',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Set your own ratios',
    protein: 30,
    carbs: 40,
    fat: 30,
    icon: '✏️',
    color: 'bg-gray-100 text-gray-700',
  },
];

// Calorie goals
const calorieGoals = [
  { id: 'lose-fast', label: 'Aggressive Cut', modifier: -500, description: '~1 lb/week loss' },
  { id: 'lose', label: 'Moderate Cut', modifier: -250, description: '~0.5 lb/week loss' },
  { id: 'maintain', label: 'Maintain', modifier: 0, description: 'Stay the same weight' },
  { id: 'gain', label: 'Lean Bulk', modifier: 250, description: '~0.5 lb/week gain' },
  { id: 'gain-fast', label: 'Bulk', modifier: 500, description: '~1 lb/week gain' },
];

// Main Component
export default function MacroCalculator() {
  // User inputs
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(30);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [activity, setActivity] = useState('moderate');
  const [calorieGoal, setCalorieGoal] = useState('maintain');

  // Macro settings
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [customProtein, setCustomProtein] = useState(30);
  const [customCarbs, setCustomCarbs] = useState(40);
  const [customFat, setCustomFat] = useState(30);

  // Get current macros
  const currentMacros = useMemo(() => {
    if (selectedPreset === 'custom') {
      return { protein: customProtein, carbs: customCarbs, fat: customFat };
    }
    const preset = macroPresets.find((p) => p.id === selectedPreset);
    return preset
      ? { protein: preset.protein, carbs: preset.carbs, fat: preset.fat }
      : { protein: 30, carbs: 40, fat: 30 };
  }, [selectedPreset, customProtein, customCarbs, customFat]);

  // Convert units if needed
  const weightKg = unit === 'imperial' ? weight * 0.453592 : weight;
  const heightCm = unit === 'imperial' ? height * 2.54 : height;

  // Calculate BMR using Mifflin-St Jeor equation
  const bmr = useMemo(() => {
    if (sex === 'male') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  }, [weightKg, heightCm, age, sex]);

  // Calculate TDEE
  const tdee = useMemo(() => {
    const activityMultiplier = activityLevels.find((a) => a.id === activity)?.multiplier || 1.55;
    return Math.round(bmr * activityMultiplier);
  }, [bmr, activity]);

  // Calculate target calories
  const targetCalories = useMemo(() => {
    const modifier = calorieGoals.find((g) => g.id === calorieGoal)?.modifier || 0;
    return Math.round(tdee + modifier);
  }, [tdee, calorieGoal]);

  // Calculate grams for each macro
  const macroGrams = useMemo(() => {
    const proteinCals = targetCalories * (currentMacros.protein / 100);
    const carbsCals = targetCalories * (currentMacros.carbs / 100);
    const fatCals = targetCalories * (currentMacros.fat / 100);

    return {
      protein: Math.round(proteinCals / 4), // 4 cal/g
      carbs: Math.round(carbsCals / 4), // 4 cal/g
      fat: Math.round(fatCals / 9), // 9 cal/g
    };
  }, [targetCalories, currentMacros]);

  // Handle custom slider changes
  const handleCustomChange = (macro: 'protein' | 'carbs' | 'fat', value: number) => {
    const current = { protein: customProtein, carbs: customCarbs, fat: customFat };
    const diff = value - current[macro];
    const others = Object.keys(current).filter((k) => k !== macro) as Array<'protein' | 'carbs' | 'fat'>;

    // Distribute the difference to other macros
    const adjustPer = diff / 2;
    const newValues = { ...current };
    newValues[macro] = value;

    others.forEach((other) => {
      newValues[other] = Math.max(5, Math.min(80, current[other] - adjustPer));
    });

    // Normalize to 100%
    const total = newValues.protein + newValues.carbs + newValues.fat;
    if (Math.abs(total - 100) > 0.5) {
      const factor = 100 / total;
      newValues.protein = Math.round(newValues.protein * factor);
      newValues.carbs = Math.round(newValues.carbs * factor);
      newValues.fat = 100 - newValues.protein - newValues.carbs;
    }

    setCustomProtein(newValues.protein);
    setCustomCarbs(newValues.carbs);
    setCustomFat(newValues.fat);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Inputs */}
        <div className="space-y-6">
          {/* Personal Stats */}
          <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Your Stats
            </h2>

            {/* Unit toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUnit('metric')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                  unit === 'metric'
                    ? 'bg-[var(--color-wine)] text-white'
                    : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
                )}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                  unit === 'imperial'
                    ? 'bg-[var(--color-wine)] text-white'
                    : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
                )}
              >
                Imperial (lbs/in)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Height ({unit === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none"
                />
              </div>

              {/* Sex */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Sex
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSex('male')}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                      sex === 'male'
                        ? 'bg-[var(--color-wine)] text-white'
                        : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
                    )}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setSex('female')}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                      sex === 'female'
                        ? 'bg-[var(--color-wine)] text-white'
                        : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
                    )}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none"
              >
                {activityLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Calorie Goal */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Goal
              </label>
              <div className="flex flex-wrap gap-2">
                {calorieGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setCalorieGoal(goal.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      calorieGoal === goal.id
                        ? 'bg-[var(--color-wine)] text-white'
                        : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
                    )}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Macro Preset Selection */}
          <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Macro Ratio
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {macroPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-center transition-all',
                    selectedPreset === preset.id
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                      : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine-light)]'
                  )}
                >
                  <span className="text-2xl block mb-1">{preset.icon}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)] block">
                    {preset.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {preset.protein}/{preset.carbs}/{preset.fat}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom sliders */}
            {selectedPreset === 'custom' && (
              <div className="mt-6 space-y-4">
                {/* Protein slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-red-600">Protein</span>
                    <span className="text-sm font-semibold text-red-600">{customProtein}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={customProtein}
                    onChange={(e) => handleCustomChange('protein', Number(e.target.value))}
                    className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                {/* Carbs slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-blue-600">Carbs</span>
                    <span className="text-sm font-semibold text-blue-600">{customCarbs}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={customCarbs}
                    onChange={(e) => handleCustomChange('carbs', Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Fat slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-yellow-600">Fat</span>
                    <span className="text-sm font-semibold text-yellow-600">{customFat}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={customFat}
                    onChange={(e) => handleCustomChange('fat', Number(e.target.value))}
                    className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Calorie Summary */}
          <div className="bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white">
            <h2 className="font-display text-lg font-semibold mb-4">Your Daily Calories</h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <span className="block text-2xl font-bold">{Math.round(bmr)}</span>
                <span className="text-xs text-white/70">BMR</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">{tdee}</span>
                <span className="text-xs text-white/70">TDEE</span>
              </div>
              <div className="text-center bg-white/20 rounded-lg py-2">
                <span className="block text-3xl font-bold">{targetCalories}</span>
                <span className="text-xs text-white/90">Target</span>
              </div>
            </div>

            <p className="text-sm text-white/70 text-center">
              {calorieGoals.find((g) => g.id === calorieGoal)?.description}
            </p>
          </div>

          {/* Macro Breakdown */}
          <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Daily Macros
            </h2>

            {/* Visual bar */}
            <div className="h-8 rounded-full overflow-hidden flex mb-6">
              <div
                className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${currentMacros.protein}%` }}
              >
                {currentMacros.protein}%
              </div>
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${currentMacros.carbs}%` }}
              >
                {currentMacros.carbs}%
              </div>
              <div
                className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${currentMacros.fat}%` }}
              >
                {currentMacros.fat}%
              </div>
            </div>

            {/* Macro cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  🥩
                </div>
                <span className="text-3xl font-bold text-red-600 block">{macroGrams.protein}g</span>
                <span className="text-sm text-red-500">Protein</span>
                <span className="text-xs text-red-400 block">{Math.round(macroGrams.protein * 4)} cal</span>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  🍞
                </div>
                <span className="text-3xl font-bold text-blue-600 block">{macroGrams.carbs}g</span>
                <span className="text-sm text-blue-500">Carbs</span>
                <span className="text-xs text-blue-400 block">{Math.round(macroGrams.carbs * 4)} cal</span>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  🥑
                </div>
                <span className="text-3xl font-bold text-yellow-600 block">{macroGrams.fat}g</span>
                <span className="text-sm text-yellow-600">Fat</span>
                <span className="text-xs text-yellow-500 block">{Math.round(macroGrams.fat * 9)} cal</span>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-[var(--color-cream)] rounded-xl p-4">
            <h3 className="font-medium text-[var(--text-primary)] mb-3">Quick Reference</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <span className="font-medium text-[var(--text-primary)]">Per Meal (3 meals)</span>
                <div className="mt-1 text-[var(--text-muted)]">
                  <span className="block">Protein: {Math.round(macroGrams.protein / 3)}g</span>
                  <span className="block">Carbs: {Math.round(macroGrams.carbs / 3)}g</span>
                  <span className="block">Fat: {Math.round(macroGrams.fat / 3)}g</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="font-medium text-[var(--text-primary)]">Per Meal (4 meals)</span>
                <div className="mt-1 text-[var(--text-muted)]">
                  <span className="block">Protein: {Math.round(macroGrams.protein / 4)}g</span>
                  <span className="block">Carbs: {Math.round(macroGrams.carbs / 4)}g</span>
                  <span className="block">Fat: {Math.round(macroGrams.fat / 4)}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">
          Understanding Macros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
              🥩
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Protein</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Builds and repairs muscle. Essential for satiety and metabolism. 4 calories per gram.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
              🍞
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Carbohydrates</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Primary energy source. Fuels workouts and brain function. 4 calories per gram.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-xl">
              🥑
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Fat</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Hormone production, vitamin absorption, long-term energy. 9 calories per gram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
