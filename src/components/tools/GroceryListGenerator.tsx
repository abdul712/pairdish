/**
 * Grocery List Generator Component
 *
 * Generate organized shopping lists from recipes with store section grouping.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

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

  // Print list
  const printList = () => {
    const printContent = Object.entries(groupedItems)
      .filter(([, items]) => items.length > 0)
      .map(([section, items]) => {
        const info = SECTION_INFO[section as StoreSection];
        return `${info.icon} ${info.name}\n${items.map((i) => `  ${i.checked ? '✓' : '○'} ${i.quantity} ${i.unit} ${i.name}`).join('\n')}`;
      })
      .join('\n\n');

    const printWindow = window.open('', '', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Grocery List</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              pre { font-family: system-ui, sans-serif; white-space: pre-wrap; line-height: 1.8; }
            </style>
          </head>
          <body>
            <h1>Grocery List</h1>
            <pre>${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
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
            <div className="flex gap-2">
              <button
                onClick={clearChecked}
                disabled={checkedItems === 0}
                className="btn text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Clear Checked
              </button>
              <button
                onClick={printList}
                className="btn text-sm bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
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
    </div>
  );
}
