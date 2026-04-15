"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Header from "@/components/Header";
import PixelIcon from "@/components/PixelIcon";
import PixelBackground from "@/components/PixelBackground";

const modules = [
  {
    href: "/chance",
    title: "ROLL THE DICE",
    subtitle: "Destination by chance",
    icon: "dice",
    color: "#00e5ff",
    glowClass: "glow-cyan",
  },
  {
    href: "/mood",
    title: "FOLLOW YOUR MOOD",
    subtitle: "Choose by feeling",
    icon: "mood",
    color: "#b8ff00",
    glowClass: "glow-green",
  },
  {
    href: "/popular",
    title: "POPULAR QUESTS",
    subtitle: "Top destinations",
    icon: "trophy",
    color: "#ffcc00",
    glowClass: "glow-golden",
  },
  {
    href: "/saved",
    title: "MY DESTINATIONS",
    subtitle: "Saved adventures",
    icon: "bookmark",
    color: "#ff6ec7",
    glowClass: "",
    requiresAuth: true,
  },
];

// FloatingStars removed — replaced by PixelBackground

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col relative">
      <PixelBackground />
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-pixel text-2xl sm:text-4xl text-[#00e5ff] glow-cyan mb-4">
            WANDERQUEST
          </h1>
          <p className="font-pixel text-[8px] sm:text-[10px] text-gray-400 tracking-widest">
            YOUR RETRO TRAVEL ADVENTURE
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-2 h-[2px] bg-[#2a2a4a]" />
            ))}
          </div>
        </div>

        {/* 4 Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
          {modules.map((mod) => {
            const isLocked = mod.requiresAuth && !isSignedIn;
            return (
              <Link
                key={mod.href}
                href={isLocked ? "/sign-in" : mod.href}
                className="retro-card p-6 flex flex-col items-center gap-4 group cursor-pointer relative overflow-hidden"
                style={{
                  borderColor: `${mod.color}33`,
                }}
              >
                {/* Background glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${mod.color}08 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 flex flex-col items-center gap-4">
                  <PixelIcon name={mod.icon} size={48} color={mod.color} />
                  <h2
                    className="font-pixel text-[10px] sm:text-xs text-center"
                    style={{ color: mod.color }}
                  >
                    {mod.title}
                  </h2>
                  <p className="text-xs text-gray-500 text-center">
                    {isLocked ? "Sign in required" : mod.subtitle}
                  </p>
                </div>

                {isLocked && (
                  <div className="absolute top-3 right-3">
                    <span className="font-pixel text-[6px] text-gray-600">LOCKED</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom decoration */}
        <div className="mt-12 flex items-center gap-2">
          <div className="w-16 h-[1px] bg-[#2a2a4a]" />
          <PixelIcon name="globe" size={16} color="#2a2a4a" />
          <div className="w-16 h-[1px] bg-[#2a2a4a]" />
        </div>
        <p className="font-pixel text-[6px] text-gray-600 mt-2">
          INSERT COIN TO BEGIN
        </p>
      </main>
    </div>
  );
}
