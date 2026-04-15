import { NextRequest, NextResponse } from "next/server";

// Curated music associations for destinations — more reliable than API search
const musicByRegion: Record<string, Array<{ artist: string; album: string; genre: string }>> = {
  Japan: [
    { artist: "Nujabes", album: "Metaphorical Music", genre: "Jazz Hop" },
    { artist: "Joe Hisaishi", album: "Spirited Away OST", genre: "Film Score" },
    { artist: "Yellow Magic Orchestra", album: "Solid State Survivor", genre: "Synthpop" },
  ],
  France: [
    { artist: "Édith Piaf", album: "La Vie en Rose", genre: "Chanson" },
    { artist: "Daft Punk", album: "Discovery", genre: "Electronic" },
    { artist: "Serge Gainsbourg", album: "Histoire de Melody Nelson", genre: "Pop" },
  ],
  Italy: [
    { artist: "Ennio Morricone", album: "The Good, the Bad and the Ugly", genre: "Film Score" },
    { artist: "Andrea Bocelli", album: "Romanza", genre: "Classical Crossover" },
    { artist: "Lucio Dalla", album: "Dalla", genre: "Italian Pop" },
  ],
  Indonesia: [
    { artist: "Gamelan Ensemble", album: "Music of Bali", genre: "Traditional" },
    { artist: "Tulus", album: "Monokrom", genre: "Indonesian Pop" },
    { artist: "Balawan", album: "Magic Fingers", genre: "World Fusion" },
  ],
  "United States": [
    { artist: "Frank Sinatra", album: "New York, New York", genre: "Jazz Standards" },
    { artist: "Billy Joel", album: "The Stranger", genre: "Piano Rock" },
    { artist: "LCD Soundsystem", album: "Sound of Silver", genre: "Dance-Punk" },
  ],
  "United Kingdom": [
    { artist: "The Beatles", album: "Abbey Road", genre: "Rock" },
    { artist: "Adele", album: "21", genre: "Pop Soul" },
    { artist: "The Clash", album: "London Calling", genre: "Punk Rock" },
  ],
  Morocco: [
    { artist: "Nass El Ghiwane", album: "Best Of", genre: "Gnawa" },
    { artist: "Hassan Hakmoun", album: "Trance", genre: "Gnawa Fusion" },
    { artist: "Oum", album: "Soul of Morocco", genre: "World Music" },
  ],
  Brazil: [
    { artist: "Tom Jobim", album: "Wave", genre: "Bossa Nova" },
    { artist: "Gilberto Gil", album: "Tropicália", genre: "MPB" },
    { artist: "Jorge Ben Jor", album: "África Brasil", genre: "Samba Rock" },
  ],
  Iceland: [
    { artist: "Björk", album: "Homogenic", genre: "Art Pop" },
    { artist: "Sigur Rós", album: "( )", genre: "Post-Rock" },
    { artist: "Ólafur Arnalds", album: "Island Songs", genre: "Neoclassical" },
  ],
  Turkey: [
    { artist: "Barış Manço", album: "2023", genre: "Anatolian Rock" },
    { artist: "Mercan Dede", album: "800", genre: "Electronic Sufi" },
    { artist: "Tarkan", album: "Aacayipsin", genre: "Turkish Pop" },
  ],
  "South Africa": [
    { artist: "Miriam Makeba", album: "Pata Pata", genre: "Afropop" },
    { artist: "Hugh Masekela", album: "Hope", genre: "Jazz" },
    { artist: "Black Coffee", album: "Subconsciously", genre: "Afro House" },
  ],
  Thailand: [
    { artist: "Carabao", album: "Made in Thailand", genre: "Thai Rock" },
    { artist: "Thongchai McIntyre", album: "Best Collection", genre: "Thai Pop" },
    { artist: "Paradise Bangkok", album: "21st Century Molam", genre: "Molam" },
  ],
  Australia: [
    { artist: "Tame Impala", album: "Currents", genre: "Psychedelic Pop" },
    { artist: "AC/DC", album: "Back in Black", genre: "Hard Rock" },
    { artist: "Courtney Barnett", album: "Sometimes I Sit", genre: "Indie Rock" },
  ],
  Argentina: [
    { artist: "Astor Piazzolla", album: "Libertango", genre: "Tango Nuevo" },
    { artist: "Mercedes Sosa", album: "Gracias a la Vida", genre: "Folk" },
    { artist: "Soda Stereo", album: "Dynamo", genre: "Alt Rock" },
  ],
  Netherlands: [
    { artist: "Tiësto", album: "In Search of Sunrise", genre: "Trance" },
    { artist: "Golden Earring", album: "Moontan", genre: "Rock" },
    { artist: "Caro Emerald", album: "Deleted Scenes", genre: "Jazz Pop" },
  ],
  Egypt: [
    { artist: "Umm Kulthum", album: "Alf Leila Wa Leila", genre: "Classical Arabic" },
    { artist: "Amr Diab", album: "Tamally Maak", genre: "Arabic Pop" },
    { artist: "Mohamed Mounir", album: "Earth Peace", genre: "World Music" },
  ],
  Peru: [
    { artist: "Susana Baca", album: "Lamento Negro", genre: "Afro-Peruvian" },
    { artist: "Los Kjarkas", album: "Best Of", genre: "Andean Folk" },
    { artist: "Novalima", album: "Planetario", genre: "Electronic Folk" },
  ],
  Spain: [
    { artist: "Paco de Lucía", album: "Siroco", genre: "Flamenco" },
    { artist: "Rosalía", album: "El Mal Querer", genre: "Nuevo Flamenco" },
    { artist: "Buika", album: "La Noche Más Larga", genre: "Flamenco Jazz" },
  ],
  "Czech Republic": [
    { artist: "Dvořák", album: "New World Symphony", genre: "Classical" },
    { artist: "Čechomor", album: "Proměny", genre: "Czech Folk Rock" },
    { artist: "Dan Bárta", album: "Kráska a Zvířený Prach", genre: "Jazz Fusion" },
  ],
  UAE: [
    { artist: "Hussain Al Jassmi", album: "Boshret Kheir", genre: "Arabic Pop" },
    { artist: "Balqees", album: "Best Of", genre: "Khaliji Pop" },
    { artist: "DJ Bliss", album: "Made in Dubai", genre: "Electronic" },
  ],
  Vietnam: [
    { artist: "Trinh Cong Son", album: "Best Of", genre: "Vietnamese Folk" },
    { artist: "Toc Tien", album: "Best Of", genre: "Vpop" },
    { artist: "Den Vau", album: "Best Of", genre: "Vietnamese Rap" },
  ],
  Portugal: [
    { artist: "Amália Rodrigues", album: "The Art of Amália", genre: "Fado" },
    { artist: "Mariza", album: "Fado em Mim", genre: "Modern Fado" },
    { artist: "Madredeus", album: "O Espírito da Paz", genre: "Folk" },
  ],
  Kenya: [
    { artist: "Sauti Sol", album: "Afrikan Sauce", genre: "Afropop" },
    { artist: "Ayub Ogada", album: "En Mana Kuoyo", genre: "World Music" },
    { artist: "Nyashinski", album: "Lucky You", genre: "Kenyan Hip Hop" },
  ],
  Greece: [
    { artist: "Mikis Theodorakis", album: "Zorba the Greek", genre: "Film Score" },
    { artist: "Vangelis", album: "Chariots of Fire", genre: "Electronic" },
    { artist: "Nana Mouskouri", album: "Best Of", genre: "World Pop" },
  ],
  "South Korea": [
    { artist: "BTS", album: "Map of the Soul: 7", genre: "K-Pop" },
    { artist: "Hyukoh", album: "23", genre: "Indie Rock" },
    { artist: "Lee Moon-sae", album: "Best Of", genre: "Korean Ballad" },
  ],
  Cuba: [
    { artist: "Buena Vista Social Club", album: "Buena Vista Social Club", genre: "Son Cubano" },
    { artist: "Compay Segundo", album: "Lo Mejor", genre: "Traditional Cuban" },
    { artist: "Celia Cruz", album: "La Negra Tiene Tumbao", genre: "Salsa" },
  ],
  Singapore: [
    { artist: "Dick Lee", album: "The Mad Chinaman", genre: "Asian Pop" },
    { artist: "Stefanie Sun", album: "Start", genre: "Mandopop" },
    { artist: "Charlie Lim", album: "Time/Space", genre: "Indie Pop" },
  ],
  Jordan: [
    { artist: "Omar Al Abdallat", album: "Best Of", genre: "Arabic Folk" },
    { artist: "Hani Mitwasi", album: "Aghani", genre: "Arabic Pop" },
    { artist: "JadaL", album: "El Mekhada", genre: "Arabic Rock" },
  ],
  Canada: [
    { artist: "Joni Mitchell", album: "Blue", genre: "Folk" },
    { artist: "Arcade Fire", album: "The Suburbs", genre: "Indie Rock" },
    { artist: "Drake", album: "Take Care", genre: "Hip-Hop" },
  ],
};

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");

  if (!country) {
    return NextResponse.json({ error: "country is required" }, { status: 400 });
  }

  const music = musicByRegion[country] || [
    { artist: "Various Artists", album: "World Music Collection", genre: "World" },
    { artist: "Global Beats", album: "Around the World", genre: "World Fusion" },
    { artist: "Putumayo", album: "World Lounge", genre: "Lounge" },
  ];

  // Fetch iTunes preview URLs for each track
  const musicWithPreviews = await Promise.all(
    music.map(async (track) => {
      try {
        const searchTerm = encodeURIComponent(`${track.artist} ${track.album}`);
        const itunesRes = await fetch(
          `https://itunes.apple.com/search?term=${searchTerm}&limit=1&media=music`,
          { next: { revalidate: 86400 } }
        );
        if (itunesRes.ok) {
          const data = await itunesRes.json();
          if (data.results?.length > 0) {
            return {
              ...track,
              previewUrl: data.results[0].previewUrl || null,
              artworkUrl: data.results[0].artworkUrl100 || null,
            };
          }
        }
      } catch {
        // Fall through to return without preview
      }
      return { ...track, previewUrl: null, artworkUrl: null };
    })
  );

  return NextResponse.json({ music: musicWithPreviews });
}
