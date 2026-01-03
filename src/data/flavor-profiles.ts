/**
 * PairingPlates - Flavor Profiles Data
 * 
 * Comprehensive database of ingredients with flavor profiles,
 * aromatic compounds, and pairing suggestions.
 */

export interface FlavorProfile {
    id: string;
    name: string;
    category: 'protein' | 'vegetable' | 'fruit' | 'dairy' | 'grain' | 'herb' | 'spice' | 'sauce' | 'beverage' | 'nut' | 'legume';
    subcategory: string;
    flavorNotes: string[];
    aromaticProfile: ('sweet' | 'sour' | 'salty' | 'bitter' | 'umami' | 'fatty' | 'spicy')[];
    intensity: 'mild' | 'medium' | 'bold';
    bestPairings: string[];
    unexpectedPairings: string[];
    cuisineAffinities: string[];
    seasonality: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
    cookingMethods: string[];
    image?: string;
}

export const flavorProfiles: FlavorProfile[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // PROTEINS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'salmon',
        name: 'Salmon',
        category: 'protein',
        subcategory: 'fish',
        flavorNotes: ['rich', 'buttery', 'slightly sweet', 'oceanic'],
        aromaticProfile: ['fatty', 'umami', 'sweet'],
        intensity: 'medium',
        bestPairings: ['dill', 'lemon', 'capers', 'cucumber', 'cream cheese', 'asparagus', 'fennel', 'white wine'],
        unexpectedPairings: ['mango', 'miso', 'bourbon', 'beets', 'grapefruit', 'coffee rub'],
        cuisineAffinities: ['Nordic', 'Japanese', 'Pacific Northwest', 'French'],
        seasonality: 'year-round',
        cookingMethods: ['bake', 'grill', 'smoke', 'poach', 'raw', 'pan-sear'],
    },
    {
        id: 'chicken',
        name: 'Chicken',
        category: 'protein',
        subcategory: 'poultry',
        flavorNotes: ['mild', 'versatile', 'slightly sweet'],
        aromaticProfile: ['umami', 'fatty'],
        intensity: 'mild',
        bestPairings: ['lemon', 'rosemary', 'thyme', 'garlic', 'mushrooms', 'white wine', 'butter'],
        unexpectedPairings: ['chocolate', 'coffee', 'lavender', 'pomegranate', 'tahini'],
        cuisineAffinities: ['French', 'Italian', 'Mexican', 'Chinese', 'Indian', 'American'],
        seasonality: 'year-round',
        cookingMethods: ['roast', 'grill', 'braise', 'fry', 'poach', 'smoke'],
    },
    {
        id: 'beef',
        name: 'Beef',
        category: 'protein',
        subcategory: 'red meat',
        flavorNotes: ['rich', 'savory', 'meaty', 'earthy'],
        aromaticProfile: ['umami', 'fatty', 'salty'],
        intensity: 'bold',
        bestPairings: ['red wine', 'garlic', 'rosemary', 'thyme', 'mushrooms', 'blue cheese', 'horseradish'],
        unexpectedPairings: ['dark chocolate', 'coffee', 'anchovies', 'miso', 'szechuan peppercorn'],
        cuisineAffinities: ['American', 'French', 'Argentinian', 'Korean', 'Japanese'],
        seasonality: 'year-round',
        cookingMethods: ['grill', 'roast', 'braise', 'pan-sear', 'smoke', 'sous vide'],
    },
    {
        id: 'lamb',
        name: 'Lamb',
        category: 'protein',
        subcategory: 'red meat',
        flavorNotes: ['gamey', 'rich', 'earthy', 'slightly sweet'],
        aromaticProfile: ['fatty', 'umami'],
        intensity: 'bold',
        bestPairings: ['rosemary', 'mint', 'garlic', 'cumin', 'red wine', 'feta cheese', 'eggplant'],
        unexpectedPairings: ['lavender', 'pomegranate', 'anchovy', 'coffee', 'prunes'],
        cuisineAffinities: ['Greek', 'Middle Eastern', 'Moroccan', 'French', 'Indian'],
        seasonality: 'spring',
        cookingMethods: ['roast', 'grill', 'braise', 'smoke'],
    },
    {
        id: 'pork',
        name: 'Pork',
        category: 'protein',
        subcategory: 'white meat',
        flavorNotes: ['mild', 'slightly sweet', 'savory'],
        aromaticProfile: ['fatty', 'sweet', 'umami'],
        intensity: 'medium',
        bestPairings: ['apple', 'sage', 'garlic', 'fennel', 'cabbage', 'maple', 'mustard'],
        unexpectedPairings: ['pineapple', 'cloves', 'coffee', 'chocolate', 'fish sauce'],
        cuisineAffinities: ['German', 'Chinese', 'Mexican', 'Southern US', 'Korean'],
        seasonality: 'year-round',
        cookingMethods: ['roast', 'grill', 'braise', 'smoke', 'pan-fry'],
    },
    {
        id: 'shrimp',
        name: 'Shrimp',
        category: 'protein',
        subcategory: 'shellfish',
        flavorNotes: ['sweet', 'briny', 'delicate'],
        aromaticProfile: ['sweet', 'umami', 'salty'],
        intensity: 'mild',
        bestPairings: ['garlic', 'lemon', 'butter', 'white wine', 'tomato', 'coconut', 'chili'],
        unexpectedPairings: ['bacon', 'vanilla', 'grapefruit', 'fennel pollen', 'coffee'],
        cuisineAffinities: ['Cajun', 'Thai', 'Mediterranean', 'Chinese', 'Indian'],
        seasonality: 'year-round',
        cookingMethods: ['sauté', 'grill', 'boil', 'fry', 'raw'],
    },
    {
        id: 'scallops',
        name: 'Scallops',
        category: 'protein',
        subcategory: 'shellfish',
        flavorNotes: ['sweet', 'buttery', 'delicate', 'oceanic'],
        aromaticProfile: ['sweet', 'umami'],
        intensity: 'mild',
        bestPairings: ['bacon', 'butter', 'lemon', 'pea puree', 'corn', 'cauliflower', 'brown butter'],
        unexpectedPairings: ['black pudding', 'vanilla', 'passionfruit', 'truffle', 'curry'],
        cuisineAffinities: ['French', 'American', 'Japanese'],
        seasonality: 'fall',
        cookingMethods: ['pan-sear', 'grill', 'poach', 'raw'],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // VEGETABLES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'asparagus',
        name: 'Asparagus',
        category: 'vegetable',
        subcategory: 'stem',
        flavorNotes: ['grassy', 'earthy', 'slightly bitter'],
        aromaticProfile: ['bitter', 'sweet'],
        intensity: 'medium',
        bestPairings: ['lemon', 'parmesan', 'eggs', 'hollandaise', 'prosciutto', 'salmon'],
        unexpectedPairings: ['strawberry', 'orange', 'miso', 'sesame', 'goat cheese'],
        cuisineAffinities: ['French', 'Italian', 'American'],
        seasonality: 'spring',
        cookingMethods: ['grill', 'roast', 'steam', 'sauté', 'blanch'],
    },
    {
        id: 'mushroom',
        name: 'Mushroom',
        category: 'vegetable',
        subcategory: 'fungi',
        flavorNotes: ['earthy', 'umami', 'meaty', 'woodsy'],
        aromaticProfile: ['umami', 'sweet'],
        intensity: 'medium',
        bestPairings: ['garlic', 'thyme', 'butter', 'cream', 'red wine', 'truffle oil', 'soy sauce'],
        unexpectedPairings: ['coffee', 'chocolate', 'caramel', 'goat cheese', 'dill'],
        cuisineAffinities: ['French', 'Italian', 'Japanese', 'Chinese', 'Eastern European'],
        seasonality: 'fall',
        cookingMethods: ['sauté', 'roast', 'grill', 'braise', 'raw'],
    },
    {
        id: 'tomato',
        name: 'Tomato',
        category: 'vegetable',
        subcategory: 'fruit vegetable',
        flavorNotes: ['sweet', 'acidic', 'savory', 'bright'],
        aromaticProfile: ['sweet', 'sour', 'umami'],
        intensity: 'medium',
        bestPairings: ['basil', 'mozzarella', 'olive oil', 'garlic', 'balsamic', 'oregano'],
        unexpectedPairings: ['strawberry', 'watermelon', 'chocolate', 'vanilla', 'cinnamon'],
        cuisineAffinities: ['Italian', 'Mexican', 'Spanish', 'Greek', 'Indian'],
        seasonality: 'summer',
        cookingMethods: ['raw', 'roast', 'sauce', 'grill', 'confit'],
    },
    {
        id: 'butternut-squash',
        name: 'Butternut Squash',
        category: 'vegetable',
        subcategory: 'squash',
        flavorNotes: ['sweet', 'nutty', 'earthy', 'creamy'],
        aromaticProfile: ['sweet'],
        intensity: 'medium',
        bestPairings: ['sage', 'brown butter', 'nutmeg', 'maple', 'parmesan', 'bacon'],
        unexpectedPairings: ['curry', 'tahini', 'miso', 'coconut', 'ginger'],
        cuisineAffinities: ['American', 'Italian', 'Thai'],
        seasonality: 'fall',
        cookingMethods: ['roast', 'soup', 'puree', 'grill'],
    },
    {
        id: 'beets',
        name: 'Beets',
        category: 'vegetable',
        subcategory: 'root',
        flavorNotes: ['earthy', 'sweet', 'mineral'],
        aromaticProfile: ['sweet'],
        intensity: 'bold',
        bestPairings: ['goat cheese', 'walnuts', 'orange', 'balsamic', 'arugula', 'dill'],
        unexpectedPairings: ['chocolate', 'horseradish', 'grapefruit', 'coffee', 'cardamom'],
        cuisineAffinities: ['Eastern European', 'Scandinavian', 'American'],
        seasonality: 'fall',
        cookingMethods: ['roast', 'pickle', 'raw', 'juice'],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HERBS & SPICES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'basil',
        name: 'Basil',
        category: 'herb',
        subcategory: 'fresh herb',
        flavorNotes: ['sweet', 'peppery', 'anise-like', 'fresh'],
        aromaticProfile: ['sweet', 'spicy'],
        intensity: 'medium',
        bestPairings: ['tomato', 'mozzarella', 'garlic', 'olive oil', 'lemon', 'pasta'],
        unexpectedPairings: ['strawberry', 'watermelon', 'chocolate', 'mint', 'peach'],
        cuisineAffinities: ['Italian', 'Thai', 'Vietnamese'],
        seasonality: 'summer',
        cookingMethods: ['raw', 'infused', 'blended'],
    },
    {
        id: 'rosemary',
        name: 'Rosemary',
        category: 'herb',
        subcategory: 'woody herb',
        flavorNotes: ['piney', 'woodsy', 'pungent', 'slightly minty'],
        aromaticProfile: ['bitter', 'sweet'],
        intensity: 'bold',
        bestPairings: ['lamb', 'chicken', 'potato', 'olive oil', 'garlic', 'lemon'],
        unexpectedPairings: ['chocolate', 'orange', 'honey', 'grapefruit', 'apple'],
        cuisineAffinities: ['Italian', 'French', 'Mediterranean'],
        seasonality: 'year-round',
        cookingMethods: ['roast', 'grill', 'infused', 'baked'],
    },
    {
        id: 'cumin',
        name: 'Cumin',
        category: 'spice',
        subcategory: 'seed spice',
        flavorNotes: ['earthy', 'warm', 'nutty', 'slightly bitter'],
        aromaticProfile: ['bitter', 'umami'],
        intensity: 'bold',
        bestPairings: ['coriander', 'chili', 'garlic', 'lamb', 'beans', 'yogurt', 'lime'],
        unexpectedPairings: ['chocolate', 'mango', 'carrot', 'cauliflower', 'apple'],
        cuisineAffinities: ['Mexican', 'Indian', 'Middle Eastern', 'North African'],
        seasonality: 'year-round',
        cookingMethods: ['toast', 'ground', 'temper'],
    },
    {
        id: 'cinnamon',
        name: 'Cinnamon',
        category: 'spice',
        subcategory: 'bark spice',
        flavorNotes: ['warm', 'sweet', 'woody', 'slightly spicy'],
        aromaticProfile: ['sweet', 'spicy'],
        intensity: 'bold',
        bestPairings: ['apple', 'pear', 'honey', 'brown sugar', 'nutmeg', 'vanilla'],
        unexpectedPairings: ['lamb', 'beef', 'tomato', 'coffee', 'chili'],
        cuisineAffinities: ['Middle Eastern', 'Mexican', 'American', 'Moroccan'],
        seasonality: 'year-round',
        cookingMethods: ['baking', 'stewing', 'braising', 'beverages'],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FRUITS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'lemon',
        name: 'Lemon',
        category: 'fruit',
        subcategory: 'citrus',
        flavorNotes: ['bright', 'tart', 'fresh', 'zesty'],
        aromaticProfile: ['sour', 'sweet'],
        intensity: 'bold',
        bestPairings: ['fish', 'chicken', 'olive oil', 'butter', 'herbs', 'garlic', 'honey'],
        unexpectedPairings: ['thyme', 'lavender', 'black pepper', 'parmesan', 'chili'],
        cuisineAffinities: ['Mediterranean', 'Middle Eastern', 'French', 'American'],
        seasonality: 'winter',
        cookingMethods: ['raw', 'preserved', 'zested', 'juiced'],
    },
    {
        id: 'apple',
        name: 'Apple',
        category: 'fruit',
        subcategory: 'pome fruit',
        flavorNotes: ['sweet', 'tart', 'crisp', 'fresh'],
        aromaticProfile: ['sweet', 'sour'],
        intensity: 'medium',
        bestPairings: ['cinnamon', 'caramel', 'pork', 'cheese', 'walnut', 'vanilla'],
        unexpectedPairings: ['black pudding', 'curry', 'brie', 'rosemary', 'fennel'],
        cuisineAffinities: ['American', 'French', 'German', 'British'],
        seasonality: 'fall',
        cookingMethods: ['raw', 'bake', 'sauce', 'cider', 'roast'],
    },
    {
        id: 'mango',
        name: 'Mango',
        category: 'fruit',
        subcategory: 'tropical',
        flavorNotes: ['sweet', 'tropical', 'floral', 'slightly tart'],
        aromaticProfile: ['sweet'],
        intensity: 'bold',
        bestPairings: ['lime', 'chili', 'coconut', 'cilantro', 'shrimp', 'sticky rice'],
        unexpectedPairings: ['salmon', 'duck', 'blue cheese', 'basil', 'black pepper'],
        cuisineAffinities: ['Thai', 'Indian', 'Mexican', 'Caribbean'],
        seasonality: 'summer',
        cookingMethods: ['raw', 'salsa', 'puree', 'grill'],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DAIRY & CHEESE
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'brie',
        name: 'Brie',
        category: 'dairy',
        subcategory: 'soft cheese',
        flavorNotes: ['creamy', 'buttery', 'earthy', 'mushroomy'],
        aromaticProfile: ['fatty', 'umami'],
        intensity: 'medium',
        bestPairings: ['honey', 'fig', 'walnut', 'baguette', 'apple', 'champagne'],
        unexpectedPairings: ['truffle', 'bacon', 'dark chocolate', 'thyme', 'pear'],
        cuisineAffinities: ['French'],
        seasonality: 'year-round',
        cookingMethods: ['raw', 'baked', 'melted'],
    },
    {
        id: 'parmesan',
        name: 'Parmesan',
        category: 'dairy',
        subcategory: 'hard cheese',
        flavorNotes: ['nutty', 'savory', 'salty', 'umami-rich'],
        aromaticProfile: ['umami', 'salty'],
        intensity: 'bold',
        bestPairings: ['pasta', 'risotto', 'pear', 'balsamic', 'prosciutto', 'tomato'],
        unexpectedPairings: ['honey', 'coffee', 'chocolate', 'strawberry', 'peach'],
        cuisineAffinities: ['Italian'],
        seasonality: 'year-round',
        cookingMethods: ['grated', 'shaved', 'crisp'],
    },
    {
        id: 'goat-cheese',
        name: 'Goat Cheese',
        category: 'dairy',
        subcategory: 'soft cheese',
        flavorNotes: ['tangy', 'creamy', 'earthy', 'bright'],
        aromaticProfile: ['sour', 'fatty'],
        intensity: 'medium',
        bestPairings: ['beets', 'honey', 'walnut', 'thyme', 'fig', 'arugula'],
        unexpectedPairings: ['watermelon', 'pumpkin', 'bacon', 'lavender', 'mint'],
        cuisineAffinities: ['French', 'Mediterranean', 'American'],
        seasonality: 'year-round',
        cookingMethods: ['raw', 'baked', 'crumbled'],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GRAINS & STARCHES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'rice',
        name: 'Rice',
        category: 'grain',
        subcategory: 'grain',
        flavorNotes: ['neutral', 'slightly sweet', 'starchy'],
        aromaticProfile: ['sweet'],
        intensity: 'mild',
        bestPairings: ['soy sauce', 'sesame', 'ginger', 'vegetables', 'curry', 'coconut milk'],
        unexpectedPairings: ['cinnamon', 'cardamom', 'orange', 'vanilla', 'mango'],
        cuisineAffinities: ['Asian', 'Indian', 'Latin American', 'Middle Eastern'],
        seasonality: 'year-round',
        cookingMethods: ['boil', 'steam', 'fry', 'risotto'],
    },
    {
        id: 'potato',
        name: 'Potato',
        category: 'grain',
        subcategory: 'starch',
        flavorNotes: ['earthy', 'starchy', 'mild', 'creamy when cooked'],
        aromaticProfile: ['sweet'],
        intensity: 'mild',
        bestPairings: ['butter', 'cream', 'rosemary', 'garlic', 'cheese', 'bacon'],
        unexpectedPairings: ['truffle', 'anchovy', 'wasabi', 'curry', 'dill'],
        cuisineAffinities: ['American', 'French', 'Irish', 'German', 'Indian'],
        seasonality: 'year-round',
        cookingMethods: ['roast', 'mash', 'fry', 'bake', 'boil'],
    },
];

// Helper function to find pairings
export function findPairingsFor(ingredientId: string): FlavorProfile | undefined {
    return flavorProfiles.find(p => p.id === ingredientId);
}

// Helper to find by name (case-insensitive)
export function searchIngredients(query: string): FlavorProfile[] {
    const lowerQuery = query.toLowerCase();
    return flavorProfiles.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.flavorNotes.some(note => note.toLowerCase().includes(lowerQuery)) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}

// Get all unique categories
export function getCategories(): string[] {
    return [...new Set(flavorProfiles.map(p => p.category))];
}

// Get ingredients by category
export function getByCategory(category: string): FlavorProfile[] {
    return flavorProfiles.filter(p => p.category === category);
}

// Calculate match score between two ingredients
export function calculateMatchScore(ingredient1: string, ingredient2: string): number {
    const profile1 = findPairingsFor(ingredient1);
    const profile2 = findPairingsFor(ingredient2);

    if (!profile1 || !profile2) return 0;

    // Check if it's in best pairings (high score)
    if (profile1.bestPairings.some(p => p.toLowerCase().includes(ingredient2.toLowerCase()))) {
        return 85 + Math.floor(Math.random() * 15); // 85-100
    }

    // Check if it's in unexpected pairings (medium-high score with "surprise" label)
    if (profile1.unexpectedPairings.some(p => p.toLowerCase().includes(ingredient2.toLowerCase()))) {
        return 75 + Math.floor(Math.random() * 15); // 75-90
    }

    // Check shared aromatic profiles
    const sharedAromas = profile1.aromaticProfile.filter(a =>
        profile2.aromaticProfile.includes(a)
    );

    if (sharedAromas.length > 0) {
        return 50 + (sharedAromas.length * 15); // 65-95 depending on matches
    }

    // Check shared cuisine affinities
    const sharedCuisines = profile1.cuisineAffinities.filter(c =>
        profile2.cuisineAffinities.includes(c)
    );

    if (sharedCuisines.length > 0) {
        return 40 + (sharedCuisines.length * 10);
    }

    return 30 + Math.floor(Math.random() * 20); // Low score for no clear match
}
