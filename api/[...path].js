const UPSTREAM = process.env.MCP_UPSTREAM || 'https://released-arise-bronze-commonwealth.trycloudflare.com';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const target = `${UPSTREAM}${url.pathname}${url.search}`;
  
  // Handle SSE for MCP
  const isSSE = url.pathname === '/mcp/sse';
  
  const headers = new Headers(req.headers);
  headers.delete('host');
  
  const resp = await fetch(target, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    duplex: 'half',
  });

  const respHeaders = new Headers(resp.headers);
  respHeaders.set('Access-Control-Allow-Origin', '*');
    // Prevent Vercel from caching HTML responses
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('text/html')) {
      respHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  respHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  respHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(resp.body, {
    status: resp.status,
    headers: respHeaders,
  });
}
