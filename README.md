# PairDish — Culinary Flavor Profiles & Pairing Intelligence

PairDish is a culinary application that pairs ingredients, calculates nutritional compositions, recommends complementary wines and side dishes, and assists with meal planning.

## WebMCP (Web Model Context Protocol) Support

PairDish natively integrates with **WebMCP** enabling browser AI assistants (ChatGPT Desktop Browser, Claude in Browser, Chrome AI) to discover culinary capabilities and execute food pairing searches:

### 1. Browser-Native WebMCP Runtime (`window.modelContext`)
AI browser agents can discover and call PairDish pairing tools directly:
```javascript
// Discover available tools
const tools = window.modelContext.getTools();

// Search pairings for an ingredient or dish
const results = await window.modelContext.callTool('pairdish_find_pairings', {
  dish: 'salmon',
  limit: 5
});
```

### 2. Available Tools
- **`pairdish_find_pairings`**: Finds culinary dish pairings, side dishes, wine, and complementary flavor profiles for any dish or ingredient.

## Local Development
```bash
npm install
npm run dev
```
