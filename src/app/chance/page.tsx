"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import DestinationCard from "@/components/DestinationCard";
import PixelIcon from "@/components/PixelIcon";
import { getRandomDestination, type Destination } from "@/lib/destinations";

type Phase = "idle" | "flipping" | "globe" | "preview" | "reveal";

function CoinFlip({ onComplete }: { onComplete: () => void }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const totalSpins = 8 + Math.floor(Math.random() * 4);
    const totalDeg = totalSpins * 360;
    let start: number | null = null;
    const duration = 2500;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRotation(eased * totalDeg);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 500);
      }
    }

    requestAnimationFrame(animate);
  }, [onComplete]);

  const showHeads = Math.floor(rotation / 180) % 2 === 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="font-pixel text-sm text-[#ffcc00] glow-golden">FLIPPING...</h2>
      <div className="relative w-32 h-32" style={{ perspective: "600px" }}>
        <div
          className="w-full h-full rounded-full border-4 border-[#ffcc00] flex items-center justify-center"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            background: showHeads
              ? "linear-gradient(135deg, #ffcc00 0%, #b8860b 100%)"
              : "linear-gradient(135deg, #b8860b 0%, #ffcc00 100%)",
            boxShadow: "0 0 30px rgba(255, 204, 0, 0.3)",
          }}
        >
          <span className="font-pixel text-2xl text-[#0a0a0a]" style={{ backfaceVisibility: "hidden" }}>
            {showHeads ? "GO" : "?"}
          </span>
        </div>
      </div>
    </div>
  );
}

function GlobeAnimation({ destination, onComplete }: { destination: Destination; onComplete: () => void }) {
  const [phase, setPhase] = useState<"clouds" | "globe" | "zoom">("clouds");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("globe"), 1500);
    const timer2 = setTimeout(() => setPhase("zoom"), 3500);
    const timer3 = setTimeout(onComplete, 5000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {phase === "clouds" && (
        <div className="relative w-64 h-64 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gray-400/30 rounded-full"
              style={{
                width: `${60 + Math.random() * 80}px`,
                height: `${30 + Math.random() * 40}px`,
                left: `${Math.random() * 60}%`,
                top: `${Math.random() * 60}%`,
                animation: `clouds-disperse 1.5s ease-out ${i * 0.2}s forwards`,
              }}
            />
          ))}
          <p className="font-pixel text-[8px] text-gray-400 animate-blink z-10">CLEARING SKIES...</p>
        </div>
      )}
      {phase === "globe" && (
        <div className="relative w-64 h-64 flex items-center justify-center" style={{ animation: "globe-zoom 2s ease-out forwards" }}>
          <div className="w-48 h-48 rounded-full border-2 border-[#00e5ff] bg-[#0a0a2e] relative overflow-hidden">
            <div className="absolute top-6 left-8 w-12 h-8 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute top-10 left-24 w-16 h-12 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute top-24 left-12 w-10 h-14 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute top-16 right-4 w-14 h-10 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute bottom-8 left-4 w-20 h-6 bg-[#2d5a27] rounded-sm opacity-60" />
            <div
              className="absolute w-3 h-3 bg-[#ff6ec7] rounded-full z-10"
              style={{
                top: `${50 - (destination.lat / 180) * 100}%`,
                left: `${50 + (destination.lon / 360) * 100}%`,
                boxShadow: "0 0 10px #ff6ec7, 0 0 20px #ff6ec7",
                animation: "float-star 1s ease-in-out infinite",
              }}
            />
            <div className="absolute inset-0 border border-[#00e5ff]/10 rounded-full" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#00e5ff]/10" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#00e5ff]/10" />
          </div>
          <p className="absolute -bottom-8 font-pixel text-[8px] text-[#00e5ff]">
            NAVIGATING TO {destination.city.toUpperCase()}...
          </p>
        </div>
      )}
      {phase === "zoom" && (
        <div className="flex flex-col items-center gap-4">
          <div className="font-pixel text-lg text-[#ffcc00] glow-golden" style={{ animation: "globe-zoom 1s ease-out forwards" }}>
            {destination.city.toUpperCase()}
          </div>
          <p className="font-pixel text-[8px] text-gray-400 animate-blink">LOADING DESTINATION...</p>
        </div>
      )}
    </div>
  );
}

// Pokemon-card-style preview
function PreviewCard({
  destination,
  onLike,
  onSkip,
}: {
  destination: Destination;
  onLike: () => void;
  onSkip: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(true);
    fetch(`/api/photos?q=${encodeURIComponent(destination.city + " " + destination.country)}&count=1`)
      .then((r) => r.json())
      .then((data) => {
        if (data.photos?.[0]?.imageUrl) setImageUrl(data.photos[0].imageUrl);
      })
      .catch(() => {});
  }, [destination]);

  // Type colors based on region
  const typeColors: Record<string, { bg: string; border: string; badge: string }> = {
    Asia: { bg: "from-red-900/30 to-orange-900/30", border: "#ef4444", badge: "bg-red-600" },
    Europe: { bg: "from-blue-900/30 to-indigo-900/30", border: "#3b82f6", badge: "bg-blue-600" },
    "North America": { bg: "from-green-900/30 to-emerald-900/30", border: "#22c55e", badge: "bg-green-600" },
    "South America": { bg: "from-yellow-900/30 to-amber-900/30", border: "#eab308", badge: "bg-yellow-600" },
    Africa: { bg: "from-orange-900/30 to-amber-900/30", border: "#f97316", badge: "bg-orange-600" },
    Oceania: { bg: "from-cyan-900/30 to-teal-900/30", border: "#06b6d4", badge: "bg-cyan-600" },
  };
  const tc = typeColors[destination.region] || typeColors.Europe;

  return (
    <div
      className={`transition-all duration-500 ${entered ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
    >
      <div
        className="w-72 mx-auto rounded-xl overflow-hidden"
        style={{
          border: `3px solid ${tc.border}`,
          boxShadow: `0 0 30px ${tc.border}40, inset 0 0 30px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Card top - name & type */}
        <div className={`bg-gradient-to-r ${tc.bg} px-4 py-3 flex items-center justify-between border-b border-[#2a2a4a]`}>
          <h3 className="font-pixel text-[10px] text-white">{destination.city.toUpperCase()}</h3>
          <span className={`font-pixel text-[5px] text-white px-2 py-0.5 rounded ${tc.badge}`}>
            {destination.region.toUpperCase()}
          </span>
        </div>

        {/* Card image area */}
        <div className="relative h-40 bg-[#1a1a2e] overflow-hidden">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={destination.city}
                className="w-full h-full object-cover"
                style={{
                  imageRendering: "pixelated",
                  filter: "contrast(1.2) saturate(0.8)",
                  transform: "scale(1.1)",
                }}
              />
              {/* Pixel grid overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "3px 3px",
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PixelIcon name="globe" size={64} color="#2a2a4a" />
            </div>
          )}

          {/* Holographic shine effect */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
            }}
          />
        </div>

        {/* Card stats */}
        <div className="bg-[#0a0a1a] p-4 space-y-3">
          <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
            {destination.description}
          </p>

          {/* Stats bar */}
          <div className="flex gap-4">
            <div>
              <p className="font-pixel text-[5px] text-gray-500">COUNTRY</p>
              <p className="font-pixel text-[7px] text-gray-300">{destination.country}</p>
            </div>
            <div>
              <p className="font-pixel text-[5px] text-gray-500">PLACES</p>
              <p className="font-pixel text-[7px] text-gray-300">{destination.funPlaces.length}</p>
            </div>
            <div>
              <p className="font-pixel text-[5px] text-gray-500">MOODS</p>
              <p className="font-pixel text-[7px] text-gray-300">{destination.moods.length}</p>
            </div>
          </div>

          {/* Mood tags */}
          <div className="flex flex-wrap gap-1">
            {destination.moods.slice(0, 3).map((mood) => (
              <span
                key={mood}
                className="font-pixel text-[5px] px-2 py-0.5 rounded border border-[#2a2a4a] text-gray-400"
              >
                {mood.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-[#0a0a1a] px-4 pb-4 flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 font-pixel text-[8px] py-3 rounded border-2 border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
          >
            SKIP &gt;&gt;
          </button>
          <button
            onClick={onLike}
            className="flex-1 font-pixel text-[8px] py-3 rounded border-2 text-[#b8ff00] hover:bg-[#b8ff00]/10 transition-all active:scale-95"
            style={{
              borderColor: "#b8ff00",
              boxShadow: "0 0 10px rgba(184, 255, 0, 0.2)",
            }}
          >
            I LIKE IT!
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChancePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [destination, setDestination] = useState<Destination | null>(null);

  const startRoll = () => {
    setDestination(getRandomDestination());
    setPhase("flipping");
  };

  const reroll = () => {
    setPhase("idle");
    setDestination(null);
  };

  const skipPreview = () => {
    // Pick a new random destination and go back to coin flip
    setDestination(getRandomDestination());
    setPhase("flipping");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8">
        {phase === "idle" && (
          <div className="flex flex-col items-center gap-8">
            <h1 className="font-pixel text-lg text-[#00e5ff] glow-cyan text-center">
              ROLL THE DICE
            </h1>
            <p className="text-sm text-gray-400 text-center max-w-md">
              Leave your destination to fate. Flip the coin and discover where
              your next adventure awaits.
            </p>
            <button
              onClick={startRoll}
              className="font-pixel text-sm px-8 py-4 border-2 border-[#ffcc00] text-[#ffcc00] rounded-lg hover:bg-[#ffcc00]/10 transition-all hover:scale-105 active:scale-95"
              style={{ boxShadow: "0 0 20px rgba(255, 204, 0, 0.2)" }}
            >
              FLIP COIN
            </button>
            <p className="font-pixel text-[6px] text-gray-600 animate-blink">PRESS TO BEGIN</p>
          </div>
        )}

        {phase === "flipping" && (
          <CoinFlip onComplete={() => setPhase("globe")} />
        )}

        {phase === "globe" && destination && (
          <GlobeAnimation destination={destination} onComplete={() => setPhase("preview")} />
        )}

        {phase === "preview" && destination && (
          <div className="flex flex-col items-center gap-6">
            <p className="font-pixel text-[8px] text-gray-400">YOUR DESTINATION AWAITS...</p>
            <PreviewCard
              destination={destination}
              onLike={() => setPhase("reveal")}
              onSkip={skipPreview}
            />
          </div>
        )}

        {phase === "reveal" && destination && (
          <div className="w-full max-w-2xl space-y-6">
            <DestinationCard destination={destination} onBack={reroll} />
            <div className="text-center">
              <button
                onClick={reroll}
                className="font-pixel text-[8px] px-4 py-2 text-gray-400 hover:text-[#00e5ff] transition-colors"
              >
                ROLL AGAIN?
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
