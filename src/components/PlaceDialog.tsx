"use client";

import { useEffect, useState } from "react";

interface PlaceDialogProps {
  place: string;
  city: string;
  onClose: () => void;
}

interface PhotoResult {
  title: string;
  extract: string;
  imageUrl: string | null;
}

export default function PlaceDialog({ place, city, onClose }: PlaceDialogProps) {
  const [photos, setPhotos] = useState<PhotoResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/photos?q=${encodeURIComponent(place)}&city=${encodeURIComponent(city)}&count=4`)
      .then((r) => r.json())
      .then((data) => setPhotos(data.photos || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [place, city]);

  const info = photos[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog - Game UI style (Image 5 reference) */}
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hazard stripe top bar */}
        <div className="h-3 bg-repeating-linear rounded-t-lg overflow-hidden"
          style={{
            background: "repeating-linear-gradient(45deg, #ffcc00, #ffcc00 10px, #1a1a2e 10px, #1a1a2e 20px)",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-md flex items-center justify-center font-pixel text-[8px] text-white hover:bg-red-500 transition-colors z-10 border-2 border-red-800"
        >
          X
        </button>

        {/* Main content area */}
        <div className="bg-[#f5f0e8] border-2 border-[#2a2a4a] p-5 text-[#1a1a2e]">
          {/* Header with icon */}
          <div className="flex items-start gap-4 mb-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 bg-[#2a2a4a] rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
              {info?.imageUrl ? (
                <img
                  src={info.imageUrl}
                  alt={place}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "auto" }}
                />
              ) : (
                <div className="w-8 h-8 bg-[#4a4a6a] rounded" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-pixel text-[10px] text-[#1a1a2e] mb-1 leading-relaxed">
                {place.toUpperCase()}
              </h3>
              <p className="text-xs text-[#4a4a6a] leading-relaxed">
                {loading
                  ? "Loading info..."
                  : info?.extract || `A must-visit attraction in ${city}.`}
              </p>
            </div>
          </div>

          {/* Photo gallery */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {photos.map((photo, i) => (
                photo.imageUrl && (
                  <div
                    key={i}
                    className="aspect-square rounded overflow-hidden border border-[#2a2a4a]/20"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const parent = (e.target as HTMLElement).closest(".aspect-square");
                        if (parent) (parent as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="font-pixel text-[7px] text-[#4a4a6a] animate-blink">
                LOADING DATA...
              </div>
            </div>
          )}
        </div>

        {/* Bottom buttons bar */}
        <div className="bg-[#e8e0d0] border-2 border-t-0 border-[#2a2a4a] rounded-b-lg p-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="font-pixel text-[8px] px-6 py-2 bg-[#f5f0e8] border-2 border-[#2a2a4a] text-[#1a1a2e] rounded hover:bg-[#e8e0d0] transition-colors active:translate-y-px"
          >
            CLOSE
          </button>
        </div>

        {/* Hazard stripe bottom */}
        <div className="h-1.5 overflow-hidden rounded-b-lg"
          style={{
            background: "repeating-linear-gradient(45deg, #ffcc00, #ffcc00 10px, #1a1a2e 10px, #1a1a2e 20px)",
          }}
        />
      </div>
    </div>
  );
}
