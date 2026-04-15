"use client";

import { useState } from "react";
import Header from "@/components/Header";
import DestinationCard from "@/components/DestinationCard";
import PixelIcon from "@/components/PixelIcon";
import PixelBackground from "@/components/PixelBackground";
import { MOODS, getDestinationsByMood, type Destination, type MoodId } from "@/lib/destinations";

const moodColors: Record<string, string> = {
  adventurous: "#ff6ec7",
  relaxed: "#00e5ff",
  cultural: "#ffcc00",
  romantic: "#ff6ec7",
  foodie: "#b8ff00",
  nature: "#2d5a27",
  party: "#a855f7",
  spiritual: "#ffcc00",
  happy: "#ffcc00",
  sad: "#60a5fa",
  excited: "#ff6ec7",
  curious: "#00e5ff",
};

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleMoodSelect = async (moodId: MoodId) => {
    setSelectedMood(moodId);
    setAnalyzing(true);

    // Simulate analysis animation
    await new Promise((r) => setTimeout(r, 2000));

    const matches = getDestinationsByMood(moodId);
    // Pick a random from top matches for variety
    const topMatches = matches.slice(0, Math.min(5, matches.length));
    const picked = topMatches[Math.floor(Math.random() * topMatches.length)];

    setDestination(picked);
    setAnalyzing(false);
  };

  const reset = () => {
    setSelectedMood(null);
    setDestination(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PixelBackground />
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 pt-20 pb-8 relative z-10">
        {!destination && !analyzing && (
          <>
            <div className="text-center mb-8">
              <h1 className="font-pixel text-lg text-[#b8ff00] glow-green mb-3">
                FOLLOW YOUR MOOD
              </h1>
              <p className="text-sm text-gray-400 max-w-md">
                How are you feeling? Select your mood and we&apos;ll find the
                perfect destination to match your vibe.
              </p>
            </div>

            {/* Mood Grid - Image 3 style: dark rounded tiles */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg w-full">
              {MOODS.map((mood) => {
                const color = moodColors[mood.id] || "#00e5ff";
                const isActive = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`retro-card aspect-square flex flex-col items-center justify-center gap-2 p-3 transition-all hover:scale-105 active:scale-95 ${
                      isActive ? "ring-2" : ""
                    }`}
                    style={{
                      borderColor: isActive ? color : undefined,
                      boxShadow: isActive ? `0 0 15px ${color}40` : undefined,
                    }}
                  >
                    <PixelIcon name={mood.emoji} size={28} color={color} />
                    <span
                      className="font-pixel text-[5px] sm:text-[6px]"
                      style={{ color }}
                    >
                      {mood.label.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-2">
              <div className="w-8 h-[1px] bg-[#2a2a4a]" />
              <span className="font-pixel text-[6px] text-gray-600">
                TAP A MOOD TO BEGIN
              </span>
              <div className="w-8 h-[1px] bg-[#2a2a4a]" />
            </div>
          </>
        )}

        {analyzing && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              {/* Scanning animation */}
              <div className="w-32 h-32 border-2 border-[#b8ff00] rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: "3s" }}>
                <div className="w-24 h-24 border border-[#b8ff00]/30 rounded-full flex items-center justify-center">
                  <PixelIcon
                    name={MOODS.find((m) => m.id === selectedMood)?.emoji || "smile"}
                    size={40}
                    color={moodColors[selectedMood || "happy"]}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-pixel text-[10px] text-[#b8ff00] glow-green mb-2">
                ANALYZING MOOD...
              </p>
              <p className="font-pixel text-[6px] text-gray-500 animate-blink">
                MATCHING DESTINATION
              </p>
            </div>
          </div>
        )}

        {destination && !analyzing && (
          <div className="w-full max-w-2xl space-y-6 mt-4">
            <div className="text-center">
              <p className="font-pixel text-[8px] text-gray-400">
                MOOD: <span style={{ color: moodColors[selectedMood || "happy"] }}>
                  {selectedMood?.toUpperCase()}
                </span> → PERFECT MATCH
              </p>
            </div>
            <DestinationCard destination={destination} onBack={reset} />
            <div className="text-center">
              <button
                onClick={reset}
                className="font-pixel text-[8px] px-4 py-2 text-gray-400 hover:text-[#b8ff00] transition-colors"
              >
                TRY ANOTHER MOOD?
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
