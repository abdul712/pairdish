/**
 * Chocolate Pairing Guide Component
 *
 * Pair chocolate types with wines, cheeses, fruits, and beverages.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface Chocolate {
  id: string;
  name: string;
  type: 'dark' | 'milk' | 'white' | 'specialty';
  cocoa: string;
  flavor: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  description: string;
  color: string;
}

interface ChocolatePairings {
  chocolateId: string;
  wines: string[];
  spirits: string[];
  fruits: string[];
  nuts: string[];
  cheeses: string[];
  spices: string[];
  beverages: string[];
  avoid: string[];
  tips: string;
}

// Chocolate Data
const chocolates: Chocolate[] = [
  // Dark Chocolates
  {
    id: 'dark-70',
    name: '70% Dark',
    type: 'dark',
    cocoa: '70%',
    flavor: 'Rich, slightly bitter, fruity undertones',
    intensity: 4,
    description: 'The classic dark chocolate with balanced bitterness and complex flavor.',
    color: 'bg-stone-800',
  },
  {
    id: 'dark-85',
    name: '85% Extra Dark',
    type: 'dark',
    cocoa: '85%',
    flavor: 'Intensely bitter, earthy, minimal sweetness',
    intensity: 5,
    description: 'For serious chocolate lovers who appreciate bold, intense flavors.',
    color: 'bg-stone-900',
  },
  {
    id: 'dark-60',
    name: '60% Bittersweet',
    type: 'dark',
    cocoa: '60%',
    flavor: 'Balanced sweetness and bitterness, caramel notes',
    intensity: 3,
    description: 'Approachable dark chocolate with pleasant sweetness.',
    color: 'bg-stone-700',
  },
  {
    id: 'dark-single-origin',
    name: 'Single Origin Dark',
    type: 'dark',
    cocoa: '70-75%',
    flavor: 'Terroir-specific, can be fruity, floral, or nutty',
    intensity: 4,
    description: 'Showcases unique flavors from specific growing regions.',
    color: 'bg-amber-900',
  },
  // Milk Chocolates
  {
    id: 'milk-classic',
    name: 'Classic Milk',
    type: 'milk',
    cocoa: '30-40%',
    flavor: 'Creamy, sweet, mild cocoa, caramel',
    intensity: 2,
    description: 'Smooth and creamy with gentle chocolate flavor.',
    color: 'bg-amber-700',
  },
  {
    id: 'milk-european',
    name: 'European Milk',
    type: 'milk',
    cocoa: '40-50%',
    flavor: 'Richer cocoa, less sweet, cultured milk notes',
    intensity: 3,
    description: 'Higher cocoa content for more chocolate-forward flavor.',
    color: 'bg-amber-800',
  },
  {
    id: 'milk-caramel',
    name: 'Milk Chocolate with Caramel',
    type: 'milk',
    cocoa: '30-35%',
    flavor: 'Sweet, buttery, rich caramel',
    intensity: 2,
    description: 'Classic combination of creamy chocolate and salted caramel.',
    color: 'bg-yellow-800',
  },
  // White Chocolates
  {
    id: 'white-classic',
    name: 'Classic White',
    type: 'white',
    cocoa: '0% (cocoa butter only)',
    flavor: 'Sweet, vanilla, creamy, buttery',
    intensity: 1,
    description: 'Sweet and creamy with no cocoa solids.',
    color: 'bg-amber-100',
  },
  {
    id: 'white-premium',
    name: 'Premium White',
    type: 'white',
    cocoa: '35%+ cocoa butter',
    flavor: 'Rich, complex vanilla, slight tang',
    intensity: 2,
    description: 'Higher quality white chocolate with complex flavors.',
    color: 'bg-yellow-50',
  },
  // Specialty
  {
    id: 'ruby',
    name: 'Ruby Chocolate',
    type: 'specialty',
    cocoa: '~47%',
    flavor: 'Berry, tangy, slightly sweet, fruity',
    intensity: 2,
    description: 'Made from ruby cocoa beans with natural pink color and berry notes.',
    color: 'bg-pink-300',
  },
  {
    id: 'gianduja',
    name: 'Gianduja',
    type: 'specialty',
    cocoa: '30-50%',
    flavor: 'Hazelnut, sweet, nutty, smooth',
    intensity: 2,
    description: 'Italian chocolate-hazelnut paste, silky smooth.',
    color: 'bg-amber-600',
  },
  {
    id: 'salted-dark',
    name: 'Salted Dark Chocolate',
    type: 'specialty',
    cocoa: '60-70%',
    flavor: 'Salty-sweet contrast, amplified chocolate',
    intensity: 4,
    description: 'Sea salt enhances and balances dark chocolate bitterness.',
    color: 'bg-stone-700',
  },
  {
    id: 'chili-dark',
    name: 'Chili Dark Chocolate',
    type: 'specialty',
    cocoa: '60-70%',
    flavor: 'Spicy heat, smoky, complex',
    intensity: 5,
    description: 'Traditional Mesoamerican combination of chocolate and chili.',
    color: 'bg-red-900',
  },
];

// Pairing Database
const pairings: ChocolatePairings[] = [
  {
    chocolateId: 'dark-70',
    wines: ['Cabernet Sauvignon', 'Zinfandel', 'Port', 'Malbec', 'Syrah'],
    spirits: ['Bourbon', 'Dark Rum', 'Cognac', 'Armagnac'],
    fruits: ['Raspberries', 'Cherries', 'Oranges', 'Strawberries', 'Blackberries'],
    nuts: ['Almonds', 'Hazelnuts', 'Pecans', 'Walnuts'],
    cheeses: ['Aged Gouda', 'Blue Cheese', 'Manchego', 'Sharp Cheddar'],
    spices: ['Sea Salt', 'Cinnamon', 'Cardamom', 'Vanilla'],
    beverages: ['Espresso', 'Cold Brew Coffee', 'Earl Grey Tea'],
    avoid: ['Light white wines', 'Delicate fruits', 'Fresh mild cheeses'],
    tips: 'The 70% range is versatile - pairs well with bold reds and fruit. Let it melt on your tongue to appreciate the flavor layers.',
  },
  {
    chocolateId: 'dark-85',
    wines: ['Port', 'Late Harvest Zinfandel', 'Pedro Ximénez Sherry', 'Banyuls'],
    spirits: ['Single Malt Scotch', 'Aged Rum', 'Mezcal', 'Aged Tequila'],
    fruits: ['Dried Figs', 'Dates', 'Dried Cherries', 'Orange Peel'],
    nuts: ['Walnuts', 'Marcona Almonds', 'Brazil Nuts'],
    cheeses: ['Aged Parmesan', 'Stilton', 'Aged Manchego'],
    spices: ['Fleur de Sel', 'Black Pepper', 'Smoked Paprika'],
    beverages: ['Double Espresso', 'Turkish Coffee', 'Black Tea'],
    avoid: ['Sweet wines', 'Delicate flavors', 'Fresh fruits', 'Mild cheeses'],
    tips: 'This intense chocolate needs equally bold partners. Sweet elements help balance the bitterness.',
  },
  {
    chocolateId: 'dark-60',
    wines: ['Pinot Noir', 'Merlot', 'Grenache', 'Ruby Port'],
    spirits: ['Bourbon', 'Irish Whiskey', 'Brandy'],
    fruits: ['Strawberries', 'Cherries', 'Bananas', 'Pears'],
    nuts: ['Hazelnuts', 'Almonds', 'Pistachios', 'Cashews'],
    cheeses: ['Brie', 'Camembert', 'Gruyère', 'Gouda'],
    spices: ['Vanilla', 'Cinnamon', 'Mint', 'Orange Zest'],
    beverages: ['Cappuccino', 'Chai Tea', 'Hot Cocoa'],
    avoid: ['Very tannic wines', 'Overly acidic fruits'],
    tips: 'The most approachable dark chocolate - great for those transitioning from milk chocolate.',
  },
  {
    chocolateId: 'dark-single-origin',
    wines: ['Wine matching the origin (Spanish with Spanish cocoa, etc.)', 'Champagne', 'Tawny Port'],
    spirits: ['Rum from same region', 'Cognac', 'Grappa'],
    fruits: ['Match to origin notes - tropical, berry, or citrus'],
    nuts: ['Almonds', 'Macadamias', 'Hazelnuts'],
    cheeses: ['Aged cheeses', 'Sheep\'s milk cheeses'],
    spices: ['Sea Salt', 'Region-specific spices'],
    beverages: ['Single Origin Coffee', 'Fine Tea'],
    avoid: ['Overpowering flavors that mask terroir'],
    tips: 'Taste plain first to identify flavor notes, then match pairings to complement those specific characteristics.',
  },
  {
    chocolateId: 'milk-classic',
    wines: ['Moscato d\'Asti', 'Late Harvest Riesling', 'Brachetto', 'Tawny Port'],
    spirits: ['Irish Cream', 'Amaretto', 'Frangelico', 'Kahlúa'],
    fruits: ['Bananas', 'Strawberries', 'Apples', 'Pears', 'Caramelized Fruits'],
    nuts: ['Peanuts', 'Almonds', 'Hazelnuts', 'Macadamias'],
    cheeses: ['Mascarpone', 'Cream Cheese', 'Mild Gouda', 'Swiss'],
    spices: ['Vanilla', 'Cinnamon', 'Nutmeg'],
    beverages: ['Latte', 'Chai Tea', 'Malted Milk'],
    avoid: ['Dry wines', 'Bitter flavors', 'Very strong cheeses'],
    tips: 'Milk chocolate\'s sweetness pairs best with mild, sweet, or creamy accompaniments.',
  },
  {
    chocolateId: 'milk-european',
    wines: ['Recioto', 'Muscat', 'Ruby Port', 'Sweet Sherry'],
    spirits: ['Cognac', 'Amaretto', 'Hazelnut Liqueur'],
    fruits: ['Cherries', 'Raspberries', 'Oranges', 'Pears'],
    nuts: ['Hazelnuts', 'Almonds', 'Pistachios'],
    cheeses: ['Gruyère', 'Mild Blue', 'Aged Gouda'],
    spices: ['Sea Salt', 'Espresso', 'Vanilla'],
    beverages: ['Café au Lait', 'Earl Grey', 'Hot Chocolate'],
    avoid: ['Very dry wines', 'Extremely bitter foods'],
    tips: 'European-style milk chocolate can handle slightly more complex pairings than American milk chocolate.',
  },
  {
    chocolateId: 'milk-caramel',
    wines: ['Sauternes', 'Ice Wine', 'PX Sherry', 'Tokaji'],
    spirits: ['Bourbon', 'Salted Caramel Liqueur', 'Irish Cream'],
    fruits: ['Apples', 'Bananas', 'Pears', 'Peaches'],
    nuts: ['Pecans', 'Macadamias', 'Cashews', 'Walnuts'],
    cheeses: ['Mascarpone', 'Brie', 'Cream Cheese'],
    spices: ['Sea Salt', 'Vanilla', 'Cinnamon', 'Nutmeg'],
    beverages: ['Salted Caramel Latte', 'Apple Cider', 'Chai'],
    avoid: ['Acidic flavors', 'Dry wines', 'Tannic wines'],
    tips: 'The caramel amplifies sweetness - a touch of salt creates perfect balance.',
  },
  {
    chocolateId: 'white-classic',
    wines: ['Champagne', 'Prosecco', 'Moscato', 'Riesling'],
    spirits: ['Limoncello', 'Raspberry Liqueur', 'Amaretto', 'Vodka'],
    fruits: ['Strawberries', 'Raspberries', 'Passion Fruit', 'Lemon', 'Mango'],
    nuts: ['Macadamias', 'Almonds', 'Pistachios'],
    cheeses: ['Mascarpone', 'Fresh Ricotta', 'Cream Cheese'],
    spices: ['Vanilla', 'Lavender', 'Rose', 'Matcha'],
    beverages: ['Green Tea', 'Matcha Latte', 'Light Coffee'],
    avoid: ['Strong flavors', 'Dark chocolate', 'Tannic wines', 'Strong cheeses'],
    tips: 'White chocolate is subtle - pair with delicate, fruity, or floral flavors that won\'t overpower it.',
  },
  {
    chocolateId: 'white-premium',
    wines: ['Vintage Champagne', 'Gewürztraminer', 'Vouvray'],
    spirits: ['Fine Brandy', 'Aged Rum', 'Grand Marnier'],
    fruits: ['Fresh Berries', 'Passion Fruit', 'Yuzu', 'Lychee'],
    nuts: ['Marcona Almonds', 'Pistachios', 'Toasted Coconut'],
    cheeses: ['Burrata', 'Triple Cream', 'Chèvre'],
    spices: ['Tahitian Vanilla', 'Saffron', 'Cardamom'],
    beverages: ['White Tea', 'Jasmine Tea', 'Light Roast Coffee'],
    avoid: ['Overpowering flavors', 'Bitter elements'],
    tips: 'Premium white chocolate has nuanced flavors - choose equally refined pairings.',
  },
  {
    chocolateId: 'ruby',
    wines: ['Rosé Champagne', 'Brachetto d\'Acqui', 'Lambrusco Rosé'],
    spirits: ['Chambord', 'Raspberry Vodka', 'Elderflower Liqueur'],
    fruits: ['Fresh Berries', 'Pomegranate', 'Cherries', 'Citrus'],
    nuts: ['Pistachios', 'Almonds', 'Coconut'],
    cheeses: ['Fresh Goat Cheese', 'Mascarpone', 'Cream Cheese'],
    spices: ['Rose Water', 'Citrus Zest', 'Vanilla'],
    beverages: ['Hibiscus Tea', 'Rosé', 'Berry Smoothies'],
    avoid: ['Dark chocolate', 'Strong bitter flavors', 'Heavy wines'],
    tips: 'Ruby chocolate\'s natural berry tang pairs beautifully with actual berries and rosé.',
  },
  {
    chocolateId: 'gianduja',
    wines: ['Vin Santo', 'Banyuls', 'Tawny Port', 'Marsala'],
    spirits: ['Frangelico', 'Nocino', 'Amaretto', 'Brandy'],
    fruits: ['Figs', 'Pears', 'Cherries', 'Banana'],
    nuts: ['Additional Hazelnuts', 'Almonds', 'Pistachios'],
    cheeses: ['Mascarpone', 'Ricotta', 'Taleggio'],
    spices: ['Espresso', 'Vanilla', 'Cinnamon'],
    beverages: ['Hazelnut Coffee', 'Café Latte', 'Hot Chocolate'],
    avoid: ['Conflicting nut flavors', 'Very tart fruits'],
    tips: 'The hazelnut flavor is dominant - complement it rather than compete with it.',
  },
  {
    chocolateId: 'salted-dark',
    wines: ['Sauternes', 'Port', 'PX Sherry', 'Madeira'],
    spirits: ['Bourbon', 'Whiskey', 'Salted Caramel Vodka'],
    fruits: ['Caramelized Bananas', 'Dates', 'Dried Apricots'],
    nuts: ['Salted Almonds', 'Candied Pecans', 'Cashews'],
    cheeses: ['Blue Cheese', 'Aged Cheddar', 'Parmesan'],
    spices: ['More Sea Salt', 'Vanilla', 'Caramel'],
    beverages: ['Salted Caramel Espresso', 'Irish Coffee'],
    avoid: ['Additional very salty foods', 'Overly sweet pairings'],
    tips: 'The salt amplifies chocolate flavor - don\'t add more salt; let it enhance your pairing.',
  },
  {
    chocolateId: 'chili-dark',
    wines: ['Zinfandel', 'Shiraz', 'Malbec', 'Petite Sirah'],
    spirits: ['Mezcal', 'Añejo Tequila', 'Spiced Rum', 'Rye Whiskey'],
    fruits: ['Mango', 'Papaya', 'Pineapple', 'Orange'],
    nuts: ['Pepitas', 'Spiced Nuts', 'Coconut'],
    cheeses: ['Aged Manchego', 'Cotija', 'Oaxaca'],
    spices: ['Cinnamon', 'Cayenne', 'Smoked Paprika'],
    beverages: ['Mexican Hot Chocolate', 'Strong Coffee', 'Chai'],
    avoid: ['Delicate flavors', 'Very sweet pairings', 'Mild wines'],
    tips: 'Embrace the heat - pair with other Mexican/Latin flavors for an authentic experience.',
  },
];

// Get pairings for a chocolate
const getPairings = (chocolateId: string): ChocolatePairings | undefined => {
  return pairings.find((p) => p.chocolateId === chocolateId);
};

// Chocolate Card Component
const ChocolateCard = ({
  chocolate,
  isSelected,
  onClick,
}: {
  chocolate: Chocolate;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-xl border-2 transition-all',
        isSelected
          ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)] shadow-md'
          : 'border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine-light)] hover:shadow-sm'
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn('w-10 h-10 rounded-full', chocolate.color, chocolate.type === 'white' && 'border border-gray-200')} />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-[var(--text-primary)] truncate">
            {chocolate.name}
          </h3>
          <p className="text-xs text-[var(--text-muted)]">{chocolate.cocoa} cocoa</p>
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{chocolate.flavor}</p>

      {/* Intensity */}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-xs text-[var(--text-muted)]">Intensity:</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                'w-2 h-2 rounded-full',
                level <= chocolate.intensity ? 'bg-amber-800' : 'bg-gray-200'
              )}
            />
          ))}
        </div>
      </div>
    </button>
  );
};

// Main Component
export default function ChocolatePairing() {
  const [selectedChocolate, setSelectedChocolate] = useState<Chocolate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter chocolates
  const filteredChocolates = useMemo(() => {
    return chocolates.filter((chocolate) => {
      const matchesCategory = categoryFilter === 'all' || chocolate.type === categoryFilter;
      const matchesSearch =
        searchTerm === '' ||
        chocolate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chocolate.flavor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchTerm]);

  // Get pairings for selected chocolate
  const currentPairings = selectedChocolate ? getPairings(selectedChocolate.id) : null;

  const categories = [
    { id: 'all', label: 'All Types' },
    { id: 'dark', label: 'Dark' },
    { id: 'milk', label: 'Milk' },
    { id: 'white', label: 'White' },
    { id: 'specialty', label: 'Specialty' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Search Chocolates
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or flavor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-cream-dark)] focus:ring-2 focus:ring-[var(--color-wine)] focus:border-[var(--color-wine)] outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Chocolate Type
            </label>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    categoryFilter === cat.id
                      ? 'bg-[var(--color-wine)] text-white'
                      : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chocolate Selection */}
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
            Select a Chocolate ({filteredChocolates.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredChocolates.map((chocolate) => (
              <ChocolateCard
                key={chocolate.id}
                chocolate={chocolate}
                isSelected={selectedChocolate?.id === chocolate.id}
                onClick={() => setSelectedChocolate(chocolate)}
              />
            ))}
          </div>
        </div>

        {/* Pairing Results */}
        <div>
          {selectedChocolate && currentPairings ? (
            <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 sticky top-4">
              {/* Chocolate Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--color-cream-dark)]">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full',
                    selectedChocolate.color,
                    selectedChocolate.type === 'white' && 'border border-gray-200'
                  )}
                />
                <div>
                  <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                    {selectedChocolate.name}
                  </h2>
                  <p className="text-[var(--text-muted)]">{selectedChocolate.cocoa} cocoa</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {selectedChocolate.description}
                  </p>
                </div>
              </div>

              {/* Pairing Tip */}
              <div className="bg-amber-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
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
                    className="mt-0.5 flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  {currentPairings.tips}
                </p>
              </div>

              {/* Pairing Categories */}
              <div className="space-y-4">
                {/* Wines */}
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <span className="text-lg">🍷</span> Wines
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.wines.map((wine) => (
                      <span
                        key={wine}
                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-sm"
                      >
                        {wine}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spirits */}
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <span className="text-lg">🥃</span> Spirits & Liqueurs
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.spirits.map((spirit) => (
                      <span
                        key={spirit}
                        className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-sm"
                      >
                        {spirit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fruits */}
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <span className="text-lg">🍓</span> Fruits
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.fruits.map((fruit) => (
                      <span
                        key={fruit}
                        className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm"
                      >
                        {fruit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nuts */}
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <span className="text-lg">🥜</span> Nuts
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.nuts.map((nut) => (
                      <span
                        key={nut}
                        className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded text-sm"
                      >
                        {nut}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cheeses */}
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <span className="text-lg">🧀</span> Cheeses
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.cheeses.map((cheese) => (
                      <span
                        key={cheese}
                        className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-sm"
                      >
                        {cheese}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spices */}
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <span className="text-lg">🌿</span> Spices & Flavors
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.spices.map((spice) => (
                      <span
                        key={spice}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm"
                      >
                        {spice}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Beverages */}
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <span className="text-lg">☕</span> Other Beverages
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.beverages.map((bev) => (
                      <span
                        key={bev}
                        className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-sm"
                      >
                        {bev}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Avoid */}
                <div>
                  <h3 className="font-medium text-red-600 flex items-center gap-2 mb-2">
                    <span className="text-lg">⚠️</span> Avoid
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPairings.avoid.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-cream)] rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🍫</div>
              <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                Select a Chocolate
              </h3>
              <p className="text-[var(--text-secondary)]">
                Choose a chocolate type from the left to discover perfect pairings
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pairing Guide */}
      <div className="mt-12 bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">
          Chocolate Pairing Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
              ⚖️
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Match Intensity</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Bold dark chocolate needs bold pairings. Delicate white chocolate pairs with
              subtle flavors.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
              🎯
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Complement or Contrast</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Either complement chocolate's flavors (fruit + fruit notes) or create contrast
              (salt + sweet).
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
              🍷
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Wine Rule of Thumb</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              The wine should be sweeter than the chocolate. Dark chocolate pairs with
              fortified wines, milk with dessert wines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
