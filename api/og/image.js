import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
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
    const directionColor = isLong ? '#34d399' : '#fb7185'; // emerald-400 / rose-400
    const directionBg = isLong ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // slate-900
            padding: 60,
          }}
        >
          {/* Commitment Certificate Card - matches MintOverlay design */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#020617', // slate-950
              borderRadius: 32,
              padding: 48,
              border: '2px solid #1e293b', // slate-800
              width: '100%',
              maxWidth: 1000,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Award watermark icon (top right) */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 160,
                opacity: 0.08,
              }}
            >
              🏆
            </div>

            {/* Header: Commitment Certificate */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#3b82f6', // blue-500
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                  marginBottom: 8,
                  fontFamily: 'monospace',
                }}
              >
                Commitment Certificate
              </div>
              
              {/* Pair + Direction */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {pair}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: directionColor,
                    backgroundColor: directionBg,
                    padding: '8px 16px',
                    borderRadius: 8,
                  }}
                >
                  {direction.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Trade Details Grid - matches MintOverlay */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                fontFamily: 'monospace',
              }}
            >
              {/* Risk Row */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: 20,
                    color: '#64748b', // slate-500
                    textTransform: 'uppercase',
                    width: 140,
                  }}
                >
                  Risk
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: '#cbd5e1', // slate-300
                    fontWeight: 600,
                  }}
                >
                  {riskPercent}%
                </div>
              </div>

              {/* Entry Row */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: 20,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    width: 140,
                  }}
                >
                  Entry
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: '#cbd5e1',
                    fontWeight: 600,
                  }}
                >
                  {entry}
                </div>
              </div>

              {/* Stop Loss Row */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: 20,
                    color: '#fb7185', // rose-400
                    textTransform: 'uppercase',
                    width: 140,
                  }}
                >
                  Stop
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: '#fb7185',
                    fontWeight: 600,
                  }}
                >
                  {sl}
                </div>
              </div>

              {/* Target Row */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: 20,
                    color: '#34d399', // emerald-400
                    textTransform: 'uppercase',
                    width: 140,
                  }}
                >
                  Target
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: '#34d399',
                    fontWeight: 600,
                  }}
                >
                  {tp}
                </div>
              </div>

              {/* R:R Row */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: 20,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    width: 140,
                  }}
                >
                  R:R
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: '#3b82f6', // blue-500
                    fontWeight: 600,
                  }}
                >
                  1:{rr}
                </div>
              </div>
            </div>

            {/* Footer with username */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 40,
                paddingTop: 24,
                borderTop: '1px solid #1e293b',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  color: '#64748b',
                }}
              >
                @{username}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 20,
                  color: '#3b82f6',
                  fontWeight: 600,
                }}
              >
                📊 TradePlan
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
        },
      }
    );
  } catch (e) {
    console.error('Image generation failed:', e);

    // Return error image with short cache to avoid caching failures
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#020617',
            color: '#f1f5f9',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 20 }}>
            📊 TradePlan
          </div>
          <div style={{ fontSize: 24, color: '#64748b' }}>
            Trade Commitment
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
