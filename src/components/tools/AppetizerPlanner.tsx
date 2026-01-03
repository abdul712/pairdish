/**
 * Appetizer Quantity Planner
 *
 * Calculate how many appetizers to make or order for any event.
 * Features:
 * - Guest count and event type inputs
 * - Appetizer style selection (passed, stationed, mixed)
 * - Variety recommendations
 * - Quantity per appetizer type
 * - Shopping/prep list
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type EventType = 'cocktail' | 'pre-dinner' | 'reception' | 'party' | 'casual';
type AppetizerStyle = 'passed' | 'stationed' | 'mixed';
type AppetizerCategory = 'hot' | 'cold' | 'dips' | 'finger-food';

interface AppetizerItem {
  id: string;
  name: string;
  category: AppetizerCategory;
  servingSize: string;
  prepNote: string;
  dietaryTags?: string[];
}

// Appetizer database
const APPETIZER_IDEAS: AppetizerItem[] = [
  // Hot
  { id: 'meatballs', name: 'Mini Meatballs', category: 'hot', servingSize: '2-3 per person', prepNote: 'Make ahead, reheat in sauce', dietaryTags: [] },
  { id: 'stuffed-mushrooms', name: 'Stuffed Mushrooms', category: 'hot', servingSize: '2 per person', prepNote: 'Prep day before, bake before serving', dietaryTags: ['vegetarian'] },
  { id: 'pigs-blanket', name: 'Pigs in a Blanket', category: 'hot', servingSize: '3 per person', prepNote: 'Assemble ahead, bake from frozen', dietaryTags: [] },
  { id: 'bruschetta', name: 'Bruschetta', category: 'hot', servingSize: '2 per person', prepNote: 'Toast bread ahead, add topping just before', dietaryTags: ['vegetarian'] },
  { id: 'spring-rolls', name: 'Spring Rolls', category: 'hot', servingSize: '2 per person', prepNote: 'Buy frozen or make ahead, fry before serving', dietaryTags: ['vegan'] },
  { id: 'coconut-shrimp', name: 'Coconut Shrimp', category: 'hot', servingSize: '3 per person', prepNote: 'Bread ahead, fry just before serving', dietaryTags: [] },
  { id: 'spinach-puffs', name: 'Spinach Puffs', category: 'hot', servingSize: '2 per person', prepNote: 'Freeze assembled, bake from frozen', dietaryTags: ['vegetarian'] },
  { id: 'bacon-dates', name: 'Bacon-Wrapped Dates', category: 'hot', servingSize: '2-3 per person', prepNote: 'Wrap ahead, bake before serving', dietaryTags: [] },

  // Cold
  { id: 'deviled-eggs', name: 'Deviled Eggs', category: 'cold', servingSize: '2 halves per person', prepNote: 'Make day ahead, keep refrigerated', dietaryTags: ['vegetarian', 'gluten-free'] },
  { id: 'shrimp-cocktail', name: 'Shrimp Cocktail', category: 'cold', servingSize: '4-5 shrimp per person', prepNote: 'Buy precooked, serve chilled', dietaryTags: ['gluten-free'] },
  { id: 'caprese-skewers', name: 'Caprese Skewers', category: 'cold', servingSize: '2-3 per person', prepNote: 'Assemble day of, drizzle with balsamic', dietaryTags: ['vegetarian', 'gluten-free'] },
  { id: 'cucumber-bites', name: 'Cucumber Bites', category: 'cold', servingSize: '3 per person', prepNote: 'Slice cucumbers ahead, top day of', dietaryTags: ['vegetarian', 'gluten-free', 'vegan'] },
  { id: 'prosciutto-melon', name: 'Prosciutto & Melon', category: 'cold', servingSize: '2 pieces per person', prepNote: 'Prep morning of event', dietaryTags: ['gluten-free'] },
  { id: 'cheese-platter', name: 'Cheese Platter', category: 'cold', servingSize: '2 oz cheese per person', prepNote: 'Set out 30 min before serving', dietaryTags: ['vegetarian', 'gluten-free'] },
  { id: 'crudites', name: 'Crudités (Veggie Tray)', category: 'cold', servingSize: '4-5 oz per person', prepNote: 'Cut veggies day before, store in water', dietaryTags: ['vegan', 'gluten-free'] },
  { id: 'smoked-salmon', name: 'Smoked Salmon Canapés', category: 'cold', servingSize: '2 per person', prepNote: 'Assemble up to 2 hours ahead', dietaryTags: [] },

  // Dips
  { id: 'spinach-dip', name: 'Spinach Artichoke Dip', category: 'dips', servingSize: '2-3 oz per person', prepNote: 'Make ahead, reheat before serving', dietaryTags: ['vegetarian'] },
  { id: 'guacamole', name: 'Guacamole', category: 'dips', servingSize: '2-3 oz per person', prepNote: 'Make same day for freshness', dietaryTags: ['vegan', 'gluten-free'] },
  { id: 'hummus', name: 'Hummus', category: 'dips', servingSize: '2-3 oz per person', prepNote: 'Make 2-3 days ahead, flavors develop', dietaryTags: ['vegan', 'gluten-free'] },
  { id: 'buffalo-dip', name: 'Buffalo Chicken Dip', category: 'dips', servingSize: '2-3 oz per person', prepNote: 'Make ahead, bake before serving', dietaryTags: [] },
  { id: 'salsa', name: 'Fresh Salsa', category: 'dips', servingSize: '2-3 oz per person', prepNote: 'Make day of for best flavor', dietaryTags: ['vegan', 'gluten-free'] },
  { id: 'tzatziki', name: 'Tzatziki', category: 'dips', servingSize: '2-3 oz per person', prepNote: 'Make day before, flavors meld', dietaryTags: ['vegetarian', 'gluten-free'] },

  // Finger Foods
  { id: 'chips-crackers', name: 'Chips & Crackers', category: 'finger-food', servingSize: '1-2 oz per person', prepNote: 'Buy and set out', dietaryTags: [] },
  { id: 'mixed-nuts', name: 'Mixed Nuts', category: 'finger-food', servingSize: '1 oz per person', prepNote: 'Buy or roast ahead', dietaryTags: ['vegan', 'gluten-free'] },
  { id: 'olives', name: 'Marinated Olives', category: 'finger-food', servingSize: '1-2 oz per person', prepNote: 'Buy or marinate 2 days ahead', dietaryTags: ['vegan', 'gluten-free'] },
  { id: 'pickles', name: 'Pickles & Cornichons', category: 'finger-food', servingSize: '1-2 oz per person', prepNote: 'Buy and set out', dietaryTags: ['vegan', 'gluten-free'] },
];

// Per-person appetizer counts by event type
const APPETIZERS_PER_PERSON: Record<EventType, { min: number; max: number }> = {
  'cocktail': { min: 8, max: 12 },      // Main event, 2-3 hours
  'pre-dinner': { min: 4, max: 6 },     // Before a meal
  'reception': { min: 6, max: 10 },     // Wedding/formal reception
  'party': { min: 10, max: 15 },        // Long party with apps as food
  'casual': { min: 5, max: 8 },         // Casual get-together
};

// Event type labels
const EVENT_TYPES: { id: EventType; label: string; description: string }[] = [
  { id: 'cocktail', label: 'Cocktail Party', description: '2-3 hours, appetizers are the food' },
  { id: 'pre-dinner', label: 'Pre-Dinner Apps', description: 'Light nibbles before a meal' },
  { id: 'reception', label: 'Reception', description: 'Wedding or formal event' },
  { id: 'party', label: 'All-Evening Party', description: '3+ hours, apps replace dinner' },
  { id: 'casual', label: 'Casual Gathering', description: 'Relaxed get-together' },
];

const STYLE_OPTIONS: { id: AppetizerStyle; label: string; description: string }[] = [
  { id: 'passed', label: 'Passed Appetizers', description: 'Served by staff, bite-sized' },
  { id: 'stationed', label: 'Stationed/Displayed', description: 'Self-serve platters and displays' },
  { id: 'mixed', label: 'Mixed', description: 'Combination of both' },
];

// Category labels
const CATEGORY_LABELS: Record<AppetizerCategory, { label: string; icon: string }> = {
  hot: { label: 'Hot Appetizers', icon: '🔥' },
  cold: { label: 'Cold Appetizers', icon: '❄️' },
  dips: { label: 'Dips & Spreads', icon: '🫕' },
  'finger-food': { label: 'Finger Foods', icon: '🥜' },
};

// Icons
const PlatterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5v8c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
    <path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function AppetizerPlanner() {
  // State
  const [guestCount, setGuestCount] = useState(20);
  const [eventType, setEventType] = useState<EventType>('cocktail');
  const [style, setStyle] = useState<AppetizerStyle>('mixed');
  const [selectedApps, setSelectedApps] = useState<string[]>(['stuffed-mushrooms', 'deviled-eggs', 'spinach-dip', 'shrimp-cocktail', 'pigs-blanket', 'crudites']);

  // Calculations
  const calculations = useMemo(() => {
    const appRange = APPETIZERS_PER_PERSON[eventType];
    const avgApps = (appRange.min + appRange.max) / 2;
    const totalPieces = Math.round(guestCount * avgApps);

    // Recommendations
    let varietyMin = 3;
    let varietyMax = 5;
    if (guestCount > 30) {
      varietyMin = 5;
      varietyMax = 8;
    }
    if (guestCount > 50) {
      varietyMin = 6;
      varietyMax = 10;
    }

    // Hot/cold ratio based on style
    let hotRatio = 0.5;
    if (style === 'passed') hotRatio = 0.6; // More hot for passed
    if (style === 'stationed') hotRatio = 0.4; // More cold for stationed

    // Calculate per-appetizer quantities
    const selectedCount = selectedApps.length || varietyMin;
    const piecesPerApp = Math.ceil(totalPieces / selectedCount);

    const appDetails = selectedApps.map(id => {
      const app = APPETIZER_IDEAS.find(a => a.id === id);
      if (!app) return null;
      return {
        ...app,
        quantity: piecesPerApp,
      };
    }).filter(Boolean);

    return {
      totalPieces,
      perPerson: { min: appRange.min, max: appRange.max },
      varietyRange: { min: varietyMin, max: varietyMax },
      hotRatio,
      piecesPerApp,
      apps: appDetails,
    };
  }, [guestCount, eventType, style, selectedApps]);

  // Toggle appetizer selection
  const toggleApp = (id: string) => {
    setSelectedApps(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  // Group appetizers by category
  const appsByCategory = useMemo(() => {
    const groups: Record<AppetizerCategory, AppetizerItem[]> = {
      hot: [],
      cold: [],
      dips: [],
      'finger-food': [],
    };

    APPETIZER_IDEAS.forEach(app => {
      groups[app.category].push(app);
    });

    return groups;
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-[var(--color-wine)]">
            <PlatterIcon />
          </span>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Appetizer Quantity Planner
          </h2>
        </div>

        {/* Guest Count & Event Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Guest Count */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Number of Guests
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-[var(--color-cream-dark)] rounded-lg appearance-none cursor-pointer accent-[var(--color-wine)]"
              />
              <div className="w-14 h-12 flex items-center justify-center bg-[var(--color-wine-glow)] rounded-lg">
                <span className="text-xl font-bold text-[var(--color-wine)]">{guestCount}</span>
              </div>
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="w-full p-3 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {EVENT_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Serving Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as AppetizerStyle)}
              className="w-full p-3 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {STYLE_OPTIONS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="bg-[var(--color-wine-glow)] rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[var(--color-wine)]">{calculations.totalPieces}</div>
              <div className="text-sm text-[var(--text-muted)]">Total Pieces</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-wine)]">{calculations.perPerson.min}-{calculations.perPerson.max}</div>
              <div className="text-sm text-[var(--text-muted)]">Per Person</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-wine)]">{calculations.varietyRange.min}-{calculations.varietyRange.max}</div>
              <div className="text-sm text-[var(--text-muted)]">Varieties Recommended</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-wine)]">{selectedApps.length}</div>
              <div className="text-sm text-[var(--text-muted)]">Selected</div>
            </div>
          </div>
        </div>

        {/* Appetizer Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">
            Select Your Appetizers
          </label>

          {Object.entries(appsByCategory).map(([category, apps]) => (
            <div key={category} className="mb-6">
              <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-3 flex items-center gap-2">
                <span>{CATEGORY_LABELS[category as AppetizerCategory].icon}</span>
                <span>{CATEGORY_LABELS[category as AppetizerCategory].label}</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {apps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={cn(
                      "p-3 rounded-lg text-left text-sm transition-all border",
                      selectedApps.includes(app.id)
                        ? "bg-[var(--color-wine)] text-white border-[var(--color-wine)]"
                        : "bg-white text-[var(--text-secondary)] border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{app.name}</span>
                      {selectedApps.includes(app.id) && <CheckIcon />}
                    </div>
                    {app.dietaryTags && app.dietaryTags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {app.dietaryTags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded",
                              selectedApps.includes(app.id)
                                ? "bg-white/20"
                                : "bg-green-100 text-green-700"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {selectedApps.length > 0 && (
        <div className="card bg-white p-6 md:p-8 mb-8">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-6">
            Your Appetizer Plan
          </h3>

          <div className="space-y-4">
            {calculations.apps.map((app: any) => (
              <div
                key={app?.id}
                className="flex items-start justify-between p-4 bg-[var(--color-cream)] rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)]">{app?.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-white rounded text-[var(--text-muted)]">
                      {CATEGORY_LABELS[app?.category as AppetizerCategory].icon}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--text-muted)] mt-1">
                    {app?.prepNote}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--color-wine)]">
                    {app?.quantity}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">pieces</div>
                </div>
              </div>
            ))}
          </div>

          {/* Balance indicator */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">Balance Check</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-amber-700">Hot appetizers: </span>
                <span className="font-medium">
                  {calculations.apps.filter((a: any) => a?.category === 'hot').length}
                </span>
              </div>
              <div>
                <span className="text-amber-700">Cold appetizers: </span>
                <span className="font-medium">
                  {calculations.apps.filter((a: any) => a?.category === 'cold').length}
                </span>
              </div>
              <div>
                <span className="text-amber-700">Dips: </span>
                <span className="font-medium">
                  {calculations.apps.filter((a: any) => a?.category === 'dips').length}
                </span>
              </div>
              <div>
                <span className="text-amber-700">Finger foods: </span>
                <span className="font-medium">
                  {calculations.apps.filter((a: any) => a?.category === 'finger-food').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Planning Tips
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Plan for 2/3 of guests being heavy eaters</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Include at least one vegetarian and one gluten-free option</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Balance hot and cold for easier prep timing</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Prep as much as possible ahead of time</span>
            </li>
          </ul>
        </div>

        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Timing Guidelines
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Serve hot apps every 15-20 minutes for passed service</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Replenish platters when 1/3 empty</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Set out cold apps 30 minutes before guests arrive</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>For 2+ hour events, stagger hot items over time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
