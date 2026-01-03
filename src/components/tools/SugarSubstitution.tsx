/**
 * Sugar Substitution Calculator
 *
 * Convert between different sweeteners with proper ratios and adjustments.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

interface Sweetener {
  id: string;
  name: string;
  type: 'natural' | 'artificial' | 'sugar-alcohol' | 'processed';
  sweetness: number; // relative to white sugar (1.0)
  calories: number; // per 100g
  glycemicIndex: number;
  description: string;
  bestFor: string[];
  avoid: string[];
  color: string;
}

interface SubstitutionRecipe {
  from: string;
  to: string;
  ratio: number;
  liquidAdjust?: string; // e.g., "reduce by 3 tbsp per cup"
  notes: string;
  bakingNotes?: string;
  quality: 'excellent' | 'good' | 'acceptable';
}

const sweeteners: Sweetener[] = [
  {
    id: 'white-sugar',
    name: 'White Sugar',
    type: 'processed',
    sweetness: 1.0,
    calories: 387,
    glycemicIndex: 65,
    description: 'Refined granulated sugar from sugarcane or sugar beets.',
    bestFor: ['Baking', 'Beverages', 'Candy making', 'Preserving'],
    avoid: ['Low-calorie diets', 'Diabetic recipes'],
    color: 'bg-gray-100',
  },
  {
    id: 'brown-sugar',
    name: 'Brown Sugar',
    type: 'processed',
    sweetness: 1.0,
    calories: 380,
    glycemicIndex: 64,
    description: 'White sugar with molasses added for moisture and flavor.',
    bestFor: ['Cookies', 'Sauces', 'Marinades', 'Caramel'],
    avoid: ['Delicate white cakes', 'Meringues'],
    color: 'bg-amber-200',
  },
  {
    id: 'honey',
    name: 'Honey',
    type: 'natural',
    sweetness: 1.25,
    calories: 304,
    glycemicIndex: 58,
    description: 'Natural sweetener made by bees from flower nectar.',
    bestFor: ['Dressings', 'Marinades', 'Tea', 'Baked goods'],
    avoid: ['Infants under 1 year', 'High-heat candy'],
    color: 'bg-amber-400',
  },
  {
    id: 'maple-syrup',
    name: 'Maple Syrup',
    type: 'natural',
    sweetness: 0.75,
    calories: 260,
    glycemicIndex: 54,
    description: 'Natural syrup from the sap of maple trees.',
    bestFor: ['Pancakes', 'Glazes', 'Oatmeal', 'Baking'],
    avoid: ['Candy making', 'Delicate pastries'],
    color: 'bg-orange-400',
  },
  {
    id: 'coconut-sugar',
    name: 'Coconut Sugar',
    type: 'natural',
    sweetness: 1.0,
    calories: 375,
    glycemicIndex: 35,
    description: 'Made from coconut palm sap, with caramel notes.',
    bestFor: ['Baking', 'Coffee', 'Asian dishes', 'Paleo recipes'],
    avoid: ['Light-colored baked goods'],
    color: 'bg-amber-600',
  },
  {
    id: 'agave',
    name: 'Agave Nectar',
    type: 'processed',
    sweetness: 1.5,
    calories: 310,
    glycemicIndex: 15,
    description: 'Liquid sweetener from the agave plant.',
    bestFor: ['Beverages', 'Smoothies', 'Raw desserts', 'Vegan recipes'],
    avoid: ['Candy', 'Baking requiring structure'],
    color: 'bg-yellow-300',
  },
  {
    id: 'stevia',
    name: 'Stevia',
    type: 'natural',
    sweetness: 300,
    calories: 0,
    glycemicIndex: 0,
    description: 'Zero-calorie sweetener from stevia plant leaves.',
    bestFor: ['Beverages', 'Diabetic recipes', 'Low-carb baking'],
    avoid: ['Caramelization', 'Candy', 'Yeast breads'],
    color: 'bg-green-200',
  },
  {
    id: 'monk-fruit',
    name: 'Monk Fruit',
    type: 'natural',
    sweetness: 250,
    calories: 0,
    glycemicIndex: 0,
    description: 'Zero-calorie natural sweetener from monk fruit.',
    bestFor: ['Keto baking', 'Beverages', 'Diabetic recipes'],
    avoid: ['Caramelization', 'Traditional candy'],
    color: 'bg-lime-200',
  },
  {
    id: 'erythritol',
    name: 'Erythritol',
    type: 'sugar-alcohol',
    sweetness: 0.7,
    calories: 6,
    glycemicIndex: 0,
    description: 'Sugar alcohol with minimal digestive effects.',
    bestFor: ['Low-carb baking', 'Frostings', 'Keto desserts'],
    avoid: ['Candy', 'High-temperature cooking'],
    color: 'bg-blue-100',
  },
  {
    id: 'xylitol',
    name: 'Xylitol',
    type: 'sugar-alcohol',
    sweetness: 1.0,
    calories: 40,
    glycemicIndex: 7,
    description: 'Sugar alcohol often used in sugar-free products.',
    bestFor: ['Baking', 'Beverages', 'Sugar-free candy'],
    avoid: ['Dogs (toxic!)', 'Large amounts'],
    color: 'bg-sky-100',
  },
  {
    id: 'date-sugar',
    name: 'Date Sugar',
    type: 'natural',
    sweetness: 0.67,
    calories: 282,
    glycemicIndex: 42,
    description: 'Ground dried dates with fiber and nutrients.',
    bestFor: ['Oatmeal', 'Smoothies', 'Quick breads'],
    avoid: ['Dissolving recipes', 'Clear syrups'],
    color: 'bg-amber-800',
  },
  {
    id: 'molasses',
    name: 'Molasses',
    type: 'natural',
    sweetness: 0.65,
    calories: 290,
    glycemicIndex: 55,
    description: 'Byproduct of sugar refining with robust flavor.',
    bestFor: ['Gingerbread', 'BBQ sauce', 'Baked beans'],
    avoid: ['Delicate desserts', 'Light-colored recipes'],
    color: 'bg-stone-700',
  },
];

const substitutions: SubstitutionRecipe[] = [
  // White Sugar substitutions
  {
    from: 'white-sugar',
    to: 'honey',
    ratio: 0.75,
    liquidAdjust: 'Reduce other liquids by 3 tbsp per cup of honey',
    notes: 'Honey adds moisture and browns faster. Reduce oven temp by 25°F.',
    bakingNotes: 'Works great in muffins, quick breads, and cookies.',
    quality: 'excellent',
  },
  {
    from: 'white-sugar',
    to: 'maple-syrup',
    ratio: 0.75,
    liquidAdjust: 'Reduce other liquids by 3 tbsp per cup of syrup',
    notes: 'Adds distinct maple flavor. Best for recipes where maple complements.',
    bakingNotes: 'Great for pancakes, waffles, and rustic baked goods.',
    quality: 'good',
  },
  {
    from: 'white-sugar',
    to: 'brown-sugar',
    ratio: 1.0,
    notes: 'Direct 1:1 swap. Adds moisture and molasses flavor.',
    bakingNotes: 'Makes cookies chewier and adds caramel notes.',
    quality: 'excellent',
  },
  {
    from: 'white-sugar',
    to: 'coconut-sugar',
    ratio: 1.0,
    notes: 'Direct 1:1 swap. Darker color and slight caramel flavor.',
    bakingNotes: 'Excellent for cookies and dark cakes.',
    quality: 'excellent',
  },
  {
    from: 'white-sugar',
    to: 'agave',
    ratio: 0.67,
    liquidAdjust: 'Reduce other liquids by 2 tbsp per cup of agave',
    notes: 'Very sweet - use less. Neutral flavor works well in most recipes.',
    bakingNotes: 'Best for bars, chewy cookies, and quick breads.',
    quality: 'good',
  },
  {
    from: 'white-sugar',
    to: 'stevia',
    ratio: 0.004,
    notes: '1 tsp stevia = 1 cup sugar. May need bulk filler for baking.',
    bakingNotes: 'Best combined with other ingredients for texture.',
    quality: 'acceptable',
  },
  {
    from: 'white-sugar',
    to: 'monk-fruit',
    ratio: 1.0,
    notes: 'Monk fruit blends are typically 1:1. Check package instructions.',
    bakingNotes: 'Works well in most baked goods with proper blend.',
    quality: 'good',
  },
  {
    from: 'white-sugar',
    to: 'erythritol',
    ratio: 1.3,
    notes: 'Less sweet than sugar. May have cooling effect.',
    bakingNotes: 'Great for keto baking. May crystallize in some recipes.',
    quality: 'good',
  },
  {
    from: 'white-sugar',
    to: 'xylitol',
    ratio: 1.0,
    notes: 'Direct 1:1 swap. TOXIC TO DOGS - keep away from pets.',
    bakingNotes: 'Works well in most baked goods.',
    quality: 'excellent',
  },
  {
    from: 'white-sugar',
    to: 'date-sugar',
    ratio: 1.0,
    notes: 'Does not dissolve well. Best for toppings and mix-ins.',
    bakingNotes: 'Great for streusel, oatmeal cookies, and quick breads.',
    quality: 'acceptable',
  },
  // Brown Sugar substitutions
  {
    from: 'brown-sugar',
    to: 'white-sugar',
    ratio: 1.0,
    notes: 'Add 1 tbsp molasses per cup of white sugar for similar flavor.',
    bakingNotes: 'Cookies will be crisper without molasses moisture.',
    quality: 'good',
  },
  {
    from: 'brown-sugar',
    to: 'coconut-sugar',
    ratio: 1.0,
    notes: 'Similar flavor profile and moisture. Great swap.',
    bakingNotes: 'Works perfectly in cookies and brownies.',
    quality: 'excellent',
  },
  {
    from: 'brown-sugar',
    to: 'honey',
    ratio: 0.75,
    liquidAdjust: 'Reduce liquids by 3 tbsp per cup',
    notes: 'Adds moisture but less molasses depth.',
    bakingNotes: 'Good for muffins and quick breads.',
    quality: 'good',
  },
  // Honey substitutions
  {
    from: 'honey',
    to: 'maple-syrup',
    ratio: 1.0,
    notes: 'Direct swap. Different flavor but similar properties.',
    quality: 'excellent',
  },
  {
    from: 'honey',
    to: 'agave',
    ratio: 1.0,
    notes: 'Direct swap. More neutral flavor than honey.',
    quality: 'good',
  },
  {
    from: 'honey',
    to: 'molasses',
    ratio: 1.0,
    notes: 'Very different flavor - much stronger and darker.',
    bakingNotes: 'Only for recipes where molasses flavor fits.',
    quality: 'acceptable',
  },
  // Maple Syrup substitutions
  {
    from: 'maple-syrup',
    to: 'honey',
    ratio: 1.0,
    notes: 'Direct swap. Sweeter and more floral flavor.',
    quality: 'excellent',
  },
  {
    from: 'maple-syrup',
    to: 'agave',
    ratio: 0.75,
    notes: 'Agave is sweeter. Use less for similar sweetness level.',
    quality: 'good',
  },
];

export default function SugarSubstitution() {
  const [fromSweetener, setFromSweetener] = useState('white-sugar');
  const [toSweetener, setToSweetener] = useState('honey');
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState<'cup' | 'tbsp' | 'tsp' | 'g'>('cup');

  const fromData = sweeteners.find((s) => s.id === fromSweetener);
  const toData = sweeteners.find((s) => s.id === toSweetener);

  const recipe = useMemo(() => {
    // Find direct recipe
    let found = substitutions.find(
      (s) => s.from === fromSweetener && s.to === toSweetener
    );

    // Try reverse
    if (!found) {
      const reverse = substitutions.find(
        (s) => s.from === toSweetener && s.to === fromSweetener
      );
      if (reverse) {
        found = {
          ...reverse,
          from: fromSweetener,
          to: toSweetener,
          ratio: 1 / reverse.ratio,
        };
      }
    }

    // Calculate based on sweetness if no recipe
    if (!found && fromData && toData) {
      const ratio = fromData.sweetness / toData.sweetness;
      found = {
        from: fromSweetener,
        to: toSweetener,
        ratio,
        notes: 'Calculated based on relative sweetness. Adjust to taste.',
        quality: 'acceptable' as const,
      };
    }

    return found;
  }, [fromSweetener, toSweetener, fromData, toData]);

  const convertedAmount = recipe ? amount * recipe.ratio : amount;

  const formatAmount = (amt: number): string => {
    if (amt < 0.01) return `${(amt * 48).toFixed(1)} tsp`; // Very small amounts
    if (amt >= 1) {
      const whole = Math.floor(amt);
      const frac = amt - whole;
      if (frac < 0.08) return whole.toString();
      if (frac < 0.2) return `${whole}⅛`;
      if (frac < 0.29) return `${whole}¼`;
      if (frac < 0.4) return `${whole}⅓`;
      if (frac < 0.58) return `${whole}½`;
      if (frac < 0.7) return `${whole}⅔`;
      if (frac < 0.8) return `${whole}¾`;
      return (whole + 1).toString();
    }
    if (amt < 0.2) return '⅛';
    if (amt < 0.29) return '¼';
    if (amt < 0.4) return '⅓';
    if (amt < 0.58) return '½';
    if (amt < 0.7) return '⅔';
    if (amt < 0.8) return '¾';
    return '1';
  };

  const swapSweeteners = () => {
    setFromSweetener(toSweetener);
    setToSweetener(fromSweetener);
  };

  const getTypeColor = (type: Sweetener['type']) => {
    switch (type) {
      case 'natural':
        return 'bg-green-100 text-green-700';
      case 'processed':
        return 'bg-gray-100 text-gray-700';
      case 'sugar-alcohol':
        return 'bg-blue-100 text-blue-700';
      case 'artificial':
        return 'bg-purple-100 text-purple-700';
    }
  };

  const getQualityBadge = (quality: SubstitutionRecipe['quality']) => {
    switch (quality) {
      case 'excellent':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Excellent Match' };
      case 'good':
        return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Good Match' };
      case 'acceptable':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Acceptable' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Calculator Section */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6 md:p-8 mb-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
          Calculate Substitution
        </h2>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Amount to Convert
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min="0.125"
              step="0.125"
              value={amount}
              onChange={(e) => setAmount(Math.max(0.125, parseFloat(e.target.value) || 0))}
              className="flex-1 px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent text-lg"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as typeof unit)}
              className="px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent bg-white"
            >
              <option value="cup">cup(s)</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
              <option value="g">grams</option>
            </select>
          </div>
        </div>

        {/* Sweetener Selection */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end mb-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Convert From
            </label>
            <select
              value={fromSweetener}
              onChange={(e) => setFromSweetener(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent bg-white"
            >
              {sweeteners.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapSweeteners}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] transition-colors mb-1"
            title="Swap sweeteners"
          >
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
            >
              <path d="M8 3L4 7l4 4" />
              <path d="M4 7h16" />
              <path d="M16 21l4-4-4-4" />
              <path d="M20 17H4" />
            </svg>
          </button>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Convert To
            </label>
            <select
              value={toSweetener}
              onChange={(e) => setToSweetener(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent bg-white"
            >
              {sweeteners.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        {fromSweetener !== toSweetener && recipe && (
          <div className="bg-gradient-to-br from-[var(--color-wine-glow)] to-pink-50 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-sm text-[var(--text-muted)]">Use</span>
                <div className="text-3xl font-display font-bold text-[var(--color-wine)]">
                  {formatAmount(convertedAmount)} {unit}
                </div>
                <div className="text-lg text-[var(--text-primary)]">
                  {toData?.name}
                </div>
              </div>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  getQualityBadge(recipe.quality).bg,
                  getQualityBadge(recipe.quality).text
                )}
              >
                {getQualityBadge(recipe.quality).label}
              </span>
            </div>

            {/* Adjustments */}
            {recipe.liquidAdjust && (
              <div className="bg-white/80 rounded-lg p-3 mb-3">
                <span className="text-sm font-medium text-[var(--color-wine)]">Liquid Adjustment:</span>
                <p className="text-sm text-[var(--text-secondary)]">{recipe.liquidAdjust}</p>
              </div>
            )}

            <div className="bg-white/80 rounded-lg p-3 mb-3">
              <span className="text-sm font-medium text-[var(--text-primary)]">Notes:</span>
              <p className="text-sm text-[var(--text-secondary)]">{recipe.notes}</p>
            </div>

            {recipe.bakingNotes && (
              <div className="bg-white/80 rounded-lg p-3">
                <span className="text-sm font-medium text-amber-700">Baking Tips:</span>
                <p className="text-sm text-[var(--text-secondary)]">{recipe.bakingNotes}</p>
              </div>
            )}
          </div>
        )}

        {fromSweetener === toSweetener && (
          <div className="bg-gray-50 rounded-xl p-6 text-center text-[var(--text-muted)]">
            Select different sweeteners to see the conversion.
          </div>
        )}
      </div>

      {/* Comparison Cards */}
      {fromData && toData && fromSweetener !== toSweetener && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[fromData, toData].map((s) => (
            <div key={s.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn('w-10 h-10 rounded-lg', s.color)} />
                <div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)]">
                    {s.name}
                  </h3>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', getTypeColor(s.type))}>
                    {s.type.charAt(0).toUpperCase() + s.type.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-4">{s.description}</p>

              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div className="bg-[var(--color-cream)] rounded-lg p-2">
                  <div className="font-bold text-[var(--text-primary)]">
                    {s.sweetness === 1 ? '1x' : s.sweetness > 1 ? `${s.sweetness}x` : `${s.sweetness}x`}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">Sweetness</div>
                </div>
                <div className="bg-[var(--color-cream)] rounded-lg p-2">
                  <div className="font-bold text-[var(--text-primary)]">{s.calories}</div>
                  <div className="text-xs text-[var(--text-muted)]">Cal/100g</div>
                </div>
                <div className="bg-[var(--color-cream)] rounded-lg p-2">
                  <div className="font-bold text-[var(--text-primary)]">{s.glycemicIndex}</div>
                  <div className="text-xs text-[var(--text-muted)]">GI</div>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs font-medium text-green-700">Best for:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {s.bestFor.map((use) => (
                    <span
                      key={use}
                      className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-red-700">Avoid:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {s.avoid.map((use) => (
                    <span
                      key={use}
                      className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Sweeteners Reference */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
          Sweetener Reference Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sweeteners.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (fromSweetener !== s.id) {
                  setToSweetener(s.id);
                }
              }}
              className={cn(
                'text-left p-4 rounded-xl border-2 transition-all hover:shadow-md',
                toSweetener === s.id
                  ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                  : 'border-transparent bg-[var(--color-cream)] hover:border-[var(--color-wine)]/30'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn('w-8 h-8 rounded-lg', s.color)} />
                <span className="font-medium text-[var(--text-primary)]">{s.name}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-0.5 bg-white/70 rounded text-[var(--text-muted)]">
                  {s.sweetness > 1 ? `${s.sweetness}x sweeter` : s.sweetness < 1 ? `${Math.round(s.sweetness * 100)}% as sweet` : 'Standard'}
                </span>
                <span className="px-2 py-0.5 bg-white/70 rounded text-[var(--text-muted)]">
                  GI: {s.glycemicIndex}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-amber-50 rounded-xl p-6">
        <h3 className="font-display font-semibold text-amber-800 mb-4">
          Sugar Substitution Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-900">
          <div className="flex gap-3">
            <span className="text-xl">🍰</span>
            <p>
              <strong>Baking:</strong> Liquid sweeteners (honey, maple syrup) add moisture.
              Reduce other liquids and lower oven temp by 25°F to prevent over-browning.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">⚖️</span>
            <p>
              <strong>Measuring:</strong> Spray measuring cups with cooking spray
              when measuring sticky sweeteners like honey or molasses.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🎂</span>
            <p>
              <strong>Structure:</strong> Sugar provides structure in baked goods.
              Zero-calorie sweeteners may need bulk fillers for proper texture.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">⚠️</span>
            <p>
              <strong>Pet Safety:</strong> Xylitol is extremely toxic to dogs.
              Keep xylitol products away from pets at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
