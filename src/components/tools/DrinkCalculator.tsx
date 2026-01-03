/**
 * Drink/Cocktail Calculator
 *
 * Calculate beverage quantities for parties and events.
 * Features:
 * - Guest count and duration inputs
 * - Drink type toggles (beer, wine, spirits, non-alcoholic)
 * - Ratio sliders for drink preferences
 * - Visual breakdown
 * - Batch cocktail scaling
 * - Shopping list generator
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type DrinkType = 'beer' | 'wine' | 'spirits' | 'nonAlcoholic';
type EventType = 'casual' | 'formal' | 'cocktail' | 'bbq' | 'wedding' | 'brunch';

interface DrinkPreferences {
  beer: number;
  wine: number;
  spirits: number;
  nonAlcoholic: number;
}

interface BatchCocktail {
  name: string;
  servings: number;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

// Constants
const EVENT_TYPES: Array<{ id: EventType; name: string; icon: string; drinksPerHour: number }> = [
  { id: 'casual', name: 'Casual Party', icon: '🎈', drinksPerHour: 1.5 },
  { id: 'formal', name: 'Formal Dinner', icon: '🍽️', drinksPerHour: 1.0 },
  { id: 'cocktail', name: 'Cocktail Party', icon: '🍸', drinksPerHour: 2.0 },
  { id: 'bbq', name: 'BBQ / Outdoor', icon: '🍖', drinksPerHour: 2.0 },
  { id: 'wedding', name: 'Wedding / Reception', icon: '💒', drinksPerHour: 1.5 },
  { id: 'brunch', name: 'Brunch', icon: '🥂', drinksPerHour: 1.5 },
];

const DRINK_CATEGORIES = {
  beer: {
    name: 'Beer',
    icon: '🍺',
    color: 'amber',
    servingsPerUnit: 1, // 1 bottle/can = 1 serving
    unitLabel: 'bottles/cans',
    tips: 'Plan for 12oz servings. Consider variety packs for different tastes.',
  },
  wine: {
    name: 'Wine',
    icon: '🍷',
    color: 'wine',
    servingsPerUnit: 5, // 1 bottle = 5 glasses
    unitLabel: 'bottles',
    tips: 'Each bottle yields about 5 glasses. Mix red, white, and sparkling.',
  },
  spirits: {
    name: 'Spirits/Cocktails',
    icon: '🥃',
    color: 'copper',
    servingsPerUnit: 17, // 750ml bottle = ~17 shots (1.5oz each)
    unitLabel: 'bottles (750ml)',
    tips: 'Each 750ml bottle makes about 17 cocktails. Don\'t forget mixers!',
  },
  nonAlcoholic: {
    name: 'Non-Alcoholic',
    icon: '🥤',
    color: 'green',
    servingsPerUnit: 8, // 2L bottle = ~8 glasses
    unitLabel: '2L bottles',
    tips: 'Always have 20-30% non-alcoholic options for designated drivers.',
  },
};

const POPULAR_COCKTAILS: BatchCocktail[] = [
  {
    name: 'Classic Margarita',
    servings: 1,
    ingredients: [
      { name: 'Tequila', amount: 2, unit: 'oz' },
      { name: 'Triple Sec', amount: 1, unit: 'oz' },
      { name: 'Fresh Lime Juice', amount: 1, unit: 'oz' },
      { name: 'Simple Syrup', amount: 0.5, unit: 'oz' },
    ],
  },
  {
    name: 'Moscow Mule',
    servings: 1,
    ingredients: [
      { name: 'Vodka', amount: 2, unit: 'oz' },
      { name: 'Ginger Beer', amount: 4, unit: 'oz' },
      { name: 'Fresh Lime Juice', amount: 0.5, unit: 'oz' },
    ],
  },
  {
    name: 'Mojito',
    servings: 1,
    ingredients: [
      { name: 'White Rum', amount: 2, unit: 'oz' },
      { name: 'Fresh Lime Juice', amount: 1, unit: 'oz' },
      { name: 'Simple Syrup', amount: 0.75, unit: 'oz' },
      { name: 'Fresh Mint Leaves', amount: 6, unit: 'leaves' },
      { name: 'Club Soda', amount: 2, unit: 'oz' },
    ],
  },
  {
    name: 'Whiskey Sour',
    servings: 1,
    ingredients: [
      { name: 'Bourbon', amount: 2, unit: 'oz' },
      { name: 'Fresh Lemon Juice', amount: 0.75, unit: 'oz' },
      { name: 'Simple Syrup', amount: 0.75, unit: 'oz' },
      { name: 'Egg White (optional)', amount: 0.5, unit: 'oz' },
    ],
  },
  {
    name: 'Aperol Spritz',
    servings: 1,
    ingredients: [
      { name: 'Aperol', amount: 2, unit: 'oz' },
      { name: 'Prosecco', amount: 3, unit: 'oz' },
      { name: 'Club Soda', amount: 1, unit: 'oz' },
    ],
  },
  {
    name: 'Sangria (Pitcher)',
    servings: 8,
    ingredients: [
      { name: 'Red Wine', amount: 750, unit: 'ml' },
      { name: 'Brandy', amount: 4, unit: 'oz' },
      { name: 'Orange Juice', amount: 4, unit: 'oz' },
      { name: 'Triple Sec', amount: 2, unit: 'oz' },
      { name: 'Simple Syrup', amount: 2, unit: 'oz' },
      { name: 'Mixed Fruit', amount: 2, unit: 'cups' },
    ],
  },
];

// Arrow icons as inline SVG
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect width="12" height="8" x="6" y="14"/>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </svg>
);

export default function DrinkCalculator() {
  // State
  const [guests, setGuests] = useState(25);
  const [duration, setDuration] = useState(3);
  const [eventType, setEventType] = useState<EventType>('casual');
  const [enabledDrinks, setEnabledDrinks] = useState<Record<DrinkType, boolean>>({
    beer: true,
    wine: true,
    spirits: true,
    nonAlcoholic: true,
  });
  const [preferences, setPreferences] = useState<DrinkPreferences>({
    beer: 40,
    wine: 30,
    spirits: 20,
    nonAlcoholic: 10,
  });
  const [copied, setCopied] = useState(false);

  // Batch cocktail state
  const [selectedCocktail, setSelectedCocktail] = useState<BatchCocktail | null>(null);
  const [batchServings, setBatchServings] = useState(10);

  // Get event info
  const currentEvent = EVENT_TYPES.find(e => e.id === eventType) || EVENT_TYPES[0];

  // Normalize preferences when drink types change
  const normalizedPreferences = useMemo(() => {
    const enabled = Object.entries(enabledDrinks)
      .filter(([, isEnabled]) => isEnabled)
      .map(([type]) => type as DrinkType);

    if (enabled.length === 0) return preferences;

    const total = enabled.reduce((sum, type) => sum + preferences[type], 0);
    if (total === 0) {
      // Equal distribution if all are zero
      const equalShare = 100 / enabled.length;
      return Object.fromEntries(
        Object.entries(preferences).map(([type, value]) => [
          type,
          enabled.includes(type as DrinkType) ? equalShare : 0
        ])
      ) as DrinkPreferences;
    }

    // Normalize to 100%
    return Object.fromEntries(
      Object.entries(preferences).map(([type, value]) => [
        type,
        enabled.includes(type as DrinkType) ? (value / total) * 100 : 0
      ])
    ) as DrinkPreferences;
  }, [preferences, enabledDrinks]);

  // Calculate drink quantities
  const calculations = useMemo(() => {
    const drinksPerHour = currentEvent.drinksPerHour;
    const totalDrinks = Math.ceil(guests * duration * drinksPerHour);

    const results: Record<DrinkType, { servings: number; units: number; unitLabel: string }> = {
      beer: { servings: 0, units: 0, unitLabel: DRINK_CATEGORIES.beer.unitLabel },
      wine: { servings: 0, units: 0, unitLabel: DRINK_CATEGORIES.wine.unitLabel },
      spirits: { servings: 0, units: 0, unitLabel: DRINK_CATEGORIES.spirits.unitLabel },
      nonAlcoholic: { servings: 0, units: 0, unitLabel: DRINK_CATEGORIES.nonAlcoholic.unitLabel },
    };

    (Object.keys(results) as DrinkType[]).forEach(type => {
      if (enabledDrinks[type]) {
        const servings = Math.ceil(totalDrinks * (normalizedPreferences[type] / 100));
        const units = Math.ceil(servings / DRINK_CATEGORIES[type].servingsPerUnit);
        results[type] = {
          servings,
          units,
          unitLabel: DRINK_CATEGORIES[type].unitLabel,
        };
      }
    });

    return {
      totalDrinks,
      drinksPerPerson: (totalDrinks / guests).toFixed(1),
      breakdown: results,
    };
  }, [guests, duration, currentEvent, enabledDrinks, normalizedPreferences]);

  // Calculate ice needed
  const iceNeeded = useMemo(() => {
    // Rule of thumb: 1 lb of ice per person for a standard party
    const baseIce = guests;
    // Adjust for duration
    const durationMultiplier = duration > 3 ? 1.5 : 1;
    // Adjust for event type (outdoor/BBQ needs more)
    const eventMultiplier = eventType === 'bbq' ? 1.5 : 1;

    return Math.ceil(baseIce * durationMultiplier * eventMultiplier);
  }, [guests, duration, eventType]);

  // Batch cocktail calculations
  const batchCalculations = useMemo(() => {
    if (!selectedCocktail) return null;

    const multiplier = batchServings / selectedCocktail.servings;

    return selectedCocktail.ingredients.map(ing => ({
      name: ing.name,
      amount: +(ing.amount * multiplier).toFixed(2),
      unit: ing.unit,
      displayAmount: formatAmount(ing.amount * multiplier, ing.unit),
    }));
  }, [selectedCocktail, batchServings]);

  // Format amount helper
  function formatAmount(amount: number, unit: string): string {
    if (unit === 'oz') {
      if (amount >= 32) {
        return `${(amount / 32).toFixed(1)} quarts`;
      } else if (amount >= 16) {
        return `${(amount / 16).toFixed(1)} pints`;
      } else if (amount >= 8) {
        return `${(amount / 8).toFixed(1)} cups`;
      }
    }
    if (unit === 'ml' && amount >= 750) {
      return `${(amount / 750).toFixed(1)} bottles`;
    }
    return `${amount} ${unit}`;
  }

  // Handle preference change
  const handlePreferenceChange = (type: DrinkType, value: number) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  // Toggle drink type
  const toggleDrinkType = (type: DrinkType) => {
    setEnabledDrinks(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setGuests(25);
    setDuration(3);
    setEventType('casual');
    setEnabledDrinks({ beer: true, wine: true, spirits: true, nonAlcoholic: true });
    setPreferences({ beer: 40, wine: 30, spirits: 20, nonAlcoholic: 10 });
  };

  // Generate shopping list text
  const generateShoppingList = () => {
    const lines: string[] = [
      `DRINK SHOPPING LIST`,
      `==================`,
      `Event: ${currentEvent.name}`,
      `Guests: ${guests} | Duration: ${duration} hours`,
      ``,
      `BEVERAGES NEEDED:`,
      `-----------------`,
    ];

    (Object.entries(calculations.breakdown) as [DrinkType, typeof calculations.breakdown.beer][]).forEach(([type, data]) => {
      if (enabledDrinks[type] && data.units > 0) {
        const cat = DRINK_CATEGORIES[type];
        lines.push(`${cat.icon} ${cat.name}: ${data.units} ${data.unitLabel} (~${data.servings} servings)`);
      }
    });

    lines.push(``);
    lines.push(`ICE: ${iceNeeded} lbs`);
    lines.push(``);
    lines.push(`TIPS:`);
    (Object.entries(DRINK_CATEGORIES) as [DrinkType, typeof DRINK_CATEGORIES.beer][]).forEach(([type, cat]) => {
      if (enabledDrinks[type]) {
        lines.push(`• ${cat.tips}`);
      }
    });

    return lines.join('\n');
  };

  // Copy to clipboard
  const copyShoppingList = async () => {
    try {
      await navigator.clipboard.writeText(generateShoppingList());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = generateShoppingList();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Print shopping list
  const printShoppingList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Drink Shopping List</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
          h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
          .meta { color: #666; margin-bottom: 1.5rem; }
          .section { margin-bottom: 1.5rem; }
          .section-title { font-weight: 600; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; margin-bottom: 0.5rem; }
          .item { padding: 0.25rem 0; display: flex; justify-content: space-between; }
          .tip { font-size: 0.875rem; color: #666; margin: 0.25rem 0; }
        </style>
      </head>
      <body>
        <h1>🍹 Drink Shopping List</h1>
        <div class="meta">${currentEvent.name} • ${guests} guests • ${duration} hours</div>

        <div class="section">
          <div class="section-title">Beverages</div>
          ${(Object.entries(calculations.breakdown) as [DrinkType, typeof calculations.breakdown.beer][])
            .filter(([type, data]) => enabledDrinks[type] && data.units > 0)
            .map(([type, data]) => {
              const cat = DRINK_CATEGORIES[type];
              return `<div class="item"><span>${cat.icon} ${cat.name}</span><span><strong>${data.units}</strong> ${data.unitLabel}</span></div>`;
            }).join('')}
        </div>

        <div class="section">
          <div class="section-title">Ice</div>
          <div class="item"><span>🧊 Ice</span><span><strong>${iceNeeded}</strong> lbs</span></div>
        </div>

        <div class="section">
          <div class="section-title">Tips</div>
          ${(Object.entries(DRINK_CATEGORIES) as [DrinkType, typeof DRINK_CATEGORIES.beer][])
            .filter(([type]) => enabledDrinks[type])
            .map(([, cat]) => `<p class="tip">• ${cat.tips}</p>`).join('')}
        </div>

        <script>window.print(); window.close();</script>
      </body>
      </html>
    `);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Event Details Card */}
        <div className="card bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Event Details
          </h2>

          {/* Guest Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Number of Guests
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="200"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="flex-1 accent-[var(--color-wine)]"
              />
              <span className="w-16 text-center font-semibold text-lg text-[var(--color-wine)]">
                {guests}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Duration (hours)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="8"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex-1 accent-[var(--color-wine)]"
              />
              <span className="w-16 text-center font-semibold text-lg text-[var(--color-wine)]">
                {duration}h
              </span>
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_TYPES.map(event => (
                <button
                  key={event.id}
                  onClick={() => setEventType(event.id)}
                  className={cn(
                    "p-3 rounded-lg text-sm font-medium transition-all text-left",
                    eventType === event.id
                      ? "bg-[var(--color-wine)] text-white"
                      : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                  )}
                >
                  <span className="mr-2">{event.icon}</span>
                  {event.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drink Types Card */}
        <div className="card bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Drink Types
          </h2>

          <div className="space-y-4">
            {(Object.entries(DRINK_CATEGORIES) as [DrinkType, typeof DRINK_CATEGORIES.beer][]).map(([type, cat]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledDrinks[type]}
                      onChange={() => toggleDrinkType(type)}
                      className="w-4 h-4 rounded accent-[var(--color-wine)]"
                    />
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-medium text-[var(--text-primary)]">{cat.name}</span>
                  </label>
                  <span className="text-sm font-semibold text-[var(--color-wine)]">
                    {Math.round(normalizedPreferences[type])}%
                  </span>
                </div>
                {enabledDrinks[type] && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={preferences[type]}
                    onChange={(e) => handlePreferenceChange(type, Number(e.target.value))}
                    className="w-full accent-[var(--color-wine)]"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={resetToDefaults}
            className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-wine)] transition-colors"
          >
            <RefreshIcon />
            Reset to Defaults
          </button>
        </div>

        {/* Quick Stats Card */}
        <div className="card bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-wine-deep)] text-white p-6">
          <h2 className="font-display text-lg font-semibold mb-4 opacity-90">
            Quick Summary
          </h2>

          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-display font-bold mb-1">
                {calculations.totalDrinks}
              </div>
              <div className="text-sm opacity-80">Total drinks needed</div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-display font-bold mb-1">
                {calculations.drinksPerPerson}
              </div>
              <div className="text-sm opacity-80">Drinks per person</div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-display font-bold mb-1">
                {iceNeeded} lbs
              </div>
              <div className="text-sm opacity-80">Ice recommended</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="card bg-white p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Shopping List
          </h2>
          <div className="flex gap-2">
            <button
              onClick={copyShoppingList}
              className="btn btn-secondary text-sm flex items-center gap-2"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={printShoppingList}
              className="btn btn-secondary text-sm flex items-center gap-2"
            >
              <PrintIcon />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(Object.entries(calculations.breakdown) as [DrinkType, typeof calculations.breakdown.beer][]).map(([type, data]) => {
            if (!enabledDrinks[type] || data.units === 0) return null;
            const cat = DRINK_CATEGORIES[type];

            return (
              <div
                key={type}
                className="bg-[var(--color-cream)] rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">{cat.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {Math.round(normalizedPreferences[type])}% of drinks
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-display font-bold text-[var(--color-wine)] mb-1">
                  {data.units}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {data.unitLabel}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  (~{data.servings} servings)
                </div>
              </div>
            );
          })}

          {/* Ice Card */}
          <div className="bg-blue-50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🧊</span>
              <div>
                <div className="font-semibold text-[var(--text-primary)]">Ice</div>
                <div className="text-xs text-[var(--text-muted)]">Essential</div>
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-blue-600 mb-1">
              {iceNeeded}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              pounds
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              (~{Math.ceil(iceNeeded / 10)} bags)
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-800 mb-2">Pro Tips</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            {(Object.entries(DRINK_CATEGORIES) as [DrinkType, typeof DRINK_CATEGORIES.beer][])
              .filter(([type]) => enabledDrinks[type])
              .map(([type, cat]) => (
                <li key={type}>• {cat.tips}</li>
              ))}
            <li>• Keep drinks chilled - have coolers or ice buckets ready.</li>
            <li>• Consider having backup stock (~10% extra) for popular items.</li>
          </ul>
        </div>
      </div>

      {/* Batch Cocktail Calculator */}
      <div className="card bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Batch Cocktail Calculator
        </h2>
        <p className="text-[var(--text-secondary)] text-sm mb-6">
          Scale up cocktail recipes for your party. Select a recipe and adjust the number of servings.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cocktail Selector */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Select Cocktail
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {POPULAR_COCKTAILS.map(cocktail => (
                <button
                  key={cocktail.name}
                  onClick={() => {
                    setSelectedCocktail(cocktail);
                    setBatchServings(cocktail.servings * 10);
                  }}
                  className={cn(
                    "p-3 rounded-lg text-sm font-medium transition-all text-left",
                    selectedCocktail?.name === cocktail.name
                      ? "bg-[var(--color-wine)] text-white"
                      : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                  )}
                >
                  {cocktail.name}
                </button>
              ))}
            </div>

            {selectedCocktail && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Number of Servings
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={selectedCocktail.servings}
                    max={selectedCocktail.servings * 20}
                    step={selectedCocktail.servings}
                    value={batchServings}
                    onChange={(e) => setBatchServings(Number(e.target.value))}
                    className="flex-1 accent-[var(--color-wine)]"
                  />
                  <span className="w-16 text-center font-semibold text-lg text-[var(--color-wine)]">
                    {batchServings}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Batch Recipe */}
          {selectedCocktail && batchCalculations && (
            <div className="bg-[var(--color-cream)] rounded-xl p-5">
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
                {selectedCocktail.name} × {batchServings}
              </h3>
              <div className="space-y-2">
                {batchCalculations.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-[var(--color-cream-dark)] last:border-0">
                    <span className="text-[var(--text-secondary)]">{ing.name}</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {ing.displayAmount}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-4">
                Tip: Mix all ingredients except carbonated components. Add sparkling/soda just before serving.
              </p>
            </div>
          )}

          {!selectedCocktail && (
            <div className="flex items-center justify-center bg-[var(--color-cream)] rounded-xl p-8 text-center">
              <div>
                <span className="text-4xl mb-3 block">🍹</span>
                <p className="text-[var(--text-muted)]">
                  Select a cocktail to calculate batch quantities
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
