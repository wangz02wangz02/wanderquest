import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }

  const data = await res.json();

  // Map WMO weather codes to descriptions
  const weatherDescriptions: Record<number, string> = {
    0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Rime Fog", 51: "Light Drizzle", 53: "Drizzle",
    55: "Heavy Drizzle", 61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
    71: "Light Snow", 73: "Snow", 75: "Heavy Snow", 77: "Snow Grains",
    80: "Light Showers", 81: "Showers", 82: "Heavy Showers",
    85: "Light Snow Showers", 86: "Snow Showers",
    95: "Thunderstorm", 96: "Thunderstorm w/ Hail", 99: "Heavy Thunderstorm",
  };

  const current = data.current;
  const daily = data.daily;

  return NextResponse.json({
    current: {
      temp: Math.round(current.temperature_2m),
      description: weatherDescriptions[current.weather_code] || "Unknown",
      weatherCode: current.weather_code,
      windSpeed: current.wind_speed_10m,
    },
    forecast: daily.time.map((date: string, i: number) => ({
      date,
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      description: weatherDescriptions[daily.weather_code[i]] || "Unknown",
      weatherCode: daily.weather_code[i],
    })),
  });
}
