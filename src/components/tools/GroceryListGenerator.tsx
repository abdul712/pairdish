/**
 * Grocery List Generator Component
 *
 * Generate organized shopping lists from recipes with store section grouping.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '../../lib/utils';
import {
    generateShareableUrl,
    parseSharedData,
    shareContent,
    generatePrintableHTML,
    printContent,
    downloadAsHTML,
    copyToClipboard,
    BRAND,
} from '../../lib/export-utils';

// Store section categories
type StoreSection =
  | 'produce'
  | 'meat'
  | 'dairy'
  | 'bakery'
  | 'frozen'
  | 'pantry'
  | 'spices'
  | 'canned'
  | 'beverages'
  | 'other';

const SECTION_INFO: Record<StoreSection, { name: string; icon: string; color: string }> = {
  produce: { name: 'Produce', icon: '🥬', color: 'green' },
  meat: { name: 'Meat & Seafood', icon: '🥩', color: 'red' },
  dairy: { name: 'Dairy & Eggs', icon: '🧀', color: 'yellow' },
  bakery: { name: 'Bakery & Bread', icon: '🍞', color: 'amber' },
  frozen: { name: 'Frozen', icon: '❄️', color: 'blue' },
  pantry: { name: 'Pantry & Dry Goods', icon: '🫙', color: 'orange' },
  spices: { name: 'Spices & Seasonings', icon: '🧂', color: 'purple' },
  canned: { name: 'Canned & Jarred', icon: '🥫', color: 'rose' },
  beverages: { name: 'Beverages', icon: '🥤', color: 'cyan' },
  other: { name: 'Other', icon: '📦', color: 'gray' },
};

// Common ingredients with their store sections
const INGREDIENT_SECTIONS: Record<string, StoreSection> = {
  // Produce
  onion: 'produce',
  onions: 'produce',
  garlic: 'produce',
  tomato: 'produce',
  tomatoes: 'produce',
  potato: 'produce',
  potatoes: 'produce',
  carrot: 'produce',
  carrots: 'produce',
  celery: 'produce',
  lettuce: 'produce',
  spinach: 'produce',
  kale: 'produce',
  broccoli: 'produce',
  cauliflower: 'produce',
  'bell pepper': 'produce',
  'bell peppers': 'produce',
  peppers: 'produce',
  cucumber: 'produce',
  cucumbers: 'produce',
  zucchini: 'produce',
  mushroom: 'produce',
  mushrooms: 'produce',
  avocado: 'produce',
  lemon: 'produce',
  lemons: 'produce',
  lime: 'produce',
  limes: 'produce',
  orange: 'produce',
  oranges: 'produce',
  apple: 'produce',
  apples: 'produce',
  banana: 'produce',
  bananas: 'produce',
  berries: 'produce',
  strawberries: 'produce',
  blueberries: 'produce',
  ginger: 'produce',
  herbs: 'produce',
  parsley: 'produce',
  cilantro: 'produce',
  basil: 'produce',
  mint: 'produce',
  rosemary: 'produce',
  thyme: 'produce',
  'green onions': 'produce',
  scallions: 'produce',
  jalapeño: 'produce',
  asparagus: 'produce',
  corn: 'produce',
  cabbage: 'produce',
  eggplant: 'produce',
  squash: 'produce',
  peas: 'produce',
  'green beans': 'produce',

  // Meat & Seafood
  chicken: 'meat',
  'chicken breast': 'meat',
  'chicken thighs': 'meat',
  beef: 'meat',
  'ground beef': 'meat',
  steak: 'meat',
  pork: 'meat',
  'pork chops': 'meat',
  bacon: 'meat',
  sausage: 'meat',
  ham: 'meat',
  turkey: 'meat',
  'ground turkey': 'meat',
  salmon: 'meat',
  shrimp: 'meat',
  fish: 'meat',
  tuna: 'meat',
  cod: 'meat',
  tilapia: 'meat',
  lamb: 'meat',
  duck: 'meat',

  // Dairy & Eggs
  milk: 'dairy',
  butter: 'dairy',
  eggs: 'dairy',
  egg: 'dairy',
  cheese: 'dairy',
  cheddar: 'dairy',
  mozzarella: 'dairy',
  parmesan: 'dairy',
  'cream cheese': 'dairy',
  'sour cream': 'dairy',
  yogurt: 'dairy',
  'greek yogurt': 'dairy',
  cream: 'dairy',
  'heavy cream': 'dairy',
  'half and half': 'dairy',
  'cottage cheese': 'dairy',
  ricotta: 'dairy',

  // Bakery
  bread: 'bakery',
  tortillas: 'bakery',
  rolls: 'bakery',
  buns: 'bakery',
  bagels: 'bakery',
  croissants: 'bakery',
  pita: 'bakery',
  'naan bread': 'bakery',

  // Frozen
  'frozen vegetables': 'frozen',
  'frozen fruit': 'frozen',
  'ice cream': 'frozen',
  'frozen pizza': 'frozen',
  'frozen berries': 'frozen',

  // Pantry & Dry Goods
  rice: 'pantry',
  pasta: 'pantry',
  spaghetti: 'pantry',
  noodles: 'pantry',
  flour: 'pantry',
  sugar: 'pantry',
  'brown sugar': 'pantry',
  'powdered sugar': 'pantry',
  oats: 'pantry',
  cereal: 'pantry',
  quinoa: 'pantry',
  couscous: 'pantry',
  lentils: 'pantry',
  'dried beans': 'pantry',
  'bread crumbs': 'pantry',
  'panko': 'pantry',
  nuts: 'pantry',
  almonds: 'pantry',
  walnuts: 'pantry',
  peanuts: 'pantry',
  'peanut butter': 'pantry',
  honey: 'pantry',
  'maple syrup': 'pantry',
  'chocolate chips': 'pantry',
  'baking powder': 'pantry',
  'baking soda': 'pantry',
  yeast: 'pantry',
  'vanilla extract': 'pantry',
  cornstarch: 'pantry',
  crackers: 'pantry',
  chips: 'pantry',

  // Spices & Seasonings
  salt: 'spices',
  pepper: 'spices',
  'black pepper': 'spices',
  paprika: 'spices',
  cumin: 'spices',
  'chili powder': 'spices',
  oregano: 'spices',
  cinnamon: 'spices',
  nutmeg: 'spices',
  cayenne: 'spices',
  'garlic powder': 'spices',
  'onion powder': 'spices',
  'italian seasoning': 'spices',
  'curry powder': 'spices',
  turmeric: 'spices',
  'bay leaves': 'spices',
  'red pepper flakes': 'spices',

  // Canned & Jarred
  'tomato sauce': 'canned',
  'tomato paste': 'canned',
  'diced tomatoes': 'canned',
  'crushed tomatoes': 'canned',
  'canned beans': 'canned',
  'black beans': 'canned',
  'kidney beans': 'canned',
  chickpeas: 'canned',
  'canned corn': 'canned',
  'canned tuna': 'canned',
  broth: 'canned',
  'chicken broth': 'canned',
  'beef broth': 'canned',
  'vegetable broth': 'canned',
  stock: 'canned',
  'coconut milk': 'canned',
  olives: 'canned',
  pickles: 'canned',
  salsa: 'canned',
  'soy sauce': 'canned',
  'worcestershire sauce': 'canned',
  mustard: 'canned',
  ketchup: 'canned',
  mayo: 'canned',
  mayonnaise: 'canned',
  vinegar: 'canned',
  'olive oil': 'canned',
  'vegetable oil': 'canned',
  'sesame oil': 'canned',
  oil: 'canned',

  // Beverages
  water: 'beverages',
  juice: 'beverages',
  'orange juice': 'beverages',
  wine: 'beverages',
  beer: 'beverages',
  coffee: 'beverages',
  tea: 'beverages',
  soda: 'beverages',
};

interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  section: StoreSection;
  checked: boolean;
  fromRecipe?: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
}

interface SharedGroceryData {
  listName: string;
  items: GroceryItem[];
}

// Sample recipes to demonstrate
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'spaghetti-bolognese',
    name: 'Spaghetti Bolognese',
    ingredients: [
      { name: 'spaghetti', quantity: '1', unit: 'lb' },
      { name: 'ground beef', quantity: '1', unit: 'lb' },
      { name: 'onion', quantity: '1', unit: 'medium' },
      { name: 'garlic', quantity: '4', unit: 'cloves' },
      { name: 'crushed tomatoes', quantity: '28', unit: 'oz can' },
      { name: 'tomato paste', quantity: '2', unit: 'tbsp' },
      { name: 'olive oil', quantity: '2', unit: 'tbsp' },
      { name: 'italian seasoning', quantity: '1', unit: 'tsp' },
      { name: 'parmesan', quantity: '1/2', unit: 'cup' },
      { name: 'salt', quantity: '', unit: 'to taste' },
      { name: 'pepper', quantity: '', unit: 'to taste' },
    ],
  },
  {
    id: 'chicken-stir-fry',
    name: 'Chicken Stir Fry',
    ingredients: [
      { name: 'chicken breast', quantity: '1.5', unit: 'lbs' },
      { name: 'broccoli', quantity: '2', unit: 'cups' },
      { name: 'bell peppers', quantity: '2', unit: 'medium' },
      { name: 'carrots', quantity: '2', unit: 'medium' },
      { name: 'garlic', quantity: '3', unit: 'cloves' },
      { name: 'ginger', quantity: '1', unit: 'inch' },
      { name: 'soy sauce', quantity: '1/4', unit: 'cup' },
      { name: 'sesame oil', quantity: '1', unit: 'tbsp' },
      { name: 'rice', quantity: '2', unit: 'cups' },
      { name: 'green onions', quantity: '3', unit: 'stalks' },
    ],
  },
  {
    id: 'tacos',
    name: 'Beef Tacos',
    ingredients: [
      { name: 'ground beef', quantity: '1', unit: 'lb' },
      { name: 'tortillas', quantity: '12', unit: 'small' },
      { name: 'onion', quantity: '1', unit: 'medium' },
      { name: 'tomatoes', quantity: '2', unit: 'medium' },
      { name: 'lettuce', quantity: '1', unit: 'head' },
      { name: 'cheddar', quantity: '1', unit: 'cup shredded' },
      { name: 'sour cream', quantity: '1/2', unit: 'cup' },
      { name: 'salsa', quantity: '1', unit: 'cup' },
      { name: 'cumin', quantity: '1', unit: 'tsp' },
      { name: 'chili powder', quantity: '1', unit: 'tbsp' },
    ],
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    ingredients: [
      { name: 'lettuce', quantity: '2', unit: 'heads romaine' },
      { name: 'parmesan', quantity: '1/2', unit: 'cup shaved' },
      { name: 'bread', quantity: '2', unit: 'slices for croutons' },
      { name: 'garlic', quantity: '2', unit: 'cloves' },
      { name: 'lemon', quantity: '1', unit: 'juiced' },
      { name: 'olive oil', quantity: '1/3', unit: 'cup' },
      { name: 'eggs', quantity: '1', unit: 'yolk' },
      { name: 'worcestershire sauce', quantity: '1', unit: 'tsp' },
      { name: 'pepper', quantity: '', unit: 'to taste' },
    ],
  },
  {
    id: 'banana-bread',
    name: 'Banana Bread',
    ingredients: [
      { name: 'bananas', quantity: '3', unit: 'ripe' },
      { name: 'flour', quantity: '1.5', unit: 'cups' },
      { name: 'sugar', quantity: '3/4', unit: 'cup' },
      { name: 'butter', quantity: '1/3', unit: 'cup melted' },
      { name: 'eggs', quantity: '1', unit: 'large' },
      { name: 'baking soda', quantity: '1', unit: 'tsp' },
      { name: 'salt', quantity: '1/4', unit: 'tsp' },
      { name: 'vanilla extract', quantity: '1', unit: 'tsp' },
      { name: 'walnuts', quantity: '1/2', unit: 'cup chopped' },
    ],
  },
];

function getSectionForIngredient(name: string): StoreSection {
  const normalized = name.toLowerCase().trim();

  // Direct match
  if (INGREDIENT_SECTIONS[normalized]) {
    return INGREDIENT_SECTIONS[normalized];
  }

  // Partial match
  for (const [key, section] of Object.entries(INGREDIENT_SECTIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return section;
    }
  }

  return 'other';
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function GroceryListGenerator() {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [manualItem, setManualItem] = useState({ name: '', quantity: '', unit: '' });
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [listName, setListName] = useState('My Shopping List');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLoadedFromShare, setIsLoadedFromShare] = useState(false);

  // Load from shared URL on mount
  useEffect(() => {
    const sharedData = parseSharedData<SharedGroceryData | null>(null);
    if (sharedData) {
      setListName(sharedData.listName || 'Shared Shopping List');
      if (sharedData.items && sharedData.items.length > 0) {
        setGroceryList(sharedData.items);
      }
      setIsLoadedFromShare(true);
    }
  }, []);

  // Generate grocery list from selected recipes
  const generateList = () => {
    const itemMap = new Map<string, GroceryItem>();

    selectedRecipes.forEach((recipeId) => {
      const recipe = SAMPLE_RECIPES.find((r) => r.id === recipeId);
      if (!recipe) return;

      recipe.ingredients.forEach((ing) => {
        const key = ing.name.toLowerCase().trim();
        const existing = itemMap.get(key);

        if (existing) {
          // Combine quantities (simplified - just note both)
          existing.quantity = existing.quantity
            ? `${existing.quantity}, ${ing.quantity} ${ing.unit}`
            : `${ing.quantity} ${ing.unit}`;
          if (existing.fromRecipe) {
            existing.fromRecipe += `, ${recipe.name}`;
          }
        } else {
          itemMap.set(key, {
            id: generateId(),
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            section: getSectionForIngredient(ing.name),
            checked: false,
            fromRecipe: recipe.name,
          });
        }
      });
    });

    setGroceryList(Array.from(itemMap.values()));
  };

  // Add manual item
  const addManualItem = () => {
    if (!manualItem.name.trim()) return;

    const newItem: GroceryItem = {
      id: generateId(),
      name: manualItem.name,
      quantity: manualItem.quantity,
      unit: manualItem.unit,
      section: getSectionForIngredient(manualItem.name),
      checked: false,
    };

    setGroceryList([...groceryList, newItem]);
    setManualItem({ name: '', quantity: '', unit: '' });
  };

  // Toggle item checked
  const toggleItem = (id: string) => {
    setGroceryList(
      groceryList.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Remove item
  const removeItem = (id: string) => {
    setGroceryList(groceryList.filter((item) => item.id !== id));
  };

  // Clear checked items
  const clearChecked = () => {
    setGroceryList(groceryList.filter((item) => !item.checked));
  };

  // Group items by section
  const groupedItems = useMemo(() => {
    const groups: Record<StoreSection, GroceryItem[]> = {
      produce: [],
      meat: [],
      dairy: [],
      bakery: [],
      frozen: [],
      pantry: [],
      spices: [],
      canned: [],
      beverages: [],
      other: [],
    };

    groceryList.forEach((item) => {
      groups[item.section].push(item);
    });

    return groups;
  }, [groceryList]);

  // Stats
  const totalItems = groceryList.length;
  const checkedItems = groceryList.filter((i) => i.checked).length;

  // Generate HTML content for print/download
  const generateListHTML = useCallback(() => {
    const sectionsHTML = Object.entries(groupedItems)
      .filter(([, items]) => items.length > 0)
      .map(([section, items]) => {
        const info = SECTION_INFO[section as StoreSection];
        const sectionChecked = items.filter((i) => i.checked).length;
        const itemsHTML = items
          .map((item) => `
            <div class="item" style="${item.checked ? 'opacity: 0.6; text-decoration: line-through;' : ''}">
              <span class="item-name">${item.checked ? '✓' : '○'} ${item.quantity} ${item.unit} ${item.name}</span>
              ${item.fromRecipe ? `<span class="item-detail">From: ${item.fromRecipe}</span>` : ''}
            </div>
          `)
          .join('');

        return `
          <div class="section">
            <h3 class="section-title">${info.icon} ${info.name} (${sectionChecked}/${items.length})</h3>
            ${itemsHTML}
          </div>
        `;
      })
      .join('');

    return `
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">${totalItems}</div>
          <div class="stat-label">Total Items</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${checkedItems}</div>
          <div class="stat-label">Checked Off</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${totalItems - checkedItems}</div>
          <div class="stat-label">Remaining</div>
        </div>
      </div>
      ${sectionsHTML}
    `;
  }, [groupedItems, totalItems, checkedItems]);

  // Print list with branding
  const printList = useCallback(() => {
    const html = generatePrintableHTML({
      title: listName,
      subtitle: `${totalItems} items across ${Object.values(groupedItems).filter(items => items.length > 0).length} store sections`,
      content: generateListHTML(),
    });
    printContent(html);
  }, [listName, totalItems, groupedItems, generateListHTML]);

  // Download as HTML
  const handleDownload = useCallback(() => {
    downloadAsHTML({
      title: listName,
      subtitle: `${totalItems} items across ${Object.values(groupedItems).filter(items => items.length > 0).length} store sections`,
      content: generateListHTML(),
      filename: `${listName.toLowerCase().replace(/\s+/g, '-')}.html`,
    });
  }, [listName, totalItems, groupedItems, generateListHTML]);

  // Generate shareable URL
  const handleShare = useCallback(() => {
    const data: SharedGroceryData = {
      listName,
      items: groceryList,
    };
    const url = generateShareableUrl('/tools/grocery-list', data);
    setShareUrl(url);
    setShowShareModal(true);
    setLinkCopied(false);
  }, [listName, groceryList]);

  // Copy share link
  const handleCopyLink = useCallback(async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  }, [shareUrl]);

  // Share via native share API
  const handleNativeShare = useCallback(async () => {
    await shareContent({
      title: listName,
      text: `Check out my shopping list with ${totalItems} items!`,
      url: shareUrl,
    });
  }, [listName, totalItems, shareUrl]);

  // Copy list as text
  const handleCopyText = useCallback(async () => {
    const text = Object.entries(groupedItems)
      .filter(([, items]) => items.length > 0)
      .map(([section, items]) => {
        const info = SECTION_INFO[section as StoreSection];
        return `${info.icon} ${info.name}\n${items.map((i) => `  ${i.checked ? '✓' : '○'} ${i.quantity} ${i.unit} ${i.name}`).join('\n')}`;
      })
      .join('\n\n');

    const fullText = `${listName}\n${'='.repeat(listName.length)}\n\n${text}\n\nCreated with ${BRAND.name} - ${BRAND.url}`;
    await copyToClipboard(fullText);
  }, [listName, groupedItems]);

  // Reset list
  const handleReset = useCallback(() => {
    setListName('My Shopping List');
    setGroceryList([]);
    setSelectedRecipes([]);
    setIsLoadedFromShare(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Shared List Banner */}
      {isLoadedFromShare && (
        <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] text-white rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <div>
              <p className="font-medium">You're viewing a shared shopping list!</p>
              <p className="text-sm text-white/80">Check items off as you shop.</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Start Fresh
          </button>
        </div>
      )}

      {/* List Name Input */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          List Name
        </label>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Enter list name..."
          className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
        />
      </div>

      {/* Recipe Selection */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Select Recipes
          </h2>
          <button
            onClick={() => setShowAddRecipe(!showAddRecipe)}
            className="text-sm text-[var(--color-wine)] hover:underline"
          >
            {showAddRecipe ? 'Hide recipes' : 'Browse recipes'}
          </button>
        </div>

        {showAddRecipe && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {SAMPLE_RECIPES.map((recipe) => (
              <label
                key={recipe.id}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  selectedRecipes.includes(recipe.id)
                    ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                    : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine-light)]'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedRecipes.includes(recipe.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRecipes([...selectedRecipes, recipe.id]);
                    } else {
                      setSelectedRecipes(selectedRecipes.filter((id) => id !== recipe.id));
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--color-wine)] focus:ring-[var(--color-wine)]"
                />
                <div>
                  <span className="font-medium text-[var(--text-primary)]">{recipe.name}</span>
                  <span className="block text-xs text-[var(--text-muted)]">
                    {recipe.ingredients.length} ingredients
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}

        {selectedRecipes.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-muted)]">
              {selectedRecipes.length} recipe{selectedRecipes.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={generateList}
              className="btn bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
            >
              Generate List
            </button>
          </div>
        )}
      </div>

      {/* Manual Add */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Add Items Manually
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Item name"
            value={manualItem.name}
            onChange={(e) => setManualItem({ ...manualItem, name: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
          />
          <input
            type="text"
            placeholder="Qty"
            value={manualItem.quantity}
            onChange={(e) => setManualItem({ ...manualItem, quantity: e.target.value })}
            className="w-20 px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
          />
          <input
            type="text"
            placeholder="Unit"
            value={manualItem.unit}
            onChange={(e) => setManualItem({ ...manualItem, unit: e.target.value })}
            className="w-24 px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
          />
          <button
            onClick={addManualItem}
            disabled={!manualItem.name.trim()}
            className="btn bg-[var(--color-sage)] text-white hover:bg-green-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Grocery List */}
      {groceryList.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Your Grocery List
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {checkedItems} of {totalItems} items checked
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={clearChecked}
                disabled={checkedItems === 0}
                className="btn text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Clear Checked
              </button>
              <button
                onClick={handleCopyText}
                className="btn text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </button>
              <button
                onClick={handleShare}
                className="btn text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" x2="12" y1="2" y2="15" />
                </svg>
                Share
              </button>
              <button
                onClick={handleDownload}
                className="btn text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download
              </button>
              <button
                onClick={printList}
                className="btn text-sm bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect width="12" height="8" x="6" y="14" />
                </svg>
                Print
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-sage)] transition-all duration-300"
                style={{ width: `${totalItems > 0 ? (checkedItems / totalItems) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Grouped List */}
          <div className="space-y-6">
            {Object.entries(groupedItems)
              .filter(([, items]) => items.length > 0)
              .map(([section, items]) => {
                const info = SECTION_INFO[section as StoreSection];
                const sectionChecked = items.filter((i) => i.checked).length;

                return (
                  <div key={section}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{info.icon}</span>
                      <h3 className="font-display font-semibold text-[var(--text-primary)]">
                        {info.name}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)] bg-gray-100 px-2 py-0.5 rounded-full">
                        {sectionChecked}/{items.length}
                      </span>
                    </div>

                    <div className="space-y-2 pl-8">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg transition-all',
                            item.checked ? 'bg-gray-50 opacity-60' : 'bg-[var(--color-cream)]'
                          )}
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                              item.checked
                                ? 'bg-[var(--color-sage)] border-[var(--color-sage)] text-white'
                                : 'border-gray-300 hover:border-[var(--color-sage)]'
                            )}
                          >
                            {item.checked && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>

                          <div className="flex-1">
                            <span
                              className={cn(
                                'font-medium',
                                item.checked
                                  ? 'line-through text-[var(--text-muted)]'
                                  : 'text-[var(--text-primary)]'
                              )}
                            >
                              {item.name}
                            </span>
                            {(item.quantity || item.unit) && (
                              <span className="ml-2 text-sm text-[var(--text-muted)]">
                                {item.quantity} {item.unit}
                              </span>
                            )}
                            {item.fromRecipe && (
                              <span className="block text-xs text-[var(--text-muted)]">
                                From: {item.fromRecipe}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-[var(--color-cream)] rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Shopping Tips
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-sage)]">✓</span>
            <span>Shop the perimeter first (produce, meat, dairy) for fresh items.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-sage)]">✓</span>
            <span>Check your pantry before shopping to avoid duplicate purchases.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-sage)]">✓</span>
            <span>Buy frozen vegetables for longer shelf life with similar nutrition.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-sage)]">✓</span>
            <span>Meal prep proteins on Sunday to save time during the week.</span>
          </li>
        </ul>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Share Shopping List
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="text-[var(--text-secondary)] mb-4">
              Share this link so others can view and check off items from your list:
            </p>

            {/* Share URL */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-[var(--color-cream)] border border-[var(--color-cream-dark)] rounded-lg text-sm truncate"
              />
              <button
                onClick={handleCopyLink}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                  linkCopied
                    ? "bg-green-500 text-white"
                    : "bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
                )}
              >
                {linkCopied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2 p-3 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" x2="12" y1="2" y2="15" />
                </svg>
                <span className="text-xs text-[var(--text-secondary)]">Share</span>
              </button>
              <a
                href={`mailto:?subject=${encodeURIComponent(listName)}&body=${encodeURIComponent(`Here's my shopping list!\n\n${shareUrl}`)}`}
                className="flex flex-col items-center gap-2 p-3 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="text-xs text-[var(--text-secondary)]">Email</span>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Here's my shopping list!\n\n${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="text-xs text-[var(--text-secondary)]">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
