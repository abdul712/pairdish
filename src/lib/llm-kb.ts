// Shared LLM knowledge-base layer for PairDish.
// Queryable KB per the reverse-mullet pattern (spock.is/writing/reverse-mullet).
// Deterministic keyword scoring over a static KB bundle; no AI calls, no storage.
import kb from '../data/llm-kb.json';

export interface KbEntry {
  title: string;
  url: string;
  keywords: string[];
  text: string;
}

export const entries = kb as KbEntry[];

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
}

export function score(entry: KbEntry, q: string): number {
  const qt = new Set(tokens(q));
  if (qt.size === 0) return 0;
  let s = 0;
  for (const w of qt) {
    const inTitle = tokens(entry.title).includes(w) ? 3 : 0;
    const inKw = entry.keywords.some((k) => k.toLowerCase().includes(w)) ? 2 : 0;
    const inText = tokens(entry.text).includes(w) ? 1 : 0;
    s += inTitle + inKw + inText;
  }
  return s;
}

export function searchKb(query: string, limit = 5): KbEntry[] {
  return entries
    .map((e) => ({ e, s: score(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.e);
}

export function toPlain(results: KbEntry[], query: string): string {
  if (results.length === 0) {
    return `No matches found for "${query}". Try a different question, or browse the full index at /llms.txt`;
  }
  const lines = results.map(
    (r, i) => `${i + 1}. ${r.title}\n   URL: ${r.url}\n   ${r.text.slice(0, 400)}`
  );
  return `Matches for "${query}":\n\n${lines.join('\n\n')}`;
}
