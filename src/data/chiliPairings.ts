/**
 * Chili Pairing Finder — data
 *
 * 24 sides, grouped into 6 categories for the guide and 4 roles for the
 * tool output (dunkable / fresh-crunchy / hearty / to finish). Every
 * description is PairDish's own wording. Toppings table is our own
 * selection, same structure (cheese / cooling / crunchy / heat) as the
 * genre standard, not copied from any ranking page.
 *
 * Images: real Wikimedia Commons photographs, TASL attribution recorded in
 * assets_sourcing/credits.csv + manifest.json under slug
 * "chili-pairing-finder". One photo per side category; result cards show
 * their category's photo.
 */

export type ChiliType = 'beef' | 'white-chicken' | 'turkey' | 'vegetarian';
export type Occasion = 'family-dinner' | 'game-day' | 'chili-bar';
export type Diet = 'any' | 'vegetarian' | 'vegan' | 'gluten-free';
export type Role = 'dunkable' | 'fresh' | 'hearty' | 'finish';
export type Category =
  | 'breads'
  | 'potatoes-rice'
  | 'salads-slaws'
  | 'finger-foods'
  | 'desserts'
  | 'drinks';

export interface ChiliSide {
  name: string;
  why: string;
  category: Category;
  roles: Role[];
  chiliTypes: ChiliType[];
  occasions: Occasion[];
  /** Diets this side suits. 'any' in the filter matches everything. */
  diets: Array<'vegetarian' | 'vegan' | 'gluten-free'>;
}

export const CHILI_TYPE_LABELS: Record<ChiliType, string> = {
  beef: 'Beef / Texas chili',
  'white-chicken': 'White chicken chili',
  turkey: 'Turkey chili',
  vegetarian: 'Vegetarian chili',
};

export const OCCASION_LABELS: Record<Occasion, string> = {
  'family-dinner': 'Family dinner',
  'game-day': 'Game day',
  'chili-bar': 'Chili bar',
};

export const DIET_LABELS: Record<Diet, string> = {
  any: 'No preference',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
};

export const ROLE_LABELS: Record<Role, string> = {
  dunkable: 'Dunkable — something to soak it up',
  fresh: 'Fresh & crunchy — the contrast',
  hearty: 'Hearty — turns the bowl into a meal',
  finish: 'To finish — something sweet or cold after',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  breads: 'Breads & cornbread',
  'potatoes-rice': 'Potatoes & rice',
  'salads-slaws': 'Salads & slaws',
  'finger-foods': 'Finger foods & appetisers',
  desserts: 'Desserts',
  drinks: 'Drinks',
};

/** One real photo per side category (Wikimedia Commons, see credits.csv). */
export const CATEGORY_IMAGES: Record<
  Category,
  { src: string; alt: string; credit: string }
> = {
  breads: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Corn_Bread_3A_%2884%29.jpg/1280px-Corn_Bread_3A_%2884%29.jpg',
    alt: 'A pan of golden cornbread, cut into squares',
    credit: 'Wheeler Cowperthwaite, CC BY 2.0, via Wikimedia Commons',
  },
  'potatoes-rice': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Sweet_Potato_Fries_2.jpg/1280px-Sweet_Potato_Fries_2.jpg',
    alt: 'A pile of golden sweet potato fries',
    credit: 'Kurtkaiser, CC0, via Wikimedia Commons',
  },
  'salads-slaws': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Coleslaw_at_Charlies.jpg/1280px-Coleslaw_at_Charlies.jpg',
    alt: 'A bowl of creamy coleslaw',
    credit: 'Stanistani, CC BY-SA 3.0, via Wikimedia Commons',
  },
  'finger-foods': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/2019-12-16_15_52_18_Tostitos_Bite_Size_tortilla_chips_and_Salsa_Con_Queso_dip_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/1280px-2019-12-16_15_52_18_Tostitos_Bite_Size_tortilla_chips_and_Salsa_Con_Queso_dip_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg',
    alt: 'Tortilla chips with a bowl of queso dip',
    credit: 'Famartin, CC BY-SA 4.0, via Wikimedia Commons',
  },
  desserts: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Brownie-dessert-cake-sweet-45202.jpg/1280px-Brownie-dessert-cake-sweet-45202.jpg',
    alt: 'A plate of fudgy chocolate brownies',
    credit: 'johnkamatsos4, CC0, via Wikimedia Commons',
  },
  drinks: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/FelipesNOLATostadaHorchata.JPG/1280px-FelipesNOLATostadaHorchata.JPG',
    alt: 'A glass of horchata next to a tostada',
    credit: 'Infrogmation of New Orleans, CC BY-SA 3.0, via Wikimedia Commons',
  },
};

export const HERO_IMAGE = {
  src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Chili_con_carne_%284431800858%29.jpg/1280px-Chili_con_carne_%284431800858%29.jpg',
  alt: 'Bowl of chili con carne with kidney beans and a spoon, served on a white napkin.',
  credit: 'cyclonebill, CC BY-SA 2.0, via Wikimedia Commons',
};

export const SIDES: ChiliSide[] = [
  // --- Breads & cornbread (5) ---
  {
    name: 'Classic skillet cornbread',
    why: 'Sweet, crumbly and built to soak up sauce — the default chili starch for a reason.',
    category: 'breads',
    roles: ['dunkable'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian'],
  },
  {
    name: 'Jalapeño cheddar cornbread muffins',
    why: 'Cornbread in single servings, with heat and cheese baked in — no slicing, no crumbs everywhere.',
    category: 'breads',
    roles: ['dunkable'],
    chiliTypes: ['beef', 'turkey'],
    occasions: ['game-day', 'chili-bar'],
    diets: ['vegetarian'],
  },
  {
    name: 'Warm flour tortillas',
    why: 'Soft, warm and flexible: wrap the chili, scoop the chili, or mop the bowl clean.',
    category: 'breads',
    roles: ['dunkable'],
    chiliTypes: ['white-chicken', 'vegetarian', 'turkey'],
    occasions: ['family-dinner', 'chili-bar'],
    diets: ['vegetarian', 'vegan'],
  },
  {
    name: 'Garlic bread',
    why: 'Buttery, crisp-edged slices that stand up to a thick beef or turkey chili without falling apart.',
    category: 'breads',
    roles: ['dunkable', 'hearty'],
    chiliTypes: ['beef', 'turkey'],
    occasions: ['family-dinner', 'game-day'],
    diets: ['vegetarian'],
  },
  {
    name: 'Flaky buttermilk biscuits',
    why: 'Split one open and spoon chili over it — the biscuit soaks up sauce while staying flaky on top.',
    category: 'breads',
    roles: ['dunkable'],
    chiliTypes: ['beef', 'turkey', 'vegetarian'],
    occasions: ['family-dinner'],
    diets: ['vegetarian'],
  },
  // --- Potatoes & rice (5) ---
  {
    name: 'Loaded baked potatoes',
    why: 'A potato with chili ladled over it is a meal on its own — the potato is plate and side at once.',
    category: 'potatoes-rice',
    roles: ['hearty'],
    chiliTypes: ['beef', 'turkey'],
    occasions: ['family-dinner', 'game-day'],
    diets: ['vegetarian', 'gluten-free'],
  },
  {
    name: 'Sweet potato fries',
    why: 'Sweet, salty and crisp — the sweetness takes the edge off chili heat, and they are easy to share.',
    category: 'potatoes-rice',
    roles: ['hearty'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    name: 'Steamed white rice',
    why: 'A neutral base that stretches one pot of chili to feed a crowd, and lets the chili do the talking.',
    category: 'potatoes-rice',
    roles: ['hearty'],
    chiliTypes: ['white-chicken', 'vegetarian', 'turkey'],
    occasions: ['family-dinner', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    name: 'Cilantro-lime rice',
    why: 'Rice with lime and fresh cilantro — the bright, herby version that belongs next to white chicken chili.',
    category: 'potatoes-rice',
    roles: ['hearty'],
    chiliTypes: ['white-chicken', 'vegetarian'],
    occasions: ['family-dinner', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    name: 'Tater tots',
    why: 'Crisp, salty, dippable — the game-day potato, best eaten straight from the tray while the game is on.',
    category: 'potatoes-rice',
    roles: ['hearty'],
    chiliTypes: ['beef', 'turkey'],
    occasions: ['game-day'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  // --- Salads & slaws (4) ---
  {
    name: 'Classic coleslaw',
    why: 'Cold, crunchy and vinegary — the single best counterweight to a hot, rich bowl of chili.',
    category: 'salads-slaws',
    roles: ['fresh'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian', 'gluten-free'],
  },
  {
    name: 'Lime-cilantro slaw',
    why: 'Lime juice does the same job as vinegar with a fresher, brighter note that suits chicken and veggie chili.',
    category: 'salads-slaws',
    roles: ['fresh'],
    chiliTypes: ['white-chicken', 'vegetarian', 'turkey'],
    occasions: ['family-dinner', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    name: 'Cucumber-avocado salad',
    why: 'Cool cucumber and creamy avocado — a chilled salad that calms the heat without adding dairy.',
    category: 'salads-slaws',
    roles: ['fresh'],
    chiliTypes: ['white-chicken', 'vegetarian'],
    occasions: ['family-dinner', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    name: 'Corn, black bean & avocado salad',
    why: 'Sweet corn, earthy beans and avocado with lime — a fresh salad that echoes the chili without repeating it.',
    category: 'salads-slaws',
    roles: ['fresh'],
    chiliTypes: ['vegetarian', 'white-chicken', 'turkey'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  // --- Finger foods & appetisers (4) ---
  {
    name: 'Tortilla chips with queso',
    why: 'Scoopable, shareable and made for a crowd — set the bowl of queso next to the chili pot and let people graze.',
    category: 'finger-foods',
    roles: ['dunkable'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['game-day', 'chili-bar'],
    diets: ['vegetarian', 'gluten-free'],
  },
  {
    name: 'Jalapeño poppers',
    why: 'Creamy, cheesy and hot — a finger food that leans into the chili theme instead of fighting it.',
    category: 'finger-foods',
    roles: ['hearty'],
    chiliTypes: ['beef', 'turkey'],
    occasions: ['game-day', 'chili-bar'],
    diets: ['vegetarian'],
  },
  {
    name: 'Mozzarella sticks',
    why: 'Crisp outside, stretchy inside — a kid-friendly, crowd-friendly starter that needs no cutlery.',
    category: 'finger-foods',
    roles: ['hearty'],
    chiliTypes: ['beef', 'turkey'],
    occasions: ['family-dinner', 'game-day'],
    diets: ['vegetarian'],
  },
  {
    name: 'Baked tacos',
    why: 'Crisp shells filled with seasoned meat or beans — a second handheld main for guests who want more than a bowl.',
    category: 'finger-foods',
    roles: ['hearty'],
    chiliTypes: ['beef', 'turkey'],
    occasions: ['game-day', 'chili-bar'],
    diets: [],
  },
  // --- Desserts (3) ---
  {
    name: 'Fudgy brownies',
    why: 'Dense, chocolatey and plain — the sweet finish that resets the palate after a spiced bowl.',
    category: 'desserts',
    roles: ['finish'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian'],
  },
  {
    name: 'Cinnamon-sugar churros',
    why: 'Crisp, cinnamon-dusted and made for dipping — a dessert that fits a chili-bar spread.',
    category: 'desserts',
    roles: ['finish'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['game-day', 'chili-bar'],
    diets: ['vegetarian'],
  },
  {
    name: 'Vanilla ice cream',
    why: 'Cold, plain and sweet — the simplest cool-down after chili, and the one every guest will eat.',
    category: 'desserts',
    roles: ['finish'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian', 'gluten-free'],
  },
  // --- Drinks (3) ---
  {
    name: 'Horchata',
    why: 'Sweet, cinnamon-spiced rice milk — a cooling drink that tames heat and suits every chili on the table.',
    category: 'drinks',
    roles: ['finish'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    name: 'Lime agua fresca',
    why: 'Light, tart and cold — lime water with a little sweetness, the freshest drink on a chili night.',
    category: 'drinks',
    roles: ['finish'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
  {
    name: 'Iced tea with lime',
    why: 'Unsweetened iced tea and a lime wedge — the plain, cold drink that lets the chili be the star.',
    category: 'drinks',
    roles: ['finish'],
    chiliTypes: ['beef', 'white-chicken', 'turkey', 'vegetarian'],
    occasions: ['family-dinner', 'game-day', 'chili-bar'],
    diets: ['vegetarian', 'vegan', 'gluten-free'],
  },
];

export const SIDE_COUNT = SIDES.length; // 24 — the title count must match this

export interface ToppingsRow {
  chiliType: ChiliType;
  cheese: string;
  cooling: string;
  crunchy: string;
  heat: string;
}

/** Our own toppings picks per chili type — same table shape as the genre, our own cells. */
export const TOPPINGS_TABLE: ToppingsRow[] = [
  {
    chiliType: 'beef',
    cheese: 'Shredded sharp cheddar',
    cooling: 'Sour cream',
    crunchy: 'Crumbled tortilla chips',
    heat: 'Pickled jalapeños',
  },
  {
    chiliType: 'white-chicken',
    cheese: 'Shredded Monterey Jack',
    cooling: 'Diced avocado and lime wedges',
    crunchy: 'Toasted pepitas',
    heat: 'Sliced fresh jalapeño',
  },
  {
    chiliType: 'turkey',
    cheese: 'Shredded pepper Jack',
    cooling: 'Greek yoghurt',
    crunchy: 'Crispy fried onions',
    heat: 'Chipotle hot sauce',
  },
  {
    chiliType: 'vegetarian',
    cheese: 'Crumbled feta, or vegan cheddar to keep the pot vegan',
    cooling: 'Cashew cream or diced avocado',
    crunchy: 'Toasted pepitas',
    heat: 'Sliced pickled chillies',
  },
];

/** Toppings bar the tool shows, per chili type. */
export const TOPPINGS_BAR: Record<ChiliType, string[]> = {
  beef: [
    'Shredded sharp cheddar',
    'Sour cream',
    'Pickled jalapeños',
    'Diced raw onion',
    'Hot sauce',
    'Crumbled tortilla chips',
  ],
  'white-chicken': [
    'Diced avocado',
    'Lime wedges',
    'Chopped cilantro',
    'Pickled red onions',
    'Shredded Monterey Jack',
    'Greek yoghurt instead of sour cream',
  ],
  turkey: [
    'Shredded pepper Jack',
    'Greek yoghurt',
    'Crispy fried onions',
    'Chipotle hot sauce',
    'Diced avocado',
    'Crumbled tortilla chips',
  ],
  vegetarian: [
    'Crumbled feta or vegan cheddar',
    'Cashew cream',
    'Toasted pepitas',
    'Diced avocado',
    'Pickled red onions',
    'Sliced pickled chillies',
  ],
};

/** The prose matrix: best 3–4 sides per chili type / occasion. */
export const SIDES_BY_CHILI: Array<{
  label: string;
  sides: string[];
}> = [
  {
    label: 'Beef / Texas chili',
    sides: [
      'Classic skillet cornbread',
      'Classic coleslaw',
      'Loaded baked potatoes',
      'Jalapeño poppers',
    ],
  },
  {
    label: 'White chicken chili',
    sides: [
      'Cilantro-lime rice',
      'Lime-cilantro slaw',
      'Warm flour tortillas',
      'Cucumber-avocado salad',
    ],
  },
  {
    label: 'Turkey chili',
    sides: [
      'Garlic bread',
      'Corn, black bean & avocado salad',
      'Sweet potato fries',
      'Baked tacos',
    ],
  },
  {
    label: 'Vegetarian chili',
    sides: [
      'Steamed white rice',
      'Lime-cilantro slaw',
      'Sweet potato fries',
      'Tortilla chips with queso',
    ],
  },
  {
    label: 'Game day',
    sides: [
      'Tater tots',
      'Jalapeño poppers',
      'Tortilla chips with queso',
      'Mozzarella sticks',
    ],
  },
];

export const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'Can I serve rice with chili?',
    answer:
      'Yes — steamed white rice is one of the best chili sides. It stretches one pot to feed a crowd and soaks up sauce without adding flavour of its own. It works best with white chicken chili and vegetarian chili; cilantro-lime rice is the brighter version for those two. For beef chili, cornbread is the more classic starch.',
  },
  {
    question: 'What dessert goes with chili?',
    answer:
      'Something sweet and plain, to reset the palate after spice: fudgy brownies, cinnamon-sugar churros, or vanilla ice cream. Skip a second strongly spiced dessert — the meal should end on a sweet note, not a hot one. Vanilla ice cream is the safest pick when guests have different tastes.',
  },
  {
    question: 'What are the healthy options to serve with chili?',
    answer:
      'The lighter sides are the fresh ones: lime-cilantro slaw, cucumber-avocado salad, and corn, black bean and avocado salad, plus steamed white rice and baked (not fried) sweet potato fries. Skip the cheese-heavy finger foods and let the toppings bar carry the richness instead — avocado, lime and pickled onions instead of extra cheese and sour cream.',
  },
  {
    question: 'What do you serve with white chicken chili?',
    answer:
      'Lighter, brighter sides: lime-cilantro slaw, diced avocado, pickled red onions, and warm flour tortillas or cilantro-lime rice. Skip the heavy baked beans and loaded potatoes — they suit beef chili better. On the toppings bar, use Monterey Jack, avocado, lime and cilantro instead of sharp cheddar and sour cream.',
  },
  {
    question: 'Can I serve chili with pasta?',
    answer:
      'Yes — Cincinnati-style chili is served over spaghetti with shredded cheddar, and it is a real regional tradition, not a shortcut. Cook the spaghetti plain, ladle the chili over it, and top with cheese, diced onion and kidney beans. It works best with a thinner, spiced beef chili rather than a thick bean-heavy one.',
  },
  {
    question: 'How many sides should I serve with chili?',
    answer:
      'Three is the sweet spot: one dunkable side (cornbread or tortillas), one fresh, crunchy side (coleslaw or a salad), and a toppings bar. Add one hearty side — baked potatoes or rice — when you are feeding 8 or more, and a simple dessert like brownies to finish.',
  },
];
