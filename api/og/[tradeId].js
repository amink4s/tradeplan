// Vercel Serverless Function for OG Image generation
// Returns an SVG image that works as an OG image

export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
    
    // Get trade data from query params
    const pair = searchParams.get('pair') || 'BTC/USDT';
    const direction = searchParams.get('direction') || 'long';
    const entry = searchParams.get('entry') || '0';
    const tp = searchParams.get('tp') || '0';
    const sl = searchParams.get('sl') || '0';
    const rr = searchParams.get('rr') || '0';
    const riskPercent = searchParams.get('risk') || '1';
    const username = searchParams.get('username') || 'Trader';

    const isLong = direction.toLowerCase() === 'long';
    const directionColor = isLong ? '#10b981' : '#f43f5e'; // emerald / rose
    const directionBg = isLong ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';

    // Generate SVG image
    const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
      .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      .font-mono { font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="#020617"/>
  
  <!-- Header -->
  <text x="60" y="80" fill="#3b82f6" font-size="32" font-weight="bold" class="font-sans">📊 TradePlan</text>
  <text x="1140" y="80" fill="#64748b" font-size="24" text-anchor="end" class="font-sans">@${escapeXml(username)}</text>
  
  <!-- Main Card Background -->
  <rect x="60" y="120" width="1080" height="420" rx="24" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  
  <!-- Pair and Direction -->
  <text x="108" y="200" fill="#f1f5f9" font-size="56" font-weight="bold" class="font-sans">${escapeXml(pair)}</text>
  <rect x="${108 + pair.length * 34}" y="160" width="${direction.length * 20 + 48}" height="52" rx="12" fill="${directionBg}"/>
  <text x="${108 + pair.length * 34 + 24}" y="196" fill="${directionColor}" font-size="28" font-weight="bold" class="font-sans">${direction.toUpperCase()}</text>
  
  <!-- Trade Details -->
  <!-- Entry Box -->
  <rect x="108" y="240" width="320" height="100" rx="16" fill="#1e293b"/>
  <text x="132" y="275" fill="#64748b" font-size="16" class="font-sans">ENTRY</text>
  <text x="132" y="315" fill="#f1f5f9" font-size="32" font-weight="bold" class="font-mono">${escapeXml(entry)}</text>
  
  <!-- Target Box -->
  <rect x="448" y="240" width="320" height="100" rx="16" fill="#1e293b"/>
  <text x="472" y="275" fill="#64748b" font-size="16" class="font-sans">TARGET</text>
  <text x="472" y="315" fill="#10b981" font-size="32" font-weight="bold" class="font-mono">${escapeXml(tp)}</text>
  
  <!-- Stop Box -->
  <rect x="788" y="240" width="320" height="100" rx="16" fill="#1e293b"/>
  <text x="812" y="275" fill="#64748b" font-size="16" class="font-sans">STOP</text>
  <text x="812" y="315" fill="#f43f5e" font-size="32" font-weight="bold" class="font-mono">${escapeXml(sl)}</text>
  
  <!-- Divider -->
  <line x1="108" y1="380" x2="1092" y2="380" stroke="#1e293b" stroke-width="1"/>
  
  <!-- Bottom Stats -->
  <text x="108" y="430" fill="#64748b" font-size="20" class="font-sans">Risk:</text>
  <text x="170" y="430" fill="#f1f5f9" font-size="28" font-weight="bold" class="font-sans">${escapeXml(riskPercent)}%</text>
  
  <text x="900" y="430" fill="#64748b" font-size="20" class="font-sans">R:R Ratio:</text>
  <text x="1020" y="430" fill="#3b82f6" font-size="28" font-weight="bold" class="font-sans">1:${escapeXml(rr)}</text>
  
  <!-- Footer -->
  <text x="600" y="590" fill="#475569" font-size="20" text-anchor="middle" class="font-sans">Committed on TradePlan • tradeplan-mu.vercel.app</text>
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(svg);
  } catch (e) {
    console.error('OG Image generation failed:', e);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
