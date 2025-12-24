import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Use Node.js runtime (not Edge) for @resvg/resvg-js compatibility
export const config = {
  runtime: 'nodejs',
};

// Fetch Inter font from Google Fonts
async function loadFont() {
  const response = await fetch(
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
  );
  return Buffer.from(await response.arrayBuffer());
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const searchParams = url.searchParams;

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
    const directionColor = isLong ? '#34d399' : '#fb7185';
    const directionBg = isLong ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)';

    // Load font
    const fontData = await loadFont();

    // Create the image using Satori - Commitment Certificate design
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            padding: 60,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#020617',
                  borderRadius: 32,
                  padding: 48,
                  border: '2px solid #1e293b',
                  width: '100%',
                  maxWidth: 1000,
                },
                children: [
                  // Header: Commitment Certificate
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: 24,
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              fontSize: 18,
                              fontWeight: 600,
                              color: '#3b82f6',
                              textTransform: 'uppercase',
                              letterSpacing: '-0.5px',
                              marginBottom: 8,
                            },
                            children: 'Commitment Certificate',
                          },
                        },
                        // Pair + Direction
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                            },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: {
                                    fontSize: 56,
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    marginRight: 16,
                                  },
                                  children: pair,
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: {
                                    fontSize: 28,
                                    fontWeight: 800,
                                    color: directionColor,
                                    backgroundColor: directionBg,
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                  },
                                  children: direction.toUpperCase(),
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  // Trade Details Grid
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                      },
                      children: [
                        // Risk Row
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 20, color: '#64748b', textTransform: 'uppercase', width: 140 },
                                  children: 'Risk',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, color: '#cbd5e1', fontWeight: 600 },
                                  children: `${riskPercent}%`,
                                },
                              },
                            ],
                          },
                        },
                        // Entry Row
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 20, color: '#64748b', textTransform: 'uppercase', width: 140 },
                                  children: 'Entry',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, color: '#cbd5e1', fontWeight: 600 },
                                  children: entry,
                                },
                              },
                            ],
                          },
                        },
                        // Stop Row
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 20, color: '#fb7185', textTransform: 'uppercase', width: 140 },
                                  children: 'Stop',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, color: '#fb7185', fontWeight: 600 },
                                  children: sl,
                                },
                              },
                            ],
                          },
                        },
                        // Target Row
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 20, color: '#34d399', textTransform: 'uppercase', width: 140 },
                                  children: 'Target',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, color: '#34d399', fontWeight: 600 },
                                  children: tp,
                                },
                              },
                            ],
                          },
                        },
                        // R:R Row
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 20, color: '#64748b', textTransform: 'uppercase', width: 140 },
                                  children: 'R:R',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, color: '#3b82f6', fontWeight: 600 },
                                  children: `1:${rr}`,
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  // Footer
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 32,
                        paddingTop: 24,
                        borderTop: '1px solid #1e293b',
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { fontSize: 20, color: '#64748b' },
                            children: `@${username}`,
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: { fontSize: 20, color: '#3b82f6', fontWeight: 600 },
                            children: '📊 TradePlan',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );

    // Convert SVG to PNG using resvg-js
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).send(Buffer.from(pngBuffer));
  } catch (e) {
    console.error('Image generation failed:', e);
    
    // Redirect to static fallback image on error
    res.setHeader('Cache-Control', 'no-cache');
    return res.redirect(302, 'https://tradeplan-mu.vercel.app/image.png');
  }
}
