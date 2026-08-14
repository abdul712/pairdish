// SSR endpoint: GET /llms?query=...  ->  plain text matches
import type { APIRoute } from 'astro';
import { searchKb, toPlain } from '../lib/llm-kb';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query')?.trim() ?? '';

  if (!query) {
    const help = 'Usage: GET /llms?query=your_question  (plain text) — or /llms/json?query=your_question (JSON). Full index at /llms.txt';
    return new Response(help, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const results = searchKb(query, 5);
  return new Response(toPlain(results, query), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
