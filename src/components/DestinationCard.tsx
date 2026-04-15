"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { Destination } from "@/lib/destinations";
import { getDestinationBySlug } from "@/lib/destinations";
import WeatherWidget from "./WeatherWidget";
import PixelIcon from "./PixelIcon";
import PlaceDialog from "./PlaceDialog";

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
  previewUrl: string | null;
  artworkUrl: string | null;
}

interface PhotoResult {
  title: string;
  extract: string;
  imageUrl: string | null;
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
  const [photos, setPhotos] = useState<PhotoResult[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchData = useCallback(async () => {
    const [weatherRes, booksRes, musicRes, photosRes] = await Promise.all([
      fetch(`/api/weather?lat=${destination.lat}&lon=${destination.lon}`),
      fetch(`/api/books?city=${encodeURIComponent(destination.city)}&country=${encodeURIComponent(destination.country)}`),
      fetch(`/api/music?country=${encodeURIComponent(destination.country)}`),
      fetch(`/api/photos?places=${encodeURIComponent(destination.funPlaces.join(","))}`),
    ]);

    if (weatherRes.ok) setWeather(await weatherRes.json());
    if (booksRes.ok) {
      const data = await booksRes.json();
      setBooks(data.books || []);
    }
    if (musicRes.ok) {
      const data = await musicRes.json();
      setMusic(data.music || []);
    }
    if (photosRes.ok) {
      const data = await photosRes.json();
      setPhotos(data.photos || []);
    }
  }, [destination]);

  useEffect(() => {
    fetchData();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
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
    if (res.ok) {
      const data = await res.json();
      setSaved(true);
      setSavedId(data.destination?.id || null);
    } else if (res.status === 409) {
      setSaved(true);
    }
    setSaving(false);
  };

  const handleSaveNotes = async () => {
    if (!savedId) return;
    const res = await fetch("/api/saved", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: savedId, notes, itinerary }),
    });
    if (res.ok) {
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
  };

  const handlePlayTrack = (previewUrl: string) => {
    if (playingTrack === previewUrl) {
      audioRef.current?.pause();
      setPlayingTrack(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(previewUrl);
    audio.volume = 0.5;
    audio.play();
    audio.onended = () => setPlayingTrack(null);
    audioRef.current = audio;
    setPlayingTrack(previewUrl);
  };

  const handleAiSuggestion = async (type: "itinerary" | "notes" | "tips") => {
    setAiLoading(true);
    const res = await fetch("/api/ai-helper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        city: destination.city,
        country: destination.country,
        funPlaces: destination.funPlaces,
        days: 3,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (type === "itinerary") {
        setItinerary((prev) => (prev ? prev + "\n\n" + data.suggestion : data.suggestion));
      } else {
        setNotes((prev) => (prev ? prev + "\n\n" + data.suggestion : data.suggestion));
      }
    }
    setAiLoading(false);
  };

  // Get hero image for pixelated background
  const heroImage = photos[0]?.imageUrl;

  return (
    <div className="animate-card-slide-in max-w-2xl w-full mx-auto">
      {/* Place Dialog */}
      {selectedPlace && (
        <PlaceDialog
          place={selectedPlace}
          city={destination.city}
          onClose={() => setSelectedPlace(null)}
        />
      )}

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

        {/* Hero section with pixelated background */}
        <div className="relative px-6 py-8 text-center border-b border-[#2a2a4a] overflow-hidden">
          {/* Pixelated background image */}
          {heroImage && (
            <>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  imageRendering: "pixelated",
                  filter: "brightness(0.3) contrast(1.3) saturate(0.7)",
                  transform: "scale(1.05)",
                }}
              />
              {/* Pixel grid overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: "4px 4px",
                }}
              />
            </>
          )}

          <div className="relative z-10">
            <h2 className="font-pixel text-lg sm:text-xl text-[#ffcc00] glow-golden mb-2">
              {destination.city}
            </h2>
            <p className="font-pixel text-[8px] text-gray-300">
              {destination.country} {destination.countryCode && `· ${destination.countryCode}`}
            </p>
            <p className="text-sm text-gray-200 mt-3 max-w-md mx-auto leading-relaxed drop-shadow-lg">
              {destination.description}
            </p>
          </div>
        </div>

        {/* Photo Gallery */}
        {photos.length > 1 && (
          <div className="px-6 pt-6">
            <h3 className="font-pixel text-[8px] text-[#ffcc00] mb-3 flex items-center gap-2">
              <PixelIcon name="star" size={12} color="#ffcc00" />
              GALLERY
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(0, 6).map((photo, i) => (
                photo.imageUrl && (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden border border-[#2a2a4a] relative group"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{
                        imageRendering: "auto",
                        filter: "saturate(0.85) contrast(1.1)",
                      }}
                    />
                    {/* Pixel overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(0,229,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,229,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: "3px 3px",
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-pixel text-[4px] text-white truncate">{photo.title}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

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

          {/* Fun Places - now clickable */}
          <div>
            <h3 className="font-pixel text-[8px] text-[#b8ff00] mb-3 flex items-center gap-2">
              <PixelIcon name="globe" size={12} color="#b8ff00" />
              FUN PLACES TO VISIT
            </h3>
            <ul className="space-y-2">
              {destination.funPlaces.map((place) => (
                <li key={place}>
                  <button
                    onClick={() => setSelectedPlace(place)}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#b8ff00] transition-colors group w-full text-left"
                  >
                    <span className="w-1.5 h-1.5 bg-[#b8ff00] flex-shrink-0 group-hover:shadow-[0_0_6px_#b8ff00]" />
                    <span className="group-hover:underline">{place}</span>
                    <span className="font-pixel text-[5px] text-gray-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      VIEW &gt;
                    </span>
                  </button>
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

          {/* Music - now with playback */}
          {music.length > 0 && (
            <div>
              <h3 className="font-pixel text-[8px] text-[#a855f7] mb-3 flex items-center gap-2">
                <PixelIcon name="disco" size={12} color="#a855f7" />
                MUSIC FOR THE JOURNEY
              </h3>
              <div className="space-y-2">
                {music.map((track) => {
                  const isPlaying = playingTrack === track.previewUrl;
                  return (
                    <div key={`${track.artist}-${track.album}`} className="flex items-center gap-3 p-2 rounded bg-[#1a1a2e]/50">
                      {/* Artwork thumbnail */}
                      <div className="relative w-10 h-10 rounded-sm flex-shrink-0 overflow-hidden bg-[#a855f7]/20 flex items-center justify-center">
                        {track.artworkUrl ? (
                          <img src={track.artworkUrl} alt={track.album} className="w-full h-full object-cover" />
                        ) : (
                          <PixelIcon name="disco" size={16} color="#a855f7" />
                        )}
                        {isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="flex gap-0.5">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-0.5 bg-[#a855f7] rounded-sm"
                                  style={{
                                    height: `${4 + Math.random() * 8}px`,
                                    animation: `float-star ${0.3 + Math.random() * 0.5}s ease-in-out infinite`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 truncate">{track.album}</p>
                        <p className="text-xs text-gray-500 truncate">{track.artist} · {track.genre}</p>
                      </div>
                      {/* Play/Pause button */}
                      {track.previewUrl ? (
                        <button
                          onClick={() => handlePlayTrack(track.previewUrl!)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 ${
                            isPlaying
                              ? "border-[#a855f7] bg-[#a855f7]/20 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                              : "border-[#4a4a6a] hover:border-[#a855f7] bg-transparent"
                          }`}
                        >
                          <span className="font-pixel text-[7px] text-[#a855f7]">
                            {isPlaying ? "II" : "\u25B6"}
                          </span>
                        </button>
                      ) : (
                        <span className="font-pixel text-[5px] text-gray-600 flex-shrink-0">
                          N/A
                        </span>
                      )}
                    </div>
                  );
                })}
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
                      {showNotes ? "HIDE NOTES" : "ADD NOTES & ITINERARY"}
                    </button>
                  )}
                </div>

                {showNotes && saved && (
                  <div className="space-y-4 bg-[#0a0a0a]/50 rounded-lg p-4 border border-[#2a2a4a]">
                    {/* AI Helper buttons */}
                    <div>
                      <p className="font-pixel text-[6px] text-[#a855f7] mb-2 flex items-center gap-1">
                        <PixelIcon name="star" size={8} color="#a855f7" />
                        AI TRAVEL ASSISTANT
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAiSuggestion("itinerary")}
                          disabled={aiLoading}
                          className="font-pixel text-[6px] px-3 py-1.5 border border-[#a855f7]/50 text-[#a855f7] rounded hover:bg-[#a855f7]/10 transition-colors disabled:opacity-50"
                        >
                          {aiLoading ? "THINKING..." : "SUGGEST ITINERARY"}
                        </button>
                        <button
                          onClick={() => handleAiSuggestion("notes")}
                          disabled={aiLoading}
                          className="font-pixel text-[6px] px-3 py-1.5 border border-[#a855f7]/50 text-[#a855f7] rounded hover:bg-[#a855f7]/10 transition-colors disabled:opacity-50"
                        >
                          SUGGEST NOTES
                        </button>
                        <button
                          onClick={() => handleAiSuggestion("tips")}
                          disabled={aiLoading}
                          className="font-pixel text-[6px] px-3 py-1.5 border border-[#a855f7]/50 text-[#a855f7] rounded hover:bg-[#a855f7]/10 transition-colors disabled:opacity-50"
                        >
                          TRAVEL TIPS
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="font-pixel text-[6px] text-gray-500 block mb-1">
                        TRAVEL NOTES
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => { setNotes(e.target.value); setNotesSaved(false); }}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a4a] rounded p-3 text-sm text-gray-200 focus:border-[#00e5ff] focus:outline-none resize-none"
                        rows={4}
                        placeholder="Your thoughts about this destination..."
                      />
                    </div>
                    <div>
                      <label className="font-pixel text-[6px] text-gray-500 block mb-1">
                        ITINERARY
                      </label>
                      <textarea
                        value={itinerary}
                        onChange={(e) => { setItinerary(e.target.value); setNotesSaved(false); }}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a4a] rounded p-3 text-sm text-gray-200 focus:border-[#00e5ff] focus:outline-none resize-none"
                        rows={6}
                        placeholder="Day 1: Arrive and explore..."
                      />
                    </div>
                    <button
                      onClick={handleSaveNotes}
                      className={`font-pixel text-[7px] px-4 py-2 rounded border transition-all ${
                        notesSaved
                          ? "border-[#b8ff00] text-[#b8ff00] bg-[#b8ff00]/10"
                          : "border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00]/10"
                      }`}
                    >
                      {notesSaved ? "SAVED!" : "SAVE NOTES & ITINERARY"}
                    </button>
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
