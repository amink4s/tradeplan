// Share page API route - returns HTML with dynamic fc:miniapp metadata
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Get trade data from query params
  const pair = searchParams.get('pair') || 'BTC/USDT';
  const direction = searchParams.get('direction') || 'long';
  const entry = searchParams.get('entry') || '0';
  const tp = searchParams.get('tp') || '0';
  const sl = searchParams.get('sl') || '0';
  const rr = searchParams.get('rr') || '0';
  const risk = searchParams.get('risk') || '1';
  const username = searchParams.get('username') || 'Trader';

  // Build the OG image URL with same params
  const ogParams = new URLSearchParams({
    pair,
    direction,
    entry,
    tp,
    sl,
    rr,
    risk,
    username,
  });

  const imageUrl = `${baseUrl}/api/og/trade?${ogParams.toString()}`;
  const appUrl = 'https://tradeplan-mu.vercel.app';

  // Build fc:miniapp metadata
  const fcMiniapp = JSON.stringify({
    version: '1',
    imageUrl: imageUrl,
    button: {
      title: 'Open TradePlan',
      action: {
        type: 'launch_frame',
        name: 'TradePlan',
        url: appUrl,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: '#000000',
      },
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pair} ${direction.toUpperCase()} - TradePlan</title>
  <meta name="description" content="${username}'s ${pair} ${direction.toUpperCase()} trade plan on TradePlan" />
  
  <!-- Farcaster Mini App Meta Tag -->
  <meta name="fc:miniapp" content='${fcMiniapp.replace(/'/g, "&#39;")}' />
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${pair} ${direction.toUpperCase()} - TradePlan" />
  <meta property="og:description" content="${username}'s trade commitment: ${pair} ${direction.toUpperCase()} @ ${entry}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${appUrl}" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pair} ${direction.toUpperCase()} - TradePlan" />
  <meta name="twitter:description" content="${username}'s trade commitment on TradePlan" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <meta name="theme-color" content="#000000" />
</head>
<body style="background: #020617; color: white; font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0;">
  <div style="text-align: center; padding: 20px;">
    <h1 style="color: #3b82f6;">TradePlan</h1>
    <p>${username}'s ${pair} ${direction.toUpperCase()} Trade</p>
    <p style="color: #64748b;">Entry: ${entry} | Target: ${tp} | Stop: ${sl}</p>
    <a href="${appUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
      Open TradePlan
    </a>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
