"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DestinationCard from "@/components/DestinationCard";
import PixelBackground from "@/components/PixelBackground";
import { getDestinationBySlug } from "@/lib/destinations";
import PixelIcon from "@/components/PixelIcon";

export default function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <PixelBackground />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          <PixelIcon name="magnify" size={64} color="#2a2a4a" />
          <p className="font-pixel text-sm text-gray-500 mt-4">
            DESTINATION NOT FOUND
          </p>
          <button
            onClick={() => router.push("/")}
            className="font-pixel text-[8px] text-[#00e5ff] mt-4 hover:underline"
          >
            RETURN HOME &gt;
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PixelBackground />
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 pt-20 pb-8 relative z-10">
        <DestinationCard
          destination={destination}
          onBack={() => router.back()}
        />
      </main>
    </div>
  );
}
