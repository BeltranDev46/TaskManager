import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') || '512');
  
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #D45715, #1E9A63)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size * 0.4,
          fontWeight: 'bold',
        }}
      >
        TF
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
