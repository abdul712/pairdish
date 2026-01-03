/**
 * Cheese & Accompaniment Matcher
 *
 * Find perfect pairings for any cheese type.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

interface Cheese {
  id: string;
  name: string;
  category: 'soft' | 'semi-soft' | 'semi-hard' | 'hard' | 'blue' | 'fresh';
  origin: string;
  milk: 'cow' | 'goat' | 'sheep' | 'mixed';
  flavor: string;
  texture: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  description: string;
  color: string;
}

interface Pairing {
  category: string;
  items: string[];
  notes?: string;
}

interface CheesePairings {
  cheeseId: string;
  wines: string[];
  fruits: string[];
  nuts: string[];
  condiments: string[];
  breads: string[];
  meats: string[];
  beverages: string[];
}

const cheeses: Cheese[] = [
  {
    id: 'brie',
    name: 'Brie',
    category: 'soft',
    origin: 'France',
    milk: 'cow',
    flavor: 'Mild, buttery, earthy',
    texture: 'Creamy, soft-ripened',
    intensity: 2,
    description: 'Classic French soft cheese with edible white rind and creamy interior.',
    color: 'bg-amber-50',
  },
  {
    id: 'camembert',
    name: 'Camembert',
    category: 'soft',
    origin: 'France',
    milk: 'cow',
    flavor: 'Earthy, mushroomy, rich',
    texture: 'Creamy, soft-ripened',
    intensity: 3,
    description: 'Similar to Brie but stronger, with distinctive earthy aroma.',
    color: 'bg-amber-100',
  },
  {
    id: 'goat-cheese',
    name: 'Chèvre (Goat)',
    category: 'fresh',
    origin: 'France',
    milk: 'goat',
    flavor: 'Tangy, bright, citrusy',
    texture: 'Soft, spreadable to crumbly',
    intensity: 2,
    description: 'Fresh goat cheese with distinctive tangy flavor.',
    color: 'bg-slate-50',
  },
  {
    id: 'burrata',
    name: 'Burrata',
    category: 'fresh',
    origin: 'Italy',
    milk: 'cow',
    flavor: 'Mild, milky, sweet',
    texture: 'Creamy center with mozzarella shell',
    intensity: 1,
    description: 'Fresh Italian cheese with stracciatella cream inside.',
    color: 'bg-white',
  },
  {
    id: 'havarti',
    name: 'Havarti',
    category: 'semi-soft',
    origin: 'Denmark',
    milk: 'cow',
    flavor: 'Buttery, slightly tangy',
    texture: 'Supple, creamy',
    intensity: 2,
    description: 'Versatile Danish cheese, often flavored with dill or herbs.',
    color: 'bg-yellow-100',
  },
  {
    id: 'fontina',
    name: 'Fontina',
    category: 'semi-soft',
    origin: 'Italy',
    milk: 'cow',
    flavor: 'Nutty, earthy, mild',
    texture: 'Semi-soft, melts well',
    intensity: 2,
    description: 'Italian cheese excellent for melting and fondues.',
    color: 'bg-amber-200',
  },
  {
    id: 'gruyere',
    name: 'Gruyère',
    category: 'hard',
    origin: 'Switzerland',
    milk: 'cow',
    flavor: 'Nutty, sweet, slightly salty',
    texture: 'Firm, smooth',
    intensity: 3,
    description: 'Classic Swiss cheese for fondue and French onion soup.',
    color: 'bg-amber-300',
  },
  {
    id: 'cheddar',
    name: 'Cheddar',
    category: 'hard',
    origin: 'England',
    milk: 'cow',
    flavor: 'Sharp, tangy, complex',
    texture: 'Firm, crumbly when aged',
    intensity: 4,
    description: 'World\'s most popular cheese, available in many ages.',
    color: 'bg-orange-200',
  },
  {
    id: 'manchego',
    name: 'Manchego',
    category: 'semi-hard',
    origin: 'Spain',
    milk: 'sheep',
    flavor: 'Nutty, tangy, caramel notes',
    texture: 'Firm, distinctive basket weave rind',
    intensity: 3,
    description: 'Spanish sheep\'s milk cheese with characteristic crosshatch pattern.',
    color: 'bg-amber-200',
  },
  {
    id: 'gouda',
    name: 'Gouda',
    category: 'semi-hard',
    origin: 'Netherlands',
    milk: 'cow',
    flavor: 'Sweet, caramel, butterscotch when aged',
    texture: 'Smooth to crystalline when aged',
    intensity: 3,
    description: 'Dutch cheese that becomes more complex with aging.',
    color: 'bg-amber-400',
  },
  {
    id: 'parmesan',
    name: 'Parmigiano-Reggiano',
    category: 'hard',
    origin: 'Italy',
    milk: 'cow',
    flavor: 'Sharp, nutty, umami',
    texture: 'Hard, granular, crystalline',
    intensity: 5,
    description: 'King of cheeses, aged minimum 12 months.',
    color: 'bg-amber-300',
  },
  {
    id: 'pecorino',
    name: 'Pecorino Romano',
    category: 'hard',
    origin: 'Italy',
    milk: 'sheep',
    flavor: 'Sharp, salty, tangy',
    texture: 'Hard, granular',
    intensity: 5,
    description: 'Ancient Roman cheese, essential for pasta dishes.',
    color: 'bg-amber-200',
  },
  {
    id: 'gorgonzola',
    name: 'Gorgonzola',
    category: 'blue',
    origin: 'Italy',
    milk: 'cow',
    flavor: 'Pungent, earthy, creamy',
    texture: 'Creamy with blue veins',
    intensity: 4,
    description: 'Italian blue cheese, available in dolce (sweet) and piccante (sharp).',
    color: 'bg-blue-100',
  },
  {
    id: 'roquefort',
    name: 'Roquefort',
    category: 'blue',
    origin: 'France',
    milk: 'sheep',
    flavor: 'Sharp, tangy, salty, complex',
    texture: 'Moist, crumbly',
    intensity: 5,
    description: 'The king of blues, aged in limestone caves.',
    color: 'bg-blue-200',
  },
  {
    id: 'stilton',
    name: 'Stilton',
    category: 'blue',
    origin: 'England',
    milk: 'cow',
    flavor: 'Rich, complex, less salty than Roquefort',
    texture: 'Creamy, crumbly',
    intensity: 4,
    description: 'English blue cheese, traditional Christmas cheese.',
    color: 'bg-blue-100',
  },
  {
    id: 'feta',
    name: 'Feta',
    category: 'fresh',
    origin: 'Greece',
    milk: 'sheep',
    flavor: 'Salty, tangy, bright',
    texture: 'Crumbly, firm',
    intensity: 3,
    description: 'Greek brined cheese essential for salads and Mediterranean dishes.',
    color: 'bg-slate-100',
  },
];

const pairings: CheesePairings[] = [
  {
    cheeseId: 'brie',
    wines: ['Champagne', 'Chardonnay', 'Pinot Noir', 'Beaujolais'],
    fruits: ['Green apples', 'Pears', 'Grapes', 'Figs', 'Raspberries'],
    nuts: ['Almonds', 'Walnuts', 'Pecans'],
    condiments: ['Honey', 'Fig jam', 'Truffle honey', 'Apricot preserves'],
    breads: ['Baguette', 'Crackers', 'Brioche'],
    meats: ['Prosciutto', 'Salami', 'Smoked turkey'],
    beverages: ['Cider', 'Wheat beer', 'Earl Grey tea'],
  },
  {
    cheeseId: 'camembert',
    wines: ['Cider', 'Calvados', 'Burgundy', 'Champagne'],
    fruits: ['Apples', 'Pears', 'Cranberries', 'Cherries'],
    nuts: ['Hazelnuts', 'Walnuts'],
    condiments: ['Apple butter', 'Honey', 'Caramelized onions'],
    breads: ['Crusty bread', 'Walnut bread', 'Crackers'],
    meats: ['Bacon', 'Ham', 'Smoked duck'],
    beverages: ['Hard cider', 'Belgian ale', 'Coffee'],
  },
  {
    cheeseId: 'goat-cheese',
    wines: ['Sauvignon Blanc', 'Sancerre', 'Dry Rosé', 'Chenin Blanc'],
    fruits: ['Figs', 'Berries', 'Peaches', 'Roasted beets'],
    nuts: ['Pistachios', 'Pine nuts', 'Candied walnuts'],
    condiments: ['Honey', 'Balsamic reduction', 'Herb oil', 'Lavender honey'],
    breads: ['Crostini', 'Multigrain crackers', 'Flatbread'],
    meats: ['Prosciutto', 'Bresaola'],
    beverages: ['Rosé', 'Light beer', 'Lemonade'],
  },
  {
    cheeseId: 'burrata',
    wines: ['Prosecco', 'Pinot Grigio', 'Soave', 'Light Rosé'],
    fruits: ['Tomatoes', 'Peaches', 'Nectarines', 'Strawberries'],
    nuts: ['Pine nuts', 'Almonds'],
    condiments: ['Olive oil', 'Balsamic glaze', 'Pesto', 'Sun-dried tomatoes'],
    breads: ['Focaccia', 'Grilled bread', 'Crusty Italian bread'],
    meats: ['Prosciutto di Parma', 'Bresaola', 'Mortadella'],
    beverages: ['Aperol Spritz', 'Italian soda', 'Light white wine'],
  },
  {
    cheeseId: 'havarti',
    wines: ['Riesling', 'Chardonnay', 'Pinot Noir'],
    fruits: ['Apples', 'Pears', 'Grapes'],
    nuts: ['Almonds', 'Cashews'],
    condiments: ['Honey', 'Mustard', 'Pickles'],
    breads: ['Rye bread', 'Crackers', 'Pretzel bread'],
    meats: ['Turkey', 'Ham', 'Roast beef'],
    beverages: ['Pilsner', 'Wheat beer', 'Aquavit'],
  },
  {
    cheeseId: 'fontina',
    wines: ['Nebbiolo', 'Barbera', 'Italian whites'],
    fruits: ['Pears', 'Apples', 'Dried apricots'],
    nuts: ['Hazelnuts', 'Walnuts'],
    condiments: ['Truffle oil', 'Honey', 'Mostarda'],
    breads: ['Italian bread', 'Grissini', 'Focaccia'],
    meats: ['Speck', 'Prosciutto', 'Salami'],
    beverages: ['Italian red wine', 'Grappa'],
  },
  {
    cheeseId: 'gruyere',
    wines: ['White Burgundy', 'Swiss white wines', 'Chardonnay'],
    fruits: ['Apples', 'Pears', 'Grapes'],
    nuts: ['Walnuts', 'Almonds'],
    condiments: ['Dijon mustard', 'Cornichons', 'Pickled onions'],
    breads: ['French bread', 'Crackers', 'Crusty sourdough'],
    meats: ['Ham', 'Salami', 'Dried sausage'],
    beverages: ['Swiss white wine', 'Lager beer', 'Apple cider'],
  },
  {
    cheeseId: 'cheddar',
    wines: ['Cabernet Sauvignon', 'Merlot', 'Port', 'Zinfandel'],
    fruits: ['Apples', 'Pears', 'Dried cranberries', 'Grapes'],
    nuts: ['Walnuts', 'Pecans', 'Almonds'],
    condiments: ['Chutney', 'Mustard', 'Pickles', 'Branston pickle'],
    breads: ['Crusty bread', 'Crackers', 'Oatcakes'],
    meats: ['Ham', 'Roast beef', 'Bacon'],
    beverages: ['IPA', 'Stout', 'Cider', 'Bourbon'],
  },
  {
    cheeseId: 'manchego',
    wines: ['Rioja', 'Tempranillo', 'Sherry', 'Cava'],
    fruits: ['Membrillo (quince paste)', 'Dried figs', 'Grapes', 'Marcona almonds'],
    nuts: ['Marcona almonds', 'Hazelnuts'],
    condiments: ['Quince paste', 'Honey', 'Olive oil'],
    breads: ['Crusty bread', 'Bread sticks'],
    meats: ['Jamón serrano', 'Chorizo', 'Lomo'],
    beverages: ['Spanish wine', 'Sherry', 'Sangria'],
  },
  {
    cheeseId: 'gouda',
    wines: ['Riesling', 'Gewürztraminer', 'Merlot', 'Port (for aged)'],
    fruits: ['Apples', 'Pears', 'Dried apricots', 'Cherries'],
    nuts: ['Walnuts', 'Pecans', 'Almonds'],
    condiments: ['Mustard', 'Apple butter', 'Dark beer mustard'],
    breads: ['Pumpernickel', 'Rye', 'Crackers'],
    meats: ['Ham', 'Salami', 'Summer sausage'],
    beverages: ['Belgian ale', 'Dutch beer', 'Coffee'],
  },
  {
    cheeseId: 'parmesan',
    wines: ['Chianti', 'Barolo', 'Lambrusco', 'Prosecco'],
    fruits: ['Pears', 'Figs', 'Grapes', 'Balsamic-drizzled strawberries'],
    nuts: ['Walnuts', 'Almonds', 'Hazelnuts'],
    condiments: ['Balsamic vinegar', 'Honey', 'Truffle honey'],
    breads: ['Grissini', 'Italian bread'],
    meats: ['Prosciutto di Parma', 'Bresaola', 'Coppa'],
    beverages: ['Italian red wine', 'Espresso', 'Amaro'],
  },
  {
    cheeseId: 'pecorino',
    wines: ['Chianti', 'Montepulciano', 'Brunello'],
    fruits: ['Pears', 'Figs', 'Honey'],
    nuts: ['Walnuts'],
    condiments: ['Raw honey', 'Truffle honey', 'Black pepper'],
    breads: ['Italian bread', 'Focaccia'],
    meats: ['Salami', 'Guanciale', 'Pancetta'],
    beverages: ['Italian red wine', 'Grappa'],
  },
  {
    cheeseId: 'gorgonzola',
    wines: ['Port', 'Sauternes', 'Amarone', 'Moscato'],
    fruits: ['Pears', 'Figs', 'Walnuts', 'Grapes', 'Dried apricots'],
    nuts: ['Walnuts', 'Pecans', 'Candied nuts'],
    condiments: ['Honey', 'Fig jam', 'Balsamic reduction'],
    breads: ['Walnut bread', 'Crusty bread', 'Crackers'],
    meats: ['Prosciutto', 'Speck'],
    beverages: ['Dessert wine', 'Port', 'Barley wine'],
  },
  {
    cheeseId: 'roquefort',
    wines: ['Sauternes', 'Port', 'Sweet Riesling', 'Sherry'],
    fruits: ['Pears', 'Figs', 'Grapes', 'Quince'],
    nuts: ['Walnuts', 'Hazelnuts'],
    condiments: ['Honey', 'Fig paste', 'Quince paste'],
    breads: ['Walnut bread', 'Raisin bread', 'Dark rye'],
    meats: ['Prosciutto'],
    beverages: ['Sauternes', 'Port', 'Sweet wines'],
  },
  {
    cheeseId: 'stilton',
    wines: ['Port', 'Sherry', 'Madeira', 'Sweet Riesling'],
    fruits: ['Pears', 'Figs', 'Walnuts', 'Grapes', 'Cranberries'],
    nuts: ['Walnuts', 'Pecans'],
    condiments: ['Port reduction', 'Honey', 'Quince jelly'],
    breads: ['Oatcakes', 'Digestive biscuits', 'Walnut bread'],
    meats: ['None traditionally'],
    beverages: ['Port', 'Madeira', 'Strong ale', 'Single malt whisky'],
  },
  {
    cheeseId: 'feta',
    wines: ['Assyrtiko', 'Sauvignon Blanc', 'Dry Rosé', 'Retsina'],
    fruits: ['Watermelon', 'Tomatoes', 'Olives', 'Figs', 'Peaches'],
    nuts: ['Pine nuts', 'Walnuts'],
    condiments: ['Olive oil', 'Za\'atar', 'Oregano', 'Honey'],
    breads: ['Pita bread', 'Flatbread', 'Crusty bread'],
    meats: ['Lamb', 'Grilled chicken'],
    beverages: ['Ouzo', 'Greek wine', 'Lemon water'],
  },
];

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  wines: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '🍷' },
  fruits: { bg: 'bg-red-50', text: 'text-red-700', icon: '🍎' },
  nuts: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🥜' },
  condiments: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '🍯' },
  breads: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🥖' },
  meats: { bg: 'bg-rose-50', text: 'text-rose-700', icon: '🥓' },
  beverages: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '☕' },
};

const categoryLabels: Record<string, string> = {
  wines: 'Wines',
  fruits: 'Fruits',
  nuts: 'Nuts',
  condiments: 'Condiments & Spreads',
  breads: 'Breads & Crackers',
  meats: 'Charcuterie',
  beverages: 'Other Beverages',
};

export default function CheesePairing() {
  const [selectedCheese, setSelectedCheese] = useState<string>('brie');
  const [categoryFilter, setCategoryFilter] = useState<Cheese['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCheeses = useMemo(() => {
    return cheeses.filter((cheese) => {
      const matchesCategory = categoryFilter === 'all' || cheese.category === categoryFilter;
      const matchesSearch =
        cheese.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cheese.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cheese.flavor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const selectedCheeseData = cheeses.find((c) => c.id === selectedCheese);
  const selectedPairings = pairings.find((p) => p.cheeseId === selectedCheese);

  const categories: { value: Cheese['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'soft', label: 'Soft' },
    { value: 'semi-soft', label: 'Semi-Soft' },
    { value: 'semi-hard', label: 'Semi-Hard' },
    { value: 'hard', label: 'Hard' },
    { value: 'blue', label: 'Blue' },
    { value: 'fresh', label: 'Fresh' },
  ];

  const getMilkIcon = (milk: Cheese['milk']) => {
    switch (milk) {
      case 'cow': return '🐄';
      case 'goat': return '🐐';
      case 'sheep': return '🐑';
      case 'mixed': return '🧀';
    }
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 2) return 'Mild';
    if (intensity === 3) return 'Medium';
    if (intensity === 4) return 'Strong';
    return 'Intense';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cheese Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-5 sticky top-4">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Select a Cheese
            </h2>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search cheeses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                    categoryFilter === cat.value
                      ? 'bg-[var(--color-wine)] text-white'
                      : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Cheese List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredCheeses.map((cheese) => (
                <button
                  key={cheese.id}
                  onClick={() => setSelectedCheese(cheese.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl transition-all',
                    selectedCheese === cheese.id
                      ? 'bg-[var(--color-wine-glow)] border-2 border-[var(--color-wine)]'
                      : 'bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] border-2 border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', cheese.color)}>
                      {getMilkIcon(cheese.milk)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] text-sm">
                        {cheese.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {cheese.origin} • {getIntensityLabel(cheese.intensity)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pairing Results */}
        <div className="lg:col-span-2">
          {selectedCheeseData && selectedPairings && (
            <>
              {/* Cheese Info Card */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center text-3xl', selectedCheeseData.color)}>
                    🧀
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                      {selectedCheeseData.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)]">
                        {getMilkIcon(selectedCheeseData.milk)} {selectedCheeseData.milk.charAt(0).toUpperCase() + selectedCheeseData.milk.slice(1)} milk
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)]">
                        📍 {selectedCheeseData.origin}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)]">
                        {selectedCheeseData.category.charAt(0).toUpperCase() + selectedCheeseData.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] mb-4">{selectedCheeseData.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">Flavor Profile</span>
                    <p className="text-sm text-[var(--text-primary)]">{selectedCheeseData.flavor}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">Texture</span>
                    <p className="text-sm text-[var(--text-primary)]">{selectedCheeseData.texture}</p>
                  </div>
                </div>

                {/* Intensity Bar */}
                <div className="mt-4">
                  <span className="text-xs font-medium text-[var(--text-muted)]">Intensity</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'w-6 h-2 rounded-full',
                            level <= selectedCheeseData.intensity
                              ? 'bg-[var(--color-wine)]'
                              : 'bg-[var(--color-cream)]'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {getIntensityLabel(selectedCheeseData.intensity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pairings Grid */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6">
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
                  Perfect Pairings for {selectedCheeseData.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(categoryColors) as Array<keyof typeof categoryColors>).map((key) => {
                    const items = selectedPairings[key as keyof CheesePairings];
                    if (!items || !Array.isArray(items) || items.length === 0) return null;

                    const { bg, text, icon } = categoryColors[key];

                    return (
                      <div key={key} className={cn('rounded-xl p-4', bg)}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{icon}</span>
                          <h4 className={cn('font-medium', text)}>
                            {categoryLabels[key]}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(items as string[]).map((item) => (
                            <span
                              key={item}
                              className="text-xs px-2 py-1 bg-white/70 rounded-full text-[var(--text-secondary)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Pairing Tips */}
      <div className="mt-8 bg-amber-50 rounded-xl p-6">
        <h3 className="font-display font-semibold text-amber-800 mb-4">
          Cheese Board Building Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-900">
          <div className="flex gap-3">
            <span className="text-xl">🧀</span>
            <p>
              <strong>Variety:</strong> Include at least 3-5 cheeses from different categories
              (soft, hard, blue) for the best experience.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🌡️</span>
            <p>
              <strong>Temperature:</strong> Remove cheese from the fridge 30-60 minutes before
              serving for optimal flavor and texture.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">⚖️</span>
            <p>
              <strong>Portions:</strong> Plan for 2-3 oz per person for appetizers, or
              4-6 oz per person if cheese is the main event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
