# WanderQuest - Travel Bucket List

A retro game-themed travel bucket list app built with Next.js, Tailwind CSS, Clerk auth, and Supabase.

## Design Vision

The interface is **cinematic and retro game style** — dark backgrounds, pixel art, CRT scanline overlays, and glowing neon accents. The aesthetic references Space Invaders-style UIs, pixel art game cards (like Duelo/Luchadores), dot-matrix icon grids, and pixel-art weather widgets.

### Home Page
- 4 rectangular module cards in a 2x2 grid:
  1. **Roll the Dice** — destination by chance
  2. **Follow Your Mood** — destination by mood selection
  3. **Popular Quests** — top travel destinations (general list)
  4. **My Destinations** — saved destinations (requires auth)

### Module 1: Destination by Chance
- Animated pixel coin flip (purely visual, each roll gives a different random destination)
- After flip: clouds disperse animation, cartoon globe navigation to the destination
- Opens a destination card with city details

### Module 2: Destination by Mood
- Grid of dark rounded tiles with pixel-style mood icons (retro dot-matrix style)
- Moods include both feelings (Adventurous, Relaxed, Cultural, Romantic, Foodie, Nature, Party, Spiritual) AND literal emotions (Happy, Sad, Excited, Curious)
- Each mood represented by retro pixel emoji icons
- Algorithm analyzes mood → recommends a matching destination

### Module 3: Popular Destinations
- General top travel destinations list displayed as a retro leaderboard
- Includes search functionality to browse/search all destinations

### Module 4: Saved Destinations
- Grid of pixel-art weather-widget-style cards (like Image 4 reference)
- Each card shows destination name (large pixel font) instead of temperature
- Click to expand: shows notes, itinerary, and action buttons
- Users can add/edit notes and travel itinerary per destination
- Unsave/remove option

### Destination Card (shared across modules)
- Retro bordered card with pixel art header (like Duelo game cards)
- Shows: city, country, fun places to visit, similar destinations
- **Real-time weather** widget with pixel art (Open-Meteo API)
- **Book recommendations** related to the destination (Open Library API)
- **Music recommendations** related to the destination (curated by country)
- Save button with notes and itinerary fields

## Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + custom retro/pixel theme
- **Auth**: Clerk (sign up, log in, sign out)
- **Database**: Supabase (data scoped to logged-in user)
- **External APIs**: Open-Meteo (weather, no key), Open Library (books, no key), curated music data
- **Font**: Press Start 2P (pixel font via next/font)

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
- `/src/lib/` — Data and utilities (destinations data, supabase client)

## Style Guidelines
- Dark background (#0a0a0a), pixel font (Press Start 2P)
- Retro/arcade game aesthetic with CRT scanline overlay
- Color accents: cyan (#00e5ff), neon green (#b8ff00), golden (#ffcc00), pink (#ff6ec7), purple (#a855f7)
- Cards: dark bg (#1a1a2e) with subtle borders (#2a2a4a), glow on hover
- All UI text in pixel font at small sizes (6-12px)

## Environment Variables (in .env.local, never hardcoded)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Assignment Requirements Checklist
- [x] Built with Next.js + Tailwind CSS
- [x] User authentication via Clerk (sign up, log in, sign out)
- [x] Data stored in Supabase, scoped to the logged-in user
- [x] Fetches data from external APIs (Open-Meteo weather, Open Library books)
- [x] Users can search/browse API data and save items to their account
- [x] Users can view their saved items
- [x] Environment variables in .env.local, not hardcoded
- [x] Supabase MCP server configured
- [ ] Multiple git commits showing iteration
- [ ] Deployed to Vercel with environment variables set
- [ ] Live URL works
