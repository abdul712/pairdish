import type { MainDish, SideDish, DishPairing } from '../../../shared/types';

export const mockMainDishes: MainDish[] = [
  {
    id: 1,
    name: "Chicken Biryani",
    slug: "chicken-biryani",
    description: "Aromatic basmati rice layered with tender marinated chicken, cooked with fragrant spices and herbs.",
    cuisine_type: "Indian",
    seo_title: "What to Serve with Chicken Biryani - Perfect Side Dishes",
    meta_description: "Discover the best side dishes to serve with chicken biryani. Get expert pairing suggestions.",
    featured_image: "/images/chicken-biryani.jpg",
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-15')
  },
  {
    id: 2,
    name: "Pasta Carbonara",
    slug: "pasta-carbonara",
    description: "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    cuisine_type: "Italian",
    seo_title: "What to Serve with Pasta Carbonara - Best Side Dishes",
    meta_description: "Find perfect side dishes for pasta carbonara. Expert pairing recommendations.",
    featured_image: "/images/pasta-carbonara.jpg",
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-16')
  },
  {
    id: 3,
    name: "Grilled Steak",
    slug: "grilled-steak",
    description: "Perfectly grilled steak with a beautiful char and juicy interior.",
    cuisine_type: "American",
    seo_title: "What to Serve with Grilled Steak - Perfect Side Dishes",
    meta_description: "Discover the best side dishes to complement grilled steak perfectly.",
    featured_image: "/images/grilled-steak.jpg",
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-01-17')
  },
  {
    id: 4,
    name: "Fish Tacos",
    slug: "fish-tacos",
    description: "Fresh white fish in soft tortillas with cabbage slaw and tangy sauce.",
    cuisine_type: "Mexican",
    seo_title: "What to Serve with Fish Tacos - Best Side Dishes",
    meta_description: "Find perfect side dishes and accompaniments for fish tacos.",
    featured_image: "/images/fish-tacos.jpg",
    created_at: new Date('2024-01-04'),
    updated_at: new Date('2024-01-18')
  },
  {
    id: 5,
    name: "Pad Thai",
    slug: "pad-thai",
    description: "Classic Thai stir-fried rice noodles with tamarind, fish sauce, and peanuts.",
    cuisine_type: "Thai",
    seo_title: "What to Serve with Pad Thai - Perfect Pairings",
    meta_description: "Discover the best side dishes to serve with pad thai.",
    featured_image: "/images/pad-thai.jpg",
    created_at: new Date('2024-01-05'),
    updated_at: new Date('2024-01-19')
  },
  {
    id: 6,
    name: "Margherita Pizza",
    slug: "margherita-pizza",
    description: "Classic Italian pizza with tomato sauce, fresh mozzarella, and basil.",
    cuisine_type: "Italian",
    seo_title: "What to Serve with Margherita Pizza - Side Dishes",
    meta_description: "Find the best side dishes to serve with margherita pizza.",
    featured_image: "/images/margherita-pizza.jpg",
    created_at: new Date('2024-01-06'),
    updated_at: new Date('2024-01-20')
  }
];

export const mockSideDishes: SideDish[] = [
  {
    id: 1,
    name: "Raita",
    description: "Cool yogurt-based side dish with cucumber and mint",
    cuisine_type: "Indian",
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 2,
    name: "Garlic Bread",
    description: "Crispy bread with garlic butter and herbs",
    cuisine_type: "Italian",
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 3,
    name: "Roasted Vegetables",
    description: "Seasonal vegetables roasted with olive oil and herbs",
    cuisine_type: "American",
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 4,
    name: "Mexican Rice",
    description: "Fluffy rice cooked with tomatoes and spices",
    cuisine_type: "Mexican",
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 5,
    name: "Spring Rolls",
    description: "Fresh Vietnamese-style spring rolls",
    cuisine_type: "Thai",
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  }
];

export const mockPairings: DishPairing[] = [
  {
    id: 1,
    main_dish_id: 1,
    side_dish_id: 1,
    match_score: 95,
    pairing_reason: "The cool, refreshing raita perfectly balances the rich, spicy flavors of chicken biryani.",
    main_dish: mockMainDishes[0],
    side_dish: mockSideDishes[0],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 2,
    main_dish_id: 2,
    side_dish_id: 2,
    match_score: 88,
    pairing_reason: "Garlic bread complements the creamy carbonara with its crispy texture and garlicky flavor.",
    main_dish: mockMainDishes[1],
    side_dish: mockSideDishes[1],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 3,
    main_dish_id: 3,
    side_dish_id: 3,
    match_score: 92,
    pairing_reason: "Roasted vegetables provide a healthy, flavorful contrast to the rich grilled steak.",
    main_dish: mockMainDishes[2],
    side_dish: mockSideDishes[2],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  }
];