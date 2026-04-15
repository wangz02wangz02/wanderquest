"use client";

import { useEffect, useState } from "react";

// Floating stars + pixel spaceship + pixel earth on a deep blue background

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  brightness: number;
}

export default function PixelBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        brightness: 0.3 + Math.random() * 0.7,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep blue gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, #0d1b3e 0%, #0a1228 50%, #060d1a 100%)",
        }}
      />

      {/* Floating stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.id % 7 === 0 ? "#a0d4ff" : star.id % 11 === 0 ? "#ffe4a0" : "#ffffff",
            opacity: star.brightness,
            animation: `float-star ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Pixel Earth — bottom right area */}
      <div className="absolute bottom-[12%] right-[8%] opacity-[0.12]">
        <svg width="120" height="120" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }}>
          {/* Ocean */}
          <circle cx="12" cy="12" r="11" fill="#1a4a8a" />
          {/* Continents - pixel blocks */}
          <rect x="6" y="4" width="3" height="2" fill="#2d7a4a" rx="0.5" />
          <rect x="10" y="3" width="4" height="3" fill="#2d7a4a" rx="0.5" />
          <rect x="14" y="5" width="3" height="4" fill="#2d7a4a" rx="0.5" />
          <rect x="5" y="7" width="2" height="4" fill="#2d7a4a" rx="0.5" />
          <rect x="8" y="8" width="3" height="2" fill="#2d7a4a" rx="0.5" />
          <rect x="7" y="13" width="2" height="3" fill="#2d7a4a" rx="0.5" />
          <rect x="10" y="12" width="4" height="2" fill="#2d7a4a" rx="0.5" />
          <rect x="15" y="11" width="3" height="3" fill="#2d7a4a" rx="0.5" />
          <rect x="4" y="15" width="3" height="2" fill="#2d7a4a" rx="0.5" />
          {/* Ice caps */}
          <rect x="9" y="2" width="4" height="1" fill="#c8e8ff" rx="0.5" />
          <rect x="10" y="20" width="3" height="1" fill="#c8e8ff" rx="0.5" />
          {/* Atmosphere glow */}
          <circle cx="12" cy="12" r="11" fill="none" stroke="#4a9aff" strokeWidth="0.5" opacity="0.4" />
        </svg>
      </div>

      {/* Pixel Spaceship — top left, slowly drifting */}
      <div
        className="absolute top-[18%] left-[6%] opacity-[0.10]"
        style={{
          animation: "float-star 8s ease-in-out infinite",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }}>
          {/* Ship body */}
          <rect x="7" y="1" width="2" height="2" fill="#e0e0e0" />
          <rect x="6" y="3" width="4" height="2" fill="#c0c0c0" />
          <rect x="5" y="5" width="6" height="3" fill="#a0a0a0" />
          <rect x="6" y="8" width="4" height="2" fill="#c0c0c0" />
          {/* Wings */}
          <rect x="2" y="7" width="3" height="2" fill="#8080a0" />
          <rect x="11" y="7" width="3" height="2" fill="#8080a0" />
          {/* Engine glow */}
          <rect x="6" y="10" width="1" height="2" fill="#00e5ff" opacity="0.8" />
          <rect x="9" y="10" width="1" height="2" fill="#00e5ff" opacity="0.8" />
          <rect x="7" y="10" width="2" height="3" fill="#00aaff" opacity="0.5" />
        </svg>
      </div>

      {/* Small shooting star — top right */}
      <div
        className="absolute top-[10%] right-[20%] opacity-[0.06]"
        style={{
          width: "30px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #ffffff)",
          transform: "rotate(-30deg)",
          animation: "float-star 6s ease-in-out 2s infinite",
        }}
      />

      {/* Another small shooting star */}
      <div
        className="absolute top-[35%] right-[45%] opacity-[0.04]"
        style={{
          width: "20px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #a0d4ff)",
          transform: "rotate(-25deg)",
          animation: "float-star 7s ease-in-out 4s infinite",
        }}
      />

      {/* Tiny pixel moon — upper right */}
      <div className="absolute top-[8%] right-[12%] opacity-[0.08]">
        <svg width="24" height="24" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }}>
          <circle cx="6" cy="6" r="5" fill="#d4c896" />
          <circle cx="4" cy="4" r="1" fill="#b8a878" />
          <circle cx="7" cy="6" r="1.5" fill="#b8a878" />
          <circle cx="5" cy="8" r="0.8" fill="#c4b488" />
        </svg>
      </div>
    </div>
  );
}
