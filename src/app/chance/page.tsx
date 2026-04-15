"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import DestinationCard from "@/components/DestinationCard";
import { getRandomDestination, type Destination } from "@/lib/destinations";

type Phase = "idle" | "flipping" | "globe" | "reveal";

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
      // Ease out cubic
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
      <div
        className="relative w-32 h-32"
        style={{
          perspective: "600px",
        }}
      >
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
          <span
            className="font-pixel text-2xl text-[#0a0a0a]"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
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
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {/* Clouds */}
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
          <p className="font-pixel text-[8px] text-gray-400 animate-blink z-10">
            CLEARING SKIES...
          </p>
        </div>
      )}

      {/* Globe */}
      {phase === "globe" && (
        <div className="relative w-64 h-64 flex items-center justify-center" style={{ animation: "globe-zoom 2s ease-out forwards" }}>
          {/* Pixel globe */}
          <div className="w-48 h-48 rounded-full border-2 border-[#00e5ff] bg-[#0a0a2e] relative overflow-hidden">
            {/* Continents as pixel blocks */}
            <div className="absolute top-6 left-8 w-12 h-8 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute top-10 left-24 w-16 h-12 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute top-24 left-12 w-10 h-14 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute top-16 right-4 w-14 h-10 bg-[#2d5a27] rounded-sm opacity-60" />
            <div className="absolute bottom-8 left-4 w-20 h-6 bg-[#2d5a27] rounded-sm opacity-60" />

            {/* Destination ping */}
            <div
              className="absolute w-3 h-3 bg-[#ff6ec7] rounded-full z-10"
              style={{
                top: `${50 - (destination.lat / 180) * 100}%`,
                left: `${50 + (destination.lon / 360) * 100}%`,
                boxShadow: "0 0 10px #ff6ec7, 0 0 20px #ff6ec7",
                animation: "float-star 1s ease-in-out infinite",
              }}
            />

            {/* Grid lines */}
            <div className="absolute inset-0 border border-[#00e5ff]/10 rounded-full" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#00e5ff]/10" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#00e5ff]/10" />
          </div>

          <p className="absolute -bottom-8 font-pixel text-[8px] text-[#00e5ff]">
            NAVIGATING TO {destination.city.toUpperCase()}...
          </p>
        </div>
      )}

      {/* Zoom */}
      {phase === "zoom" && (
        <div className="flex flex-col items-center gap-4">
          <div
            className="font-pixel text-lg text-[#ffcc00] glow-golden"
            style={{ animation: "globe-zoom 1s ease-out forwards" }}
          >
            {destination.city.toUpperCase()}
          </div>
          <p className="font-pixel text-[8px] text-gray-400 animate-blink">
            LOADING DESTINATION...
          </p>
        </div>
      )}
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
              style={{
                boxShadow: "0 0 20px rgba(255, 204, 0, 0.2)",
              }}
            >
              FLIP COIN
            </button>
            <p className="font-pixel text-[6px] text-gray-600 animate-blink">
              PRESS TO BEGIN
            </p>
          </div>
        )}

        {phase === "flipping" && (
          <CoinFlip onComplete={() => setPhase("globe")} />
        )}

        {phase === "globe" && destination && (
          <GlobeAnimation
            destination={destination}
            onComplete={() => setPhase("reveal")}
          />
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
