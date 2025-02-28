import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const description = searchParams.get('description')

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
          backgroundColor: '#4F46E5',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontStyle: 'normal',
            color: 'white',
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          Agenda 2025
        </div>
        <div
          style={{
            fontSize: 30,
            fontStyle: 'normal',
            color: 'white',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {description || 'Disponibilidad Horaria'}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}