/**
 * Cheese Board Builder Component
 *
 * Interactive step-by-step cheese board builder.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface Cheese {
  id: string;
  name: string;
  type: 'soft' | 'semi-soft' | 'firm' | 'hard' | 'blue';
  milk: 'cow' | 'goat' | 'sheep' | 'mixed';
  flavor: string;
  texture: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  pairings: string[];
}

interface Accompaniment {
  id: string;
  name: string;
  category: 'fruit' | 'meat' | 'cracker' | 'nut' | 'condiment' | 'vegetable';
  pairsWith: string[];
  tip?: string;
}

// Cheese database
const cheeses: Cheese[] = [
  // Soft
  { id: 'brie', name: 'Brie', type: 'soft', milk: 'cow', flavor: 'Buttery, earthy, mushroomy', texture: 'Creamy, spreadable', intensity: 2, pairings: ['fruit', 'honey', 'crackers', 'nuts'] },
  { id: 'camembert', name: 'Camembert', type: 'soft', milk: 'cow', flavor: 'Rich, earthy, garlicky', texture: 'Oozy, creamy', intensity: 3, pairings: ['fruit', 'bread', 'nuts', 'charcuterie'] },
  { id: 'burrata', name: 'Burrata', type: 'soft', milk: 'cow', flavor: 'Fresh, milky, delicate', texture: 'Creamy center', intensity: 1, pairings: ['tomatoes', 'olive oil', 'basil', 'prosciutto'] },
  { id: 'goat-cheese', name: 'Chèvre (Goat)', type: 'soft', milk: 'goat', flavor: 'Tangy, citrusy, bright', texture: 'Creamy, crumbly', intensity: 3, pairings: ['honey', 'fruit', 'nuts', 'herbs'] },

  // Semi-soft
  { id: 'havarti', name: 'Havarti', type: 'semi-soft', milk: 'cow', flavor: 'Buttery, mild, tangy', texture: 'Supple, creamy', intensity: 2, pairings: ['fruit', 'crackers', 'sandwiches'] },
  { id: 'fontina', name: 'Fontina', type: 'semi-soft', milk: 'cow', flavor: 'Nutty, earthy, fruity', texture: 'Semi-soft, melty', intensity: 3, pairings: ['bread', 'fruit', 'charcuterie'] },
  { id: 'taleggio', name: 'Taleggio', type: 'semi-soft', milk: 'cow', flavor: 'Pungent, tangy, fruity', texture: 'Soft, sticky rind', intensity: 4, pairings: ['fruit', 'honey', 'walnuts', 'risotto'] },

  // Firm
  { id: 'cheddar', name: 'Aged Cheddar', type: 'firm', milk: 'cow', flavor: 'Sharp, nutty, complex', texture: 'Firm, crumbly', intensity: 4, pairings: ['apple', 'crackers', 'chutney', 'ale'] },
  { id: 'gruyere', name: 'Gruyère', type: 'firm', milk: 'cow', flavor: 'Nutty, sweet, slightly salty', texture: 'Firm, smooth', intensity: 3, pairings: ['fruit', 'bread', 'nuts', 'wine'] },
  { id: 'manchego', name: 'Manchego', type: 'firm', milk: 'sheep', flavor: 'Nutty, tangy, caramel notes', texture: 'Firm, oily', intensity: 3, pairings: ['quince paste', 'olives', 'almonds', 'jamón'] },
  { id: 'gouda', name: 'Aged Gouda', type: 'firm', milk: 'cow', flavor: 'Caramel, butterscotch, nutty', texture: 'Crystalline, firm', intensity: 4, pairings: ['fruit', 'dark chocolate', 'beer', 'walnuts'] },
  { id: 'comte', name: 'Comté', type: 'firm', milk: 'cow', flavor: 'Nutty, fruity, floral', texture: 'Firm, smooth', intensity: 3, pairings: ['bread', 'fruit', 'nuts', 'wine'] },

  // Hard
  { id: 'parmesan', name: 'Parmigiano-Reggiano', type: 'hard', milk: 'cow', flavor: 'Sharp, nutty, umami', texture: 'Granular, crystalline', intensity: 5, pairings: ['balsamic', 'pear', 'honey', 'prosciutto'] },
  { id: 'pecorino', name: 'Pecorino Romano', type: 'hard', milk: 'sheep', flavor: 'Salty, tangy, sharp', texture: 'Hard, crumbly', intensity: 5, pairings: ['honey', 'pear', 'figs', 'walnuts'] },

  // Blue
  { id: 'gorgonzola', name: 'Gorgonzola', type: 'blue', milk: 'cow', flavor: 'Creamy, tangy, piquant', texture: 'Creamy with blue veins', intensity: 4, pairings: ['honey', 'pear', 'walnuts', 'port'] },
  { id: 'roquefort', name: 'Roquefort', type: 'blue', milk: 'sheep', flavor: 'Intense, tangy, salty', texture: 'Creamy, crumbly', intensity: 5, pairings: ['honey', 'figs', 'walnuts', 'sauternes'] },
  { id: 'stilton', name: 'Stilton', type: 'blue', milk: 'cow', flavor: 'Rich, complex, slightly sweet', texture: 'Crumbly, creamy', intensity: 4, pairings: ['port', 'pear', 'walnuts', 'honey'] },
];

// Accompaniments database
const accompaniments: Accompaniment[] = [
  // Fruits
  { id: 'grapes', name: 'Grapes', category: 'fruit', pairsWith: ['all'], tip: 'Red and green for variety' },
  { id: 'apple', name: 'Apple Slices', category: 'fruit', pairsWith: ['cheddar', 'brie', 'gouda'], tip: 'Toss with lemon to prevent browning' },
  { id: 'pear', name: 'Pear Slices', category: 'fruit', pairsWith: ['gorgonzola', 'parmesan', 'stilton'], tip: 'Slightly firm pears work best' },
  { id: 'figs', name: 'Fresh or Dried Figs', category: 'fruit', pairsWith: ['goat-cheese', 'blue', 'brie'], tip: 'Fresh when in season, dried otherwise' },
  { id: 'berries', name: 'Fresh Berries', category: 'fruit', pairsWith: ['brie', 'goat-cheese', 'soft'], tip: 'Blackberries and raspberries pair best' },
  { id: 'quince-paste', name: 'Quince Paste (Membrillo)', category: 'fruit', pairsWith: ['manchego', 'aged-cheeses'], tip: 'Cut into small cubes' },
  { id: 'apricots', name: 'Dried Apricots', category: 'fruit', pairsWith: ['goat-cheese', 'brie', 'blue'], tip: 'Great for sweetness contrast' },

  // Meats
  { id: 'prosciutto', name: 'Prosciutto', category: 'meat', pairsWith: ['parmesan', 'burrata', 'melon'], tip: 'Drape loosely for visual appeal' },
  { id: 'salami', name: 'Salami', category: 'meat', pairsWith: ['cheddar', 'gouda', 'manchego'], tip: 'Mix spicy and mild varieties' },
  { id: 'soppressata', name: 'Soppressata', category: 'meat', pairsWith: ['provolone', 'fontina', 'firm'], tip: 'Slice thin for best texture' },
  { id: 'coppa', name: 'Coppa', category: 'meat', pairsWith: ['gruyere', 'comte', 'firm'], tip: 'Rich flavor, pairs with nutty cheeses' },
  { id: 'jamon', name: 'Jamón Serrano', category: 'meat', pairsWith: ['manchego', 'spanish-cheeses'], tip: 'The classic Spanish pairing' },

  // Crackers & Bread
  { id: 'water-crackers', name: 'Water Crackers', category: 'cracker', pairsWith: ['all'], tip: 'Neutral, lets cheese shine' },
  { id: 'crostini', name: 'Crostini', category: 'cracker', pairsWith: ['soft', 'spreadable'], tip: 'Toast lightly, rub with garlic' },
  { id: 'baguette', name: 'Baguette Slices', category: 'cracker', pairsWith: ['brie', 'camembert', 'soft'], tip: 'Day-old works great toasted' },
  { id: 'fig-crackers', name: 'Fig & Olive Crackers', category: 'cracker', pairsWith: ['blue', 'goat-cheese'], tip: 'Adds sweetness and texture' },
  { id: 'seeded-crackers', name: 'Seeded Crackers', category: 'cracker', pairsWith: ['cheddar', 'gouda', 'firm'], tip: 'Adds crunch and nutrition' },

  // Nuts
  { id: 'almonds', name: 'Marcona Almonds', category: 'nut', pairsWith: ['manchego', 'spanish-cheeses', 'firm'], tip: 'Lightly salted, roasted' },
  { id: 'walnuts', name: 'Walnuts', category: 'nut', pairsWith: ['blue', 'gorgonzola', 'brie'], tip: 'Toast lightly to enhance flavor' },
  { id: 'pecans', name: 'Candied Pecans', category: 'nut', pairsWith: ['goat-cheese', 'brie', 'soft'], tip: 'Sweet contrast to tangy cheese' },
  { id: 'pistachios', name: 'Pistachios', category: 'nut', pairsWith: ['parmesan', 'aged-cheeses'], tip: 'Shelled for easy snacking' },

  // Condiments
  { id: 'honey', name: 'Raw Honey', category: 'condiment', pairsWith: ['blue', 'goat-cheese', 'brie'], tip: 'Drizzle or serve in small pot' },
  { id: 'fig-jam', name: 'Fig Jam', category: 'condiment', pairsWith: ['brie', 'goat-cheese', 'blue'], tip: 'Sweet, pairs with any cheese' },
  { id: 'mustard', name: 'Whole Grain Mustard', category: 'condiment', pairsWith: ['cheddar', 'gruyere', 'firm'], tip: 'Tangy, balances rich cheeses' },
  { id: 'chutney', name: 'Mango Chutney', category: 'condiment', pairsWith: ['cheddar', 'firm-cheeses'], tip: 'Sweet-spicy combination' },
  { id: 'balsamic', name: 'Balsamic Glaze', category: 'condiment', pairsWith: ['parmesan', 'burrata', 'fresh'], tip: 'Drizzle sparingly' },

  // Vegetables
  { id: 'olives', name: 'Mixed Olives', category: 'vegetable', pairsWith: ['manchego', 'feta', 'mediterranean'], tip: 'Mix colors and sizes' },
  { id: 'cornichons', name: 'Cornichons', category: 'vegetable', pairsWith: ['pate', 'cheddar', 'firm'], tip: 'Tangy, cuts richness' },
  { id: 'peppers', name: 'Roasted Peppers', category: 'vegetable', pairsWith: ['goat-cheese', 'feta', 'soft'], tip: 'Jarred or homemade' },
  { id: 'artichokes', name: 'Marinated Artichokes', category: 'vegetable', pairsWith: ['firm', 'italian-cheeses'], tip: 'Mediterranean boards' },
];

// Board styles
const boardStyles = [
  { id: 'classic', name: 'Classic Elegance', description: 'Traditional mix of textures and flavors', cheesesCount: 4, accompanimentCount: 8 },
  { id: 'minimal', name: 'Minimalist', description: 'Focused selection for intimate gatherings', cheesesCount: 3, accompanimentCount: 5 },
  { id: 'abundant', name: 'Abundant Feast', description: 'Generous spread for larger parties', cheesesCount: 6, accompanimentCount: 12 },
];

export default function CheeseBoardBuilder() {
  const [step, setStep] = useState(1);
  const [boardStyle, setBoardStyle] = useState<string>('classic');
  const [selectedCheeses, setSelectedCheeses] = useState<string[]>([]);
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(6);

  const currentStyle = boardStyles.find((s) => s.id === boardStyle)!;

  // Get cheese types for variety check
  const selectedCheeseTypes = useMemo(() => {
    return selectedCheeses.map((id) => cheeses.find((c) => c.id === id)?.type).filter(Boolean);
  }, [selectedCheeses]);

  // Get accompaniment categories for variety check
  const selectedAccompanimentCategories = useMemo(() => {
    return selectedAccompaniments.map((id) => accompaniments.find((a) => a.id === id)?.category).filter(Boolean);
  }, [selectedAccompaniments]);

  const handleCheeseToggle = (id: string) => {
    if (selectedCheeses.includes(id)) {
      setSelectedCheeses(selectedCheeses.filter((c) => c !== id));
    } else if (selectedCheeses.length < currentStyle.cheesesCount) {
      setSelectedCheeses([...selectedCheeses, id]);
    }
  };

  const handleAccompanimentToggle = (id: string) => {
    if (selectedAccompaniments.includes(id)) {
      setSelectedAccompaniments(selectedAccompaniments.filter((a) => a !== id));
    } else if (selectedAccompaniments.length < currentStyle.accompanimentCount) {
      setSelectedAccompaniments([...selectedAccompaniments, id]);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setBoardStyle('classic');
    setSelectedCheeses([]);
    setSelectedAccompaniments([]);
    setGuestCount(6);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      soft: 'bg-yellow-100 text-yellow-700',
      'semi-soft': 'bg-orange-100 text-orange-700',
      firm: 'bg-amber-100 text-amber-700',
      hard: 'bg-red-100 text-red-700',
      blue: 'bg-blue-100 text-blue-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fruit: 'bg-pink-100 text-pink-700',
      meat: 'bg-red-100 text-red-700',
      cracker: 'bg-amber-100 text-amber-700',
      nut: 'bg-orange-100 text-orange-700',
      condiment: 'bg-yellow-100 text-yellow-700',
      vegetable: 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Calculate quantities per person
  const calculateQuantities = () => {
    const cheeseOz = guestCount * 2; // 2oz per person
    const meatOz = guestCount * 1; // 1oz per person
    const crackers = guestCount * 5; // 5 crackers per person
    const fruitServings = guestCount * 0.5; // shared

    return { cheeseOz, meatOz, crackers, fruitServings };
  };

  const quantities = calculateQuantities();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => s < step && setStep(s)}
                className={cn(
                  'w-10 h-10 rounded-full font-medium transition-colors',
                  step === s
                    ? 'bg-[var(--color-wine)] text-white'
                    : step > s
                      ? 'bg-green-500 text-white cursor-pointer'
                      : 'bg-[var(--color-cream)] text-[var(--text-muted)]'
                )}
              >
                {step > s ? '✓' : s}
              </button>
              {s < 4 && (
                <div
                  className={cn(
                    'w-16 md:w-24 h-1 mx-2',
                    step > s ? 'bg-green-500' : 'bg-[var(--color-cream)]'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-[var(--text-muted)]">
          <span>Style</span>
          <span>Cheeses</span>
          <span>Pairings</span>
          <span>Build</span>
        </div>
      </div>

      {/* Step 1: Choose Style */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
            Choose Your Board Style
          </h2>
          <p className="text-[var(--text-muted)] mb-6">How grand should your cheese board be?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {boardStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setBoardStyle(style.id)}
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-all',
                  boardStyle === style.id
                    ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                    : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]'
                )}
              >
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{style.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-2">{style.description}</p>
                <div className="text-xs text-[var(--text-muted)]">
                  {style.cheesesCount} cheeses • {style.accompanimentCount} accompaniments
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              How many guests?
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-lg font-semibold text-[var(--color-wine)]">{guestCount} guests</div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-[var(--color-wine)] text-white rounded-lg font-medium hover:bg-[var(--color-wine-deep)] transition-colors"
          >
            Next: Choose Cheeses
          </button>
        </div>
      )}

      {/* Step 2: Choose Cheeses */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Select Your Cheeses
              </h2>
              <p className="text-[var(--text-muted)]">Choose {currentStyle.cheesesCount} cheeses for variety</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[var(--color-wine)]">{selectedCheeses.length}</span>
              <span className="text-[var(--text-muted)]">/{currentStyle.cheesesCount}</span>
            </div>
          </div>

          {/* Variety Tips */}
          <div className="mb-4 p-3 bg-[var(--color-cream)] rounded-lg text-sm">
            <span className="font-medium">Pro tip:</span> Include a mix of soft, firm, and bold cheeses for the best variety.
            {selectedCheeseTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                Selected types: {[...new Set(selectedCheeseTypes)].map((type) => (
                  <span key={type} className={cn('px-2 py-0.5 rounded text-xs', getTypeColor(type as string))}>
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cheese Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto">
            {cheeses.map((cheese) => (
              <button
                key={cheese.id}
                onClick={() => handleCheeseToggle(cheese.id)}
                disabled={!selectedCheeses.includes(cheese.id) && selectedCheeses.length >= currentStyle.cheesesCount}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all',
                  selectedCheeses.includes(cheese.id)
                    ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                    : selectedCheeses.length >= currentStyle.cheesesCount
                      ? 'border-[var(--color-cream-dark)] opacity-50 cursor-not-allowed'
                      : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">{cheese.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{cheese.flavor}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded text-xs', getTypeColor(cheese.type))}>
                    {cheese.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-[var(--color-cream)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--color-cream-dark)] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedCheeses.length < currentStyle.cheesesCount}
              className={cn(
                'flex-1 py-3 rounded-lg font-medium transition-colors',
                selectedCheeses.length >= currentStyle.cheesesCount
                  ? 'bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]'
                  : 'bg-[var(--color-cream)] text-[var(--text-muted)] cursor-not-allowed'
              )}
            >
              Next: Add Pairings
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Accompaniments */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Add Accompaniments
              </h2>
              <p className="text-[var(--text-muted)]">Choose {currentStyle.accompanimentCount} items to complement your cheeses</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[var(--color-wine)]">{selectedAccompaniments.length}</span>
              <span className="text-[var(--text-muted)]">/{currentStyle.accompanimentCount}</span>
            </div>
          </div>

          {/* Category variety */}
          <div className="mb-4 p-3 bg-[var(--color-cream)] rounded-lg text-sm">
            <span className="font-medium">Aim for variety:</span> Include items from different categories.
            {selectedAccompanimentCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {[...new Set(selectedAccompanimentCategories)].map((cat) => (
                  <span key={cat} className={cn('px-2 py-0.5 rounded text-xs', getCategoryColor(cat as string))}>
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Accompaniments by category */}
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {['fruit', 'meat', 'cracker', 'nut', 'condiment', 'vegetable'].map((category) => (
              <div key={category}>
                <h3 className={cn('text-sm font-medium mb-2 px-2 py-1 rounded inline-block', getCategoryColor(category))}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}s
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {accompaniments
                    .filter((a) => a.category === category)
                    .map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => handleAccompanimentToggle(acc.id)}
                        disabled={!selectedAccompaniments.includes(acc.id) && selectedAccompaniments.length >= currentStyle.accompanimentCount}
                        className={cn(
                          'p-2 rounded-lg border text-left text-sm transition-all',
                          selectedAccompaniments.includes(acc.id)
                            ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                            : selectedAccompaniments.length >= currentStyle.accompanimentCount
                              ? 'border-[var(--color-cream-dark)] opacity-50 cursor-not-allowed'
                              : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]'
                        )}
                      >
                        {acc.name}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-[var(--color-cream)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--color-cream-dark)] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={selectedAccompaniments.length < currentStyle.accompanimentCount}
              className={cn(
                'flex-1 py-3 rounded-lg font-medium transition-colors',
                selectedAccompaniments.length >= currentStyle.accompanimentCount
                  ? 'bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]'
                  : 'bg-[var(--color-cream)] text-[var(--text-muted)] cursor-not-allowed'
              )}
            >
              Build My Board
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Board */}
      {step === 4 && (
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-[var(--color-wine)] text-white p-6 text-center">
              <span className="text-4xl mb-2 block">🧀</span>
              <h2 className="font-display text-2xl font-semibold">Your Perfect Cheese Board</h2>
              <p className="text-white/80">{currentStyle.name} for {guestCount} guests</p>
            </div>

            <div className="p-6">
              {/* Quantities */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{quantities.cheeseOz} oz</div>
                  <div className="text-xs text-[var(--text-muted)]">Total Cheese</div>
                </div>
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{quantities.meatOz} oz</div>
                  <div className="text-xs text-[var(--text-muted)]">Charcuterie</div>
                </div>
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{quantities.crackers}+</div>
                  <div className="text-xs text-[var(--text-muted)]">Crackers</div>
                </div>
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{Math.ceil(quantities.fruitServings)}</div>
                  <div className="text-xs text-[var(--text-muted)]">Cups Fruit</div>
                </div>
              </div>

              {/* Selected Cheeses */}
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Your Cheeses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {selectedCheeses.map((id) => {
                  const cheese = cheeses.find((c) => c.id === id)!;
                  return (
                    <div key={id} className="p-3 border border-[var(--color-cream-dark)] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{cheese.name}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded', getTypeColor(cheese.type))}>
                          {cheese.type}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">{cheese.flavor}</p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Accompaniments */}
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Your Accompaniments</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedAccompaniments.map((id) => {
                  const acc = accompaniments.find((a) => a.id === id)!;
                  return (
                    <span
                      key={id}
                      className={cn('px-3 py-1.5 rounded-lg text-sm', getCategoryColor(acc.category))}
                    >
                      {acc.name}
                    </span>
                  );
                })}
              </div>

              {/* Tips */}
              <div className="p-4 bg-[var(--color-cream)] rounded-lg">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">Assembly Tips</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                  <li>* Take cheese out 30-60 minutes before serving</li>
                  <li>* Place soft cheeses away from edge to prevent mess</li>
                  <li>* Cut a few slices to encourage guests to dig in</li>
                  <li>* Add fresh herbs or edible flowers for color</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                const boardDetails = `My Cheese Board for ${guestCount} guests:\n\nCheeses:\n${selectedCheeses.map((id) => '- ' + cheeses.find((c) => c.id === id)?.name).join('\n')}\n\nAccompaniments:\n${selectedAccompaniments.map((id) => '- ' + accompaniments.find((a) => a.id === id)?.name).join('\n')}`;

                if (navigator.share) {
                  navigator.share({
                    title: 'My Perfect Cheese Board',
                    text: boardDetails,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(boardDetails);
                  alert('Board details copied to clipboard!');
                }
              }}
              className="flex-1 py-3 rounded-lg font-medium bg-[var(--color-cream)] text-[var(--text-primary)] hover:bg-[var(--color-cream-dark)] transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" x2="12" y1="2" y2="15"/>
              </svg>
              Share Board
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 py-3 rounded-lg font-medium bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)] transition-colors"
            >
              Build Another Board
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
