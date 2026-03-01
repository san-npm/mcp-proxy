export const config = { runtime: 'edge' };

export default function handler() {
  return new Response(JSON.stringify({
    name: "MCP Services",
    version: "1.0.0",
    docs: "https://github.com/san-npm/mcp-services",
    endpoints: {
      screenshot: "/api/screenshot?url=<url>",
      pdf: "/api/pdf?url=<url>",
      html2md: "/api/html2md?url=<url>",
      ocr: "/api/ocr?url=<image_url>",
      whois: "/api/whois?domain=<domain>",
      dns: "/api/dns?domain=<domain>",
      ssl: "/api/ssl?domain=<domain>",
      balance: "/api/chain/balance?address=<addr>&chain=ethereum",
      erc20: "/api/chain/erc20?address=<addr>&token=<contract>&chain=ethereum",
      tx: "/api/chain/tx?hash=<hash>&chain=ethereum",
      health: "/health"
    },
    mcp: "For MCP/SSE connections, use the direct tunnel endpoint (see GitHub README)"
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
