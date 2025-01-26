import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const units = searchParams.get('units') || 'metric';
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  if (!city) return NextResponse.json({ error: 'City is required' }, { status: 400 });

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
    );
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
