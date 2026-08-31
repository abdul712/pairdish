import { searchKb, toPlain, type KbEntry } from './llm-kb';

export interface WebMCPTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export const PAIRDISH_WEBMCP_TOOLS: WebMCPTool[] = [
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

export function handlePairDishMCPCall(name: string, args: Record<string, any> = {}) {
  if (name === 'pairdish_find_pairings') {
    const dish = String(args.dish || '');
    const limit = Number(args.limit || 5);
    const results = searchKb(dish, limit);
    const textOutput = toPlain(results, dish);
    return {
      content: [{ type: 'text', text: textOutput }],
      structuredData: { dish, matches: results },
      isError: false,
    };
  }
  throw new Error(`Unknown WebMCP tool: ${name}`);
}
