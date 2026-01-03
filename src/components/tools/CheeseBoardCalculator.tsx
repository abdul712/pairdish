/**
 * Cheese Board Calculator
 *
 * Calculate how much cheese and charcuterie to buy for your gathering.
 * Features:
 * - Guest count and event type inputs
 * - Cheese quantity recommendations by variety
 * - Charcuterie and accompaniment calculations
 * - Shopping list generation
 * - Budget estimates
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type EventType = 'appetizer' | 'main' | 'wine-party' | 'casual';
type CheeseType = 'soft' | 'semi-soft' | 'firm' | 'hard' | 'blue';

interface CheeseVariety {
  id: string;
  name: string;
  type: CheeseType;
  description: string;
  pairings: string[];
  priceRange: 'budget' | 'mid' | 'premium';
}

// Cheese varieties database
const CHEESE_VARIETIES: CheeseVariety[] = [
  // Soft
  { id: 'brie', name: 'Brie', type: 'soft', description: 'Creamy, mild, buttery', pairings: ['Crackers', 'Honey', 'Figs'], priceRange: 'mid' },
  { id: 'camembert', name: 'Camembert', type: 'soft', description: 'Earthy, mushroomy, rich', pairings: ['Baguette', 'Apples', 'Walnuts'], priceRange: 'mid' },
  { id: 'goat', name: 'Fresh Goat Cheese', type: 'soft', description: 'Tangy, creamy, bright', pairings: ['Honey', 'Herbs', 'Crackers'], priceRange: 'mid' },
  { id: 'burrata', name: 'Burrata', type: 'soft', description: 'Creamy, milky, fresh', pairings: ['Tomatoes', 'Basil', 'Olive oil'], priceRange: 'premium' },

  // Semi-soft
  { id: 'havarti', name: 'Havarti', type: 'semi-soft', description: 'Buttery, mild, smooth', pairings: ['Fruit', 'Crackers', 'Prosciutto'], priceRange: 'budget' },
  { id: 'fontina', name: 'Fontina', type: 'semi-soft', description: 'Nutty, mild, melty', pairings: ['Bread', 'Pears', 'Prosciutto'], priceRange: 'mid' },
  { id: 'muenster', name: 'Muenster', type: 'semi-soft', description: 'Mild, smooth, slightly tangy', pairings: ['Apples', 'Crackers', 'Beer'], priceRange: 'budget' },

  // Firm
  { id: 'cheddar', name: 'Aged Cheddar', type: 'firm', description: 'Sharp, tangy, complex', pairings: ['Apples', 'Chutney', 'Ale'], priceRange: 'mid' },
  { id: 'gruyere', name: 'Gruyère', type: 'firm', description: 'Nutty, sweet, slightly salty', pairings: ['Bread', 'Grapes', 'White wine'], priceRange: 'premium' },
  { id: 'gouda', name: 'Aged Gouda', type: 'firm', description: 'Caramelized, crystalline, rich', pairings: ['Dark chocolate', 'Nuts', 'Porter'], priceRange: 'mid' },
  { id: 'manchego', name: 'Manchego', type: 'firm', description: 'Nutty, tangy, sheep\'s milk', pairings: ['Quince paste', 'Almonds', 'Sherry'], priceRange: 'mid' },

  // Hard
  { id: 'parmesan', name: 'Parmigiano-Reggiano', type: 'hard', description: 'Savory, umami, crystalline', pairings: ['Balsamic', 'Prosciutto', 'Figs'], priceRange: 'premium' },
  { id: 'pecorino', name: 'Pecorino Romano', type: 'hard', description: 'Sharp, salty, tangy', pairings: ['Honey', 'Pears', 'Red wine'], priceRange: 'mid' },

  // Blue
  { id: 'gorgonzola', name: 'Gorgonzola', type: 'blue', description: 'Creamy, tangy, pungent', pairings: ['Honey', 'Walnuts', 'Pears'], priceRange: 'mid' },
  { id: 'roquefort', name: 'Roquefort', type: 'blue', description: 'Strong, salty, complex', pairings: ['Honey', 'Figs', 'Port'], priceRange: 'premium' },
  { id: 'stilton', name: 'Stilton', type: 'blue', description: 'Rich, creamy, bold', pairings: ['Port', 'Walnuts', 'Pears'], priceRange: 'premium' },
];

// Accompanying items
const ACCOMPANIMENTS = [
  { id: 'crackers', name: 'Assorted Crackers', unit: 'boxes', perPerson: 0.25, category: 'carbs' },
  { id: 'baguette', name: 'Baguette', unit: 'loaves', perPerson: 0.15, category: 'carbs' },
  { id: 'grapes', name: 'Grapes', unit: 'lbs', perPerson: 0.1, category: 'fruit' },
  { id: 'figs', name: 'Fresh/Dried Figs', unit: 'oz', perPerson: 0.5, category: 'fruit' },
  { id: 'apples', name: 'Sliced Apples', unit: 'apples', perPerson: 0.25, category: 'fruit' },
  { id: 'honey', name: 'Honey', unit: 'oz', perPerson: 0.3, category: 'sweet' },
  { id: 'jam', name: 'Fig/Apricot Jam', unit: 'jars', perPerson: 0.05, category: 'sweet' },
  { id: 'nuts', name: 'Mixed Nuts', unit: 'oz', perPerson: 0.5, category: 'nuts' },
  { id: 'olives', name: 'Olives', unit: 'oz', perPerson: 0.75, category: 'savory' },
  { id: 'prosciutto', name: 'Prosciutto', unit: 'oz', perPerson: 1, category: 'meat' },
  { id: 'salami', name: 'Salami', unit: 'oz', perPerson: 0.75, category: 'meat' },
  { id: 'cornichons', name: 'Cornichons', unit: 'oz', perPerson: 0.5, category: 'pickles' },
];

// Per-person cheese amounts by event type (in oz)
const CHEESE_PER_PERSON: Record<EventType, number> = {
  'appetizer': 2,      // Light nibbling before dinner
  'main': 4,           // Cheese is the main focus
  'wine-party': 3,     // Wine and cheese party
  'casual': 2.5,       // Casual grazing
};

// Event type labels
const EVENT_TYPES: { id: EventType; label: string; description: string }[] = [
  { id: 'appetizer', label: 'Appetizer Course', description: 'Light nibbles before a meal' },
  { id: 'main', label: 'Main Event', description: 'Cheese board is the star' },
  { id: 'wine-party', label: 'Wine & Cheese Party', description: 'Evening of wine and cheese' },
  { id: 'casual', label: 'Casual Gathering', description: 'Relaxed grazing' },
];

// Icons
const CheeseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"/>
    <path d="M2 10h20"/>
    <path d="M2 10v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10"/>
    <circle cx="7" cy="15" r="1.5"/>
    <circle cx="12" cy="17" r="1"/>
    <circle cx="17" cy="14" r="2"/>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect width="12" height="8" x="6" y="14"/>
  </svg>
);

export default function CheeseBoardCalculator() {
  // State
  const [guestCount, setGuestCount] = useState(8);
  const [eventType, setEventType] = useState<EventType>('wine-party');
  const [includeCharcuterie, setIncludeCharcuterie] = useState(true);
  const [selectedCheeses, setSelectedCheeses] = useState<string[]>(['brie', 'cheddar', 'gouda', 'gorgonzola']);

  // Calculations
  const calculations = useMemo(() => {
    const cheesePerPerson = CHEESE_PER_PERSON[eventType];
    const totalCheeseOz = guestCount * cheesePerPerson;
    const varietyCount = selectedCheeses.length || 3; // Minimum 3 varieties recommended
    const cheesePerVariety = totalCheeseOz / varietyCount;

    // Get selected cheese details
    const cheeses = selectedCheeses.map(id => {
      const cheese = CHEESE_VARIETIES.find(c => c.id === id);
      return {
        ...cheese,
        amount: cheesePerVariety,
      };
    }).filter(Boolean);

    // Calculate accompaniments
    const accompaniments = ACCOMPANIMENTS.map(item => {
      let amount = guestCount * item.perPerson;
      // Adjust for event type
      if (eventType === 'main') amount *= 1.5;
      if (eventType === 'appetizer') amount *= 0.7;

      // Skip meat if not including charcuterie
      if (item.category === 'meat' && !includeCharcuterie) {
        return null;
      }

      return {
        ...item,
        amount: Math.ceil(amount * 10) / 10, // Round up to 1 decimal
      };
    }).filter(Boolean);

    // Budget estimates
    const cheeseCost = {
      budget: totalCheeseOz * 0.75,    // ~$12/lb
      mid: totalCheeseOz * 1.25,       // ~$20/lb
      premium: totalCheeseOz * 2,      // ~$32/lb
    };

    const accompanimentCost = guestCount * (includeCharcuterie ? 4 : 2);

    return {
      totalCheeseOz,
      cheesePerVariety,
      cheeses,
      accompaniments,
      budget: {
        low: Math.round(cheeseCost.budget + accompanimentCost),
        mid: Math.round(cheeseCost.mid + accompanimentCost),
        high: Math.round(cheeseCost.premium + accompanimentCost),
      },
    };
  }, [guestCount, eventType, selectedCheeses, includeCharcuterie]);

  // Toggle cheese selection
  const toggleCheese = (id: string) => {
    setSelectedCheeses(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  // Group cheeses by type
  const cheesesByType = useMemo(() => {
    const groups: Record<CheeseType, CheeseVariety[]> = {
      soft: [],
      'semi-soft': [],
      firm: [],
      hard: [],
      blue: [],
    };

    CHEESE_VARIETIES.forEach(cheese => {
      groups[cheese.type].push(cheese);
    });

    return groups;
  }, []);

  const typeLabels: Record<CheeseType, string> = {
    soft: 'Soft & Creamy',
    'semi-soft': 'Semi-Soft',
    firm: 'Firm',
    hard: 'Hard & Aged',
    blue: 'Blue',
  };

  // Print shopping list
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-[var(--color-wine)]">
            <CheeseIcon />
          </span>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Cheese Board Calculator
          </h2>
        </div>

        {/* Guest Count & Event Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Guest Count */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Number of Guests
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="50"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-[var(--color-cream-dark)] rounded-lg appearance-none cursor-pointer accent-[var(--color-wine)]"
              />
              <div className="w-16 h-12 flex items-center justify-center bg-[var(--color-wine-glow)] rounded-lg">
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
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Charcuterie Toggle */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCharcuterie}
              onChange={(e) => setIncludeCharcuterie(e.target.checked)}
              className="w-5 h-5 rounded border-[var(--color-cream-dark)] text-[var(--color-wine)] focus:ring-[var(--color-wine)]"
            />
            <span className="text-[var(--text-primary)] font-medium">Include Charcuterie (Prosciutto, Salami)</span>
          </label>
        </div>

        {/* Cheese Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            Select Your Cheeses <span className="text-[var(--text-muted)]">(recommended: 3-5 varieties)</span>
          </label>

          {Object.entries(cheesesByType).map(([type, cheeses]) => (
            <div key={type} className="mb-4">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                {typeLabels[type as CheeseType]}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cheeses.map(cheese => (
                  <button
                    key={cheese.id}
                    onClick={() => toggleCheese(cheese.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedCheeses.includes(cheese.id)
                        ? "bg-[var(--color-wine)] text-white"
                        : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                    )}
                    title={cheese.description}
                  >
                    {cheese.name}
                    {cheese.priceRange === 'premium' && ' ★'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cheese Quantities */}
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Cheese Shopping List
          </h3>

          <div className="mb-4 p-4 bg-[var(--color-wine-glow)] rounded-lg text-center">
            <div className="text-3xl font-bold text-[var(--color-wine)]">
              {Math.round(calculations.totalCheeseOz)} oz
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              Total cheese ({(calculations.totalCheeseOz / 16).toFixed(1)} lbs)
            </div>
          </div>

          <div className="space-y-3">
            {calculations.cheeses.map((cheese: any) => (
              <div key={cheese?.id} className="flex items-center justify-between p-3 bg-[var(--color-cream)] rounded-lg">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">{cheese?.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{cheese?.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--color-wine)]">
                    {Math.round(cheese?.amount || 0)} oz
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    ~{((cheese?.amount || 0) / 16).toFixed(2)} lb
                  </div>
                </div>
              </div>
            ))}

            {selectedCheeses.length === 0 && (
              <div className="text-center py-4 text-[var(--text-muted)]">
                Select cheeses above to see quantities
              </div>
            )}
          </div>
        </div>

        {/* Accompaniments */}
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Accompaniments
          </h3>

          <div className="space-y-2">
            {calculations.accompaniments.map((item: any) => (
              <div key={item?.id} className="flex items-center justify-between py-2 border-b border-[var(--color-cream)] last:border-0">
                <span className="text-[var(--text-secondary)]">{item?.name}</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {item?.amount} {item?.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Estimates */}
      <div className="card bg-white p-6 mb-8">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Budget Estimates
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">${calculations.budget.low}</div>
            <div className="text-sm text-green-600">Budget-Friendly</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Grocery store cheeses</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border-2 border-amber-400">
            <div className="text-2xl font-bold text-amber-700">${calculations.budget.mid}</div>
            <div className="text-sm text-amber-600">Recommended</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Quality selections</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">${calculations.budget.high}</div>
            <div className="text-sm text-purple-600">Premium</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Artisan & imported</div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handlePrint}
          className="btn bg-[var(--color-charcoal)] text-white hover:bg-[var(--color-charcoal)]/90 flex items-center gap-2"
        >
          <PrintIcon />
          Print Shopping List
        </button>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Building the Perfect Board
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Include a variety of textures (soft, firm, hard)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Balance mild and strong flavors</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Mix different milk types (cow, goat, sheep)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Let cheese sit at room temperature for 30-60 minutes before serving</span>
            </li>
          </ul>
        </div>

        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Serving Tips
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Arrange from mild to strong in a clockwise pattern</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Use separate knives for each cheese to avoid flavor mixing</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Label cheeses for guests unfamiliar with varieties</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Start tasting with milder cheeses, end with blue</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
