"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { Destination } from "@/lib/destinations";
import { getDestinationBySlug } from "@/lib/destinations";
import WeatherWidget from "./WeatherWidget";
import PixelIcon from "./PixelIcon";

interface WeatherData {
  current: { temp: number; description: string; weatherCode: number };
  forecast: Array<{ date: string; high: number; low: number; description: string; weatherCode: number }>;
}

interface Book {
  title: string;
  author: string;
  year: number | null;
  coverId: number | null;
  key: string;
}

interface Music {
  artist: string;
  album: string;
  genre: string;
}

interface DestinationCardProps {
  destination: Destination;
  onBack?: () => void;
}

export default function DestinationCard({ destination, onBack }: DestinationCardProps) {
  const { isSignedIn } = useUser();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [music, setMusic] = useState<Music[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const fetchData = useCallback(async () => {
    const [weatherRes, booksRes, musicRes] = await Promise.all([
      fetch(`/api/weather?lat=${destination.lat}&lon=${destination.lon}`),
      fetch(`/api/books?city=${encodeURIComponent(destination.city)}&country=${encodeURIComponent(destination.country)}`),
      fetch(`/api/music?country=${encodeURIComponent(destination.country)}`),
    ]);

    if (weatherRes.ok) {
      const data = await weatherRes.json();
      setWeather(data);
    }
    if (booksRes.ok) {
      const data = await booksRes.json();
      setBooks(data.books || []);
    }
    if (musicRes.ok) {
      const data = await musicRes.json();
      setMusic(data.music || []);
    }
  }, [destination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!isSignedIn || saving) return;
    setSaving(true);
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: destination.slug,
        city: destination.city,
        country: destination.country,
        countryCode: destination.countryCode,
      }),
    });
    if (res.ok || res.status === 409) {
      setSaved(true);
    }
    setSaving(false);
  };

  return (
    <div className="animate-card-slide-in max-w-2xl w-full mx-auto">
      {/* Card header */}
      <div className="retro-card overflow-hidden" style={{ borderColor: "#ffcc0066" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a4a] bg-[#ffcc00]/5">
          {onBack && (
            <button onClick={onBack} className="font-pixel text-[8px] text-[#ffcc00] hover:underline">
              &lt; BACK
            </button>
          )}
          <span className="font-pixel text-[6px] text-gray-500">DESTINATION CARD</span>
          <div className="w-12" />
        </div>

        {/* City/Country header */}
        <div className="px-6 py-6 text-center border-b border-[#2a2a4a]">
          <h2 className="font-pixel text-lg sm:text-xl text-[#ffcc00] glow-golden mb-2">
            {destination.city}
          </h2>
          <p className="font-pixel text-[8px] text-gray-400">
            {destination.country} {destination.countryCode && `· ${destination.countryCode}`}
          </p>
          <p className="text-sm text-gray-300 mt-3 max-w-md mx-auto leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Content sections */}
        <div className="p-6 space-y-6">
          {/* Weather */}
          <div>
            <h3 className="font-pixel text-[8px] text-[#00e5ff] mb-3 flex items-center gap-2">
              <PixelIcon name="star" size={12} color="#00e5ff" />
              WEATHER NOW
            </h3>
            <WeatherWidget weather={weather} />
          </div>

          {/* Fun Places */}
          <div>
            <h3 className="font-pixel text-[8px] text-[#b8ff00] mb-3 flex items-center gap-2">
              <PixelIcon name="globe" size={12} color="#b8ff00" />
              FUN PLACES TO VISIT
            </h3>
            <ul className="space-y-2">
              {destination.funPlaces.map((place) => (
                <li key={place} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 bg-[#b8ff00] flex-shrink-0" />
                  {place}
                </li>
              ))}
            </ul>
          </div>

          {/* Books */}
          {books.length > 0 && (
            <div>
              <h3 className="font-pixel text-[8px] text-[#ff6ec7] mb-3 flex items-center gap-2">
                <PixelIcon name="bookmark" size={12} color="#ff6ec7" />
                BOOK RECOMMENDATIONS
              </h3>
              <div className="space-y-2">
                {books.map((book) => (
                  <div key={book.key} className="flex items-start gap-3 p-2 rounded bg-[#1a1a2e]/50">
                    {book.coverId && (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`}
                        alt={book.title}
                        className="w-8 h-12 object-cover rounded-sm flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-200">{book.title}</p>
                      <p className="text-xs text-gray-500">
                        {book.author}{book.year ? ` · ${book.year}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music */}
          {music.length > 0 && (
            <div>
              <h3 className="font-pixel text-[8px] text-[#a855f7] mb-3 flex items-center gap-2">
                <PixelIcon name="disco" size={12} color="#a855f7" />
                MUSIC FOR THE JOURNEY
              </h3>
              <div className="space-y-2">
                {music.map((track) => (
                  <div key={`${track.artist}-${track.album}`} className="flex items-center gap-3 p-2 rounded bg-[#1a1a2e]/50">
                    <div className="w-8 h-8 bg-[#a855f7]/20 rounded-sm flex items-center justify-center flex-shrink-0">
                      <PixelIcon name="disco" size={16} color="#a855f7" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">{track.album}</p>
                      <p className="text-xs text-gray-500">{track.artist} · {track.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Destinations */}
          <div>
            <h3 className="font-pixel text-[8px] text-[#00e5ff] mb-3 flex items-center gap-2">
              <PixelIcon name="magnify" size={12} color="#00e5ff" />
              SIMILAR DESTINATIONS
            </h3>
            <div className="flex flex-wrap gap-2">
              {destination.similarDestinations.map((slug) => {
                const d = getDestinationBySlug(slug);
                if (!d) return null;
                return (
                  <Link
                    key={slug}
                    href={`/destination/${slug}`}
                    className="px-3 py-1.5 rounded border border-[#2a2a4a] text-xs text-gray-300 hover:border-[#00e5ff] hover:text-[#00e5ff] transition-colors"
                  >
                    {d.city}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Save Section */}
          <div className="border-t border-[#2a2a4a] pt-4">
            {isSignedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saved || saving}
                    className={`font-pixel text-[8px] px-4 py-2 rounded border transition-all ${
                      saved
                        ? "border-[#b8ff00] text-[#b8ff00] bg-[#b8ff00]/10"
                        : "border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00]/10"
                    }`}
                  >
                    {saved ? "SAVED!" : saving ? "SAVING..." : "SAVE TO MY QUESTS"}
                  </button>
                  {saved && (
                    <button
                      onClick={() => setShowNotes(!showNotes)}
                      className="font-pixel text-[7px] text-gray-400 hover:text-[#00e5ff] transition-colors"
                    >
                      {showNotes ? "HIDE NOTES" : "ADD NOTES"}
                    </button>
                  )}
                </div>

                {showNotes && saved && (
                  <div className="space-y-3">
                    <div>
                      <label className="font-pixel text-[6px] text-gray-500 block mb-1">
                        TRAVEL NOTES
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a4a] rounded p-3 text-sm text-gray-200 focus:border-[#00e5ff] focus:outline-none resize-none"
                        rows={3}
                        placeholder="Your thoughts about this destination..."
                      />
                    </div>
                    <div>
                      <label className="font-pixel text-[6px] text-gray-500 block mb-1">
                        ITINERARY
                      </label>
                      <textarea
                        value={itinerary}
                        onChange={(e) => setItinerary(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a4a] rounded p-3 text-sm text-gray-200 focus:border-[#00e5ff] focus:outline-none resize-none"
                        rows={3}
                        placeholder="Day 1: Arrive and explore..."
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="font-pixel text-[7px] text-gray-500 text-center">
                SIGN IN TO SAVE THIS DESTINATION
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
