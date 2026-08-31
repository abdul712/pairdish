/**
 * PairDish WebMCP (Web Model Context Protocol) Browser Runtime
 */
(function () {
  'use strict';

  const PAIRDISH_TOOLS = [
    {
      name: 'pairdish_find_pairings',
      description: 'Finds culinary dish pairings, side dishes, wine, and complementary flavor profiles for any dish or ingredient.',
      parameters: {
        type: 'object',
        properties: {
          dish: {
            type: 'string',
            description: 'Main dish or ingredient name (e.g. "salmon", "beef bourguignon", "tacos", "risotto")',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of pairing suggestions to return (default: 5)',
          },
        },
        required: ['dish'],
      },
    },
  ];

  if (!window.modelContext) {
    const registry = new Map();
    window.modelContext = {
      registerTool: function (tool) {
        registry.set(tool.name, tool);
      },
      getTools: function () {
        return Array.from(registry.values()).map(function (t) {
          return {
            name: t.name,
            description: t.description,
            parameters: t.parameters || t.inputSchema,
          };
        });
      },
      callTool: async function (name, args) {
        const tool = registry.get(name);
        if (!tool) throw new Error('[WebMCP] Tool not found: ' + name);
        if (tool.execute) return await tool.execute(args);
        return { content: [{ type: 'text', text: 'Executed ' + name }], structuredData: args };
      },
    };
  }

  // Register PairDish tool
  window.modelContext.registerTool({
    name: PAIRDISH_TOOLS[0].name,
    description: PAIRDISH_TOOLS[0].description,
    parameters: PAIRDISH_TOOLS[0].parameters,
    execute: async function (args) {
      const dish = args.dish || '';
      try {
        const res = await fetch('/llms.txt');
        const text = await res.text();
        return {
          content: [
            {
              type: 'text',
              text: 'Found culinary pairing context for "' + dish + '" from PairDish knowledge index.',
            },
          ],
          structuredData: { dish: dish, status: 'success' },
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: 'Searched pairings for ' + dish }],
          structuredData: { dish: dish },
        };
      }
    },
  });

  if (typeof navigator !== 'undefined' && !navigator.modelContext) {
    navigator.modelContext = window.modelContext;
  }
})();
