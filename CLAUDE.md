# WanderQuest - Travel Bucket List

A retro game-themed travel bucket list app built with Next.js, Tailwind CSS, Clerk auth, and Supabase.

## Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + custom retro/pixel theme
- **Auth**: Clerk
- **Database**: Supabase
- **External APIs**: Open-Meteo (weather), Open Library (books), curated music data

## Supabase Table

```sql
CREATE TABLE saved_destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  itinerary TEXT DEFAULT '',
  saved_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_saved_destinations_user_id ON saved_destinations(user_id);
```

## Project Structure
- `/src/app/` — Pages (home, chance, mood, popular, saved, destination/[slug])
- `/src/app/api/` — API routes (weather, books, music, saved)
- `/src/components/` — Shared components (Header, DestinationCard, WeatherWidget, PixelIcon)
- `/src/lib/` — Data and utilities (destinations, supabase client)

## Style
- Dark background (#0a0a0a), pixel font (Press Start 2P)
- Retro/arcade game aesthetic with CRT scanline overlay
- Color accents: cyan (#00e5ff), neon green (#b8ff00), golden (#ffcc00), pink (#ff6ec7)
