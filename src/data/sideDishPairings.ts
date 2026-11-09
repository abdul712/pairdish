/**
 * Side-Dish Pairing Generator — dish database.
 *
 * One profile per "what to serve with X" main dish. Each profile groups its
 * sides by the four jobs a side dish can do (the framework from
 * /tools/flavor-pairing):
 *   cut      — cut richness (acid, crunch, freshness)
 *   contrast — add contrast (temperature, texture, colour)
 *   depth    — carry savoury depth (umami, roasted, smoky)
 *   starch   — supply starch (the filling base)
 *
 * Portions are per person; the generator scales them by guest count.
 * Diets use: vegetarian | vegan | glutenFree | dairyFree | lowCarb.
 * A side with no `occasions` tag fits every occasion; a side with no
 * `methods` tag fits every cooking method of its dish.
 */

export type SideJob = 'cut' | 'contrast' | 'depth' | 'starch';
export type Diet = 'vegetarian' | 'vegan' | 'glutenFree' | 'dairyFree' | 'lowCarb';
export type Occasion = 'weeknight' | 'game-day' | 'holiday' | 'bbq' | 'potluck' | 'formal';

export const JOB_LABELS: Record<SideJob, { title: string; blurb: string }> = {
  cut: {
    title: 'Cut the richness',
    blurb: 'Acid, crunch and freshness that keep a rich main from feeling heavy.',
  },
  contrast: {
    title: 'Add contrast',
    blurb: 'A different temperature, texture or colour from the main dish.',
  },
  depth: {
    title: 'Carry savoury depth',
    blurb: 'Roasted, smoky or umami-rich sides that stand up to a bold main.',
  },
  starch: {
    title: 'Supply the starch',
    blurb: 'The filling base that turns the main into a complete meal.',
  },
};

export interface DishSide {
  name: string;
  why: string;
  amount: number;
  unit: string;
  prepMinutes: number;
  diets: Diet[];
  occasions?: Occasion[];
  methods?: string[];
}

export interface DishProfile {
  id: string;
  name: string;
  aliases: string[];
  blurb: string;
  methods?: string[];
  occasions: Occasion[];
  pageSlug?: string;
  sides: Record<SideJob, DishSide[]>;
}

const v: Diet[] = ['vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'lowCarb'];
const veg: Diet[] = ['vegetarian', 'vegan', 'glutenFree', 'dairyFree'];
const vegNoDairy: Diet[] = ['vegetarian', 'glutenFree'];

export const DISHES: DishProfile[] = [
  {
    id: 'chili',
    name: 'Chili',
    aliases: ['chili con carne', 'beef chili', 'texas chili', 'white chicken chili', 'vegetarian chili'],
    blurb:
      'Chili is rich, spiced and saucy, so the plate needs crunch, acid and something to soak it up — plus a toppings bar, because half the fun of chili night is building your own bowl.',
    occasions: ['weeknight', 'game-day', 'potluck'],
    pageSlug: 'what-to-serve-with-chili',
    sides: {
      cut: [
        { name: 'Classic coleslaw', why: 'Cold, crunchy and vinegary — the single best counterweight to a hot, rich bowl of chili.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Pickled jalapeños', why: 'Sharp heat and brine that cut through beef chili without adding another heavy flavour.', amount: 2, unit: 'tbsp', prepMinutes: 5, diets: v },
        { name: 'Lime-cilantro slaw', why: 'Lime juice does the same job as vinegar with a fresher, brighter note that suits chicken chili.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Quick-pickled red onions', why: 'Ten minutes in vinegar turns raw onion into a sharp pink topping that lifts every spoonful.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Sour cream', why: 'Cool dairy against hot spice; a spoonful on top changes the temperature of each bite.', amount: 2, unit: 'tbsp', prepMinutes: 0, diets: vegNoDairy },
        { name: 'Shredded sharp cheddar', why: 'Melts into the chili and adds salty richness — the classic topping-bar anchor.', amount: 0.25, unit: 'cup', prepMinutes: 0, diets: vegNoDairy },
        { name: 'Diced avocado', why: 'Creamy and cool where chili is hot and sharp; also the vegetarian-friendly fat on the plate.', amount: 0.25, unit: 'whole', prepMinutes: 5, diets: v },
        { name: 'Crumbled tortilla chips', why: 'Crunch on top of a soft stew — sprinkle at the table so they stay crisp.', amount: 0.5, unit: 'cup', prepMinutes: 0, diets: ['vegetarian', 'vegan', 'glutenFree', 'dairyFree'], occasions: ['game-day'] },
      ],
      depth: [
        { name: 'Smoky baked beans', why: 'Beans on beans sounds redundant, but smoky baked beans echo chili spices while adding sweetness.', amount: 0.5, unit: 'cup', prepMinutes: 10, diets: veg },
        { name: 'Roasted sweet potatoes', why: 'Sweet, caramelised cubes that balance chili heat and add a second warm vegetable.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Charred corn', why: 'Smoky-sweet kernels that pick up the cumin and chipotle in the chili.', amount: 0.5, unit: 'cup', prepMinutes: 15, diets: v, occasions: ['bbq', 'game-day'] },
        { name: 'Sautéed peppers and onions', why: 'The fajita-style base, served as a side, doubles the savoury depth without another pot.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: v },
      ],
      starch: [
        { name: 'Cornbread', why: 'The classic chili starch — sweet, crumbly, and built to soak up sauce.', amount: 1, unit: 'piece', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Steamed white rice', why: 'A neutral base that stretches one pot of chili to feed a crowd.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Flour tortillas', why: 'Warm tortillas turn chili into a wrap and mop up the bowl.', amount: 1, unit: 'tortilla', prepMinutes: 5, diets: ['vegetarian', 'vegan', 'dairyFree'] },
        { name: 'Baked potatoes', why: 'A baked potato with chili on top is a meal on its own — the potato is plate and side at once.', amount: 1, unit: 'potato', prepMinutes: 60, diets: veg },
      ],
    },
  },
  {
    id: 'mac-and-cheese',
    name: 'Mac and Cheese',
    aliases: ['macaroni and cheese', 'macaroni cheese', 'baked mac and cheese'],
    blurb:
      'Mac and cheese is pure comfort — creamy, salty, starchy. The sides that work either cut through that richness with acid and crunch, or turn the bowl into a full dinner with a protein main.',
    occasions: ['weeknight', 'potluck', 'holiday'],
    pageSlug: 'what-to-serve-with-mac-and-cheese',
    sides: {
      cut: [
        { name: 'Steamed broccoli', why: 'The classic pairing for a reason: green, slightly bitter, and its florets catch the cheese sauce.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Roasted Brussels sprouts', why: 'Caramelised edges and a bitter note that slice straight through cheddar richness.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
        { name: 'Simple green salad with vinaigrette', why: 'Acidic dressing is the fastest way to reset the palate between creamy bites.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled beets', why: 'Earthy, vinegary and jewel-bright — the sharpest contrast on this list.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
      ],
      contrast: [
        { name: 'Crispy fried onions', why: 'Crunch on top of soft pasta; the texture mac and cheese is missing.', amount: 2, unit: 'tbsp', prepMinutes: 5, diets: ['vegetarian', 'vegan', 'dairyFree'] },
        { name: 'Garlic green beans', why: 'Snappy, garlicky and green — a fresh counterpoint that cooks in one pan.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Apple and walnut salad', why: 'Sweet crunch and tart apple against a salty cheese sauce.', amount: 1, unit: 'cup', prepMinutes: 15, diets: ['vegetarian', 'glutenFree'] },
        { name: 'Roasted cauliflower', why: 'Nutty, browned florets that hold their shape next to soft pasta.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
      ],
      depth: [
        { name: 'BBQ pulled pork', why: 'Smoky pork turns a side dish into the main event — the barbecue-joint version of mac and cheese.', amount: 4, unit: 'oz', prepMinutes: 15, diets: ['glutenFree', 'dairyFree', 'lowCarb'], occasions: ['bbq', 'game-day'] },
        { name: 'Grilled chicken', why: 'Lean protein that lets the mac stay the star while the plate becomes dinner.', amount: 4, unit: 'oz', prepMinutes: 20, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Meatballs in marinara', why: 'Tomato acid plus savoury meat — the Italian-American answer to mac and cheese night.', amount: 3, unit: 'meatballs', prepMinutes: 25, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Crispy bacon bits', why: 'Smoky, salty crunch stirred through or scattered on top.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
      ],
      starch: [
        { name: 'Garlic bread', why: 'A second starch is the point here — buttery bread for mopping up cheese sauce.', amount: 1, unit: 'slice', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Roasted potatoes', why: 'Crisp-edged potatoes add a second texture while staying in the comfort-food lane.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Dinner rolls', why: 'Soft rolls are the potluck answer: cheap, filling, and everyone eats them.', amount: 1, unit: 'roll', prepMinutes: 5, diets: vegNoDairy, occasions: ['potluck', 'holiday'] },
      ],
    },
  },
  {
    id: 'salmon',
    name: 'Salmon',
    aliases: ['grilled salmon', 'baked salmon', 'pan-seared salmon', 'teriyaki salmon'],
    blurb:
      'Salmon is rich in its own right — oily, full-flavoured, and quick to cook. The best sides are bright and fresh for rich preparations, or warm and earthy for lighter ones. Pick a cooking method and the sides follow.',
    methods: ['Baked', 'Grilled', 'Pan-seared', 'Teriyaki'],
    occasions: ['weeknight', 'formal', 'holiday'],
    pageSlug: 'what-to-serve-with-salmon',
    sides: {
      cut: [
        { name: 'Lemon-dressed asparagus', why: 'Lemon and salmon are a fixed pairing — acid lifts the fish and asparagus adds a green snap.', amount: 4, unit: 'spears', prepMinutes: 12, diets: v },
        { name: 'Cucumber-dill salad', why: 'Cool, crisp and herbal; the Scandinavian answer to rich fish.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: veg },
        { name: 'Arugula with lemon vinaigrette', why: 'Peppery leaves and sharp dressing cut the oiliness without competing with the fish.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled fennel', why: 'Anise-bright and crunchy; a small spoonful resets the palate between bites.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Roasted broccoli', why: 'Charred edges and a firm bite against soft, flaky salmon.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Shaved fennel and orange salad', why: 'Crunchy, citrusy and pale — a visual and textural opposite to a pink fillet.', amount: 1, unit: 'cup', prepMinutes: 15, diets: v, methods: ['Baked', 'Pan-seared'] },
        { name: 'Crispy smashed potatoes', why: 'Crackling outsides, fluffy middles — the texture salmon does not have.', amount: 0.75, unit: 'cup', prepMinutes: 40, diets: v },
        { name: 'Grilled corn on the cob', why: 'Sweet char from the same grill as the fish; butter and lime finish it.', amount: 1, unit: 'ear', prepMinutes: 15, diets: veg, methods: ['Grilled'], occasions: ['bbq'] },
      ],
      depth: [
        { name: 'Miso-glazed eggplant', why: 'Deep umami that matches teriyaki salmon note for note.', amount: 0.5, unit: 'cup', prepMinutes: 25, diets: veg, methods: ['Teriyaki'] },
        { name: 'Roasted mushrooms', why: 'Earthy and meaty; they give the plate a second savoury anchor.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Garlic butter green beans', why: 'Buttery and garlicky — the bistro side that never argues with salmon.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Sesame spinach', why: 'Wilted spinach with soy and sesame; the light, savoury side for teriyaki salmon.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: veg, methods: ['Teriyaki'] },
      ],
      starch: [
        { name: 'Lemon herb rice', why: 'A neutral, fragrant base that soaks up pan juices and lemon butter.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Roasted baby potatoes', why: 'Crisp skins and soft centres; the classic salmon supper starch.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Quinoa pilaf', why: 'Nutty, light and protein-rich — the weeknight upgrade from rice.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Crusty bread', why: 'For the pan sauce and the lemon butter — bread is the delivery system.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'stuffed-bell-peppers',
    name: 'Stuffed Bell Peppers',
    aliases: ['stuffed peppers', 'stuffed green peppers'],
    blurb:
      'Stuffed peppers already bring rice, meat and tomato in one package, so sides should stay light and fresh — a salad, a simple grain, or a vegetable that does not repeat the filling.',
    occasions: ['weeknight', 'potluck'],
    pageSlug: 'what-to-serve-with-stuffed-bell-peppers',
    sides: {
      cut: [
        { name: 'Simple green salad', why: 'The pepper is heavy and baked; a raw salad is the lightest possible contrast.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Cucumber-tomato salad', why: 'Fresh, juicy and acidic — it eats like a salsa next to a rich filling.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Coleslaw', why: 'Cold crunch against a soft, hot pepper.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Marinated artichoke salad', why: 'Briny and bright; a Mediterranean note that suits a tomato-based filling.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
      ],
      contrast: [
        { name: 'Garlic green beans', why: 'Snappy and garlicky where the pepper is soft and sweet.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Roasted zucchini', why: 'A second roasted vegetable with a different texture — soft, not stuffed.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Kale chips', why: 'Crackling salty leaves as a garnish-side; kids eat them first.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: v },
      ],
      depth: [
        { name: 'Roasted mushrooms', why: 'Earthy depth that echoes the savoury filling without repeating it.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Italian sausage links', why: 'For meat-filled peppers, sausage on the side is belt-and-braces; for vegetarian peppers, it makes the meal.', amount: 1, unit: 'link', prepMinutes: 20, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Balsamic roasted carrots', why: 'Sweet-sour roasted roots that share the oven with the peppers.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
      ],
      starch: [
        { name: 'Crusty bread', why: 'For the tomato sauce that escapes the pepper.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
        { name: 'Garlic mashed potatoes', why: 'A soft, buttery base under a soft pepper — comfort doubled, deliberately.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'Couscous', why: 'Fluffy, fast and neutral; it soaks up sauce without another heavy starch.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'crab-cakes',
    name: 'Crab Cakes',
    aliases: ['maryland crab cakes', 'crabcakes'],
    blurb:
      'Crab cakes are delicate, sweet and fried — they need a sauce, something green, and a light starch. Anything heavy or strongly spiced will bury the crab.',
    occasions: ['weeknight', 'formal', 'potluck'],
    pageSlug: 'what-to-serve-with-crab-cakes',
    sides: {
      cut: [
        { name: 'Remoulade sauce', why: 'The Maryland answer: tangy, creamy, and built for fried crab.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Tartar sauce', why: 'Pickle brine and lemon against sweet crab and a crisp crust.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Lemon aioli', why: 'Garlic-lemon mayonnaise — richer than remoulade, lighter than tartar.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Coleslaw', why: 'Cold crunch and vinegar; the fish-fry side that fits crab cakes too.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
      ],
      contrast: [
        { name: 'Arugula salad', why: 'Peppery leaves that need nothing more than lemon and olive oil next to crab.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Grilled asparagus', why: 'Charred green spears with a firm bite against a soft cake.', amount: 4, unit: 'spears', prepMinutes: 12, diets: v },
        { name: 'Cucumber salad', why: 'Cool and crisp; it cleans the palate between rich bites.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      depth: [
        { name: 'Roasted corn', why: 'Sweet, smoky kernels that echo a summer crab boil.', amount: 0.5, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Sautéed spinach with garlic', why: 'A quick wilted green that adds savoury depth without weight.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Corn chowder', why: 'A small cup of chowder turns crab cakes into a coastal supper.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: veg },
      ],
      starch: [
        { name: 'Roasted potatoes', why: 'Crisp-edged potatoes; the safe, classic crab-cake starch.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Hushpuppies', why: 'The Southern fish-fry starch — fried, but small and corny, not heavy.', amount: 3, unit: 'pieces', prepMinutes: 25, diets: vegNoDairy },
        { name: 'Rice pilaf', why: 'A light, lemony rice that stays out of the crab\'s way.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
      ],
    },
  },
  {
    id: 'hummus',
    name: 'Hummus',
    aliases: ['hummus platter', 'mezze'],
    blurb:
      'Hummus is a base, not a main — so the question is what it is served with: dippers for snacking, mains that turn it into dinner, or a full mezze spread for a crowd.',
    occasions: ['weeknight', 'potluck', 'game-day'],
    pageSlug: 'what-to-serve-with-hummus',
    sides: {
      cut: [
        { name: 'Pickled vegetables', why: 'Sharp brine against creamy chickpeas; the mezze-table essential.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
        { name: 'Tabbouleh', why: 'Parsley, lemon and bulgur — the freshest thing on a mezze spread.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: ['vegetarian', 'vegan', 'dairyFree'] },
        { name: 'Marinated olives', why: 'Salty and briny; a small bowl of olives makes hummus feel like a meal.', amount: 0.25, unit: 'cup', prepMinutes: 5, diets: v },
        { name: 'Lemon-herb cucumber salad', why: 'Crisp cucumber with lemon — a cooling dipper-side.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Warm pita bread', why: 'Soft, warm triangles for scooping — the dipper hummus was made for.', amount: 1, unit: 'pita', prepMinutes: 5, diets: ['vegetarian', 'vegan', 'dairyFree'] },
        { name: 'Crudités (carrots, celery, peppers)', why: 'Crunchy raw vegetables; the light, no-cook mezze option.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pita chips', why: 'Crackling chips for a crunchier scoop than soft pita.', amount: 0.5, unit: 'cup', prepMinutes: 0, diets: ['vegetarian', 'vegan', 'dairyFree'], occasions: ['game-day'] },
        { name: 'Roasted cauliflower', why: 'Warm, nutty florets that dip as well as any chip.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
      ],
      depth: [
        { name: 'Falafel', why: 'Crisp chickpea fritters — hummus and falafel are the same ingredient twice, and it works.', amount: 3, unit: 'pieces', prepMinutes: 25, diets: veg },
        { name: 'Shawarma-spiced chicken', why: 'Warm, spiced strips over hummus turn a dip into dinner.', amount: 4, unit: 'oz', prepMinutes: 20, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Roasted eggplant', why: 'Smoky, soft eggplant that leans the spread toward baba ganoush territory.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Spiced ground lamb', why: 'Rich, warmly spiced lamb spooned over hummus — the restaurant presentation.', amount: 4, unit: 'oz', prepMinutes: 20, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
      ],
      starch: [
        { name: 'Couscous', why: 'Fluffy grains that carry hummus like a sauce.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Flatbread', why: 'A sturdier scoop than pita, and it doubles as the bread course.', amount: 1, unit: 'piece', prepMinutes: 5, diets: ['vegetarian', 'vegan', 'dairyFree'] },
        { name: 'Roasted potatoes with za\'atar', why: 'Crisp potatoes with Middle Eastern spice — the starch that matches the spread.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
      ],
    },
  },
  {
    id: 'ribs',
    name: 'Ribs',
    aliases: ['bbq ribs', 'baby back ribs', 'spare ribs'],
    blurb:
      'Ribs are smoky, sticky and rich — the sides are the classic barbecue spread: slaw for acid, beans for sweetness, potatoes for starch, and bread for the sauce.',
    occasions: ['bbq', 'game-day', 'potluck'],
    pageSlug: 'what-to-serve-with-ribs',
    sides: {
      cut: [
        { name: 'Classic coleslaw', why: 'The barbecue essential: cold, vinegary crunch against hot, fatty ribs.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Vinegar slaw', why: 'No mayo, all vinegar — the Carolina-style cut for the richest ribs.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Pickles', why: 'A dill spear on the plate is the simplest acid on this list.', amount: 2, unit: 'spears', prepMinutes: 0, diets: v },
        { name: 'Cucumber salad', why: 'Cool and crisp; the lightest thing on a barbecue plate.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Grilled corn on the cob', why: 'Sweet char from the same grill, buttered at the table.', amount: 1, unit: 'ear', prepMinutes: 15, diets: veg, occasions: ['bbq'] },
        { name: 'Mac and cheese', why: 'The barbecue-joint second main — creamy against smoky.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Fried okra', why: 'Crisp, salty bites that add crunch to a soft, saucy plate.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: vegNoDairy },
      ],
      depth: [
        { name: 'Baked beans', why: 'Sweet, smoky beans are the flavour echo of the ribs themselves.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: veg },
        { name: 'Collard greens', why: 'Slow-cooked, smoky greens — the Southern side that earns its place.', amount: 0.75, unit: 'cup', prepMinutes: 40, diets: veg },
        { name: 'Smoked sausage', why: 'A second smoke on the plate for the serious barbecue spread.', amount: 2, unit: 'links', prepMinutes: 15, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
      ],
      starch: [
        { name: 'Cornbread', why: 'Sweet cornbread with barbecue sauce is the pairing the region settled on.', amount: 1, unit: 'piece', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Potato salad', why: 'Cool, creamy potatoes that rest the palate between rib bites.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'White bread', why: 'The Texas barbecue move: plain white bread for mopping sauce.', amount: 2, unit: 'slices', prepMinutes: 0, diets: ['vegetarian', 'vegan', 'dairyFree'], occasions: ['bbq'] },
        { name: 'Baked potatoes', why: 'A loaded baked potato turns ribs into a full plate.', amount: 1, unit: 'potato', prepMinutes: 60, diets: veg },
      ],
    },
  },
  {
    id: 'lasagna',
    name: 'Lasagna',
    aliases: ['beef lasagna', 'vegetable lasagna'],
    blurb:
      'Lasagna is a complete dish in a pan — rich, cheesy, saucy. It needs one fresh side, one bread, and one vegetable. That is the whole formula.',
    occasions: ['weeknight', 'holiday', 'potluck'],
    pageSlug: 'what-to-serve-with-lasagna',
    sides: {
      cut: [
        { name: 'Simple green salad', why: 'The one fresh thing on a lasagna plate — lemon vinaigrette, nothing fancy.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Arugula and shaved parmesan', why: 'Peppery leaves with the same cheese as the lasagna, in a lighter form.', amount: 1, unit: 'cup', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Tomato-cucumber salad', why: 'Fresh tomato and cucumber with red onion — a salad that echoes the sauce.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled vegetables', why: 'A sharp, briny bite that cuts through cheese and béchamel.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
      ],
      contrast: [
        { name: 'Roasted broccoli', why: 'Charred green florets with a firm bite next to soft pasta layers.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Sautéed spinach with garlic', why: 'A quick wilted green that adds colour and iron without weight.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Grilled zucchini', why: 'Smoky strips that share the Italian flavour lane.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
      ],
      depth: [
        { name: 'Roasted mushrooms', why: 'Earthy depth that matches the meat sauce without more meat.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Italian sausage', why: 'For a vegetarian lasagna, sausage on the side supplies the missing savoury hit.', amount: 1, unit: 'link', prepMinutes: 20, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Balsamic roasted carrots', why: 'Sweet-sour roots that share the oven and the flavour profile.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
      ],
      starch: [
        { name: 'Garlic bread', why: 'The lasagna rule: bread is for the sauce left on the plate.', amount: 1, unit: 'slice', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Focaccia', why: 'Oily, salty flatbread — the Italian answer to garlic bread.', amount: 1, unit: 'piece', prepMinutes: 5, diets: vegNoDairy },
        { name: 'Crusty bread', why: 'A plain loaf does the same job with less fuss.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'steak',
    name: 'Steak',
    aliases: ['ribeye', 'filet mignon', 'sirloin', 'new york strip'],
    blurb:
      'Steak is the steakhouse plate: the sides are the classics for a reason — creamed spinach, baked potatoes, mushrooms. Pick a cut and the sides adjust.',
    methods: ['Ribeye', 'Filet', 'Sirloin'],
    occasions: ['weeknight', 'formal', 'holiday'],
    pageSlug: 'what-to-serve-with-steak',
    sides: {
      cut: [
        { name: 'Arugula salad', why: 'Peppery leaves with lemon — the steakhouse salad that cuts a fatty ribeye.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v, methods: ['Ribeye'] },
        { name: 'Tomato and onion salad', why: 'Acidic, raw and simple; the Brazilian steakhouse counterweight.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled red onions', why: 'Sharp pink onions on a rich steak plate — small amount, big effect.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v },
        { name: 'Lemon-dressed asparagus', why: 'Green, bright and quick — the classic filet companion.', amount: 4, unit: 'spears', prepMinutes: 12, diets: v, methods: ['Filet'] },
      ],
      contrast: [
        { name: 'Creamed spinach', why: 'The steakhouse icon: rich, soft and green against a seared crust.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: vegNoDairy },
        { name: 'Roasted Brussels sprouts', why: 'Caramelised, bitter crunch next to a tender filet.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v, methods: ['Filet'] },
        { name: 'Crispy onion rings', why: 'Sweet crunch and frying — the indulgent steakhouse side.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: vegNoDairy },
        { name: 'Grilled corn', why: 'Sweet char for a grilled sirloin night.', amount: 1, unit: 'ear', prepMinutes: 15, diets: veg, methods: ['Sirloin'], occasions: ['bbq'] },
      ],
      depth: [
        { name: 'Sautéed mushrooms', why: 'Buttery mushrooms and steak are a fixed pairing — umami on umami.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Roasted garlic', why: 'Sweet, spreadable garlic cloves for a ribeye — the steakhouse move.', amount: 0.5, unit: 'head', prepMinutes: 40, diets: v, methods: ['Ribeye'] },
        { name: 'Blue cheese butter', why: 'A cold compound butter melting over hot steak — the filet upgrade.', amount: 1, unit: 'tbsp', prepMinutes: 5, diets: vegNoDairy, methods: ['Filet'] },
        { name: 'Grilled peppers and onions', why: 'Charred and sweet; the sirloin-strips side.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: v, methods: ['Sirloin'] },
      ],
      starch: [
        { name: 'Baked potato', why: 'The steakhouse default — fluffy inside, crisp skin, butter and sour cream.', amount: 1, unit: 'potato', prepMinutes: 60, diets: veg },
        { name: 'Garlic mashed potatoes', why: 'Buttery mash for the pan juices.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'Crispy fries', why: 'Steak frites: thin, salty fries are the bistro answer.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'Crusty bread', why: 'For the butter and the juices — bread is the quiet steak side.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'beef-brisket',
    name: 'Beef Brisket',
    aliases: ['brisket', 'smoked brisket', 'bbq brisket'],
    blurb:
      'Brisket is slow-smoked, fatty and deeply savoury — Texas barbecue sides apply: slaw, beans, potatoes and bread, with pickles for acid.',
    occasions: ['bbq', 'game-day', 'potluck'],
    pageSlug: 'what-to-serve-with-beef-brisket',
    sides: {
      cut: [
        { name: 'Vinegar slaw', why: 'The Texas cut: sharp vinegar slaw against fatty smoked beef.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Pickles and onions', why: 'Dill pickles and raw onion — the brisket-plate acid, straight from the barbecue joint.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
        { name: 'Coleslaw', why: 'Creamy slaw for those who want the crunch without the vinegar punch.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Cucumber salad', why: 'Cool and light; the palate rest on a heavy barbecue plate.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Mac and cheese', why: 'Creamy mac is the barbecue-joint second main next to brisket.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Grilled corn', why: 'Sweet char from the smoker\'s neighbour, the grill.', amount: 1, unit: 'ear', prepMinutes: 15, diets: veg },
        { name: 'Fried okra', why: 'Crisp, salty bites that add crunch to soft smoked meat.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: vegNoDairy },
      ],
      depth: [
        { name: 'Baked beans', why: 'Sweet, smoky beans are the brisket plate\'s flavour echo.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: veg },
        { name: 'Collard greens', why: 'Slow-cooked greens with pot liquor — the Southern depth on the plate.', amount: 0.75, unit: 'cup', prepMinutes: 40, diets: veg },
        { name: 'Smoked sausage', why: 'A second smoke for the full barbecue spread.', amount: 2, unit: 'links', prepMinutes: 15, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
      ],
      starch: [
        { name: 'White bread', why: 'The Texas move: plain white bread to mop sauce and wrap brisket.', amount: 2, unit: 'slices', prepMinutes: 0, diets: ['vegetarian', 'vegan', 'dairyFree'] },
        { name: 'Potato salad', why: 'Cool, creamy potatoes between bites of hot brisket.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'Cornbread', why: 'Sweet cornbread with smoky meat — the barbecue pairing.', amount: 1, unit: 'piece', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Baked potato', why: 'A loaded baked potato turns brisket into a full plate.', amount: 1, unit: 'potato', prepMinutes: 60, diets: veg },
      ],
    },
  },
  {
    id: 'tacos',
    name: 'Tacos',
    aliases: ['ground beef tacos', 'carnitas tacos', 'fish tacos', 'veggie tacos'],
    blurb:
      'Tacos are already a complete handheld meal, so sides stay in the Mexican lane: rice, beans, slaw and something fresh. Match the side to the filling — fish wants slaw, carnitas wants beans.',
    methods: ['Ground beef', 'Carnitas', 'Fish', 'Veg'],
    occasions: ['weeknight', 'game-day', 'potluck'],
    pageSlug: 'what-to-serve-with-tacos',
    sides: {
      cut: [
        { name: 'Cabbage slaw with lime', why: 'Crunchy, lime-bright slaw — the fish-taco essential.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg, methods: ['Fish'] },
        { name: 'Pico de gallo', why: 'Fresh tomato, onion and lime — a salsa-side that doubles as a topping.', amount: 0.5, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled red onions', why: 'Sharp pink onions that suit carnitas and al pastor alike.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v, methods: ['Carnitas'] },
        { name: 'Guacamole', why: 'Cool, creamy avocado against spiced meat — also the vegetarian fat on the plate.', amount: 0.25, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Mexican street corn (elote)', why: 'Charred corn with mayo, lime and cotija — the taco-night side.', amount: 1, unit: 'ear', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Jalapeño poppers', why: 'Creamy, spicy, crunchy — the game-day taco side.', amount: 3, unit: 'pieces', prepMinutes: 25, diets: vegNoDairy, occasions: ['game-day'] },
        { name: 'Grilled peppers', why: 'Smoky strips that match fajita-style fillings.', amount: 0.5, unit: 'cup', prepMinutes: 15, diets: v },
      ],
      depth: [
        { name: 'Refried beans', why: 'Creamy, savoury beans — the taco plate\'s second protein.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Black beans with cumin', why: 'Earthy beans with cumin and lime; the lighter bean option.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Queso dip', why: 'Warm cheese dip for chips on the side — taco night, fully committed.', amount: 0.25, unit: 'cup', prepMinutes: 10, diets: vegNoDairy, occasions: ['game-day'] },
      ],
      starch: [
        { name: 'Mexican rice', why: 'Tomato-cumin rice — the taco plate\'s classic starch.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Cilantro-lime rice', why: 'Bright, herby rice that suits fish and veg fillings.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v, methods: ['Fish', 'Veg'] },
        { name: 'Tortilla chips and salsa', why: 'The pre-dinner crunch that turns tacos into a spread.', amount: 0.5, unit: 'cup', prepMinutes: 0, diets: ['vegetarian', 'vegan', 'glutenFree', 'dairyFree'] },
      ],
    },
  },
  {
    id: 'meatloaf',
    name: 'Meatloaf',
    aliases: ['beef meatloaf', 'turkey meatloaf'],
    blurb:
      'Meatloaf is the Sunday-dinner main — the formula is one starch, one green, and one crisp side. The glaze decides the rest: sweet glazes want tangy sides, savoury glazes want sweet ones.',
    occasions: ['weeknight', 'holiday'],
    pageSlug: 'what-to-serve-with-meatloaf',
    sides: {
      cut: [
        { name: 'Simple green salad', why: 'A fresh salad is the fastest way to lighten a rich, glazed meatloaf plate.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Roasted Brussels sprouts', why: 'Bitter, caramelised sprouts against a sweet ketchup glaze.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
        { name: 'Pickled beets', why: 'Earthy vinegar that cuts a sweet glaze like nothing else.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
        { name: 'Coleslaw', why: 'Cold crunch next to hot, soft meatloaf.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
      ],
      contrast: [
        { name: 'Garlic green beans', why: 'Snappy and garlicky — the green that holds its shape.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Crispy onion rings', why: 'Sweet crunch for a soft main.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: vegNoDairy },
        { name: 'Roasted broccoli', why: 'Charred florets with a firm bite.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
      ],
      depth: [
        { name: 'Brown gravy', why: 'A savoury gravy over the slice — the diner version of meatloaf night.', amount: 0.25, unit: 'cup', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Sautéed mushrooms', why: 'Buttery mushrooms add the umami the loaf itself is missing.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Roasted carrots', why: 'Sweet roasted roots that match a sweet glaze.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
      ],
      starch: [
        { name: 'Mashed potatoes', why: 'The meatloaf default — buttery mash and gravy, no debate.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'Roasted potatoes', why: 'Crisp-edged potatoes when you want texture with the mash alternative.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Dinner rolls', why: 'Soft rolls for the gravy and the glaze.', amount: 1, unit: 'roll', prepMinutes: 5, diets: vegNoDairy },
        { name: 'Mac and cheese', why: 'The comfort double-down: meatloaf and mac, the blue-plate special.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops',
    aliases: ['grilled pork chops', 'pan-fried pork chops', 'baked pork chops'],
    blurb:
      'Pork chops are lean and quick — they want a sweet or tangy partner. Sweet and fruity sides suit a plain chop; tangy and fresh sides suit a glazed or breaded one.',
    occasions: ['weeknight', 'holiday'],
    pageSlug: 'what-to-serve-with-pork-chops',
    sides: {
      cut: [
        { name: 'Applesauce', why: 'The pork-and-apple rule: sweet-tart applesauce is the oldest pork pairing there is.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
        { name: 'Coleslaw', why: 'Cold crunch and vinegar against a hot, seared chop.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Pickled red onions', why: 'Sharp onions that cut a rich breaded chop.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v },
        { name: 'Simple green salad', why: 'A light salad keeps a pork-chop plate from feeling like a roast dinner.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Roasted Brussels sprouts', why: 'Bitter, caramelised crunch next to a tender chop.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
        { name: 'Garlic green beans', why: 'Snappy and garlicky; the green that works with every chop preparation.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Crispy onion rings', why: 'Sweet crunch for a breaded chop night.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: vegNoDairy },
      ],
      depth: [
        { name: 'Sautéed apples with sage', why: 'Warm apples and sage — the savoury-sweet side built for pork.', amount: 0.5, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Roasted mushrooms', why: 'Earthy mushrooms add the depth a lean chop lacks.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Brown gravy', why: 'A savoury gravy over the chop — the diner version.', amount: 0.25, unit: 'cup', prepMinutes: 10, diets: vegNoDairy },
      ],
      starch: [
        { name: 'Mashed potatoes', why: 'Buttery mash and pork gravy — the classic plate.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'Roasted sweet potatoes', why: 'Sweet potatoes echo the apple pairing and add colour.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Rice pilaf', why: 'A light, herby rice that stays out of the chop\'s way.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Dinner rolls', why: 'Soft rolls for the pan juices.', amount: 1, unit: 'roll', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'shrimp',
    name: 'Shrimp',
    aliases: ['grilled shrimp', 'roasted shrimp', 'shrimp pasta', 'garlic shrimp'],
    blurb:
      'Shrimp cooks in minutes and takes on the flavour of its sauce — garlic butter, grilled, or tossed with pasta. Sides follow the preparation: grilled shrimp wants slaw, shrimp pasta wants salad and bread.',
    methods: ['Grilled', 'Roasted', 'Shrimp pasta'],
    occasions: ['weeknight', 'formal', 'potluck'],
    pageSlug: 'what-to-serve-with-shrimp',
    sides: {
      cut: [
        { name: 'Lime-cilantro slaw', why: 'Bright lime slaw is the grilled-shrimp essential.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg, methods: ['Grilled'] },
        { name: 'Simple green salad', why: 'A light salad keeps a garlic-butter shrimp plate from feeling heavy.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Cucumber-tomato salad', why: 'Fresh and juicy; the shrimp-cocktail-adjacent side.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled red onions', why: 'Sharp onions that lift roasted shrimp.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v, methods: ['Roasted'] },
      ],
      contrast: [
        { name: 'Grilled corn', why: 'Sweet char that matches grilled shrimp and a summer table.', amount: 1, unit: 'ear', prepMinutes: 15, diets: veg, methods: ['Grilled'], occasions: ['bbq'] },
        { name: 'Roasted asparagus', why: 'Green spears with a firm bite next to soft shrimp.', amount: 4, unit: 'spears', prepMinutes: 12, diets: v },
        { name: 'Crispy garlic bread', why: 'Crunchy bread for the garlic butter — the shrimp-pasta rule.', amount: 1, unit: 'slice', prepMinutes: 10, diets: vegNoDairy, methods: ['Shrimp pasta'] },
      ],
      depth: [
        { name: 'Garlic butter mushrooms', why: 'Buttery mushrooms that share the shrimp\'s pan sauce.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Roasted cherry tomatoes', why: 'Burst, sweet tomatoes that echo a shrimp-pasta sauce.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: v, methods: ['Shrimp pasta'] },
        { name: 'Sautéed spinach with garlic', why: 'A quick wilted green that adds savoury depth without weight.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      starch: [
        { name: 'Lemon herb rice', why: 'A neutral base that soaks up garlic butter.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Crusty bread', why: 'For the pan sauce — bread is the shrimp delivery system.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
        { name: 'Pasta with olive oil', why: 'When shrimp is not the pasta, a simple oiled pasta is the starch.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Roasted potatoes', why: 'Crisp-edged potatoes for a roasted-shrimp sheet-pan dinner.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v, methods: ['Roasted'] },
      ],
    },
  },
  {
    id: 'pizza',
    name: 'Pizza',
    aliases: ['pizza night', 'pepperoni pizza'],
    blurb:
      'Pizza night is a spread, not a plate: one salad, one fried or crunchy side, and one antipasti-style board. The pizza is the main; the sides are the party around it.',
    occasions: ['weeknight', 'game-day', 'potluck'],
    pageSlug: 'what-to-serve-with-pizza',
    sides: {
      cut: [
        { name: 'Simple green salad', why: 'The pizza-night rule: something green and acidic next to cheese and tomato.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Caesar salad', why: 'Crunchy romaine and sharp dressing — the pizzeria salad.', amount: 1, unit: 'cup', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Antipasto salad', why: 'Pickled vegetables, olives and cheese — a salad that is also a side.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: veg },
        { name: 'Pickled peppers', why: 'Sharp, briny heat that cuts a pepperoni slice.', amount: 0.25, unit: 'cup', prepMinutes: 5, diets: v },
      ],
      contrast: [
        { name: 'Garlic knots', why: 'Soft, buttery knots — the pizzeria side that needs no introduction.', amount: 2, unit: 'knots', prepMinutes: 20, diets: vegNoDairy },
        { name: 'Chicken wings', why: 'Crispy wings turn pizza night into a game-day spread.', amount: 3, unit: 'wings', prepMinutes: 30, diets: ['glutenFree', 'dairyFree', 'lowCarb'], occasions: ['game-day'] },
        { name: 'Mozzarella sticks', why: 'Fried cheese with marinara — the indulgent pizza-night double-down.', amount: 3, unit: 'sticks', prepMinutes: 20, diets: vegNoDairy },
        { name: 'Roasted broccoli', why: 'Charred florets for the lighter pizza night.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
      ],
      depth: [
        { name: 'Meatballs in marinara', why: 'A second Italian main on the side — the pizzeria spread.', amount: 3, unit: 'meatballs', prepMinutes: 25, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Sausage and peppers', why: 'Savoury sausage strips that match a pepperoni pizza.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Roasted mushrooms', why: 'Earthy mushrooms for a vegetarian pizza night.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
      ],
      starch: [
        { name: 'Garlic bread', why: 'A second bread is the point on pizza night — for the sauce and the cheese.', amount: 1, unit: 'slice', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Breadsticks', why: 'Soft breadsticks with marinara for dipping.', amount: 2, unit: 'sticks', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Antipasti board', why: 'Cured meats, cheese, olives and bread — the board that turns pizza into a party.', amount: 0.5, unit: 'cup', prepMinutes: 10, diets: ['glutenFree', 'lowCarb'] },
      ],
    },
  },
  {
    id: 'prime-rib',
    name: 'Prime Rib',
    aliases: ['prime rib roast', 'rib roast', 'standing rib roast'],
    blurb:
      'Prime rib is the holiday roast — the sides are the Christmas-dinner classics: Yorkshire pudding, horseradish, roasted potatoes and something green.',
    occasions: ['holiday', 'formal'],
    pageSlug: 'what-to-serve-with-prime-rib',
    sides: {
      cut: [
        { name: 'Arugula salad', why: 'Peppery leaves with lemon — the light note on a heavy holiday plate.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled red onions', why: 'Sharp onions that cut a fatty rib roast.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v },
        { name: 'Cranberry sauce', why: 'Sweet-tart cranberry is the holiday acid that suits roast beef.', amount: 0.25, unit: 'cup', prepMinutes: 5, diets: v, occasions: ['holiday'] },
        { name: 'Simple green salad', why: 'A fresh salad is the palate rest on a roast-dinner plate.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Creamed spinach', why: 'The steakhouse side, scaled up for the holiday roast.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: vegNoDairy },
        { name: 'Roasted Brussels sprouts', why: 'Caramelised sprouts with a bitter edge — the holiday green.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
        { name: 'Green bean casserole', why: 'The holiday-table classic next to the holiday roast.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: vegNoDairy, occasions: ['holiday'] },
      ],
      depth: [
        { name: 'Horseradish sauce', why: 'The prime rib essential: sharp, creamy heat for rich beef.', amount: 2, unit: 'tbsp', prepMinutes: 5, diets: vegNoDairy },
        { name: 'Au jus', why: 'The roast\'s own pan juices, served as a dip — the prime rib rule.', amount: 0.25, unit: 'cup', prepMinutes: 10, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Roasted mushrooms', why: 'Earthy mushrooms that share the roast\'s savoury lane.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Sautéed carrots with herbs', why: 'Sweet roasted carrots that share the oven with the roast.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
      ],
      starch: [
        { name: 'Yorkshire pudding', why: 'The prime rib starch — crisp, puffy cups for the au jus.', amount: 2, unit: 'puddings', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Roasted potatoes', why: 'Crisp-edged potatoes roasted in the beef dripping.', amount: 0.75, unit: 'cup', prepMinutes: 40, diets: v },
        { name: 'Garlic mashed potatoes', why: 'Buttery mash for the gravy and the juices.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'Dinner rolls', why: 'Soft rolls for the holiday table.', amount: 1, unit: 'roll', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'caviar',
    name: 'Caviar',
    aliases: ['caviar service', 'sturgeon caviar'],
    blurb:
      'Caviar is served, not cooked — the accompaniments are classic and minimal: blinis, crème fraîche, egg, and something sparkling. Less is more.',
    occasions: ['formal', 'holiday'],
    pageSlug: 'what-to-serve-with-caviar',
    sides: {
      cut: [
        { name: 'Lemon wedges', why: 'A squeeze of lemon is the only acid caviar needs.', amount: 1, unit: 'wedge', prepMinutes: 0, diets: v },
        { name: 'Chopped chives', why: 'Mild onion freshness without overpowering the roe.', amount: 1, unit: 'tsp', prepMinutes: 5, diets: v },
        { name: 'Pickled shallots', why: 'A sharp, elegant bite between spoonfuls.', amount: 1, unit: 'tbsp', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Blinis', why: 'Warm, soft mini pancakes — the classic caviar base.', amount: 2, unit: 'blinis', prepMinutes: 20, diets: vegNoDairy },
        { name: 'Toast points', why: 'Crisp, buttery triangles for a crunchier base.', amount: 2, unit: 'points', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Cucumber rounds', why: 'Cool, crisp rounds as a gluten-free caviar base.', amount: 3, unit: 'rounds', prepMinutes: 5, diets: v },
      ],
      depth: [
        { name: 'Crème fraîche', why: 'Cool, tangy cream — the caviar essential.', amount: 2, unit: 'tbsp', prepMinutes: 0, diets: vegNoDairy },
        { name: 'Chopped hard-boiled egg', why: 'Egg yolk and white, finely chopped — the traditional caviar partner.', amount: 1, unit: 'tbsp', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Smoked salmon', why: 'A second luxury on the plate; salmon and caviar share a table, not a flavour fight.', amount: 2, unit: 'oz', prepMinutes: 0, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
      ],
      starch: [
        { name: 'Potato blinis', why: 'Crisp potato pancakes as a heartier caviar base.', amount: 2, unit: 'pieces', prepMinutes: 25, diets: vegNoDairy },
        { name: 'Butter crackers', why: 'Plain, buttery crackers that stay out of the caviar\'s way.', amount: 4, unit: 'crackers', prepMinutes: 0, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'risotto',
    name: 'Risotto',
    aliases: ['mushroom risotto', 'seafood risotto'],
    blurb:
      'Risotto is creamy and rich on its own — the question is whether it is the main or the side. As a main it wants a protein; as a side it wants something light and green.',
    occasions: ['weeknight', 'formal'],
    pageSlug: 'what-to-serve-with-risotto',
    sides: {
      cut: [
        { name: 'Arugula salad', why: 'Peppery leaves with lemon cut a creamy risotto.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Lemon-dressed asparagus', why: 'Green, bright spears that match a spring risotto.', amount: 4, unit: 'spears', prepMinutes: 12, diets: v },
        { name: 'Shaved fennel salad', why: 'Crunchy, anise-bright salad against soft rice.', amount: 1, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Pickled vegetables', why: 'A sharp bite that resets the palate between creamy spoonfuls.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
      ],
      contrast: [
        { name: 'Roasted broccoli', why: 'Charred florets with a firm bite next to soft risotto.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Crispy pancetta', why: 'Salty, crackling bits scattered over the top.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Garlic green beans', why: 'Snappy beans that hold their shape next to creamy rice.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
      ],
      depth: [
        { name: 'Seared scallops', why: 'Sweet, caramelised scallops turn risotto into a restaurant main.', amount: 3, unit: 'scallops', prepMinutes: 10, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Grilled chicken', why: 'Lean protein that lets the risotto stay the star.', amount: 4, unit: 'oz', prepMinutes: 20, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Roasted mushrooms', why: 'Earthy mushrooms that double the risotto\'s own umami.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Sautéed shrimp', why: 'Garlic shrimp over risotto — the coastal version.', amount: 4, unit: 'shrimp', prepMinutes: 10, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
      ],
      starch: [
        { name: 'Crusty bread', why: 'For the creamy rice left on the plate.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
        { name: 'Focaccia', why: 'Oily flatbread that shares risotto\'s Italian lane.', amount: 1, unit: 'piece', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'bbq-chicken',
    name: 'BBQ Chicken',
    aliases: ['barbecue chicken', 'grilled bbq chicken'],
    blurb:
      'BBQ chicken is sweet, smoky and saucy — the sides are the summer cookout spread: slaw, beans, corn and cornbread, with a healthy swap for the classic plate.',
    occasions: ['bbq', 'game-day', 'weeknight'],
    pageSlug: 'what-to-serve-with-bbq-chicken',
    sides: {
      cut: [
        { name: 'Classic coleslaw', why: 'Cold, vinegary crunch against sweet barbecue sauce.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Pickles', why: 'A dill spear is the simplest acid on a barbecue plate.', amount: 2, unit: 'spears', prepMinutes: 0, diets: v },
        { name: 'Cucumber salad', why: 'Cool and light; the palate rest on a saucy plate.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Vinegar slaw', why: 'No-mayo slaw for the richest barbecue sauce.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
      ],
      contrast: [
        { name: 'Grilled corn on the cob', why: 'Sweet char from the same grill as the chicken.', amount: 1, unit: 'ear', prepMinutes: 15, diets: veg, occasions: ['bbq'] },
        { name: 'Mac and cheese', why: 'Creamy mac is the cookout second main.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Grilled vegetables', why: 'Smoky peppers and zucchini from the same grill.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
      ],
      depth: [
        { name: 'Baked beans', why: 'Sweet, smoky beans are the barbecue echo.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: veg },
        { name: 'Collard greens', why: 'Slow-cooked greens for the Southern spread.', amount: 0.75, unit: 'cup', prepMinutes: 40, diets: veg },
        { name: 'Roasted sweet potatoes', why: 'Sweet, caramelised cubes that match barbecue sauce.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
      ],
      starch: [
        { name: 'Cornbread', why: 'Sweet cornbread with barbecue sauce — the pairing the region settled on.', amount: 1, unit: 'piece', prepMinutes: 30, diets: vegNoDairy },
        { name: 'Potato salad', why: 'Cool, creamy potatoes between bites of hot chicken.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg },
        { name: 'White bread', why: 'Plain white bread for mopping sauce.', amount: 2, unit: 'slices', prepMinutes: 0, diets: ['vegetarian', 'vegan', 'dairyFree'] },
        { name: 'Rice pilaf', why: 'The lighter starch for a healthier barbecue plate.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
      ],
    },
  },
  {
    id: 'grilled-chicken',
    name: 'Grilled Chicken',
    aliases: ['grilled chicken breast', 'bbq grilled chicken'],
    blurb:
      'Grilled chicken is lean and smoky — it takes sides from two directions: the weeknight plate (rice, green beans, salad) or the cookout spread (corn, slaw, potato salad).',
    occasions: ['weeknight', 'bbq', 'game-day'],
    pageSlug: 'what-to-serve-with-grilled-chicken',
    sides: {
      cut: [
        { name: 'Simple green salad', why: 'A light salad keeps a grilled-chicken plate feeling like a weeknight dinner.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Coleslaw', why: 'Cold crunch and vinegar for the cookout version.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg, occasions: ['bbq', 'game-day'] },
        { name: 'Cucumber-tomato salad', why: 'Fresh and juicy; the summer side for grilled chicken.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled red onions', why: 'Sharp onions that lift a simply seasoned breast.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v },
      ],
      contrast: [
        { name: 'Grilled corn on the cob', why: 'Sweet char from the same grill.', amount: 1, unit: 'ear', prepMinutes: 15, diets: veg, occasions: ['bbq'] },
        { name: 'Roasted broccoli', why: 'Charred florets with a firm bite.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Garlic green beans', why: 'Snappy and garlicky; the weeknight green.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
      ],
      depth: [
        { name: 'Sautéed mushrooms', why: 'Buttery mushrooms add the umami a lean breast lacks.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Roasted sweet potatoes', why: 'Sweet, caramelised cubes that match smoky chicken.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Grilled peppers and onions', why: 'Charred and sweet from the same grill.', amount: 0.5, unit: 'cup', prepMinutes: 15, diets: v, occasions: ['bbq'] },
      ],
      starch: [
        { name: 'Lemon herb rice', why: 'A fragrant base that soaks up the chicken juices.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Roasted potatoes', why: 'Crisp-edged potatoes for the weeknight plate.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Potato salad', why: 'Cool, creamy potatoes for the cookout version.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: veg, occasions: ['bbq', 'game-day'] },
        { name: 'Crusty bread', why: 'For the pan juices and the marinade.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'roasted-potatoes',
    name: 'Roasted Potatoes',
    aliases: ['roast potatoes', 'crispy potatoes'],
    blurb:
      'Roasted potatoes are the side that acts like a main — crisp outside, fluffy inside. They want a protein, a sauce, and something green.',
    occasions: ['weeknight', 'holiday'],
    pageSlug: 'what-to-serve-with-roasted-potatoes',
    sides: {
      cut: [
        { name: 'Simple green salad', why: 'A fresh salad is the lightest partner for a starchy roast.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled red onions', why: 'Sharp onions that cut through roast-potato richness.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: v },
        { name: 'Coleslaw', why: 'Cold crunch next to hot, crisp potatoes.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
      ],
      contrast: [
        { name: 'Roasted broccoli', why: 'Charred green florets next to golden potatoes.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Garlic green beans', why: 'Snappy beans that hold their shape.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Sour cream', why: 'Cool dairy for dipping crisp potatoes.', amount: 2, unit: 'tbsp', prepMinutes: 0, diets: vegNoDairy },
      ],
      depth: [
        { name: 'Roast chicken', why: 'The Sunday roast pairing: potatoes are the side, chicken is the main.', amount: 4, unit: 'oz', prepMinutes: 45, diets: ['glutenFree', 'dairyFree', 'lowCarb'], occasions: ['holiday'] },
        { name: 'Sausages', why: 'Bangers and roast potatoes — the British plate.', amount: 2, unit: 'sausages', prepMinutes: 25, diets: ['glutenFree', 'dairyFree', 'lowCarb'] },
        { name: 'Roasted mushrooms', why: 'Earthy mushrooms that share the roast\'s savoury lane.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
      ],
      starch: [
        { name: 'Gravy', why: 'A savoury gravy over the potatoes — the roast-dinner rule.', amount: 0.25, unit: 'cup', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Crusty bread', why: 'For the pan juices and the roast dripping.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'fried-fish',
    name: 'Fried Fish',
    aliases: ['fish and chips', 'battered fish', 'fish fry'],
    blurb:
      'Fried fish wants sides that cut grease and add freshness: something sharp, something cold, something starchy that is not fried.',
    occasions: ['weeknight', 'game-day'],
    pageSlug: 'what-to-serve-with-fried-fish',
    sides: {
      cut: [
        { name: 'Coleslaw', why: 'Cold, crunchy slaw is the single most reliable fried-fish side.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'Tartar sauce', why: 'Pickle brine and lemon against a crisp batter.', amount: 2, unit: 'tbsp', prepMinutes: 10, diets: vegNoDairy },
        { name: 'Lemon wedges', why: 'A squeeze of lemon is the oldest fried-fish move there is.', amount: 1, unit: 'wedge', prepMinutes: 0, diets: v },
        { name: 'Pickles', why: 'A dill spear on the plate is the simplest acid.', amount: 2, unit: 'spears', prepMinutes: 0, diets: v },
      ],
      contrast: [
        { name: 'Mushy peas', why: 'Soft, minty peas — the British chip-shop side.', amount: 0.5, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Cucumber salad', why: 'Cool and crisp; it cleans the palate between rich bites.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Hushpuppies', why: 'Small, corny fritters — the American fish-fry side.', amount: 3, unit: 'pieces', prepMinutes: 25, diets: vegNoDairy },
      ],
      depth: [
        { name: 'Baked beans', why: 'Sweet beans next to salty batter — the chip-shop plate.', amount: 0.5, unit: 'cup', prepMinutes: 10, diets: veg },
        { name: 'Roasted corn', why: 'Sweet, smoky kernels that echo a summer fish fry.', amount: 0.5, unit: 'cup', prepMinutes: 15, diets: v },
        { name: 'Corn chowder', why: 'A small cup of chowder turns fish and chips into a supper.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: veg },
      ],
      starch: [
        { name: 'Thick-cut chips', why: 'The classic: fluffy inside, crisp outside, malt vinegar on top.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Roasted potatoes', why: 'If the fish is fried, roast the potatoes — the contrast is the point.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Crusty bread', why: 'For the tartar sauce and the lemon butter.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
      ],
    },
  },
  {
    id: 'pesto-chicken',
    name: 'Pesto Chicken',
    aliases: ['chicken pesto', 'pesto pasta chicken'],
    blurb:
      'Pesto chicken is herby, garlicky and rich — the sides should be starchy enough to soak up the sauce, with vegetables that match basil\'s sweetness.',
    occasions: ['weeknight', 'potluck'],
    pageSlug: 'what-to-serve-with-pesto-chicken',
    sides: {
      cut: [
        { name: 'Simple green salad', why: 'A light salad with lemon dressing against rich pesto.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Tomato-cucumber salad', why: 'Fresh tomato echoes the Ligurian pairing — pesto, tomato, basil.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Arugula with lemon', why: 'Peppery leaves and sharp dressing cut the oil in pesto.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
        { name: 'Pickled vegetables', why: 'A sharp bite that resets the palate between herby spoonfuls.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
      ],
      contrast: [
        { name: 'Roasted broccoli', why: 'Charred florets with a firm bite next to soft chicken.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
        { name: 'Grilled zucchini', why: 'Smoky strips that share pesto\'s Italian lane.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Garlic green beans', why: 'Snappy beans that hold their shape.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
      ],
      depth: [
        { name: 'Roasted cherry tomatoes', why: 'Burst, sweet tomatoes that double the pesto\'s own sweetness.', amount: 0.5, unit: 'cup', prepMinutes: 20, diets: v },
        { name: 'Sautéed mushrooms', why: 'Earthy mushrooms that add depth without competing with basil.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
        { name: 'White beans with garlic', why: 'Creamy beans that turn pesto chicken into a one-pan supper.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
      ],
      starch: [
        { name: 'Pasta', why: 'The pesto vehicle: trofie, penne or orecchiette, tossed in the sauce.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: vegNoDairy },
        { name: 'Crusty bread', why: 'For the pesto left on the plate.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
        { name: 'Roasted potatoes', why: 'Crisp potatoes tossed with pesto — the Ligurian one-pot move.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
        { name: 'Rice pilaf', why: 'A light, herby rice that soaks up the sauce.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
      ],
    },
  },
];

/** Generic four-jobs sides for a dish not in the database (free-text search). */
export const GENERIC_SIDES: Record<SideJob, DishSide[]> = {
  cut: [
    { name: 'Simple green salad with vinaigrette', why: 'Acidic dressing resets the palate between rich bites.', amount: 1, unit: 'cup', prepMinutes: 10, diets: v },
    { name: 'Coleslaw', why: 'Cold, crunchy and vinegary — the most reliable rich-main counterweight.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: veg },
    { name: 'Pickled vegetables', why: 'A sharp, briny bite that cuts through richness.', amount: 0.5, unit: 'cup', prepMinutes: 5, diets: v },
  ],
  contrast: [
    { name: 'Roasted broccoli', why: 'Charred florets with a firm bite against a soft main.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
    { name: 'Garlic green beans', why: 'Snappy and garlicky; the green that works with almost everything.', amount: 0.75, unit: 'cup', prepMinutes: 15, diets: v },
    { name: 'Cucumber salad', why: 'Cool and crisp; the lightest thing on the plate.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
  ],
  depth: [
    { name: 'Roasted mushrooms', why: 'Earthy umami that gives the plate a second savoury anchor.', amount: 0.75, unit: 'cup', prepMinutes: 25, diets: v },
    { name: 'Sautéed spinach with garlic', why: 'A quick wilted green that adds savoury depth without weight.', amount: 0.75, unit: 'cup', prepMinutes: 10, diets: v },
    { name: 'Roasted carrots', why: 'Sweet roasted roots that share the oven with most mains.', amount: 0.75, unit: 'cup', prepMinutes: 30, diets: v },
  ],
  starch: [
    { name: 'Roasted potatoes', why: 'Crisp-edged potatoes — the default starch for a reason.', amount: 0.75, unit: 'cup', prepMinutes: 35, diets: v },
    { name: 'Steamed rice', why: 'A neutral base that stretches any main to feed a crowd.', amount: 0.75, unit: 'cup', prepMinutes: 20, diets: v },
    { name: 'Crusty bread', why: 'For the sauce and the pan juices.', amount: 1, unit: 'slice', prepMinutes: 5, diets: vegNoDairy },
  ],
};

export const JOB_ORDER: SideJob[] = ['cut', 'contrast', 'depth', 'starch'];

export const OCCASION_LABELS: Record<Occasion, string> = {
  weeknight: 'Weeknight',
  'game-day': 'Game day',
  holiday: 'Holiday',
  bbq: 'BBQ',
  potluck: 'Potluck',
  formal: 'Formal dinner',
};

export const DIET_LABELS: Record<Diet, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  glutenFree: 'Gluten-free',
  dairyFree: 'Dairy-free',
  lowCarb: 'Low-carb',
};

export function findDish(query: string): DishProfile | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return DISHES.find(
    (d) =>
      d.name.toLowerCase() === q ||
      d.id === q.replace(/[^a-z0-9]+/g, '-') ||
      d.aliases.some((a) => a.toLowerCase() === q),
  );
}

export function searchDishes(query: string): DishProfile[] {
  const q = query.trim().toLowerCase();
  if (!q) return DISHES;
  return DISHES.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.aliases.some((a) => a.toLowerCase().includes(q)),
  );
}

