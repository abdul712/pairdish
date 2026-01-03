/**
 * Caffeine Calculator Component
 *
 * Track daily caffeine intake and understand caffeine content in various beverages.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface Beverage {
  id: string;
  name: string;
  category: 'coffee' | 'tea' | 'soda' | 'energy' | 'other';
  caffeine: number; // mg per serving
  serving: string;
  servingMl: number;
  notes?: string;
}

interface ConsumedItem {
  beverageId: string;
  quantity: number;
}

// Beverage database with caffeine content
const beverages: Beverage[] = [
  // Coffee
  { id: 'espresso', name: 'Espresso', category: 'coffee', caffeine: 63, serving: '1 shot (30ml)', servingMl: 30, notes: 'Double shot = 126mg' },
  { id: 'drip-coffee', name: 'Drip Coffee', category: 'coffee', caffeine: 95, serving: '8 oz (240ml)', servingMl: 240 },
  { id: 'cold-brew', name: 'Cold Brew', category: 'coffee', caffeine: 200, serving: '12 oz (355ml)', servingMl: 355, notes: 'Higher concentration' },
  { id: 'latte', name: 'Latte', category: 'coffee', caffeine: 63, serving: '8 oz (240ml)', servingMl: 240, notes: 'Based on single shot' },
  { id: 'cappuccino', name: 'Cappuccino', category: 'coffee', caffeine: 63, serving: '6 oz (180ml)', servingMl: 180, notes: 'Based on single shot' },
  { id: 'americano', name: 'Americano', category: 'coffee', caffeine: 63, serving: '8 oz (240ml)', servingMl: 240, notes: 'Single shot + water' },
  { id: 'instant-coffee', name: 'Instant Coffee', category: 'coffee', caffeine: 62, serving: '8 oz (240ml)', servingMl: 240 },
  { id: 'decaf-coffee', name: 'Decaf Coffee', category: 'coffee', caffeine: 7, serving: '8 oz (240ml)', servingMl: 240, notes: 'Not caffeine-free!' },
  { id: 'french-press', name: 'French Press', category: 'coffee', caffeine: 107, serving: '8 oz (240ml)', servingMl: 240, notes: 'Longer steep time' },

  // Tea
  { id: 'black-tea', name: 'Black Tea', category: 'tea', caffeine: 47, serving: '8 oz (240ml)', servingMl: 240 },
  { id: 'green-tea', name: 'Green Tea', category: 'tea', caffeine: 28, serving: '8 oz (240ml)', servingMl: 240 },
  { id: 'white-tea', name: 'White Tea', category: 'tea', caffeine: 15, serving: '8 oz (240ml)', servingMl: 240 },
  { id: 'oolong-tea', name: 'Oolong Tea', category: 'tea', caffeine: 37, serving: '8 oz (240ml)', servingMl: 240 },
  { id: 'matcha', name: 'Matcha', category: 'tea', caffeine: 70, serving: '2g powder', servingMl: 60, notes: 'Ceremonial grade' },
  { id: 'chai-latte', name: 'Chai Latte', category: 'tea', caffeine: 50, serving: '12 oz (355ml)', servingMl: 355 },
  { id: 'earl-grey', name: 'Earl Grey', category: 'tea', caffeine: 40, serving: '8 oz (240ml)', servingMl: 240 },
  { id: 'herbal-tea', name: 'Herbal Tea', category: 'tea', caffeine: 0, serving: '8 oz (240ml)', servingMl: 240, notes: 'Caffeine-free' },

  // Soda
  { id: 'cola', name: 'Cola', category: 'soda', caffeine: 34, serving: '12 oz (355ml)', servingMl: 355 },
  { id: 'diet-cola', name: 'Diet Cola', category: 'soda', caffeine: 46, serving: '12 oz (355ml)', servingMl: 355 },
  { id: 'dr-pepper', name: 'Dr Pepper', category: 'soda', caffeine: 41, serving: '12 oz (355ml)', servingMl: 355 },
  { id: 'mountain-dew', name: 'Mountain Dew', category: 'soda', caffeine: 54, serving: '12 oz (355ml)', servingMl: 355 },
  { id: 'root-beer', name: 'Root Beer', category: 'soda', caffeine: 0, serving: '12 oz (355ml)', servingMl: 355, notes: 'Most brands caffeine-free' },

  // Energy Drinks
  { id: 'red-bull', name: 'Red Bull', category: 'energy', caffeine: 80, serving: '8.4 oz (250ml)', servingMl: 250 },
  { id: 'monster', name: 'Monster Energy', category: 'energy', caffeine: 160, serving: '16 oz (473ml)', servingMl: 473 },
  { id: 'bang', name: 'Bang Energy', category: 'energy', caffeine: 300, serving: '16 oz (473ml)', servingMl: 473, notes: 'Very high caffeine' },
  { id: 'celsius', name: 'Celsius', category: 'energy', caffeine: 200, serving: '12 oz (355ml)', servingMl: 355 },
  { id: '5-hour-energy', name: '5-Hour Energy', category: 'energy', caffeine: 200, serving: '2 oz (60ml)', servingMl: 60, notes: 'Concentrated shot' },

  // Other
  { id: 'dark-chocolate', name: 'Dark Chocolate', category: 'other', caffeine: 23, serving: '1 oz (28g)', servingMl: 0, notes: '70-85% cacao' },
  { id: 'milk-chocolate', name: 'Milk Chocolate', category: 'other', caffeine: 6, serving: '1 oz (28g)', servingMl: 0 },
  { id: 'coffee-ice-cream', name: 'Coffee Ice Cream', category: 'other', caffeine: 30, serving: '1/2 cup', servingMl: 0 },
  { id: 'caffeine-pill', name: 'Caffeine Pill', category: 'other', caffeine: 200, serving: '1 pill', servingMl: 0, notes: 'Standard dose' },
];

// Daily limits
const DAILY_LIMITS = {
  safe: 400, // FDA recommended max for healthy adults
  moderate: 200, // More conservative
  pregnant: 200, // FDA recommendation for pregnant women
  adolescent: 100, // For teens
};

const categoryInfo = {
  coffee: { label: 'Coffee', emoji: '☕', color: 'amber' },
  tea: { label: 'Tea', emoji: '🍵', color: 'green' },
  soda: { label: 'Soda', emoji: '🥤', color: 'blue' },
  energy: { label: 'Energy Drinks', emoji: '⚡', color: 'purple' },
  other: { label: 'Other', emoji: '🍫', color: 'gray' },
};

export default function CaffeineCalculator() {
  const [consumed, setConsumed] = useState<ConsumedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [limit, setLimit] = useState<'safe' | 'moderate' | 'pregnant' | 'adolescent'>('safe');

  // Calculate total caffeine
  const totalCaffeine = useMemo(() => {
    return consumed.reduce((total, item) => {
      const beverage = beverages.find((b) => b.id === item.beverageId);
      return total + (beverage ? beverage.caffeine * item.quantity : 0);
    }, 0);
  }, [consumed]);

  // Calculate percentage of daily limit
  const percentOfLimit = (totalCaffeine / DAILY_LIMITS[limit]) * 100;

  // Get status color
  const getStatusColor = () => {
    if (percentOfLimit < 50) return 'green';
    if (percentOfLimit < 75) return 'amber';
    if (percentOfLimit < 100) return 'orange';
    return 'red';
  };

  const statusColor = getStatusColor();

  // Filter beverages by category
  const filteredBeverages = selectedCategory
    ? beverages.filter((b) => b.category === selectedCategory)
    : beverages;

  const addBeverage = (beverageId: string) => {
    const existing = consumed.find((c) => c.beverageId === beverageId);
    if (existing) {
      setConsumed(
        consumed.map((c) => (c.beverageId === beverageId ? { ...c, quantity: c.quantity + 1 } : c))
      );
    } else {
      setConsumed([...consumed, { beverageId, quantity: 1 }]);
    }
  };

  const removeBeverage = (beverageId: string) => {
    const existing = consumed.find((c) => c.beverageId === beverageId);
    if (existing && existing.quantity > 1) {
      setConsumed(
        consumed.map((c) => (c.beverageId === beverageId ? { ...c, quantity: c.quantity - 1 } : c))
      );
    } else {
      setConsumed(consumed.filter((c) => c.beverageId !== beverageId));
    }
  };

  const clearAll = () => {
    setConsumed([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Daily Limit Selector */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Select Your Daily Limit
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(DAILY_LIMITS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setLimit(key as typeof limit)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all text-center',
                limit === key
                  ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                  : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]/50'
              )}
            >
              <span className="block text-xl font-bold text-[var(--text-primary)]">{value}mg</span>
              <span className="text-xs text-[var(--text-muted)] capitalize">
                {key === 'safe' ? 'Adults' : key === 'moderate' ? 'Conservative' : key}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Display */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Today's Caffeine
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {DAILY_LIMITS[limit] - totalCaffeine > 0
                ? `${DAILY_LIMITS[limit] - totalCaffeine}mg remaining`
                : `${totalCaffeine - DAILY_LIMITS[limit]}mg over limit`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-display font-bold text-[var(--text-primary)]">
              {totalCaffeine}
            </span>
            <span className="text-lg text-[var(--text-muted)]"> / {DAILY_LIMITS[limit]}mg</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-[var(--color-cream)] rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              statusColor === 'green' && 'bg-green-500',
              statusColor === 'amber' && 'bg-amber-500',
              statusColor === 'orange' && 'bg-orange-500',
              statusColor === 'red' && 'bg-red-500'
            )}
            style={{ width: `${Math.min(percentOfLimit, 100)}%` }}
          />
        </div>

        {/* Status Message */}
        <p
          className={cn(
            'mt-3 text-sm font-medium',
            statusColor === 'green' && 'text-green-600',
            statusColor === 'amber' && 'text-amber-600',
            statusColor === 'orange' && 'text-orange-600',
            statusColor === 'red' && 'text-red-600'
          )}
        >
          {percentOfLimit < 50 && 'You\'re well within your daily limit.'}
          {percentOfLimit >= 50 && percentOfLimit < 75 && 'Moderate intake - be mindful of additional caffeine.'}
          {percentOfLimit >= 75 && percentOfLimit < 100 && 'Approaching your daily limit - consider slowing down.'}
          {percentOfLimit >= 100 && 'You\'ve exceeded your daily limit. Consider stopping for today.'}
        </p>
      </div>

      {/* Consumed Items */}
      {consumed.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Today's Intake
            </h2>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-3">
            {consumed.map((item) => {
              const beverage = beverages.find((b) => b.id === item.beverageId);
              if (!beverage) return null;
              const cat = categoryInfo[beverage.category];
              return (
                <div
                  key={item.beverageId}
                  className="flex items-center justify-between p-3 bg-[var(--color-cream)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.emoji}</span>
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">{beverage.name}</span>
                      <span className="text-sm text-[var(--text-muted)] ml-2">
                        {beverage.caffeine * item.quantity}mg
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeBeverage(item.beverageId)}
                      className="w-8 h-8 rounded-full bg-white border border-[var(--color-cream-dark)] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => addBeverage(item.beverageId)}
                      className="w-8 h-8 rounded-full bg-white border border-[var(--color-cream-dark)] flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Add Beverages
        </h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              !selectedCategory
                ? 'bg-[var(--color-wine)] text-white'
                : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
            )}
          >
            All
          </button>
          {Object.entries(categoryInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1',
                selectedCategory === key
                  ? 'bg-[var(--color-wine)] text-white'
                  : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
              )}
            >
              <span>{info.emoji}</span>
              <span>{info.label}</span>
            </button>
          ))}
        </div>

        {/* Beverage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredBeverages.map((beverage) => {
            const cat = categoryInfo[beverage.category];
            const consumedQty = consumed.find((c) => c.beverageId === beverage.id)?.quantity || 0;
            return (
              <button
                key={beverage.id}
                onClick={() => addBeverage(beverage.id)}
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-cream-dark)] hover:border-[var(--color-wine)] hover:bg-[var(--color-wine-glow)] transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-cream)] flex items-center justify-center text-lg group-hover:bg-white transition-colors">
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)] truncate">
                      {beverage.name}
                    </span>
                    {consumedQty > 0 && (
                      <span className="px-2 py-0.5 bg-[var(--color-wine)] text-white text-xs rounded-full">
                        {consumedQty}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <span className="font-medium text-[var(--color-wine)]">{beverage.caffeine}mg</span>
                    <span>•</span>
                    <span className="truncate">{beverage.serving}</span>
                  </div>
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
                  className="text-[var(--color-cream-dark)] group-hover:text-[var(--color-wine)] transition-colors"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* Effects Timeline */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Caffeine Effects Timeline
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 text-center">
              <span className="text-sm font-medium text-[var(--text-primary)]">15-45 min</span>
            </div>
            <div className="flex-1 p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="font-medium text-green-700">Peak Alertness</span>
              <p className="text-sm text-green-600 mt-1">
                Caffeine reaches peak levels in your bloodstream. You feel most alert and focused.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-16 text-center">
              <span className="text-sm font-medium text-[var(--text-primary)]">3-5 hours</span>
            </div>
            <div className="flex-1 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="font-medium text-amber-700">Half-Life</span>
              <p className="text-sm text-amber-600 mt-1">
                Half of the caffeine is still in your system. Effects start to diminish.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-16 text-center">
              <span className="text-sm font-medium text-[var(--text-primary)]">6-8 hours</span>
            </div>
            <div className="flex-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium text-blue-700">Sleep Cutoff</span>
              <p className="text-sm text-blue-600 mt-1">
                Avoid caffeine within 6-8 hours of bedtime for quality sleep.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-16 text-center">
              <span className="text-sm font-medium text-[var(--text-primary)]">10-12 hours</span>
            </div>
            <div className="flex-1 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="font-medium text-purple-700">Full Elimination</span>
              <p className="text-sm text-purple-600 mt-1">
                Most caffeine has been metabolized. Ready for your next morning cup!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
