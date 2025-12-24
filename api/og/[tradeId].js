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
    const directionColor = isLong ? '#10b981' : '#f43f5e'; // emerald / rose
    const directionBg = isLong ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#020617', // slate-950
            padding: '60px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                📊 TradePlan
              </div>
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#64748b',
              }}
            >
              @{username}
            </div>
          </div>

          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0f172a', // slate-900
              borderRadius: '24px',
              padding: '48px',
              border: '2px solid #1e293b',
              flex: 1,
            }}
          >
            {/* Pair and Direction */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: '#f1f5f9',
                }}
              >
                {pair}
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: directionColor,
                  backgroundColor: directionBg,
                  padding: '12px 24px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                }}
              >
                {direction}
              </div>
            </div>

            {/* Trade Details Grid */}
            <div
              style={{
                display: 'flex',
                gap: '32px',
                marginBottom: '40px',
              }}
            >
              {/* Entry */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  backgroundColor: '#1e293b',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Entry
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f1f5f9', fontFamily: 'monospace' }}>
                  {entry}
                </div>
              </div>

              {/* Target */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  backgroundColor: '#1e293b',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Target
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' }}>
                  {tp}
                </div>
              </div>

              {/* Stop */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  backgroundColor: '#1e293b',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Stop
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f43f5e', fontFamily: 'monospace' }}>
                  {sl}
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #1e293b',
                paddingTop: '32px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '20px', color: '#64748b' }}>Risk:</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f1f5f9' }}>{riskPercent}%</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '20px', color: '#64748b' }}>R:R Ratio:</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>1:{rr}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '32px',
              color: '#475569',
              fontSize: '20px',
            }}
          >
            Committed on TradePlan • tradeplan-mu.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('OG Image generation failed:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
