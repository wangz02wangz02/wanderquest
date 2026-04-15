"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PixelIcon from "@/components/PixelIcon";
import { destinations, popularDestinations, getDestinationBySlug } from "@/lib/destinations";

export default function PopularPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Get popular destinations data
  const popularList = popularDestinations
    .map((slug) => getDestinationBySlug(slug))
    .filter(Boolean);

  // Search across all destinations
  const searchResults = searchQuery.trim()
    ? destinations.filter(
        (d) =>
          d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const displayList = searchResults || popularList;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 pt-20 pb-8">
        <div className="text-center mb-6">
          <h1 className="font-pixel text-lg text-[#ffcc00] glow-golden mb-3">
            {searchResults ? "SEARCH RESULTS" : "POPULAR QUESTS"}
          </h1>
          <p className="text-sm text-gray-400 max-w-md">
            {searchResults
              ? `Found ${searchResults.length} destination${searchResults.length !== 1 ? "s" : ""}`
              : "The world's most beloved destinations, ranked for adventurers."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-lg mb-8">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <PixelIcon name="magnify" size={16} color="#9ca3af" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities, countries, regions..."
              className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-[#ffcc00] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-[6px] text-gray-500 hover:text-[#ffcc00]"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="w-full max-w-lg space-y-2">
          {displayList.map((dest, index) => {
            if (!dest) return null;
            const rank = searchResults ? index + 1 : index + 1;
            const colors = ["#ffcc00", "#c0c0c0", "#cd7f32"];
            const rankColor = !searchResults && index < 3 ? colors[index] : "#4a4a6a";

            return (
              <Link
                key={dest.slug}
                href={`/destination/${dest.slug}`}
                className="retro-card flex items-center gap-4 p-4 group"
              >
                {/* Rank */}
                <div
                  className="font-pixel text-sm w-8 text-center flex-shrink-0"
                  style={{ color: rankColor }}
                >
                  {String(rank).padStart(2, "0")}
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#2a2a4a]" />

                {/* Destination info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-pixel text-[9px] text-gray-200 group-hover:text-[#ffcc00] transition-colors truncate">
                    {dest.city.toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {dest.country} · {dest.region}
                  </p>
                </div>

                {/* Arrow */}
                <span className="font-pixel text-[8px] text-gray-600 group-hover:text-[#ffcc00] transition-colors flex-shrink-0">
                  &gt;
                </span>
              </Link>
            );
          })}

          {searchResults && searchResults.length === 0 && (
            <div className="text-center py-12">
              <PixelIcon name="magnify" size={48} color="#2a2a4a" />
              <p className="font-pixel text-[8px] text-gray-500 mt-4">
                NO DESTINATIONS FOUND
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        {/* Bottom */}
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
