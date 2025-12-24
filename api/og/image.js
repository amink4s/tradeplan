import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';

export const config = {
  runtime: 'edge',
};

// WASM initialization state
let wasmInitialized = false;

async function initResvg() {
  if (wasmInitialized) return;
  
  try {
    // Fetch the WASM binary from CDN
    const wasmResponse = await fetch(
      'https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm'
    );
    const wasmBuffer = await wasmResponse.arrayBuffer();
    await initWasm(wasmBuffer);
    wasmInitialized = true;
  } catch (e) {
    // May already be initialized
    if (!e.message?.includes('Already initialized')) {
      console.error('WASM init error:', e);
    }
    wasmInitialized = true;
  }
}

// Fetch Inter font from Google Fonts
async function loadFont() {
  const response = await fetch(
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
  );
  return await response.arrayBuffer();
}

export default async function handler(req) {
  try {
    await initResvg();
    
    const { searchParams } = new URL(req.url);
    
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
    const directionColor = isLong ? '#10b981' : '#f43f5e';

    // Load font
    const fontData = await loadFont();

    // Create the image using Satori
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#020617',
            padding: 60,
          },
          children: [
            // Header
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 30,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: 36, fontWeight: 700, color: '#3b82f6' },
                      children: '📊 TradePlan',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: 28, color: '#64748b' },
                      children: `@${username}`,
                    },
                  },
                ],
              },
            },
            // Main Card
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#0f172a',
                  borderRadius: 24,
                  padding: 40,
                  border: '2px solid #1e293b',
                  flexGrow: 1,
                },
                children: [
                  // Pair and Direction Row
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 30,
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { fontSize: 52, fontWeight: 700, color: '#f1f5f9', marginRight: 20 },
                            children: pair,
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              fontSize: 26,
                              fontWeight: 700,
                              color: directionColor,
                              backgroundColor: isLong ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
                              padding: '10px 20px',
                              borderRadius: 10,
                            },
                            children: direction.toUpperCase(),
                          },
                        },
                      ],
                    },
                  },
                  // Price boxes row
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        marginBottom: 30,
                      },
                      children: [
                        // Entry
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 1,
                              backgroundColor: '#1e293b',
                              borderRadius: 16,
                              padding: 20,
                              marginRight: 16,
                            },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 14, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' },
                                  children: 'Entry',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, fontWeight: 700, color: '#f1f5f9' },
                                  children: entry,
                                },
                              },
                            ],
                          },
                        },
                        // Target
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 1,
                              backgroundColor: '#1e293b',
                              borderRadius: 16,
                              padding: 20,
                              marginRight: 16,
                            },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 14, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' },
                                  children: 'Target',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, fontWeight: 700, color: '#10b981' },
                                  children: tp,
                                },
                              },
                            ],
                          },
                        },
                        // Stop
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 1,
                              backgroundColor: '#1e293b',
                              borderRadius: 16,
                              padding: 20,
                            },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 14, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' },
                                  children: 'Stop',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 28, fontWeight: 700, color: '#f43f5e' },
                                  children: sl,
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  // Bottom stats
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #1e293b',
                        paddingTop: 24,
                        marginTop: 'auto',
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 20, color: '#64748b', marginRight: 10 },
                                  children: 'Risk:',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 26, fontWeight: 700, color: '#f1f5f9' },
                                  children: `${riskPercent}%`,
                                },
                              },
                            ],
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 20, color: '#64748b', marginRight: 10 },
                                  children: 'R:R Ratio:',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { fontSize: 26, fontWeight: 700, color: '#3b82f6' },
                                  children: `1:${rr}`,
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
            // Footer
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 24,
                  color: '#475569',
                  fontSize: 18,
                },
                children: 'Committed on TradePlan • tradeplan-mu.vercel.app',
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

    // Convert SVG to PNG
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('Image generation failed:', e);
    
    // Fallback to static image on error
    return Response.redirect('https://tradeplan-mu.vercel.app/image.png', 302);
  }
}
