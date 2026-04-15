# WanderQuest - Travel Bucket List

A retro game-themed travel bucket list app built with Next.js, Tailwind CSS, Clerk auth, and Supabase.

## User Instructions (Complete History)

### Initial Requirements (Assignment 3)
- Built with Next.js + Tailwind CSS
- User authentication via Clerk (sign up, log in, sign out)
- Data stored in Supabase, scoped to the logged-in user
- Fetches data from an external API
- Users can search/browse API data and save items to their account
- Users can view their saved items
- Environment variables in .env.local (Supabase + Clerk keys), not hardcoded
- Supabase MCP server configured
- Multiple git commits showing iteration
- Deployed to Vercel with environment variables set
- Live URL works — classmates can create accounts and use it

### Design Vision (User's Original Instructions)
The app is a **travel bucket list website**. The interfaces look **cinematic and retro game style**.

**Reference images provided:**
- Image 1: Space Invaders-style dark UI with pixel art, CRT frame, dashed lines — sets the overall aesthetic
- Image 2: Duelo game — pixel art character cards with stats, bordered windows, golden accents — reference for destination detail cards
- Image 3: Dark rounded tiles with dot-matrix/LED-style icons in white and yellow-green — reference for mood selection grid
- Image 4: Pixel art weather widgets with distinct color palettes per weather type — reference for saved destinations view (showing destination names instead of weather)

### Home Page (4 Modules)
The first page lays out 4 modules shown as 4 rectangular structures:
1. **Choose destination based on chance** — coin flip animation
2. **Choose destination based on mood** — mood selection UI
3. **See popular choices** — general top travel destinations
4. **See my past saved destinations** — user's saved list

### Module 1: Destination by Chance
- Shows a coin flip animation (purely visual, each time should give a different random destination)
- Then shows a page like in a game with clouds dispersing and navigating on a cartoon globe to the recommended destination
- **Pokemon card preview step**: After globe animation, show a preview card (like a Pokemon/game card) with the destination. User can choose "I LIKE IT" or "SKIP". If they like it, show the full destination card. If skip, re-roll a new random destination.
- The full destination card opens up like a card in the game (Image 2 style), showing: destination city, country, fun places to visit, similar destinations

### Module 2: Destination by Mood
- Interface references Image 3 (dark rounded tiles with dot-matrix icons)
- Asks people to select their mood
- Moods include BOTH feeling-based (Adventurous, Relaxed, Cultural, Romantic, Foodie, Nature, Party, Spiritual) AND literal emotions (Happy, Sad, Excited, Curious)
- Each mood represented by retro pixel-style emoji icons designed for the retro aesthetic
- By an algorithm/analysis process, recommend a destination, shown the same as in Module 1

### Destination Card Features (for all destinations)
- City, country, fun places to visit, similar destinations
- Allow users to **save to their favorite** and add their own **notes and travel itinerary**
- Show **real-time weather** in each destination
- **Book recommendations** related to the destination (Open Library API)
- **Music recommendations** related to the destination with **playback** (iTunes 30-second previews)
- **Destination photos** displayed in retro style — photos fetched from Wikipedia API, with pixelated retro-style rendering
- **Pixelated background** — when presenting a destination, the background uses a real photo converted to pixel retro style (CSS pixelation + grid overlay)
- **Clickable recommended places** — each "fun place to visit" is clickable and shows a retro game-style dialog popup (Image 5 reference: game UI dialog with hazard stripes, icon, description, action buttons) with photos and info about that specific location
- **AI writing assistant** — helps users while they write notes/itinerary. Template-based suggestions for itinerary, travel notes, and tips based on destination data. No external AI API key required.
- **Save everything edited** — notes, itinerary all saveable to Supabase with explicit save button and confirmation

### Module 3: Popular Places
- Shown as a retro leaderboard list
- General top travel destinations (not user-tracked)
- Includes search bar to browse/search all destinations (satisfies "search/browse API data" requirement)

### Module 4: Saved Destinations
- Looks like Image 4 (pixel art weather widget cards), except destination name is written instead of weather
- Grid of cards with pixel-art scene backgrounds and large pixel-font destination names
- Click to expand: shows notes, itinerary, action buttons
- Users can edit notes/itinerary and save changes
- Remove/unsave option

### Enhancement Request (Image 5 & 6 References)
- Image 5: Game UI/UX dialog — bordered panel with hazard stripe header, icon thumbnail, description text, Cancel/Open buttons. Used for clickable place popups.
- Image 6: Desktop-style portfolio with photo gallery grid, settings panels. Used as reference for how photos of destinations should be browsable.
- Background images: Get the picture first, then convert into pixel retro style using CSS image-rendering: pixelated and grid overlays.

## Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + custom retro/pixel theme
- **Auth**: Clerk (sign up, log in, sign out)
- **Database**: Supabase (data scoped to logged-in user via Clerk userId)
- **Font**: Press Start 2P (pixel font via next/font)
- **External APIs**:
  - Open-Meteo — real-time weather (no key)
  - Open Library — book recommendations (no key)
  - iTunes Search API — music previews with 30-second playback (no key)
  - Wikipedia/Wikimedia API — destination and place photos (no key)
  - Curated music data by country (fallback/supplement to iTunes)

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
- `/src/app/` — Pages: home, chance, mood, popular, saved, destination/[slug], sign-in, sign-up
- `/src/app/api/` — API routes: weather, books, music, photos, saved, ai-helper
- `/src/components/` — Shared: Header, DestinationCard, WeatherWidget, PixelIcon, PlaceDialog
- `/src/lib/` — Data and utilities: destinations data with mood mapping, supabase client

## Style Guidelines
- Dark background (#0a0a0a), pixel font (Press Start 2P)
- Retro/arcade game aesthetic with CRT scanline overlay
- Color accents: cyan (#00e5ff), neon green (#b8ff00), golden (#ffcc00), pink (#ff6ec7), purple (#a855f7)
- Cards: dark bg (#1a1a2e) with subtle borders (#2a2a4a), glow on hover
- All UI text in pixel font at small sizes (6-12px)
- Photos rendered with CSS pixelation (image-rendering: pixelated) and grid overlays for retro effect

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
- [x] Fetches data from external APIs (Open-Meteo, Open Library, iTunes, Wikipedia)
- [x] Users can search/browse API data and save items to their account
- [x] Users can view their saved items
- [x] Environment variables in .env.local, not hardcoded
- [x] Supabase MCP server configured
- [ ] Multiple git commits showing iteration
- [ ] Deployed to Vercel with environment variables set
- [ ] Live URL works
