/**
 * Cooking Unit Converter
 *
 * Convert between all common cooking measurements with ingredient-specific density conversions.
 * Features:
 * - Volume to volume conversions
 * - Weight to weight conversions
 * - Volume to weight (with ingredient density)
 * - Common equivalents reference
 * - Recent conversions history
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type UnitCategory = 'volume' | 'weight' | 'temperature';

interface Unit {
  id: string;
  name: string;
  abbrev: string;
  category: UnitCategory;
  toBase: number; // Conversion factor to base unit (ml for volume, g for weight)
  system: 'us' | 'metric' | 'both';
}

interface Ingredient {
  id: string;
  name: string;
  gramsPerCup: number; // Density for volume-to-weight conversion
}

interface ConversionResult {
  value: number;
  displayValue: string;
  unit: Unit;
}

interface RecentConversion {
  from: { value: number; unit: Unit };
  to: { value: number; unit: Unit };
  ingredient?: Ingredient;
  timestamp: number;
}

// Unit definitions
const UNITS: Unit[] = [
  // Volume - US
  { id: 'cup', name: 'Cup', abbrev: 'cup', category: 'volume', toBase: 236.588, system: 'us' },
  { id: 'tbsp', name: 'Tablespoon', abbrev: 'tbsp', category: 'volume', toBase: 14.787, system: 'us' },
  { id: 'tsp', name: 'Teaspoon', abbrev: 'tsp', category: 'volume', toBase: 4.929, system: 'us' },
  { id: 'fl_oz', name: 'Fluid Ounce', abbrev: 'fl oz', category: 'volume', toBase: 29.574, system: 'us' },
  { id: 'pint', name: 'Pint', abbrev: 'pt', category: 'volume', toBase: 473.176, system: 'us' },
  { id: 'quart', name: 'Quart', abbrev: 'qt', category: 'volume', toBase: 946.353, system: 'us' },
  { id: 'gallon', name: 'Gallon', abbrev: 'gal', category: 'volume', toBase: 3785.41, system: 'us' },

  // Volume - Metric
  { id: 'ml', name: 'Milliliter', abbrev: 'ml', category: 'volume', toBase: 1, system: 'metric' },
  { id: 'liter', name: 'Liter', abbrev: 'L', category: 'volume', toBase: 1000, system: 'metric' },
  { id: 'dl', name: 'Deciliter', abbrev: 'dL', category: 'volume', toBase: 100, system: 'metric' },

  // Weight - US
  { id: 'oz', name: 'Ounce', abbrev: 'oz', category: 'weight', toBase: 28.3495, system: 'us' },
  { id: 'lb', name: 'Pound', abbrev: 'lb', category: 'weight', toBase: 453.592, system: 'us' },

  // Weight - Metric
  { id: 'g', name: 'Gram', abbrev: 'g', category: 'weight', toBase: 1, system: 'metric' },
  { id: 'kg', name: 'Kilogram', abbrev: 'kg', category: 'weight', toBase: 1000, system: 'metric' },
  { id: 'mg', name: 'Milligram', abbrev: 'mg', category: 'weight', toBase: 0.001, system: 'metric' },

  // Special
  { id: 'stick', name: 'Butter Stick', abbrev: 'stick', category: 'weight', toBase: 113.4, system: 'us' },
];

// Common ingredients with density data (grams per cup)
const INGREDIENTS: Ingredient[] = [
  // Flours
  { id: 'all_purpose_flour', name: 'All-Purpose Flour', gramsPerCup: 125 },
  { id: 'bread_flour', name: 'Bread Flour', gramsPerCup: 127 },
  { id: 'cake_flour', name: 'Cake Flour', gramsPerCup: 114 },
  { id: 'whole_wheat_flour', name: 'Whole Wheat Flour', gramsPerCup: 120 },
  { id: 'almond_flour', name: 'Almond Flour', gramsPerCup: 96 },
  { id: 'coconut_flour', name: 'Coconut Flour', gramsPerCup: 112 },

  // Sugars
  { id: 'granulated_sugar', name: 'Granulated Sugar', gramsPerCup: 200 },
  { id: 'brown_sugar_packed', name: 'Brown Sugar (packed)', gramsPerCup: 220 },
  { id: 'powdered_sugar', name: 'Powdered Sugar', gramsPerCup: 120 },
  { id: 'honey', name: 'Honey', gramsPerCup: 340 },
  { id: 'maple_syrup', name: 'Maple Syrup', gramsPerCup: 315 },

  // Dairy
  { id: 'butter', name: 'Butter', gramsPerCup: 227 },
  { id: 'milk', name: 'Milk', gramsPerCup: 244 },
  { id: 'heavy_cream', name: 'Heavy Cream', gramsPerCup: 238 },
  { id: 'sour_cream', name: 'Sour Cream', gramsPerCup: 242 },
  { id: 'yogurt', name: 'Yogurt', gramsPerCup: 245 },
  { id: 'cream_cheese', name: 'Cream Cheese', gramsPerCup: 232 },

  // Oils & Fats
  { id: 'vegetable_oil', name: 'Vegetable Oil', gramsPerCup: 218 },
  { id: 'olive_oil', name: 'Olive Oil', gramsPerCup: 216 },
  { id: 'coconut_oil', name: 'Coconut Oil', gramsPerCup: 218 },

  // Grains & Starches
  { id: 'rice_uncooked', name: 'Rice (uncooked)', gramsPerCup: 185 },
  { id: 'oats_rolled', name: 'Rolled Oats', gramsPerCup: 90 },
  { id: 'cornstarch', name: 'Cornstarch', gramsPerCup: 128 },
  { id: 'breadcrumbs', name: 'Breadcrumbs', gramsPerCup: 108 },

  // Nuts & Seeds
  { id: 'almonds_sliced', name: 'Almonds (sliced)', gramsPerCup: 92 },
  { id: 'walnuts_chopped', name: 'Walnuts (chopped)', gramsPerCup: 117 },
  { id: 'pecans_chopped', name: 'Pecans (chopped)', gramsPerCup: 109 },
  { id: 'peanut_butter', name: 'Peanut Butter', gramsPerCup: 258 },

  // Chocolate & Cocoa
  { id: 'cocoa_powder', name: 'Cocoa Powder', gramsPerCup: 85 },
  { id: 'chocolate_chips', name: 'Chocolate Chips', gramsPerCup: 170 },

  // Liquids
  { id: 'water', name: 'Water', gramsPerCup: 237 },

  // Misc
  { id: 'salt', name: 'Salt', gramsPerCup: 288 },
  { id: 'baking_powder', name: 'Baking Powder', gramsPerCup: 230 },
  { id: 'baking_soda', name: 'Baking Soda', gramsPerCup: 288 },
];

// Common equivalents for quick reference
const COMMON_EQUIVALENTS = [
  { description: '1 cup', equivalents: ['16 tbsp', '48 tsp', '8 fl oz', '237 ml'] },
  { description: '1 tablespoon', equivalents: ['3 tsp', '0.5 fl oz', '15 ml'] },
  { description: '1 pound', equivalents: ['16 oz', '454 g', '2 cups butter'] },
  { description: '1 stick butter', equivalents: ['8 tbsp', '½ cup', '113 g', '4 oz'] },
  { description: '1 liter', equivalents: ['1000 ml', '4.2 cups', '33.8 fl oz'] },
  { description: '1 kilogram', equivalents: ['1000 g', '2.2 lb', '35.3 oz'] },
];

// Icons
const SwapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function UnitConverter() {
  // State
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>(UNITS.find(u => u.id === 'cup')!);
  const [toUnit, setToUnit] = useState<Unit>(UNITS.find(u => u.id === 'ml')!);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [recentConversions, setRecentConversions] = useState<RecentConversion[]>([]);
  const [copied, setCopied] = useState(false);
  const [showVolumeWeight, setShowVolumeWeight] = useState(false);

  // Parse input value
  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue);
    return isNaN(parsed) ? 0 : parsed;
  }, [inputValue]);

  // Check if we need an ingredient for this conversion
  const needsIngredient = useMemo(() => {
    return fromUnit.category !== toUnit.category;
  }, [fromUnit, toUnit]);

  // Calculate conversion result
  const result = useMemo((): ConversionResult | null => {
    if (numericValue === 0) return null;

    // Same category conversion
    if (fromUnit.category === toUnit.category) {
      const baseValue = numericValue * fromUnit.toBase;
      const convertedValue = baseValue / toUnit.toBase;
      return {
        value: convertedValue,
        displayValue: formatNumber(convertedValue),
        unit: toUnit,
      };
    }

    // Cross-category (volume to weight or vice versa)
    if (!selectedIngredient) return null;

    const cupVolume = UNITS.find(u => u.id === 'cup')!;
    const gramWeight = UNITS.find(u => u.id === 'g')!;

    if (fromUnit.category === 'volume' && toUnit.category === 'weight') {
      // Convert volume to cups first
      const volumeInMl = numericValue * fromUnit.toBase;
      const volumeInCups = volumeInMl / cupVolume.toBase;
      // Convert cups to grams using ingredient density
      const grams = volumeInCups * selectedIngredient.gramsPerCup;
      // Convert grams to target weight unit
      const convertedValue = grams / toUnit.toBase;
      return {
        value: convertedValue,
        displayValue: formatNumber(convertedValue),
        unit: toUnit,
      };
    } else if (fromUnit.category === 'weight' && toUnit.category === 'volume') {
      // Convert weight to grams first
      const weightInGrams = numericValue * fromUnit.toBase;
      // Convert grams to cups using ingredient density
      const cups = weightInGrams / selectedIngredient.gramsPerCup;
      // Convert cups to target volume in ml
      const volumeInMl = cups * cupVolume.toBase;
      // Convert ml to target volume unit
      const convertedValue = volumeInMl / toUnit.toBase;
      return {
        value: convertedValue,
        displayValue: formatNumber(convertedValue),
        unit: toUnit,
      };
    }

    return null;
  }, [numericValue, fromUnit, toUnit, selectedIngredient]);

  // Calculate related conversions (all units in same category)
  const relatedConversions = useMemo((): ConversionResult[] => {
    if (numericValue === 0 || needsIngredient && !selectedIngredient) return [];

    const targetCategory = toUnit.category;
    return UNITS
      .filter(u => u.category === targetCategory && u.id !== toUnit.id)
      .map(unit => {
        let value: number;

        if (fromUnit.category === toUnit.category) {
          // Same category
          const baseValue = numericValue * fromUnit.toBase;
          value = baseValue / unit.toBase;
        } else if (selectedIngredient) {
          // Cross-category
          const cupVolume = UNITS.find(u => u.id === 'cup')!;

          if (fromUnit.category === 'volume') {
            const volumeInMl = numericValue * fromUnit.toBase;
            const volumeInCups = volumeInMl / cupVolume.toBase;
            const grams = volumeInCups * selectedIngredient.gramsPerCup;
            value = grams / unit.toBase;
          } else {
            const weightInGrams = numericValue * fromUnit.toBase;
            const cups = weightInGrams / selectedIngredient.gramsPerCup;
            const volumeInMl = cups * cupVolume.toBase;
            value = volumeInMl / unit.toBase;
          }
        } else {
          return null;
        }

        return {
          value,
          displayValue: formatNumber(value),
          unit,
        };
      })
      .filter((r): r is ConversionResult => r !== null)
      .slice(0, 6);
  }, [numericValue, fromUnit, toUnit, selectedIngredient, needsIngredient]);

  // Format number helper
  function formatNumber(num: number): string {
    if (num === 0) return '0';
    if (num < 0.001) return num.toExponential(2);
    if (num < 0.01) return num.toFixed(4);
    if (num < 1) return num.toFixed(3);
    if (num < 10) return num.toFixed(2);
    if (num < 100) return num.toFixed(1);
    return Math.round(num).toLocaleString();
  }

  // Swap units
  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setInputValue(result.displayValue);
    }
  };

  // Add to recent conversions
  const addToRecent = () => {
    if (!result) return;

    const conversion: RecentConversion = {
      from: { value: numericValue, unit: fromUnit },
      to: { value: result.value, unit: toUnit },
      ingredient: selectedIngredient || undefined,
      timestamp: Date.now(),
    };

    setRecentConversions(prev => [
      conversion,
      ...prev.filter(c =>
        !(c.from.unit.id === fromUnit.id && c.to.unit.id === toUnit.id)
      ).slice(0, 4)
    ]);
  };

  // Copy result
  const copyResult = async () => {
    if (!result) return;
    const text = `${numericValue} ${fromUnit.abbrev} = ${result.displayValue} ${result.unit.abbrev}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      addToRecent();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Get units by category
  const volumeUnits = UNITS.filter(u => u.category === 'volume');
  const weightUnits = UNITS.filter(u => u.category === 'weight');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Converter Card */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">
          Convert Cooking Measurements
        </h2>

        {/* Volume/Weight Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-[var(--color-cream)] rounded-lg p-1">
            <button
              onClick={() => {
                setShowVolumeWeight(false);
                setFromUnit(UNITS.find(u => u.id === 'cup')!);
                setToUnit(UNITS.find(u => u.id === 'ml')!);
                setSelectedIngredient(null);
              }}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                !showVolumeWeight
                  ? "bg-white text-[var(--color-wine)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Same Unit Type
            </button>
            <button
              onClick={() => {
                setShowVolumeWeight(true);
                setFromUnit(UNITS.find(u => u.id === 'cup')!);
                setToUnit(UNITS.find(u => u.id === 'g')!);
              }}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                showVolumeWeight
                  ? "bg-white text-[var(--color-wine)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Volume ↔ Weight
            </button>
          </div>
        </div>

        {/* Converter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-6 items-end mb-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              From
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent"
                placeholder="Enter value"
                step="any"
              />
              <select
                value={fromUnit.id}
                onChange={(e) => setFromUnit(UNITS.find(u => u.id === e.target.value)!)}
                className="px-3 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] min-w-[100px]"
              >
                {showVolumeWeight ? (
                  <>
                    <optgroup label="Volume">
                      {volumeUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Weight">
                      {weightUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </optgroup>
                  </>
                ) : (
                  fromUnit.category === 'volume' ? (
                    volumeUnits.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))
                  ) : (
                    weightUnits.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))
                  )
                )}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapUnits}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-wine)] hover:text-white transition-all self-end mb-1"
            title="Swap units"
          >
            <SwapIcon />
          </button>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              To
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-[var(--color-cream)] rounded-lg text-lg font-semibold text-[var(--color-wine)]">
                {result ? result.displayValue : '—'}
              </div>
              <select
                value={toUnit.id}
                onChange={(e) => setToUnit(UNITS.find(u => u.id === e.target.value)!)}
                className="px-3 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] min-w-[100px]"
              >
                {showVolumeWeight ? (
                  <>
                    <optgroup label="Volume">
                      {volumeUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Weight">
                      {weightUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </optgroup>
                  </>
                ) : (
                  fromUnit.category === 'volume' ? (
                    volumeUnits.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))
                  ) : (
                    weightUnits.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Ingredient Selector (for volume ↔ weight) */}
        {needsIngredient && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Select Ingredient (required for volume ↔ weight conversion)
            </label>
            <select
              value={selectedIngredient?.id || ''}
              onChange={(e) => setSelectedIngredient(
                INGREDIENTS.find(i => i.id === e.target.value) || null
              )}
              className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Choose an ingredient...</option>
              <optgroup label="Flours">
                {INGREDIENTS.filter(i => i.name.toLowerCase().includes('flour')).map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </optgroup>
              <optgroup label="Sugars & Sweeteners">
                {INGREDIENTS.filter(i =>
                  i.name.toLowerCase().includes('sugar') ||
                  i.name.toLowerCase().includes('honey') ||
                  i.name.toLowerCase().includes('syrup')
                ).map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </optgroup>
              <optgroup label="Dairy">
                {INGREDIENTS.filter(i =>
                  ['butter', 'milk', 'cream', 'yogurt', 'cheese'].some(d =>
                    i.name.toLowerCase().includes(d)
                  )
                ).map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </optgroup>
              <optgroup label="Oils">
                {INGREDIENTS.filter(i => i.name.toLowerCase().includes('oil')).map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </optgroup>
              <optgroup label="Other">
                {INGREDIENTS.filter(i =>
                  !i.name.toLowerCase().includes('flour') &&
                  !i.name.toLowerCase().includes('sugar') &&
                  !i.name.toLowerCase().includes('honey') &&
                  !i.name.toLowerCase().includes('syrup') &&
                  !['butter', 'milk', 'cream', 'yogurt', 'cheese'].some(d =>
                    i.name.toLowerCase().includes(d)
                  ) &&
                  !i.name.toLowerCase().includes('oil')
                ).map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white text-center mb-6">
            <div className="text-2xl md:text-3xl font-display font-bold mb-2">
              {numericValue} {fromUnit.abbrev} = {result.displayValue} {result.unit.abbrev}
            </div>
            {selectedIngredient && (
              <div className="text-sm opacity-80">
                for {selectedIngredient.name}
              </div>
            )}
            <button
              onClick={copyResult}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
        )}

        {/* Related Conversions */}
        {relatedConversions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">
              Also equals:
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedConversions.map(conv => (
                <span
                  key={conv.unit.id}
                  className="px-3 py-1.5 bg-[var(--color-cream)] rounded-full text-sm"
                >
                  {conv.displayValue} <span className="text-[var(--text-muted)]">{conv.unit.abbrev}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference & Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Equivalents */}
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Common Equivalents
          </h3>
          <div className="space-y-3">
            {COMMON_EQUIVALENTS.map((equiv, idx) => (
              <div key={idx} className="pb-3 border-b border-[var(--color-cream)] last:border-0 last:pb-0">
                <div className="font-medium text-[var(--color-wine)] mb-1">
                  {equiv.description}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {equiv.equivalents.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversions */}
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <ClockIcon />
            Recent Conversions
          </h3>
          {recentConversions.length > 0 ? (
            <div className="space-y-3">
              {recentConversions.map((conv, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(conv.from.value.toString());
                    setFromUnit(conv.from.unit);
                    setToUnit(conv.to.unit);
                    if (conv.ingredient) {
                      setSelectedIngredient(conv.ingredient);
                      setShowVolumeWeight(true);
                    }
                  }}
                  className="w-full text-left p-3 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg transition-colors"
                >
                  <div className="font-medium text-[var(--text-primary)]">
                    {conv.from.value} {conv.from.unit.abbrev} → {formatNumber(conv.to.value)} {conv.to.unit.abbrev}
                  </div>
                  {conv.ingredient && (
                    <div className="text-xs text-[var(--text-muted)]">
                      {conv.ingredient.name}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-muted)]">
              <p>No recent conversions</p>
              <p className="text-sm mt-1">Your conversions will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Ingredient Density Reference */}
      <div className="card bg-white p-6 mt-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Ingredient Weight Reference (per cup)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INGREDIENTS.slice(0, 16).map(ing => (
            <div
              key={ing.id}
              className="p-3 bg-[var(--color-cream)] rounded-lg text-sm"
            >
              <div className="font-medium text-[var(--text-primary)] truncate">
                {ing.name}
              </div>
              <div className="text-[var(--color-wine)] font-semibold">
                {ing.gramsPerCup}g
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
