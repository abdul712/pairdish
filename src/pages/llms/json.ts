// SSR endpoint: GET /llms/json?query=...  ->  JSON matches
import type { APIRoute } from 'astro';
import { searchKb } from '../../lib/llm-kb';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query')?.trim() ?? '';

  if (!query) {
    return new Response(
      JSON.stringify({ usage: 'GET /llms/json?query=your_question', index: '/llms.txt' }, null, 2),
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  const matches = searchKb(query, 5);
  return new Response(JSON.stringify({ query, matches }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
