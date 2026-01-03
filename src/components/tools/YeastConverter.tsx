/**
 * Yeast Conversion Calculator Component
 *
 * Convert between different yeast types with proper ratios.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

type YeastType = 'active-dry' | 'instant' | 'fresh' | 'sourdough-starter';

interface YeastInfo {
  id: YeastType;
  name: string;
  shortName: string;
  description: string;
  storage: string;
  activation: string;
  color: string;
  icon: string;
}

const YEAST_TYPES: YeastInfo[] = [
  {
    id: 'active-dry',
    name: 'Active Dry Yeast',
    shortName: 'Active Dry',
    description: 'Most common yeast, requires proofing in warm water before use.',
    storage: 'Room temperature unopened, refrigerate after opening. Lasts 4-6 months.',
    activation: 'Proof in 105-110°F (40-43°C) water with a pinch of sugar for 5-10 min.',
    color: 'amber',
    icon: '🟡',
  },
  {
    id: 'instant',
    name: 'Instant Yeast (Rapid Rise)',
    shortName: 'Instant',
    description: 'Finer granules, can be mixed directly into flour. Faster rising.',
    storage: 'Room temperature unopened, refrigerate after opening. Lasts 4-6 months.',
    activation: 'No proofing needed. Mix directly with dry ingredients.',
    color: 'orange',
    icon: '🟠',
  },
  {
    id: 'fresh',
    name: 'Fresh Yeast (Cake/Compressed)',
    shortName: 'Fresh',
    description: 'Moist, perishable blocks. Preferred by professional bakers for flavor.',
    storage: 'Refrigerate, use within 2 weeks. Can be frozen for 3 months.',
    activation: 'Crumble into warm liquid (95°F/35°C) before adding to dough.',
    color: 'yellow',
    icon: '🧈',
  },
  {
    id: 'sourdough-starter',
    name: 'Sourdough Starter (100% hydration)',
    shortName: 'Starter',
    description: 'Wild yeast culture. Adds flavor and longer fermentation time.',
    storage: 'Room temperature if fed daily, refrigerate if fed weekly.',
    activation: 'Feed 4-12 hours before use until doubled and bubbly.',
    color: 'brown',
    icon: '🫙',
  },
];

// Conversion ratios (relative to 1 tsp active dry yeast)
const CONVERSION_RATIOS: Record<YeastType, Record<YeastType, number>> = {
  'active-dry': {
    'active-dry': 1,
    'instant': 0.75, // 3/4 tsp instant = 1 tsp active dry
    'fresh': 3, // 3x weight of fresh yeast
    'sourdough-starter': 48, // ~1/2 cup starter per 1 tsp yeast
  },
  'instant': {
    'active-dry': 1.33, // 1 1/3 tsp active dry = 1 tsp instant
    'instant': 1,
    'fresh': 4, // 4x weight of fresh yeast
    'sourdough-starter': 64,
  },
  'fresh': {
    'active-dry': 0.33,
    'instant': 0.25,
    'fresh': 1,
    'sourdough-starter': 16,
  },
  'sourdough-starter': {
    'active-dry': 0.021,
    'instant': 0.016,
    'fresh': 0.0625,
    'sourdough-starter': 1,
  },
};

type MeasureUnit = 'tsp' | 'tbsp' | 'packet' | 'oz' | 'g' | 'cup';

const UNIT_TO_TSP: Record<MeasureUnit, number> = {
  tsp: 1,
  tbsp: 3,
  packet: 2.25, // 1 packet = 2.25 tsp
  oz: 9, // 1 oz = ~9 tsp of dry yeast
  g: 0.32, // 1g = ~1/3 tsp
  cup: 48, // 1 cup = 48 tsp
};

const UNIT_LABELS: Record<MeasureUnit, string> = {
  tsp: 'teaspoons',
  tbsp: 'tablespoons',
  packet: 'packets',
  oz: 'ounces',
  g: 'grams',
  cup: 'cups',
};

function formatAmount(amount: number): string {
  if (amount < 0.01) return '< 0.01';
  if (amount >= 100) return Math.round(amount).toString();
  if (amount >= 10) return amount.toFixed(1);
  if (amount >= 1) return amount.toFixed(2);
  return amount.toFixed(2);
}

export default function YeastConverter() {
  const [fromType, setFromType] = useState<YeastType>('active-dry');
  const [toType, setToType] = useState<YeastType>('instant');
  const [amount, setAmount] = useState<string>('1');
  const [unit, setUnit] = useState<MeasureUnit>('tsp');

  const fromYeast = YEAST_TYPES.find((y) => y.id === fromType)!;
  const toYeast = YEAST_TYPES.find((y) => y.id === toType)!;

  // Calculate conversion
  const conversion = useMemo(() => {
    const inputAmount = parseFloat(amount) || 0;
    const inputInTsp = inputAmount * UNIT_TO_TSP[unit];
    const ratio = CONVERSION_RATIOS[fromType][toType];
    const outputInTsp = inputInTsp * ratio;

    // Convert to various units for display
    return {
      tsp: outputInTsp,
      tbsp: outputInTsp / 3,
      packets: outputInTsp / 2.25,
      oz: outputInTsp / 9,
      g: outputInTsp / 0.32,
      cups: outputInTsp / 48,
      ratio,
    };
  }, [fromType, toType, amount, unit]);

  const swapTypes = () => {
    const temp = fromType;
    setFromType(toType);
    setToType(temp);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Converter */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
          Convert Yeast Types
        </h2>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end mb-8">
          {/* Amount Input */}
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
                className="flex-1 px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as MeasureUnit)}
                className="px-3 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              >
                <option value="tsp">tsp</option>
                <option value="tbsp">tbsp</option>
                <option value="packet">pkt</option>
                <option value="g">g</option>
                <option value="oz">oz</option>
              </select>
            </div>
          </div>

          {/* From Yeast */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              From
            </label>
            <select
              value={fromType}
              onChange={(e) => setFromType(e.target.value as YeastType)}
              className="w-full px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {YEAST_TYPES.map((yeast) => (
                <option key={yeast.id} value={yeast.id}>
                  {yeast.icon} {yeast.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapTypes}
              className="p-3 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-wine-glow)] transition-colors"
              title="Swap yeast types"
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

          {/* To Yeast */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              To
            </label>
            <select
              value={toType}
              onChange={(e) => setToType(e.target.value as YeastType)}
              className="w-full px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {YEAST_TYPES.map((yeast) => (
                <option key={yeast.id} value={yeast.id}>
                  {yeast.icon} {yeast.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Result</h3>
            <span className="text-white/80 text-sm">
              Ratio: {conversion.ratio.toFixed(2)}x
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <span className="block text-2xl font-display font-bold">
                {formatAmount(conversion.tsp)}
              </span>
              <span className="text-white/80 text-sm">teaspoons</span>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <span className="block text-2xl font-display font-bold">
                {formatAmount(conversion.tbsp)}
              </span>
              <span className="text-white/80 text-sm">tablespoons</span>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <span className="block text-2xl font-display font-bold">
                {formatAmount(conversion.packets)}
              </span>
              <span className="text-white/80 text-sm">packets</span>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <span className="block text-2xl font-display font-bold">
                {formatAmount(conversion.g)}
              </span>
              <span className="text-white/80 text-sm">grams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Yeast Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* From Yeast Info */}
        <div className="bg-[var(--color-cream)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{fromYeast.icon}</span>
            <div>
              <h3 className="font-display font-semibold text-[var(--text-primary)]">
                {fromYeast.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Converting from</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{fromYeast.description}</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-[var(--color-wine)]">💾</span>
              <span className="text-[var(--text-muted)]">{fromYeast.storage}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--color-wine)]">⚡</span>
              <span className="text-[var(--text-muted)]">{fromYeast.activation}</span>
            </div>
          </div>
        </div>

        {/* To Yeast Info */}
        <div className="bg-[var(--color-wine-glow)] rounded-xl p-5 border-2 border-[var(--color-wine)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{toYeast.icon}</span>
            <div>
              <h3 className="font-display font-semibold text-[var(--text-primary)]">
                {toYeast.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Converting to</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{toYeast.description}</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-[var(--color-wine)]">💾</span>
              <span className="text-[var(--text-muted)]">{toYeast.storage}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--color-wine)]">⚡</span>
              <span className="text-[var(--text-muted)]">{toYeast.activation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Chart */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Quick Conversion Reference
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-cream-dark)]">
                <th className="text-left py-3 px-2 font-medium text-[var(--text-muted)]">
                  Active Dry
                </th>
                <th className="text-center py-3 px-2 font-medium text-[var(--text-muted)]">=</th>
                <th className="text-left py-3 px-2 font-medium text-[var(--text-muted)]">
                  Instant
                </th>
                <th className="text-center py-3 px-2 font-medium text-[var(--text-muted)]">=</th>
                <th className="text-left py-3 px-2 font-medium text-[var(--text-muted)]">
                  Fresh
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-cream)]">
                <td className="py-3 px-2">1 tsp</td>
                <td className="py-3 px-2 text-center">=</td>
                <td className="py-3 px-2">¾ tsp</td>
                <td className="py-3 px-2 text-center">=</td>
                <td className="py-3 px-2">½ oz (14g)</td>
              </tr>
              <tr className="border-b border-[var(--color-cream)]">
                <td className="py-3 px-2">1 packet (2¼ tsp)</td>
                <td className="py-3 px-2 text-center">=</td>
                <td className="py-3 px-2">1¾ tsp</td>
                <td className="py-3 px-2 text-center">=</td>
                <td className="py-3 px-2">⅔ oz (18g)</td>
              </tr>
              <tr className="border-b border-[var(--color-cream)]">
                <td className="py-3 px-2">1 tbsp</td>
                <td className="py-3 px-2 text-center">=</td>
                <td className="py-3 px-2">2¼ tsp</td>
                <td className="py-3 px-2 text-center">=</td>
                <td className="py-3 px-2">1 oz (28g)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* All Yeast Types */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Yeast Types Explained
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {YEAST_TYPES.map((yeast) => (
            <div
              key={yeast.id}
              className={cn(
                'rounded-lg p-4 border',
                yeast.id === fromType || yeast.id === toType
                  ? 'bg-[var(--color-wine-glow)] border-[var(--color-wine)]'
                  : 'bg-[var(--color-cream)] border-transparent'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{yeast.icon}</span>
                <h3 className="font-display font-semibold text-[var(--text-primary)]">
                  {yeast.name}
                </h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{yeast.description}</p>
              <div className="text-xs text-[var(--text-muted)] space-y-1">
                <p>
                  <strong>Storage:</strong> {yeast.storage}
                </p>
                <p>
                  <strong>Activation:</strong> {yeast.activation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-[var(--color-cream)] rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Yeast Conversion Tips
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🌡️</span>
            <span>
              <strong>Temperature matters:</strong> Water that's too hot (over 120°F) kills yeast.
              Too cold and it won't activate.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">⏱️</span>
            <span>
              <strong>Instant is faster:</strong> Dough made with instant yeast rises 50% faster
              than active dry.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🧊</span>
            <span>
              <strong>Freeze for longer storage:</strong> All dry yeast can be frozen for up to
              a year without losing potency.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">✨</span>
            <span>
              <strong>Fresh yeast for flavor:</strong> Bakers prefer fresh yeast for a slightly
              sweeter, more complex flavor.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
