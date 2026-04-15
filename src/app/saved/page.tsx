"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import PixelIcon from "@/components/PixelIcon";

interface SavedDestination {
  id: string;
  slug: string;
  city: string;
  country: string;
  country_code: string;
  notes: string;
  itinerary: string;
  saved_at: string;
}

// Background scenes per destination vibe
const sceneColors: Record<string, { bg: string; accent: string }> = {
  JP: { bg: "from-pink-900/40 to-purple-900/40", accent: "#ff6ec7" },
  FR: { bg: "from-blue-900/40 to-indigo-900/40", accent: "#60a5fa" },
  IT: { bg: "from-amber-900/40 to-orange-900/40", accent: "#f59e0b" },
  ID: { bg: "from-green-900/40 to-teal-900/40", accent: "#10b981" },
  US: { bg: "from-red-900/40 to-blue-900/40", accent: "#ef4444" },
  GB: { bg: "from-gray-800/40 to-blue-900/40", accent: "#9ca3af" },
  BR: { bg: "from-green-900/40 to-yellow-900/40", accent: "#22c55e" },
  IS: { bg: "from-blue-900/40 to-cyan-900/40", accent: "#06b6d4" },
  TH: { bg: "from-yellow-900/40 to-orange-900/40", accent: "#eab308" },
  AU: { bg: "from-orange-900/40 to-yellow-900/40", accent: "#f97316" },
  default: { bg: "from-indigo-900/40 to-purple-900/40", accent: "#a855f7" },
};

function getScene(countryCode: string) {
  return sceneColors[countryCode] || sceneColors.default;
}

export default function SavedPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [destinations, setDestinations] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [editingItinerary, setEditingItinerary] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        setDestinations(data.destinations || []);
        // Initialize editing state
        const notes: Record<string, string> = {};
        const itin: Record<string, string> = {};
        (data.destinations || []).forEach((d: SavedDestination) => {
          notes[d.id] = d.notes || "";
          itin[d.id] = d.itinerary || "";
        });
        setEditingNotes(notes);
        setEditingItinerary(itin);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/saved?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleSaveNotes = async (id: string) => {
    await fetch("/api/saved", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        notes: editingNotes[id] || "",
        itinerary: editingItinerary[id] || "",
      }),
    });
  };

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <PixelIcon name="bookmark" size={64} color="#2a2a4a" />
          <p className="font-pixel text-[10px] text-gray-500 mt-4">
            SIGN IN TO VIEW SAVED DESTINATIONS
          </p>
          <Link
            href="/sign-in"
            className="font-pixel text-[8px] text-[#00e5ff] mt-4 hover:underline"
          >
            LOG IN &gt;
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-lg text-[#ff6ec7] mb-3" style={{ textShadow: "0 0 10px #ff6ec7" }}>
            MY DESTINATIONS
          </h1>
          <p className="text-sm text-gray-400">
            {destinations.length} saved adventure{destinations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="retro-card aspect-square animate-pulse">
                <div className="h-full bg-[#2a2a4a] rounded-lg" />
              </div>
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <PixelIcon name="globe" size={64} color="#2a2a4a" />
            <p className="font-pixel text-[8px] text-gray-500">NO SAVED DESTINATIONS YET</p>
            <Link
              href="/chance"
              className="font-pixel text-[8px] text-[#00e5ff] hover:underline"
            >
              START EXPLORING &gt;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full">
            {destinations.map((dest) => {
              const scene = getScene(dest.country_code);
              const isExpanded = expandedId === dest.id;

              return (
                <div key={dest.id} className={`${isExpanded ? "col-span-2 sm:col-span-3" : ""}`}>
                  <div
                    className={`retro-card overflow-hidden cursor-pointer transition-all ${
                      isExpanded ? "" : "aspect-square"
                    }`}
                    style={{ borderColor: `${scene.accent}33` }}
                    onClick={() => setExpandedId(isExpanded ? null : dest.id)}
                  >
                    {/* Card face - Image 4 style */}
                    <div className={`bg-gradient-to-br ${scene.bg} p-4 ${isExpanded ? "" : "h-full"} flex flex-col justify-between relative`}>
                      {/* Pixel decorations */}
                      <div className="absolute top-2 right-2 opacity-20">
                        <PixelIcon name="globe" size={24} color={scene.accent} />
                      </div>

                      <div>
                        <h3
                          className="font-pixel text-sm sm:text-base leading-relaxed"
                          style={{ color: scene.accent }}
                        >
                          {dest.city.toUpperCase()}
                        </h3>
                        <p className="font-pixel text-[6px] text-gray-400 mt-1">
                          {dest.country}
                        </p>
                      </div>

                      {!isExpanded && (
                        <p className="font-pixel text-[5px] text-gray-600 mt-auto">
                          {new Date(dest.saved_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <Link
                            href={`/destination/${dest.slug}`}
                            className="font-pixel text-[7px] px-3 py-1.5 border border-[#00e5ff] text-[#00e5ff] rounded hover:bg-[#00e5ff]/10 transition-colors"
                          >
                            VIEW DETAILS
                          </Link>
                          <button
                            onClick={() => handleDelete(dest.id)}
                            className="font-pixel text-[7px] px-3 py-1.5 border border-red-600 text-red-500 rounded hover:bg-red-600/10 transition-colors"
                          >
                            REMOVE
                          </button>
                        </div>

                        <div>
                          <label className="font-pixel text-[6px] text-gray-500 block mb-1">
                            NOTES
                          </label>
                          <textarea
                            value={editingNotes[dest.id] || ""}
                            onChange={(e) =>
                              setEditingNotes((prev) => ({ ...prev, [dest.id]: e.target.value }))
                            }
                            className="w-full bg-[#0a0a0a] border border-[#2a2a4a] rounded p-2 text-sm text-gray-200 focus:border-[#00e5ff] focus:outline-none resize-none"
                            rows={2}
                            placeholder="Your notes..."
                          />
                        </div>

                        <div>
                          <label className="font-pixel text-[6px] text-gray-500 block mb-1">
                            ITINERARY
                          </label>
                          <textarea
                            value={editingItinerary[dest.id] || ""}
                            onChange={(e) =>
                              setEditingItinerary((prev) => ({ ...prev, [dest.id]: e.target.value }))
                            }
                            className="w-full bg-[#0a0a0a] border border-[#2a2a4a] rounded p-2 text-sm text-gray-200 focus:border-[#00e5ff] focus:outline-none resize-none"
                            rows={2}
                            placeholder="Day 1: ..."
                          />
                        </div>

                        <button
                          onClick={() => handleSaveNotes(dest.id)}
                          className="font-pixel text-[7px] px-3 py-1.5 border border-[#b8ff00] text-[#b8ff00] rounded hover:bg-[#b8ff00]/10 transition-colors"
                        >
                          SAVE NOTES
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-pixel text-[8px] text-gray-500 hover:text-[#00e5ff] transition-colors"
          >
            &lt; BACK TO HOME
          </Link>
        </div>
      </main>
    </div>
  );
}
