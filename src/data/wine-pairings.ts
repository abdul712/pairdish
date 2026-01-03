/**
 * PairingPlates - Wine Pairings Data
 *
 * Comprehensive database of wines with profiles and food pairings.
 */

export interface WineProfile {
    id: string;
    name: string;
    type: 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';
    grapeVarietals: string[];
    regions: string[];
    body: 'light' | 'medium' | 'full';
    sweetness: 'dry' | 'off-dry' | 'sweet';
    acidity: 'low' | 'medium' | 'high';
    tannins: 'none' | 'low' | 'medium' | 'high';
    flavorNotes: string[];
    servingTemp: string;
    glassType: string;
    foodPairings: string[];
    avoidPairings: string[];
    occasions: string[];
    priceRange: 'budget' | 'mid-range' | 'premium';
}

export interface DishCategory {
    id: string;
    name: string;
    dishes: string[];
    wines: string[];
    reasoning: string;
}

export const wineProfiles: WineProfile[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // RED WINES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'cabernet-sauvignon',
        name: 'Cabernet Sauvignon',
        type: 'red',
        grapeVarietals: ['Cabernet Sauvignon'],
        regions: ['Napa Valley', 'Bordeaux', 'Chile', 'Australia'],
        body: 'full',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'high',
        flavorNotes: ['blackcurrant', 'cedar', 'dark cherry', 'vanilla', 'tobacco'],
        servingTemp: '60-65°F (16-18°C)',
        glassType: 'Bordeaux glass',
        foodPairings: ['ribeye steak', 'lamb chops', 'beef bourguignon', 'aged cheddar', 'dark chocolate'],
        avoidPairings: ['light fish', 'delicate salads', 'spicy Asian cuisine'],
        occasions: ['dinner parties', 'steakhouse', 'celebrations'],
        priceRange: 'mid-range',
    },
    {
        id: 'pinot-noir',
        name: 'Pinot Noir',
        type: 'red',
        grapeVarietals: ['Pinot Noir'],
        regions: ['Burgundy', 'Oregon', 'New Zealand', 'California'],
        body: 'light',
        sweetness: 'dry',
        acidity: 'high',
        tannins: 'low',
        flavorNotes: ['cherry', 'raspberry', 'mushroom', 'earth', 'violet'],
        servingTemp: '55-60°F (13-16°C)',
        glassType: 'Burgundy glass',
        foodPairings: ['roast chicken', 'salmon', 'duck', 'mushroom risotto', 'brie cheese', 'turkey'],
        avoidPairings: ['heavily spiced dishes', 'blue cheese', 'very fatty meats'],
        occasions: ['romantic dinners', 'thanksgiving', 'casual gatherings'],
        priceRange: 'mid-range',
    },
    {
        id: 'merlot',
        name: 'Merlot',
        type: 'red',
        grapeVarietals: ['Merlot'],
        regions: ['Bordeaux', 'Napa Valley', 'Washington State', 'Chile'],
        body: 'medium',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'medium',
        flavorNotes: ['plum', 'black cherry', 'chocolate', 'herbs', 'vanilla'],
        servingTemp: '60-65°F (16-18°C)',
        glassType: 'Bordeaux glass',
        foodPairings: ['beef tenderloin', 'pork loin', 'tomato-based pasta', 'grilled vegetables', 'gouda cheese'],
        avoidPairings: ['very spicy foods', 'light seafood', 'citrus-heavy dishes'],
        occasions: ['weeknight dinners', 'dinner parties', 'BBQ'],
        priceRange: 'budget',
    },
    {
        id: 'syrah-shiraz',
        name: 'Syrah/Shiraz',
        type: 'red',
        grapeVarietals: ['Syrah'],
        regions: ['Rhone Valley', 'Australia', 'California', 'South Africa'],
        body: 'full',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'high',
        flavorNotes: ['blackberry', 'black pepper', 'smoke', 'meat', 'dark chocolate'],
        servingTemp: '60-65°F (16-18°C)',
        glassType: 'Bordeaux glass',
        foodPairings: ['BBQ ribs', 'lamb stew', 'game meats', 'aged cheeses', 'beef brisket'],
        avoidPairings: ['delicate fish', 'light salads', 'subtle dishes'],
        occasions: ['BBQ', 'winter dinners', 'meat-centric meals'],
        priceRange: 'mid-range',
    },
    {
        id: 'malbec',
        name: 'Malbec',
        type: 'red',
        grapeVarietals: ['Malbec'],
        regions: ['Argentina', 'Cahors France', 'California'],
        body: 'full',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'medium',
        flavorNotes: ['plum', 'blackberry', 'leather', 'cocoa', 'tobacco'],
        servingTemp: '60-65°F (16-18°C)',
        glassType: 'Bordeaux glass',
        foodPairings: ['grilled steak', 'empanadas', 'spiced lamb', 'hard cheeses', 'mushroom dishes'],
        avoidPairings: ['light fish', 'very delicate dishes', 'raw vegetables'],
        occasions: ['Argentine asado', 'steak night', 'casual dinners'],
        priceRange: 'budget',
    },
    {
        id: 'zinfandel',
        name: 'Zinfandel',
        type: 'red',
        grapeVarietals: ['Zinfandel'],
        regions: ['California', 'Puglia Italy'],
        body: 'full',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'medium',
        flavorNotes: ['blackberry', 'jam', 'black pepper', 'cinnamon', 'tobacco'],
        servingTemp: '60-65°F (16-18°C)',
        glassType: 'Bordeaux glass',
        foodPairings: ['BBQ', 'pizza', 'burgers', 'spicy sausage', 'tomato-based dishes'],
        avoidPairings: ['delicate fish', 'subtle Asian dishes', 'light salads'],
        occasions: ['BBQ', 'pizza night', 'casual gatherings'],
        priceRange: 'budget',
    },
    {
        id: 'chianti',
        name: 'Chianti',
        type: 'red',
        grapeVarietals: ['Sangiovese'],
        regions: ['Tuscany'],
        body: 'medium',
        sweetness: 'dry',
        acidity: 'high',
        tannins: 'medium',
        flavorNotes: ['sour cherry', 'tomato', 'herbs', 'leather', 'earth'],
        servingTemp: '60-65°F (16-18°C)',
        glassType: 'Burgundy glass',
        foodPairings: ['pasta with red sauce', 'pizza', 'grilled chicken', 'pecorino cheese', 'lasagna'],
        avoidPairings: ['very spicy foods', 'sweet dishes', 'heavy cream sauces'],
        occasions: ['Italian dinner', 'casual gatherings', 'pizza night'],
        priceRange: 'budget',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // WHITE WINES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'chardonnay',
        name: 'Chardonnay',
        type: 'white',
        grapeVarietals: ['Chardonnay'],
        regions: ['Burgundy', 'California', 'Australia', 'New Zealand'],
        body: 'full',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'none',
        flavorNotes: ['apple', 'butter', 'vanilla', 'tropical fruit', 'oak'],
        servingTemp: '45-50°F (7-10°C)',
        glassType: 'White wine glass',
        foodPairings: ['lobster', 'crab', 'chicken in cream sauce', 'soft cheeses', 'risotto'],
        avoidPairings: ['spicy foods', 'red meat', 'very acidic dishes'],
        occasions: ['seafood dinner', 'celebrations', 'business dinners'],
        priceRange: 'mid-range',
    },
    {
        id: 'sauvignon-blanc',
        name: 'Sauvignon Blanc',
        type: 'white',
        grapeVarietals: ['Sauvignon Blanc'],
        regions: ['Loire Valley', 'New Zealand', 'California', 'Chile'],
        body: 'light',
        sweetness: 'dry',
        acidity: 'high',
        tannins: 'none',
        flavorNotes: ['grapefruit', 'grass', 'lime', 'green apple', 'herbs'],
        servingTemp: '45-50°F (7-10°C)',
        glassType: 'White wine glass',
        foodPairings: ['goat cheese', 'seafood', 'salads', 'sushi', 'asparagus', 'oysters'],
        avoidPairings: ['heavy red meats', 'sweet dishes', 'very rich foods'],
        occasions: ['summer parties', 'light lunches', 'appetizers'],
        priceRange: 'budget',
    },
    {
        id: 'riesling',
        name: 'Riesling',
        type: 'white',
        grapeVarietals: ['Riesling'],
        regions: ['Germany', 'Alsace', 'Austria', 'Washington State'],
        body: 'light',
        sweetness: 'off-dry',
        acidity: 'high',
        tannins: 'none',
        flavorNotes: ['peach', 'apricot', 'lime', 'honey', 'petrol'],
        servingTemp: '42-50°F (6-10°C)',
        glassType: 'White wine glass',
        foodPairings: ['spicy Thai', 'Indian curry', 'pork', 'duck', 'spicy Chinese'],
        avoidPairings: ['very heavy meats', 'bitter vegetables', 'blue cheese'],
        occasions: ['Asian cuisine', 'spicy food nights', 'casual dinners'],
        priceRange: 'budget',
    },
    {
        id: 'pinot-grigio',
        name: 'Pinot Grigio',
        type: 'white',
        grapeVarietals: ['Pinot Grigio'],
        regions: ['Italy', 'Alsace', 'California', 'Oregon'],
        body: 'light',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'none',
        flavorNotes: ['lemon', 'green apple', 'pear', 'almond', 'minerals'],
        servingTemp: '45-50°F (7-10°C)',
        glassType: 'White wine glass',
        foodPairings: ['light pasta', 'grilled fish', 'antipasto', 'bruschetta', 'seafood salad'],
        avoidPairings: ['heavy red meats', 'very rich sauces', 'strong cheeses'],
        occasions: ['lunch', 'appetizers', 'light summer meals'],
        priceRange: 'budget',
    },
    {
        id: 'viognier',
        name: 'Viognier',
        type: 'white',
        grapeVarietals: ['Viognier'],
        regions: ['Rhone Valley', 'California', 'Australia'],
        body: 'full',
        sweetness: 'dry',
        acidity: 'low',
        tannins: 'none',
        flavorNotes: ['apricot', 'peach', 'honeysuckle', 'tangerine', 'vanilla'],
        servingTemp: '45-50°F (7-10°C)',
        glassType: 'White wine glass',
        foodPairings: ['roast chicken', 'lobster', 'Thai cuisine', 'curry', 'roasted vegetables'],
        avoidPairings: ['very acidic dishes', 'red meat', 'bitter greens'],
        occasions: ['dinner parties', 'Asian cuisine nights', 'celebrations'],
        priceRange: 'mid-range',
    },
    {
        id: 'gewurztraminer',
        name: 'Gewurztraminer',
        type: 'white',
        grapeVarietals: ['Gewurztraminer'],
        regions: ['Alsace', 'Germany', 'New Zealand'],
        body: 'full',
        sweetness: 'off-dry',
        acidity: 'low',
        tannins: 'none',
        flavorNotes: ['lychee', 'rose', 'ginger', 'tropical fruit', 'spice'],
        servingTemp: '45-50°F (7-10°C)',
        glassType: 'White wine glass',
        foodPairings: ['Asian cuisine', 'spicy foods', 'foie gras', 'muenster cheese', 'smoked salmon'],
        avoidPairings: ['very acidic dishes', 'subtle foods', 'red meat'],
        occasions: ['Asian dinner', 'cheese course', 'holiday meals'],
        priceRange: 'mid-range',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ROSE WINES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'provence-rose',
        name: 'Provence Rose',
        type: 'rose',
        grapeVarietals: ['Grenache', 'Cinsault', 'Syrah'],
        regions: ['Provence'],
        body: 'light',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'none',
        flavorNotes: ['strawberry', 'watermelon', 'citrus', 'herbs', 'minerals'],
        servingTemp: '45-50°F (7-10°C)',
        glassType: 'White wine glass',
        foodPairings: ['grilled salmon', 'salads', 'charcuterie', 'Mediterranean dishes', 'light pasta'],
        avoidPairings: ['heavy red meats', 'very rich dishes', 'strong cheeses'],
        occasions: ['summer picnics', 'brunch', 'light dinners'],
        priceRange: 'mid-range',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SPARKLING WINES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'champagne',
        name: 'Champagne',
        type: 'sparkling',
        grapeVarietals: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'],
        regions: ['Champagne'],
        body: 'light',
        sweetness: 'dry',
        acidity: 'high',
        tannins: 'none',
        flavorNotes: ['citrus', 'brioche', 'toast', 'apple', 'almond'],
        servingTemp: '40-45°F (4-7°C)',
        glassType: 'Champagne flute',
        foodPairings: ['oysters', 'caviar', 'fried chicken', 'sushi', 'popcorn', 'potato chips'],
        avoidPairings: ['very heavy dishes', 'strong spices', 'red meat'],
        occasions: ['celebrations', 'toasts', 'brunch', 'appetizers'],
        priceRange: 'premium',
    },
    {
        id: 'prosecco',
        name: 'Prosecco',
        type: 'sparkling',
        grapeVarietals: ['Glera'],
        regions: ['Veneto'],
        body: 'light',
        sweetness: 'off-dry',
        acidity: 'medium',
        tannins: 'none',
        flavorNotes: ['green apple', 'pear', 'melon', 'honeysuckle', 'cream'],
        servingTemp: '40-45°F (4-7°C)',
        glassType: 'Champagne flute',
        foodPairings: ['prosciutto', 'melon', 'light appetizers', 'seafood', 'bruschetta'],
        avoidPairings: ['heavy meats', 'very rich sauces', 'strong flavors'],
        occasions: ['aperitivo', 'brunch', 'casual celebrations'],
        priceRange: 'budget',
    },
    {
        id: 'cava',
        name: 'Cava',
        type: 'sparkling',
        grapeVarietals: ['Macabeo', 'Parellada', 'Xarel-lo'],
        regions: ['Catalonia'],
        body: 'light',
        sweetness: 'dry',
        acidity: 'high',
        tannins: 'none',
        flavorNotes: ['citrus', 'almond', 'apple', 'toast', 'herbs'],
        servingTemp: '40-45°F (4-7°C)',
        glassType: 'Champagne flute',
        foodPairings: ['tapas', 'seafood paella', 'jamón', 'manchego cheese', 'fried foods'],
        avoidPairings: ['very heavy dishes', 'sweet desserts', 'strong red meats'],
        occasions: ['Spanish dinner', 'celebrations', 'appetizers'],
        priceRange: 'budget',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DESSERT WINES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'moscato',
        name: 'Moscato d\'Asti',
        type: 'dessert',
        grapeVarietals: ['Moscato Bianco'],
        regions: ['Piedmont'],
        body: 'light',
        sweetness: 'sweet',
        acidity: 'medium',
        tannins: 'none',
        flavorNotes: ['peach', 'apricot', 'orange blossom', 'honey', 'grape'],
        servingTemp: '40-45°F (4-7°C)',
        glassType: 'Dessert wine glass',
        foodPairings: ['fruit desserts', 'cheesecake', 'light pastries', 'fruit tarts', 'biscotti'],
        avoidPairings: ['chocolate desserts', 'heavy meats', 'savory dishes'],
        occasions: ['dessert', 'brunch', 'casual sipping'],
        priceRange: 'budget',
    },
    {
        id: 'sauternes',
        name: 'Sauternes',
        type: 'dessert',
        grapeVarietals: ['Semillon', 'Sauvignon Blanc'],
        regions: ['Bordeaux'],
        body: 'full',
        sweetness: 'sweet',
        acidity: 'high',
        tannins: 'none',
        flavorNotes: ['honey', 'apricot', 'marmalade', 'saffron', 'caramel'],
        servingTemp: '42-46°F (6-8°C)',
        glassType: 'Dessert wine glass',
        foodPairings: ['foie gras', 'blue cheese', 'fruit tarts', 'creme brulee', 'pear dishes'],
        avoidPairings: ['chocolate', 'very spicy foods', 'red meat'],
        occasions: ['special occasions', 'cheese course', 'elegant desserts'],
        priceRange: 'premium',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FORTIFIED WINES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'port',
        name: 'Port',
        type: 'fortified',
        grapeVarietals: ['Touriga Nacional', 'Tinta Roriz', 'Touriga Franca'],
        regions: ['Douro Valley'],
        body: 'full',
        sweetness: 'sweet',
        acidity: 'medium',
        tannins: 'medium',
        flavorNotes: ['blackberry', 'caramel', 'chocolate', 'spice', 'dried fruit'],
        servingTemp: '55-65°F (13-18°C)',
        glassType: 'Port glass',
        foodPairings: ['chocolate desserts', 'blue cheese', 'walnuts', 'dark chocolate', 'stilton'],
        avoidPairings: ['light dishes', 'acidic foods', 'seafood'],
        occasions: ['after dinner', 'cheese course', 'special occasions'],
        priceRange: 'mid-range',
    },
    {
        id: 'sherry',
        name: 'Sherry (Fino)',
        type: 'fortified',
        grapeVarietals: ['Palomino'],
        regions: ['Jerez'],
        body: 'light',
        sweetness: 'dry',
        acidity: 'medium',
        tannins: 'none',
        flavorNotes: ['almond', 'green olive', 'yeast', 'saline', 'herbs'],
        servingTemp: '45-50°F (7-10°C)',
        glassType: 'Sherry glass',
        foodPairings: ['tapas', 'olives', 'almonds', 'jamón', 'seafood'],
        avoidPairings: ['sweet dishes', 'heavy red meats', 'rich desserts'],
        occasions: ['appetizers', 'Spanish dinner', 'tapas night'],
        priceRange: 'budget',
    },
];

export const dishCategories: DishCategory[] = [
    {
        id: 'red-meat',
        name: 'Red Meat',
        dishes: ['steak', 'beef', 'lamb', 'venison', 'ribeye', 'filet mignon', 'prime rib', 'beef bourguignon', 'lamb chops', 'beef tenderloin'],
        wines: ['cabernet-sauvignon', 'malbec', 'syrah-shiraz', 'merlot'],
        reasoning: 'Full-bodied red wines with tannins cut through the fat and complement the rich, savory flavors of red meat.',
    },
    {
        id: 'poultry',
        name: 'Poultry',
        dishes: ['chicken', 'turkey', 'duck', 'roast chicken', 'grilled chicken', 'chicken piccata', 'thanksgiving turkey', 'duck confit'],
        wines: ['pinot-noir', 'chardonnay', 'viognier', 'provence-rose'],
        reasoning: 'Medium-bodied wines that won\'t overpower the delicate flavors of poultry. Richer preparations can handle fuller wines.',
    },
    {
        id: 'seafood',
        name: 'Seafood',
        dishes: ['fish', 'salmon', 'shrimp', 'lobster', 'crab', 'scallops', 'oysters', 'tuna', 'halibut', 'sea bass', 'sushi', 'sashimi'],
        wines: ['sauvignon-blanc', 'chardonnay', 'pinot-grigio', 'champagne', 'provence-rose'],
        reasoning: 'Light to medium white wines complement the delicate flavors of seafood without overwhelming them. The acidity cuts through richness.',
    },
    {
        id: 'pasta',
        name: 'Pasta',
        dishes: ['spaghetti', 'lasagna', 'pasta bolognese', 'carbonara', 'alfredo', 'pesto pasta', 'marinara', 'pasta primavera'],
        wines: ['chianti', 'merlot', 'pinot-grigio', 'sauvignon-blanc'],
        reasoning: 'Match wine weight to sauce weight. Light creamy sauces pair with whites; hearty meat sauces call for medium reds.',
    },
    {
        id: 'pizza',
        name: 'Pizza',
        dishes: ['pizza', 'margherita', 'pepperoni pizza', 'meat lovers pizza', 'vegetable pizza'],
        wines: ['chianti', 'zinfandel', 'prosecco', 'provence-rose'],
        reasoning: 'Italian wines are natural partners. The acidity in Chianti complements tomato sauce perfectly.',
    },
    {
        id: 'asian-cuisine',
        name: 'Asian Cuisine',
        dishes: ['thai food', 'curry', 'pad thai', 'sushi', 'dim sum', 'korean bbq', 'chinese food', 'vietnamese', 'indian curry', 'tikka masala'],
        wines: ['riesling', 'gewurztraminer', 'champagne', 'provence-rose'],
        reasoning: 'Off-dry wines balance spice and heat. The sweetness tames the fire while acidity refreshes the palate.',
    },
    {
        id: 'cheese',
        name: 'Cheese',
        dishes: ['cheese board', 'brie', 'cheddar', 'gouda', 'blue cheese', 'parmesan', 'goat cheese', 'manchego', 'gruyere', 'camembert'],
        wines: ['champagne', 'port', 'sauternes', 'riesling', 'cabernet-sauvignon'],
        reasoning: 'Regional pairings work well (French cheese with French wine). Blue cheeses love sweet wines; hard cheeses match with tannic reds.',
    },
    {
        id: 'bbq',
        name: 'BBQ & Grilled',
        dishes: ['bbq', 'ribs', 'pulled pork', 'brisket', 'grilled burgers', 'hot dogs', 'grilled sausage', 'bbq chicken'],
        wines: ['zinfandel', 'syrah-shiraz', 'malbec', 'provence-rose'],
        reasoning: 'Bold, fruity reds stand up to smoky, sweet BBQ flavors. The fruit complements the caramelization.',
    },
    {
        id: 'salads',
        name: 'Salads & Light Fare',
        dishes: ['caesar salad', 'greek salad', 'garden salad', 'caprese', 'cobb salad', 'bruschetta', 'antipasto'],
        wines: ['sauvignon-blanc', 'pinot-grigio', 'provence-rose', 'prosecco'],
        reasoning: 'Crisp, acidic wines match the freshness of salads. High acidity pairs well with vinaigrette dressings.',
    },
    {
        id: 'desserts',
        name: 'Desserts',
        dishes: ['chocolate cake', 'cheesecake', 'fruit tart', 'creme brulee', 'tiramisu', 'ice cream', 'pie', 'mousse'],
        wines: ['moscato', 'port', 'sauternes', 'champagne'],
        reasoning: 'Sweet wines should be sweeter than the dessert. Rich chocolate loves Port; fruit desserts pair with lighter sweet wines.',
    },
    {
        id: 'appetizers',
        name: 'Appetizers',
        dishes: ['charcuterie', 'bruschetta', 'shrimp cocktail', 'deviled eggs', 'stuffed mushrooms', 'spring rolls', 'oysters'],
        wines: ['champagne', 'prosecco', 'cava', 'sauvignon-blanc', 'provence-rose'],
        reasoning: 'Sparkling wines are perfect appetite stimulators. Their acidity and bubbles cleanse the palate between bites.',
    },
    {
        id: 'spicy',
        name: 'Spicy Foods',
        dishes: ['hot wings', 'spicy tacos', 'cajun', 'jalapeno poppers', 'buffalo chicken', 'szechuan', 'vindaloo'],
        wines: ['riesling', 'gewurztraminer', 'prosecco', 'provence-rose'],
        reasoning: 'Off-dry wines cool the heat. Low alcohol and residual sugar soothe spice while high acidity refreshes.',
    },
];

// Helper functions
export function searchWines(query: string): WineProfile[] {
    const lowerQuery = query.toLowerCase();
    return wineProfiles.filter(wine =>
        wine.name.toLowerCase().includes(lowerQuery) ||
        wine.type.toLowerCase().includes(lowerQuery) ||
        wine.flavorNotes.some(note => note.toLowerCase().includes(lowerQuery)) ||
        wine.grapeVarietals.some(grape => grape.toLowerCase().includes(lowerQuery))
    );
}

export function searchDishes(query: string): DishCategory[] {
    const lowerQuery = query.toLowerCase();
    return dishCategories.filter(cat =>
        cat.name.toLowerCase().includes(lowerQuery) ||
        cat.dishes.some(dish => dish.toLowerCase().includes(lowerQuery))
    );
}

export function getWinesForDish(dishQuery: string): { wines: WineProfile[]; reasoning: string }[] {
    const lowerQuery = dishQuery.toLowerCase();
    const results: { wines: WineProfile[]; reasoning: string }[] = [];

    for (const category of dishCategories) {
        const matchesDish = category.dishes.some(dish =>
            dish.toLowerCase().includes(lowerQuery) ||
            lowerQuery.includes(dish.toLowerCase())
        );
        const matchesCategory = category.name.toLowerCase().includes(lowerQuery);

        if (matchesDish || matchesCategory) {
            const wines = category.wines
                .map(wineId => wineProfiles.find(w => w.id === wineId))
                .filter((w): w is WineProfile => w !== undefined);

            if (wines.length > 0) {
                results.push({
                    wines,
                    reasoning: category.reasoning,
                });
            }
        }
    }

    return results;
}

export function getDishesForWine(wineId: string): DishCategory[] {
    return dishCategories.filter(cat => cat.wines.includes(wineId));
}

export function getWineById(id: string): WineProfile | undefined {
    return wineProfiles.find(w => w.id === id);
}

export function getWinesByType(type: WineProfile['type']): WineProfile[] {
    return wineProfiles.filter(w => w.type === type);
}
