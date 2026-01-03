/**
 * Sourdough Hydration Calculator Component
 *
 * Calculate dough hydration, starter percentages, and adjust recipes.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

interface DoughFormula {
  flour: number;
  water: number;
  starter: number;
  starterHydration: number;
  salt: number;
}

const BREAD_PRESETS: { name: string; hydration: number; description: string }[] = [
  { name: 'Sandwich Loaf', hydration: 60, description: 'Tight crumb, easy to slice' },
  { name: 'Rustic Country', hydration: 70, description: 'Good balance of texture' },
  { name: 'Artisan Boule', hydration: 75, description: 'Open crumb, chewy crust' },
  { name: 'Ciabatta', hydration: 80, description: 'Very open, irregular crumb' },
  { name: 'Focaccia', hydration: 85, description: 'Crispy, airy texture' },
];

function formatNumber(num: number, decimals = 1): string {
  return num.toFixed(decimals).replace(/\.0+$/, '');
}

export default function SourdoughCalculator() {
  const [formula, setFormula] = useState<DoughFormula>({
    flour: 500,
    water: 350,
    starter: 100,
    starterHydration: 100,
    salt: 10,
  });

  const [targetHydration, setTargetHydration] = useState<string>('');
  const [targetDoughWeight, setTargetDoughWeight] = useState<string>('');

  // Calculate all derived values
  const calculations = useMemo(() => {
    const { flour, water, starter, starterHydration, salt } = formula;

    // Flour and water in starter
    const starterFlour = starter / (1 + starterHydration / 100);
    const starterWater = starter - starterFlour;

    // Total flour and water
    const totalFlour = flour + starterFlour;
    const totalWater = water + starterWater;

    // Hydration calculation
    const hydration = (totalWater / totalFlour) * 100;

    // Baker's percentages
    const starterPercent = (starter / totalFlour) * 100;
    const waterPercent = (water / totalFlour) * 100;
    const saltPercent = (salt / totalFlour) * 100;

    // Total dough weight
    const totalWeight = flour + water + starter + salt;

    return {
      starterFlour,
      starterWater,
      totalFlour,
      totalWater,
      hydration,
      starterPercent,
      waterPercent,
      saltPercent,
      totalWeight,
    };
  }, [formula]);

  // Calculate recipe for target hydration
  const adjustedForHydration = useMemo(() => {
    const target = parseFloat(targetHydration);
    if (!target || target <= 0) return null;

    const { totalFlour, starterFlour, starterWater } = calculations;

    // Target total water = totalFlour * (target / 100)
    const targetTotalWater = totalFlour * (target / 100);

    // Adjusted added water = target total water - water from starter
    const adjustedWater = Math.max(0, targetTotalWater - starterWater);

    return {
      flour: formula.flour,
      water: adjustedWater,
      starter: formula.starter,
      salt: formula.salt,
      totalWeight: formula.flour + adjustedWater + formula.starter + formula.salt,
    };
  }, [targetHydration, calculations, formula]);

  // Scale recipe to target weight
  const scaledRecipe = useMemo(() => {
    const target = parseFloat(targetDoughWeight);
    if (!target || target <= 0) return null;

    const scale = target / calculations.totalWeight;

    return {
      flour: formula.flour * scale,
      water: formula.water * scale,
      starter: formula.starter * scale,
      salt: formula.salt * scale,
      totalWeight: target,
    };
  }, [targetDoughWeight, calculations.totalWeight, formula]);

  const updateFormula = (key: keyof DoughFormula, value: string) => {
    const num = parseFloat(value) || 0;
    setFormula((prev) => ({ ...prev, [key]: num }));
  };

  const applyPreset = (hydration: number) => {
    setTargetHydration(hydration.toString());
  };

  const getHydrationLevel = (hydration: number): { label: string; color: string } => {
    if (hydration < 60) return { label: 'Very Low', color: 'blue' };
    if (hydration < 70) return { label: 'Low', color: 'cyan' };
    if (hydration < 75) return { label: 'Medium', color: 'green' };
    if (hydration < 80) return { label: 'High', color: 'amber' };
    return { label: 'Very High', color: 'orange' };
  };

  const hydrationLevel = getHydrationLevel(calculations.hydration);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Calculator */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
          Your Recipe
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Flour (g)
            </label>
            <input
              type="number"
              value={formula.flour || ''}
              onChange={(e) => updateFormula('flour', e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Water (g)
            </label>
            <input
              type="number"
              value={formula.water || ''}
              onChange={(e) => updateFormula('water', e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Starter (g)
            </label>
            <input
              type="number"
              value={formula.starter || ''}
              onChange={(e) => updateFormula('starter', e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Starter Hyd. (%)
            </label>
            <input
              type="number"
              value={formula.starterHydration || ''}
              onChange={(e) => updateFormula('starterHydration', e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Salt (g)
            </label>
            <input
              type="number"
              value={formula.salt || ''}
              onChange={(e) => updateFormula('salt', e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            />
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white">
          <h3 className="font-display text-lg font-semibold mb-4">Calculated Values</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <span className="block text-3xl font-display font-bold">
                {formatNumber(calculations.hydration)}%
              </span>
              <span className="text-white/80 text-sm">Total Hydration</span>
              <span
                className={cn(
                  'inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium',
                  hydrationLevel.color === 'blue' && 'bg-blue-500/30',
                  hydrationLevel.color === 'cyan' && 'bg-cyan-500/30',
                  hydrationLevel.color === 'green' && 'bg-green-500/30',
                  hydrationLevel.color === 'amber' && 'bg-amber-500/30',
                  hydrationLevel.color === 'orange' && 'bg-orange-500/30'
                )}
              >
                {hydrationLevel.label}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-display font-bold">
                {formatNumber(calculations.starterPercent)}%
              </span>
              <span className="text-white/80 text-sm">Starter (Baker's %)</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-display font-bold">
                {formatNumber(calculations.saltPercent)}%
              </span>
              <span className="text-white/80 text-sm">Salt (Baker's %)</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-display font-bold">
                {formatNumber(calculations.totalWeight, 0)}g
              </span>
              <span className="text-white/80 text-sm">Total Dough</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <p>
                <span className="text-white/70">Total flour:</span>{' '}
                <strong>{formatNumber(calculations.totalFlour)}g</strong>
              </p>
              <p>
                <span className="text-white/70">From starter:</span>{' '}
                {formatNumber(calculations.starterFlour)}g flour, {formatNumber(calculations.starterWater)}g water
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p>
                <span className="text-white/70">Total water:</span>{' '}
                <strong>{formatNumber(calculations.totalWater)}g</strong>
              </p>
              <p>
                <span className="text-white/70">Added water:</span> {formatNumber(formula.water)}g
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Presets */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Common Bread Hydrations
        </h2>
        <div className="flex flex-wrap gap-2">
          {BREAD_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.hydration)}
              className={cn(
                'px-4 py-2 rounded-lg border-2 transition-all text-sm',
                parseFloat(targetHydration) === preset.hydration
                  ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                  : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine-light)]'
              )}
            >
              <span className="font-medium">{preset.name}</span>
              <span className="ml-2 text-[var(--text-muted)]">{preset.hydration}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Adjust Hydration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Adjust to Target Hydration
          </h2>
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                Target Hydration (%)
              </label>
              <input
                type="number"
                value={targetHydration}
                onChange={(e) => setTargetHydration(e.target.value)}
                placeholder="e.g., 75"
                min="50"
                max="100"
                className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              />
            </div>
          </div>

          {adjustedForHydration && (
            <div className="bg-[var(--color-cream)] rounded-lg p-4">
              <h4 className="font-medium text-[var(--text-primary)] mb-2">
                Adjusted Recipe:
              </h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>Flour: {formatNumber(adjustedForHydration.flour)}g</li>
                <li>
                  <strong>Water: {formatNumber(adjustedForHydration.water)}g</strong>
                  <span className="text-[var(--text-muted)] ml-2">
                    ({adjustedForHydration.water > formula.water ? '+' : ''}
                    {formatNumber(adjustedForHydration.water - formula.water)}g)
                  </span>
                </li>
                <li>Starter: {formatNumber(adjustedForHydration.starter)}g</li>
                <li>Salt: {formatNumber(adjustedForHydration.salt)}g</li>
                <li className="pt-1 border-t border-[var(--color-cream-dark)]">
                  Total: {formatNumber(adjustedForHydration.totalWeight)}g
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Scale to Target Weight
          </h2>
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                Target Dough Weight (g)
              </label>
              <input
                type="number"
                value={targetDoughWeight}
                onChange={(e) => setTargetDoughWeight(e.target.value)}
                placeholder="e.g., 1000"
                min="100"
                className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              />
            </div>
          </div>

          {scaledRecipe && (
            <div className="bg-[var(--color-cream)] rounded-lg p-4">
              <h4 className="font-medium text-[var(--text-primary)] mb-2">Scaled Recipe:</h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>Flour: {formatNumber(scaledRecipe.flour)}g</li>
                <li>Water: {formatNumber(scaledRecipe.water)}g</li>
                <li>Starter: {formatNumber(scaledRecipe.starter)}g</li>
                <li>Salt: {formatNumber(scaledRecipe.salt)}g</li>
                <li className="pt-1 border-t border-[var(--color-cream-dark)]">
                  Total: {formatNumber(scaledRecipe.totalWeight)}g
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Hydration Guide */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Hydration Guide
        </h2>

        <div className="space-y-3">
          {[
            { range: '50-60%', label: 'Very Low', desc: 'Stiff doughs. Bagels, pretzels.', color: 'blue' },
            { range: '60-70%', label: 'Low', desc: 'Sandwich loaves, enriched breads.', color: 'cyan' },
            { range: '70-75%', label: 'Medium', desc: 'Country loaves, sourdough boules.', color: 'green' },
            { range: '75-80%', label: 'High', desc: 'Artisan breads, open crumb.', color: 'amber' },
            { range: '80%+', label: 'Very High', desc: 'Ciabatta, focaccia, pizza.', color: 'orange' },
          ].map((item) => (
            <div
              key={item.range}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg',
                item.color === 'blue' && 'bg-blue-50',
                item.color === 'cyan' && 'bg-cyan-50',
                item.color === 'green' && 'bg-green-50',
                item.color === 'amber' && 'bg-amber-50',
                item.color === 'orange' && 'bg-orange-50'
              )}
            >
              <span
                className={cn(
                  'font-mono font-bold w-20',
                  item.color === 'blue' && 'text-blue-700',
                  item.color === 'cyan' && 'text-cyan-700',
                  item.color === 'green' && 'text-green-700',
                  item.color === 'amber' && 'text-amber-700',
                  item.color === 'orange' && 'text-orange-700'
                )}
              >
                {item.range}
              </span>
              <span className="font-medium text-[var(--text-primary)] w-24">{item.label}</span>
              <span className="text-[var(--text-secondary)] text-sm">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-[var(--color-cream)] rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Sourdough Tips
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🫧</span>
            <span>
              <strong>Active starter:</strong> Use your starter when it's at peak activity
              (doubled, bubbly, domed top).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">💧</span>
            <span>
              <strong>Higher hydration = wetter dough:</strong> Start with lower hydrations
              (65-70%) while learning, then increase as you build skill.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🌾</span>
            <span>
              <strong>Flour matters:</strong> Whole grain flours absorb more water.
              Increase hydration by 5-10% when using whole wheat.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🧂</span>
            <span>
              <strong>Salt timing:</strong> Add salt after autolyse (flour + water rest)
              to avoid slowing gluten development.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
