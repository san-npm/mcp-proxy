const UPSTREAM = process.env.MCP_UPSTREAM || 'https://released-arise-bronze-commonwealth.trycloudflare.com';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/api/proxy', '') || '/';
  const target = `${UPSTREAM}${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');

  try {
    const resp = await fetch(target, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const respHeaders = new Headers(resp.headers);
    respHeaders.set('Access-Control-Allow-Origin', '*');
    // Prevent Vercel from caching HTML responses
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('text/html')) {
      respHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    return new Response(resp.body, {
      status: resp.status,
      headers: respHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'upstream unreachable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
