import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 80)
      : 'Tbilisi Hip Hop Foundation'
      
    const category = searchParams.get('category') || 'Editorial'
    const coverUrl = searchParams.get('image')

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
            backgroundColor: '#0a0a0a',
            position: 'relative',
          }}
        >
          {/* Background Image with Overlay */}
          {coverUrl && (
            <img
              src={coverUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
              }}
            />
          )}
          
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2))',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '60px 80px',
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              zIndex: 10,
            }}
          >
            {/* Category Badge */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div
                style={{
                  background: '#a3e01d',
                  color: 'black',
                  padding: '8px 24px',
                  borderRadius: '9999px',
                  fontSize: 24,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {category}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '40px',
                fontFamily: 'sans-serif',
              }}
            >
              {title}
            </div>

            {/* Footer / Branding */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#a3e01d', letterSpacing: '-0.05em' }}>
                  THHF
                </div>
                <div style={{ fontSize: 32, color: 'white', marginLeft: '12px', opacity: 0.7 }}>
                  | Street Culture Magazine
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
