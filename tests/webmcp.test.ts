import { describe, expect, it } from 'vitest';
import { PAIRDISH_WEBMCP_TOOLS, handlePairDishMCPCall } from '../src/lib/webmcp';

describe('PairDish WebMCP Integration', () => {
  it('exposes valid WebMCP tool definitions', () => {
    expect(PAIRDISH_WEBMCP_TOOLS.length).toBe(1);
    expect(PAIRDISH_WEBMCP_TOOLS[0].name).toBe('pairdish_find_pairings');
  });

  it('searches pairings for flavor', () => {
    const res = handlePairDishMCPCall('pairdish_find_pairings', {
      dish: 'flavor',
      limit: 3,
    });
    expect(res.isError).toBe(false);
    expect(res.content[0].text).toContain('Matches for "flavor"');
    expect(res.structuredData.matches.length).toBeGreaterThan(0);
  });
});
