/**
 * Flour Substitution Calculator Component
 *
 * Convert between different flour types with proper ratios and adjustments.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

interface FlourType {
  id: string;
  name: string;
  protein: string;
  description: string;
  bestFor: string[];
  color: string;
}

const FLOUR_TYPES: FlourType[] = [
  {
    id: 'all-purpose',
    name: 'All-Purpose Flour',
    protein: '10-12%',
    description: 'Versatile, most common flour. Works for almost everything.',
    bestFor: ['Cookies', 'Cakes', 'Quick breads', 'Pie crusts', 'Pancakes'],
    color: 'amber',
  },
  {
    id: 'bread',
    name: 'Bread Flour',
    protein: '12-14%',
    description: 'High protein for strong gluten. Creates chewy texture.',
    bestFor: ['Bread', 'Pizza dough', 'Bagels', 'Pretzels', 'Sourdough'],
    color: 'orange',
  },
  {
    id: 'cake',
    name: 'Cake Flour',
    protein: '7-9%',
    description: 'Low protein, finely milled. Creates tender, delicate crumb.',
    bestFor: ['Cakes', 'Cupcakes', 'Muffins', 'Biscuits', 'Scones'],
    color: 'pink',
  },
  {
    id: 'pastry',
    name: 'Pastry Flour',
    protein: '8-10%',
    description: 'Between cake and all-purpose. Flaky, tender results.',
    bestFor: ['Pie crusts', 'Tarts', 'Pastries', 'Cookies', 'Biscuits'],
    color: 'rose',
  },
  {
    id: 'whole-wheat',
    name: 'Whole Wheat Flour',
    protein: '13-14%',
    description: 'Contains bran and germ. Nutty flavor, denser texture.',
    bestFor: ['Bread', 'Muffins', 'Pancakes', 'Waffles'],
    color: 'brown',
  },
  {
    id: 'self-rising',
    name: 'Self-Rising Flour',
    protein: '8-9%',
    description: 'All-purpose + baking powder + salt. Convenience flour.',
    bestFor: ['Biscuits', 'Pancakes', 'Quick breads', 'Muffins'],
    color: 'blue',
  },
  {
    id: 'gluten-free',
    name: 'Gluten-Free Blend',
    protein: 'Varies',
    description: 'Mix of rice flour, starches, and gums. For gluten sensitivities.',
    bestFor: ['GF baking', 'Cookies', 'Cakes', 'Quick breads'],
    color: 'green',
  },
  {
    id: 'almond',
    name: 'Almond Flour',
    protein: '21%',
    description: 'Ground blanched almonds. Moist, dense, nutty flavor.',
    bestFor: ['Macarons', 'GF baking', 'Low-carb baking', 'Crusts'],
    color: 'yellow',
  },
];

// Substitution recipes: how to make [to] from [from]
interface SubstitutionRecipe {
  from: string;
  to: string;
  ratio: number; // multiply original amount by this
  additions?: string[];
  notes: string;
  quality: 'excellent' | 'good' | 'acceptable';
}

const SUBSTITUTIONS: SubstitutionRecipe[] = [
  // From All-Purpose
  { from: 'all-purpose', to: 'bread', ratio: 1, additions: ['+ 1 tbsp vital wheat gluten per cup'], notes: 'Or use straight 1:1, bread will be slightly less chewy.', quality: 'good' },
  { from: 'all-purpose', to: 'cake', ratio: 0.875, additions: ['+ 2 tbsp cornstarch per cup'], notes: 'Measure 7/8 cup AP + 2 tbsp cornstarch = 1 cup cake flour.', quality: 'excellent' },
  { from: 'all-purpose', to: 'pastry', ratio: 0.925, additions: ['+ 1 tbsp cornstarch per cup'], notes: 'Close enough that 1:1 usually works fine.', quality: 'good' },
  { from: 'all-purpose', to: 'self-rising', ratio: 1, additions: ['+ 1½ tsp baking powder', '+ ¼ tsp salt per cup'], notes: 'Mix well to distribute leavening evenly.', quality: 'excellent' },
  { from: 'all-purpose', to: 'whole-wheat', ratio: 0.5, additions: ['+ 0.5 cup AP (50/50 blend)'], notes: '100% whole wheat makes dense products. Start with 50/50.', quality: 'good' },

  // From Bread Flour
  { from: 'bread', to: 'all-purpose', ratio: 1, notes: 'Works well 1:1. Result will be slightly less chewy.', quality: 'excellent' },
  { from: 'bread', to: 'cake', ratio: 0.875, additions: ['+ 2 tbsp cornstarch per cup'], notes: 'Use the AP→cake method with bread flour.', quality: 'good' },
  { from: 'bread', to: 'whole-wheat', ratio: 0.5, additions: ['+ 0.5 cup bread flour'], notes: '50/50 blend for best results.', quality: 'good' },

  // From Cake Flour
  { from: 'cake', to: 'all-purpose', ratio: 1.125, notes: 'Use 1 cup + 2 tbsp cake flour per cup AP. Results slightly more tender.', quality: 'good' },
  { from: 'cake', to: 'pastry', ratio: 1, notes: 'Very similar, works well 1:1.', quality: 'excellent' },

  // From Whole Wheat
  { from: 'whole-wheat', to: 'all-purpose', ratio: 1, notes: 'Works 1:1. Add 1-2 tbsp more liquid. Less fiber, lighter texture.', quality: 'good' },
  { from: 'whole-wheat', to: 'bread', ratio: 1, notes: 'Works 1:1. Add 1-2 tbsp more liquid.', quality: 'good' },

  // From Self-Rising
  { from: 'self-rising', to: 'all-purpose', ratio: 1, additions: ['Omit baking powder', 'Reduce salt in recipe'], notes: 'Already has 1½ tsp baking powder + ¼ tsp salt per cup.', quality: 'excellent' },

  // Gluten-Free
  { from: 'gluten-free', to: 'all-purpose', ratio: 1, additions: ['+ ¼ tsp xanthan gum per cup (if not in blend)'], notes: 'Results vary by blend. May need more liquid.', quality: 'acceptable' },
  { from: 'all-purpose', to: 'gluten-free', ratio: 1, additions: ['+ ¼ tsp xanthan gum per cup (if not in blend)'], notes: 'GF blends work best for substitution.', quality: 'acceptable' },

  // Almond
  { from: 'almond', to: 'all-purpose', ratio: 1, additions: ['Reduce fats in recipe by 25%'], notes: 'Very different texture. Works for some recipes only.', quality: 'acceptable' },
  { from: 'all-purpose', to: 'almond', ratio: 1, additions: ['Add an extra egg or liquid'], notes: 'Not a direct substitute. Creates moist, dense results.', quality: 'acceptable' },
];

function formatNumber(num: number): string {
  if (num === Math.floor(num)) return num.toString();
  return num.toFixed(2).replace(/\.?0+$/, '');
}

export default function FlourSubstitution() {
  const [fromFlour, setFromFlour] = useState<string>('all-purpose');
  const [toFlour, setToFlour] = useState<string>('cake');
  const [amount, setAmount] = useState<string>('1');
  const [unit, setUnit] = useState<'cup' | 'g'>('cup');

  const fromFlourData = FLOUR_TYPES.find((f) => f.id === fromFlour)!;
  const toFlourData = FLOUR_TYPES.find((f) => f.id === toFlour)!;

  // Find substitution recipe
  const substitution = useMemo(() => {
    return SUBSTITUTIONS.find((s) => s.from === fromFlour && s.to === toFlour);
  }, [fromFlour, toFlour]);

  // Calculate substitution
  const calculation = useMemo(() => {
    const inputAmount = parseFloat(amount) || 0;
    if (!substitution) return null;

    const outputAmount = inputAmount * substitution.ratio;
    return {
      input: inputAmount,
      output: outputAmount,
      ratio: substitution.ratio,
    };
  }, [amount, substitution]);

  const swapFlours = () => {
    const temp = fromFlour;
    setFromFlour(toFlour);
    setToFlour(temp);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-100 text-green-700';
      case 'good':
        return 'bg-amber-100 text-amber-700';
      case 'acceptable':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Calculator */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
          Flour Substitution
        </h2>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end mb-6">
          {/* Amount */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Amount
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.25"
                className="flex-1 px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'cup' | 'g')}
                className="px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              >
                <option value="cup">cups</option>
                <option value="g">grams</option>
              </select>
            </div>
          </div>

          {/* From Flour */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Recipe Calls For
            </label>
            <select
              value={fromFlour}
              onChange={(e) => setFromFlour(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {FLOUR_TYPES.map((flour) => (
                <option key={flour.id} value={flour.id}>
                  {flour.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={swapFlours}
              className="p-3 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-wine-glow)] transition-colors"
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
          </div>

          {/* To Flour */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              You Have
            </label>
            <select
              value={toFlour}
              onChange={(e) => setToFlour(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {FLOUR_TYPES.map((flour) => (
                <option key={flour.id} value={flour.id}>
                  {flour.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        {fromFlour === toFlour ? (
          <div className="bg-[var(--color-cream)] rounded-xl p-6 text-center">
            <p className="text-[var(--text-secondary)]">
              Same flour selected. Use {amount} {unit} as-is!
            </p>
          </div>
        ) : substitution && calculation ? (
          <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Substitution</h3>
              <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getQualityColor(substitution.quality))}>
                {substitution.quality.charAt(0).toUpperCase() + substitution.quality.slice(1)} Match
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <span className="block text-3xl font-display font-bold">
                  {formatNumber(calculation.input)} {unit}
                </span>
                <span className="text-white/80 text-sm">{fromFlourData.name}</span>
              </div>
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-display font-bold">
                  {formatNumber(calculation.output)} {unit}
                </span>
                <span className="text-white/80 text-sm">{toFlourData.name}</span>
              </div>
            </div>

            {substitution.additions && substitution.additions.length > 0 && (
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Also Add:</h4>
                <ul className="text-sm space-y-1">
                  {substitution.additions.map((addition, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span>+</span>
                      {addition}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-white/90 text-sm">{substitution.notes}</p>
          </div>
        ) : (
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <p className="text-red-700">
              No direct substitution recipe available for this combination.
              Consider using all-purpose flour as an intermediate step.
            </p>
          </div>
        )}
      </div>

      {/* Flour Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-cream)] rounded-xl p-5">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2">
            {fromFlourData.name}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-2">Protein: {fromFlourData.protein}</p>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{fromFlourData.description}</p>
          <div className="flex flex-wrap gap-1">
            {fromFlourData.bestFor.map((use) => (
              <span key={use} className="text-xs bg-white px-2 py-1 rounded-full text-[var(--text-muted)]">
                {use}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-wine-glow)] rounded-xl p-5 border-2 border-[var(--color-wine)]">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2">
            {toFlourData.name}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-2">Protein: {toFlourData.protein}</p>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{toFlourData.description}</p>
          <div className="flex flex-wrap gap-1">
            {toFlourData.bestFor.map((use) => (
              <span key={use} className="text-xs bg-white px-2 py-1 rounded-full text-[var(--text-muted)]">
                {use}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Flour Guide */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Flour Types Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FLOUR_TYPES.map((flour) => (
            <div
              key={flour.id}
              className={cn(
                'rounded-lg p-4 border transition-all',
                flour.id === fromFlour || flour.id === toFlour
                  ? 'bg-[var(--color-wine-glow)] border-[var(--color-wine)]'
                  : 'bg-[var(--color-cream)] border-transparent hover:border-[var(--color-wine-light)]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold text-[var(--text-primary)]">
                  {flour.name}
                </h3>
                <span className="text-xs bg-white px-2 py-1 rounded-full text-[var(--text-muted)]">
                  {flour.protein} protein
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{flour.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-[var(--color-cream)] rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Flour Substitution Tips
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">⚖️</span>
            <span>
              <strong>Weigh your flour:</strong> Cup measurements vary. 1 cup AP flour ≈ 120-125g.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🌾</span>
            <span>
              <strong>Protein matters:</strong> Higher protein = more gluten = chewier texture.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🥄</span>
            <span>
              <strong>Spoon and level:</strong> Don't scoop with the measuring cup. Spoon flour in, then level.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🧪</span>
            <span>
              <strong>Test first:</strong> When substituting, try a small batch before the whole recipe.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
