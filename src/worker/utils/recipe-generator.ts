// Recipe Generator for PairDish
export interface Recipe {
  ingredients: string[]
  instructions: string[]
  prep_time: number
  cook_time: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine?: string
  nutritional_info?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
  }
}

export function generateRecipe(dishName: string, dishType: string): Recipe | null {
  const lowerName = dishName.toLowerCase()
  
  // Determine cooking method and generate appropriate recipe
  if (dishType === 'main') {
    return generateMainDishRecipe(dishName)
  } else if (dishType === 'side') {
    return generateSideDishRecipe(dishName)
  }
  
  return null
}

function generateMainDishRecipe(dishName: string): Recipe {
  const lowerName = dishName.toLowerCase()
  
  // Special recipes for main dishes
  if (lowerName.includes('15 bean soup')) {
    return {
      ingredients: [
        '1 package (20 oz) 15-bean soup mix',
        '8 cups water or vegetable broth',
        '1 large onion, diced',
        '3 cloves garlic, minced',
        '2 carrots, diced',
        '2 celery stalks, diced',
        '1 can (14.5 oz) diced tomatoes',
        '2 bay leaves',
        '1 tsp dried thyme',
        '1 tsp smoked paprika',
        'Salt and pepper to taste',
        '2 tbsp olive oil'
      ],
      instructions: [
        'Rinse and sort beans, then soak overnight in water',
        'Drain beans and set aside',
        'Heat olive oil in large pot over medium heat',
        'Sauté onion, garlic, carrots, and celery until softened',
        'Add beans, water, tomatoes, and seasonings',
        'Bring to boil, then reduce heat and simmer for 2-3 hours',
        'Stir occasionally and add water if needed',
        'Season with salt and pepper before serving'
      ],
      prep_time: 20,
      cook_time: 180,
      servings: 8,
      difficulty: 'easy',
      cuisine: 'American',
      nutritional_info: {
        calories: 320,
        protein: 18,
        carbs: 58,
        fat: 3,
        fiber: 16
      }
    }
  } else if (lowerName.includes('blt')) {
    return {
      ingredients: [
        '8 slices bacon',
        '4 large lettuce leaves',
        '2 large tomatoes, sliced',
        '8 slices bread, toasted',
        '4 tbsp mayonnaise',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Cook bacon until crispy and drain on paper towels',
        'Toast bread slices until golden brown',
        'Spread mayonnaise on toast',
        'Layer lettuce, tomato, and bacon on 4 slices',
        'Season tomatoes with salt and pepper',
        'Top with remaining toast slices',
        'Cut diagonally and serve immediately'
      ],
      prep_time: 10,
      cook_time: 10,
      servings: 4,
      difficulty: 'easy',
      cuisine: 'American'
    }
  } else if (lowerName.includes('breakfast casserole')) {
    return {
      ingredients: [
        '12 eggs',
        '1 cup milk',
        '8 oz shredded cheddar cheese',
        '1 lb breakfast sausage',
        '6 slices bread, cubed',
        '1 tsp salt',
        '1/2 tsp pepper',
        '1/2 tsp garlic powder'
      ],
      instructions: [
        'Preheat oven to 350°F',
        'Brown sausage and drain fat',
        'Beat eggs with milk and seasonings',
        'Layer bread cubes in greased 9x13 baking dish',
        'Add sausage and cheese',
        'Pour egg mixture over top',
        'Bake for 45-50 minutes until set',
        'Let rest 5 minutes before serving'
      ],
      prep_time: 15,
      cook_time: 50,
      servings: 8,
      difficulty: 'easy',
      cuisine: 'American'
    }
  } else if (lowerName.includes('charcuterie') || lowerName.includes('cheese board')) {
    return {
      ingredients: [
        '8 oz assorted cured meats',
        '12 oz assorted cheeses',
        '1 cup mixed olives',
        '1 cup grapes',
        '1/2 cup nuts (almonds, walnuts)',
        '1/4 cup honey',
        '1/4 cup fig jam',
        'Assorted crackers',
        'Sliced baguette'
      ],
      instructions: [
        'Let cheeses come to room temperature',
        'Arrange meats in roses or fans',
        'Cut some cheeses, leave others whole',
        'Place olives and nuts in small bowls',
        'Add grapes in clusters',
        'Include small spoons for honey and jam',
        'Fill empty spaces with crackers',
        'Serve immediately'
      ],
      prep_time: 20,
      cook_time: 0,
      servings: 6,
      difficulty: 'easy',
      cuisine: 'French'
    }
  } else if (lowerName.includes('cheese souffle')) {
    return {
      ingredients: [
        '4 tbsp butter',
        '4 tbsp flour',
        '1 1/4 cups milk',
        '6 eggs, separated',
        '1 1/2 cups grated Gruyere cheese',
        '1/2 tsp salt',
        '1/4 tsp white pepper',
        '1/4 tsp nutmeg'
      ],
      instructions: [
        'Preheat oven to 375°F',
        'Butter a souffle dish',
        'Make white sauce with butter, flour, and milk',
        'Remove from heat, add egg yolks and cheese',
        'Beat egg whites until stiff peaks form',
        'Fold whites into cheese mixture',
        'Pour into prepared dish',
        'Bake 25-30 minutes until puffed and golden'
      ],
      prep_time: 20,
      cook_time: 30,
      servings: 4,
      difficulty: 'hard',
      cuisine: 'French'
    }
  }
  
  // Generic main dish recipe
  return {
    ingredients: [
      `1 lb ${dishName} ingredients`,
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      'Fresh herbs for garnish'
    ],
    instructions: [
      'Prepare all ingredients',
      `Cook ${dishName} according to package directions`,
      'Season to taste',
      'Garnish and serve hot'
    ],
    prep_time: 15,
    cook_time: 30,
    servings: 4,
    difficulty: 'medium',
    cuisine: 'American'
  }
}

function generateSideDishRecipe(dishName: string): Recipe {
  const lowerName = dishName.toLowerCase()
  
  // Bread recipes
  if (lowerName.includes('cornbread')) {
    return {
      ingredients: [
        '1 cup cornmeal',
        '1 cup all-purpose flour',
        '1/4 cup sugar',
        '1 tbsp baking powder',
        '1 tsp salt',
        '1 cup milk',
        '1/4 cup vegetable oil',
        '1 egg'
      ],
      instructions: [
        'Preheat oven to 400°F',
        'Mix dry ingredients in a bowl',
        'Whisk wet ingredients separately',
        'Combine wet and dry until just mixed',
        'Pour into greased 8-inch pan',
        'Bake 20-25 minutes until golden'
      ],
      prep_time: 10,
      cook_time: 25,
      servings: 8,
      difficulty: 'easy',
      cuisine: 'Southern'
    }
  } else if (lowerName.includes('garlic bread')) {
    return {
      ingredients: [
        '1 French baguette',
        '1/2 cup butter, softened',
        '4 cloves garlic, minced',
        '2 tbsp parsley, chopped',
        '1/4 cup Parmesan cheese'
      ],
      instructions: [
        'Preheat oven to 375°F',
        'Mix butter, garlic, parsley, and cheese',
        'Slice baguette lengthwise',
        'Spread garlic butter on both halves',
        'Bake 10-12 minutes until golden',
        'Slice and serve warm'
      ],
      prep_time: 10,
      cook_time: 12,
      servings: 6,
      difficulty: 'easy',
      cuisine: 'Italian'
    }
  }
  
  // Salad recipes
  else if (lowerName.includes('salad')) {
    if (lowerName.includes('green salad')) {
      return {
        ingredients: [
          '6 cups mixed greens',
          '1 cucumber, sliced',
          '2 tomatoes, chopped',
          '1/2 red onion, thinly sliced',
          '1/4 cup olive oil',
          '2 tbsp vinegar',
          'Salt and pepper'
        ],
        instructions: [
          'Wash and dry greens',
          'Combine vegetables in large bowl',
          'Whisk oil and vinegar for dressing',
          'Toss salad with dressing',
          'Season and serve immediately'
        ],
        prep_time: 10,
        cook_time: 0,
        servings: 4,
        difficulty: 'easy',
        cuisine: 'American'
      }
    } else if (lowerName.includes('coleslaw')) {
      return {
        ingredients: [
          '1 head cabbage, shredded',
          '2 carrots, grated',
          '1/2 cup mayonnaise',
          '2 tbsp vinegar',
          '1 tbsp sugar',
          'Salt and pepper'
        ],
        instructions: [
          'Combine cabbage and carrots',
          'Mix mayo, vinegar, and sugar',
          'Toss vegetables with dressing',
          'Chill for 30 minutes',
          'Season before serving'
        ],
        prep_time: 15,
        cook_time: 0,
        servings: 6,
        difficulty: 'easy',
        cuisine: 'American'
      }
    }
  }
  
  // Potato dishes
  else if (lowerName.includes('fries') || lowerName.includes('french fries')) {
    return {
      ingredients: [
        '4 large potatoes',
        '3 cups vegetable oil',
        'Salt to taste'
      ],
      instructions: [
        'Cut potatoes into fries',
        'Soak in cold water 30 minutes',
        'Heat oil to 325°F',
        'Fry in batches 3-4 minutes',
        'Drain and fry again at 375°F until golden',
        'Season with salt'
      ],
      prep_time: 40,
      cook_time: 10,
      servings: 4,
      difficulty: 'medium',
      cuisine: 'American'
    }
  } else if (lowerName.includes('mashed potatoes')) {
    return {
      ingredients: [
        '3 lbs potatoes, peeled',
        '1/2 cup butter',
        '1/2 cup milk',
        'Salt and pepper'
      ],
      instructions: [
        'Boil potatoes until tender',
        'Drain and return to pot',
        'Add butter and mash',
        'Add milk gradually',
        'Season to taste'
      ],
      prep_time: 15,
      cook_time: 20,
      servings: 6,
      difficulty: 'easy',
      cuisine: 'American'
    }
  }
  
  // Vegetable dishes
  else if (lowerName.includes('steamed') || lowerName.includes('roasted')) {
    const isRoasted = lowerName.includes('roasted')
    return {
      ingredients: [
        `2 lbs ${dishName.replace(/steamed|roasted/i, '').trim()}`,
        '2 tbsp olive oil',
        'Salt and pepper',
        'Optional: garlic, herbs'
      ],
      instructions: isRoasted ? [
        'Preheat oven to 425°F',
        'Cut vegetables into even pieces',
        'Toss with oil and seasonings',
        'Spread on baking sheet',
        'Roast 20-30 minutes until tender'
      ] : [
        'Cut vegetables into even pieces',
        'Place in steamer basket',
        'Steam over boiling water',
        'Cook 5-10 minutes until tender',
        'Season and serve'
      ],
      prep_time: 10,
      cook_time: isRoasted ? 30 : 10,
      servings: 4,
      difficulty: 'easy',
      cuisine: 'American'
    }
  }
  
  // Generic side dish
  return {
    ingredients: [
      `Main ingredients for ${dishName}`,
      'Seasonings to taste',
      'Oil or butter as needed'
    ],
    instructions: [
      `Prepare ${dishName} ingredients`,
      'Cook according to standard method',
      'Season to taste',
      'Serve warm'
    ],
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'American'
  }
}