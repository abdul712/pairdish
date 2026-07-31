# PairDish “What to Serve With” Utility Implementation Plan

> **For Hermes:** This is a review plan only. Do not implement until the user approves. When approved, use the Cloudflare Workers + TDD workflow and commit/push completed changes after verification.

**Goal:** Build a PairDish utility for “What to serve with {{keyword}}” that lets a user choose a main food/ingredient and automatically lists complementary items that go well with it.

**Architecture:** Add a new Astro tool page backed by a deterministic TypeScript serving-pairing engine. Reuse the existing PairDish design system, React tool pattern, and existing `flavor-profiles` data where it helps, but model “serve with” suggestions as meal-planning items grouped by role rather than only aromatic flavor matches.

**Tech Stack:** Astro 5 SSR, React 19, TypeScript, Tailwind CSS v4, Cloudflare Workers, optional Vitest for pure logic tests.

---

## Current Context

- Production site: `https://pairdish.com` is live behind Cloudflare.
- Repo: `/home/hermes/projects/github-audit/clones/pairdish`
- Branch/HEAD inspected: `master` at `8878268`; working tree was clean before writing this plan.
- App shape: Astro + React tool site deployed as a Cloudflare Worker.
- Existing relevant files:
  - `src/components/tools/FlavorPairingFinder.tsx` — current interactive ingredient pairing UI.
  - `src/data/flavor-profiles.ts` — current curated ingredient profile and pairing dataset.
  - `src/pages/tools/flavor-pairing.astro` — existing pairing tool route.
  - `src/pages/tools/index.astro` — all-tools registry/listing.
  - `src/pages/index.astro` — homepage featured-tool section.
  - `package.json` — build scripts include `npm run build`, `npm run dry-run`, `npm run preview`, `npm run deploy`.
- Existing `FlavorPairingFinder` is close, but the requested “what to serve with” intent should be a distinct utility because users expect sides, sauces, salads, drinks, starches, and serving ideas, not only ingredient flavor matches.

## Assumptions for Review

1. The MVP should be free, fast, and deterministic — no LLM/API call on every user search.
2. “All items” means all known compatible items in our curated PairDish dataset for the selected keyword, grouped and ranked clearly.
3. User selection should support both:
   - an autocomplete/search box, and
   - popular keyword chips/cards.
4. SEO should matter: the page should target “what to serve with salmon/chicken/etc.” style search intent.
5. Deployment to production should wait for approval after this plan.

---

## Proposed User Experience

### New route

Create:

- `/tools/what-to-serve-with`

Optional SEO/share routes in the same implementation or immediately after:

- `/tools/what-to-serve-with/salmon`
- `/tools/what-to-serve-with/chicken`
- `/tools/what-to-serve-with/steak`
- etc. for curated popular keywords.

### Page behavior

1. User lands on the tool.
2. Tool shows:
   - H1: `What to Serve With [selected keyword]` after selection, otherwise `What to Serve With...`
   - Search/autocomplete input: “Search a main dish or ingredient...”
   - Popular selections: salmon, chicken, steak, shrimp, pasta, tacos, soup, pizza, pork chops, lamb, mac and cheese, etc.
3. User selects a keyword.
4. Tool renders grouped recommendations:
   - **Best overall picks**
   - **Side dishes**
   - **Vegetables & salads**
   - **Starches & grains**
   - **Sauces, toppings & condiments**
   - **Drinks** where appropriate
   - **Desserts** where appropriate
5. Each card includes:
   - item name
   - category/role badge
   - match score or “Best / Great / Good” label
   - short reason, e.g. “Bright acidity cuts through rich salmon.”
   - optional serving idea, e.g. “Serve as a lemon-dill cucumber salad.”
6. The selected keyword updates the URL via query string or path so users can share the result.
7. Unknown or unsupported input shows a helpful fallback:
   - “We don’t have a full serving guide for that yet. Try one of these nearby ingredients...”
   - suggestions powered by existing ingredient search.

---

## Data Model Plan

### Create `src/data/serve-with.ts`

Add a curated dataset designed around meal-planning intent:

```ts
export type ServeWithRole =
  | 'best'
  | 'side'
  | 'vegetable'
  | 'salad'
  | 'starch'
  | 'sauce'
  | 'drink'
  | 'dessert'
  | 'topping'
  | 'seasoning';

export interface ServeWithSuggestion {
  name: string;
  role: ServeWithRole;
  score: number; // deterministic 0-100
  reason: string;
  servingIdea?: string;
  tags?: string[];
}

export interface ServeWithProfile {
  id: string;
  keyword: string;
  aliases: string[];
  category: 'protein' | 'vegetable' | 'grain' | 'dish' | 'seafood' | 'dessert' | 'other';
  intro: string;
  suggestions: ServeWithSuggestion[];
  faq?: { question: string; answer: string }[];
}
```

Initial profiles should cover high-value food keywords first:

- proteins/seafood: salmon, chicken, steak/beef, pork chops, lamb, shrimp, scallops
- vegetables: asparagus, mushrooms, tomato, butternut squash, beets
- dishes/starches: pasta, rice, potatoes, mac and cheese, tacos, soup, pizza
- cheese/boards: brie, parmesan, goat cheese

### Reuse existing data carefully

The current `src/data/flavor-profiles.ts` already has `bestPairings` and `unexpectedPairings`. The new dataset can reuse those as supplemental inspiration, but should not be limited by them because “serve with” includes full meal components.

Example: for `salmon`, existing flavor pairings include dill, lemon, capers, cucumber, asparagus, fennel, white wine. The new serve-with profile should turn those into serving-friendly groups:

- Best: lemon dill sauce, asparagus, cucumber salad
- Starches: rice pilaf, roasted potatoes, couscous
- Vegetables/salads: fennel salad, green beans, beets
- Sauces: caper butter, miso glaze, yogurt dill sauce
- Drinks: white wine, sparkling water with citrus

---

## Logic/Engine Plan

### Create `src/lib/serve-with-engine.ts`

Add pure functions:

```ts
export function normalizeServeWithKeyword(input: string): string;
export function getServeWithProfile(input: string): ServeWithProfile | undefined;
export function searchServeWithKeywords(query: string): ServeWithProfile[];
export function getServeWithSuggestions(input: string, role?: ServeWithRole): ServeWithResult | undefined;
export function groupServeWithSuggestions(suggestions: ServeWithSuggestion[]): GroupedServeWithSuggestions;
export function buildServeWithSeo(profile: ServeWithProfile): ServeWithSeo;
```

Important implementation details:

- Normalize case, spaces, punctuation, and aliases.
- Keep scores deterministic; avoid `Math.random()` in this new engine.
- Deduplicate item names across groups.
- Sort by score descending, then by role priority.
- Return stable fallback suggestions for partial matches.
- Keep the engine independent from React/Astro so it can be unit tested.

---

## React Component Plan

### Create `src/components/tools/WhatToServeWithTool.tsx`

Use the existing `FlavorPairingFinder.tsx` visual language but improve the UI around serving-guide intent.

Component state:

```ts
const [query, setQuery] = useState('');
const [selectedProfile, setSelectedProfile] = useState<ServeWithProfile | null>(initialProfile ?? null);
const [activeRole, setActiveRole] = useState<ServeWithRole | 'all'>('all');
```

Props:

```ts
interface WhatToServeWithToolProps {
  initialKeyword?: string;
}
```

UI sections:

1. Search/autocomplete panel.
2. Popular keyword cards when nothing is selected.
3. Selected keyword summary card.
4. Role filter tabs.
5. Grouped recommendation cards.
6. “Serving formula” helper box, e.g. `1 protein + 1 bright vegetable + 1 starch + 1 sauce`.
7. Empty/unsupported state with suggested alternatives.

Accessibility:

- Input label or `aria-label`.
- Buttons with clear names.
- Keyboard-friendly autocomplete.
- No hover-only critical information.

---

## Astro Page Plan

### Create `src/pages/tools/what-to-serve-with.astro`

Page contents:

- `BaseLayout` title: `What to Serve With Any Dish | PairDish`
- description: `Choose a main ingredient or dish and get side dishes, sauces, salads, drinks, and serving ideas that pair well.`
- keywords: `what to serve with`, `side dish ideas`, `food pairings`, `dinner sides`, `meal planning`
- breadcrumbs: Home → Tools → What to Serve With
- hero section matching PairDish styling
- ad slots consistent with other tool pages
- `<WhatToServeWithTool client:load />`
- educational SEO content:
  - “How to choose what to serve with a main dish”
  - “Balance richness, acidity, texture, and temperature”
  - FAQ block
- JSON-LD for `FAQPage` and possibly `SoftwareApplication`/`WebApplication`.

### Optional: create `src/pages/tools/what-to-serve-with/[slug].astro`

If approved for SEO in the first pass, add keyword-specific URLs for curated profiles.

Behavior:

- Resolve slug via `getServeWithProfile(slug)`.
- Render 404 or redirect to generic tool if unsupported.
- Use dynamic title: `What to Serve With Salmon: Best Sides, Sauces & Pairings`.
- Pass `initialKeyword={profile.keyword}` to the React component.
- Emit `ItemList` JSON-LD with top suggestions.

This gives PairDish indexable long-tail pages without needing a database or runtime AI.

---

## Navigation/Discovery Plan

### Modify `src/pages/tools/index.astro`

Add a tool card under `Pairing Tools` or `Meal Planning`:

```ts
{
  name: 'What to Serve With Finder',
  slug: 'what-to-serve-with',
  description: 'Choose a main dish or ingredient and get sides, sauces, salads, drinks, and serving ideas.',
  status: 'live',
}
```

### Optionally modify `src/pages/index.astro`

Add or swap a featured tool card so the new utility is visible from the homepage.

Recommendation: include it in the Featured Tools section because it is a high-search-intent utility and complements the existing Flavor Pairing Finder.

### Related tools

On the new page, link to:

- `/tools/flavor-pairing`
- `/tools/recipe-generator`
- `/tools/pantry-helper`

On the existing Flavor Pairing Finder page, optionally add the new utility in “Related Tools.”

---

## Testing Plan

The repo currently does not appear to have first-party tests. Add a lightweight pure-logic test setup.

### Modify `package.json`

Add:

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "latest"
  }
}
```

Use the actual npm install process so `package-lock.json` is updated consistently.

### Create `tests/serve-with-engine.test.ts`

Cover:

1. `getServeWithProfile('salmon')` returns the salmon profile.
2. Alias lookup works, e.g. `mac & cheese` → `mac-and-cheese` if that profile is included.
3. Suggestions are sorted by score descending.
4. Duplicate suggestion names are removed.
5. Role filtering works, e.g. `role='side'` returns only side suggestions.
6. Unknown input returns `undefined` plus search alternatives via `searchServeWithKeywords`.
7. SEO builder outputs a title and description containing the selected keyword.

No browser/React test is necessary for MVP unless we add a test framework for React. The build and local smoke tests will catch integration issues.

---

## Step-by-Step Implementation Tasks After Approval

### Task 1: Add pure engine tests

**Files:**
- Create: `tests/serve-with-engine.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Action:** Install Vitest and write failing tests for lookup, grouping, aliases, role filters, and SEO metadata.

**Verify:**

```bash
npm test
```

Expected before implementation: failures because `serve-with-engine.ts` does not exist.

### Task 2: Add serve-with data and engine

**Files:**
- Create: `src/data/serve-with.ts`
- Create: `src/lib/serve-with-engine.ts`

**Action:** Implement curated profiles and deterministic ranking/grouping helpers.

**Verify:**

```bash
npm test
```

Expected: all serve-with engine tests pass.

### Task 3: Build the React utility component

**Files:**
- Create: `src/components/tools/WhatToServeWithTool.tsx`

**Action:** Implement search/autocomplete, popular keywords, selected result state, group tabs, cards, and unsupported fallback.

**Verify:**

```bash
npm run build
```

Expected: Astro/TypeScript build passes.

### Task 4: Add the generic tool page

**Files:**
- Create: `src/pages/tools/what-to-serve-with.astro`

**Action:** Add hero, ads, component mount, educational content, breadcrumbs, FAQ structured data, and related tools.

**Verify:**

```bash
npm run build
```

Expected: route compiles and appears in built output.

### Task 5: Add keyword-specific SEO routes if approved

**Files:**
- Create: `src/pages/tools/what-to-serve-with/[slug].astro`

**Action:** Render profile-specific titles, descriptions, JSON-LD, and initial selected utility state.

**Verify:**

```bash
npm run build
```

Expected: supported slugs render, unsupported slugs handle gracefully.

### Task 6: Register the tool in site navigation

**Files:**
- Modify: `src/pages/tools/index.astro`
- Optional modify: `src/pages/index.astro`
- Optional modify: `src/pages/tools/flavor-pairing.astro`

**Action:** Add tool cards and related-tool links.

**Verify:**

```bash
npm run build
```

Expected: no broken imports/routes.

### Task 7: Cloudflare Worker dry-run validation

**Files:** none unless fixes are needed.

**Action:** Verify Cloudflare bundle shape.

**Verify:**

```bash
npm run dry-run
```

Expected: Wrangler dry-run passes.

### Task 8: Local smoke test

**Files:** none unless fixes are needed.

**Action:** Run local Wrangler preview and check routes.

**Verify:**

```bash
npm run preview -- --port 8787
curl -I http://127.0.0.1:8787/tools/what-to-serve-with
curl -I http://127.0.0.1:8787/tools/what-to-serve-with/salmon
```

Expected: HTTP 200 for implemented routes. Stop preview after checks.

### Task 9: Commit and deployment handoff

**Files:** all implementation files.

**Action:** Commit after tests/build/dry-run pass.

Suggested commit message:

```bash
git commit -m "feat: add what to serve with utility"
```

Deployment should only run after explicit approval:

```bash
npm run deploy
```

Post-deploy verification:

```bash
curl -I https://pairdish.com/tools/what-to-serve-with
curl -I https://pairdish.com/tools/what-to-serve-with/salmon
```

---

## Acceptance Criteria

- A visitor can select or search a main keyword and immediately get serving suggestions.
- Suggestions are grouped by practical meal role, not dumped into one undifferentiated list.
- Each recommendation includes a clear reason why it goes with the keyword.
- The UI matches the existing PairDish editorial/luxury style.
- The tool is discoverable from `/tools`, and ideally from the homepage.
- The implementation has pure logic tests for lookup/ranking/grouping.
- `npm test`, `npm run build`, and `npm run dry-run` pass.
- If deployed, live `pairdish.com` route checks return the new pages successfully.

---

## Risks and Tradeoffs

1. **Dataset breadth:** A fully static MVP can only support curated keywords. This is safer and faster than runtime AI, but it will not answer every possible food immediately.
2. **“All items” wording:** To avoid overpromising, UI copy should say “all matching items in our guide” or “best serving ideas,” unless we build a much larger dataset.
3. **SEO scale:** Keyword-specific pages are valuable, but only for curated profiles with genuinely useful content. Avoid generating thin pages for hundreds of unsupported terms.
4. **Existing flavor engine randomness:** `calculateMatchScore` in `flavor-profiles.ts` uses `Math.random()`. The new serve-with engine should not reuse that scoring directly because SSR/client hydration should stay deterministic.
5. **Cloudflare constraints:** Keep all logic local/static for MVP to avoid D1/KV binding setup and runtime secrets.

---

## Recommended MVP Scope

Implement the first version with:

- generic route: `/tools/what-to-serve-with`
- 15–25 high-value curated keywords
- deterministic TypeScript data + engine
- grouped React UI
- tools-index registration
- pure Vitest tests
- build + Wrangler dry-run verification

Then add keyword-specific SEO pages for the top 10–20 items either in the same pass or as Phase 2, depending on how aggressively we want to target long-tail search.
