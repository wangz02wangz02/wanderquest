"use client";

// Pixel art landscape background inspired by retro game overworlds
// Floating island with trees, mountains, clouds — all rendered as CSS/SVG

export default function PixelBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0b1628 0%, #132244 30%, #1a3366 60%, #0b1628 100%)",
        }}
      />

      {/* Stars layer — subtle, behind everything */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 60 }, (_, i) => (
          <rect
            key={i}
            x={`${(i * 17 + 7) % 100}%`}
            y={`${(i * 13 + 3) % 100}%`}
            width="2"
            height="2"
            fill="white"
            opacity={0.2 + (i % 5) * 0.15}
          >
            <animate
              attributeName="opacity"
              values={`${0.1 + (i % 3) * 0.1};${0.4 + (i % 4) * 0.1};${0.1 + (i % 3) * 0.1}`}
              dur={`${2 + (i % 4)}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>

      {/* Floating clouds */}
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Cloud 1 — large, slow */}
        <g opacity="0.08">
          <rect x="-60" y="15%" width="16" height="8" rx="2" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1600,0;0,0" dur="120s" repeatCount="indefinite" />
          </rect>
          <rect x="-52" y="14%" width="24" height="12" rx="2" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1600,0;0,0" dur="120s" repeatCount="indefinite" />
          </rect>
          <rect x="-40" y="15%" width="16" height="8" rx="2" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1600,0;0,0" dur="120s" repeatCount="indefinite" />
          </rect>
        </g>
        {/* Cloud 2 */}
        <g opacity="0.06">
          <rect x="200" y="25%" width="12" height="6" rx="2" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1400,0;0,0" dur="90s" repeatCount="indefinite" />
          </rect>
          <rect x="206" y="24%" width="20" height="10" rx="2" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1400,0;0,0" dur="90s" repeatCount="indefinite" />
          </rect>
          <rect x="218" y="25%" width="12" height="6" rx="2" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1400,0;0,0" dur="90s" repeatCount="indefinite" />
          </rect>
        </g>
        {/* Cloud 3 */}
        <g opacity="0.05">
          <rect x="600" y="10%" width="10" height="5" rx="1" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1200,0;0,0" dur="150s" repeatCount="indefinite" />
          </rect>
          <rect x="606" y="9%" width="16" height="8" rx="1" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;1200,0;0,0" dur="150s" repeatCount="indefinite" />
          </rect>
        </g>
      </svg>

      {/* Bottom landscape — pixel art mountains and trees */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "35%" }}
        viewBox="0 0 320 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Far mountains */}
        <polygon points="0,120 0,70 20,55 40,65 60,45 80,60 100,50 120,62 140,40 160,55 180,48 200,58 220,42 240,56 260,50 280,60 300,52 320,65 320,120" fill="#0f1d35" />

        {/* Mid mountains */}
        <polygon points="0,120 0,85 15,75 30,82 50,68 70,78 90,72 110,80 130,65 150,76 170,70 190,80 210,72 230,78 250,68 270,80 290,74 310,82 320,78 320,120" fill="#142640" />

        {/* Near hills */}
        <polygon points="0,120 0,95 20,90 40,92 60,88 80,94 100,86 120,92 140,88 160,94 180,86 200,92 220,88 240,94 260,86 280,92 300,88 320,92 320,120" fill="#1a3050" />

        {/* Ground */}
        <rect x="0" y="105" width="320" height="15" fill="#1e3a5c" />

        {/* Pixel trees on hills */}
        {[20, 55, 90, 130, 165, 200, 245, 280].map((x, i) => (
          <g key={i} opacity={0.5 + (i % 3) * 0.15}>
            {/* Tree trunk */}
            <rect x={x + 2} y={88 - (i % 2) * 4} width="2" height="6" fill="#2d4a3a" />
            {/* Tree crown */}
            <rect x={x} y={82 - (i % 2) * 4} width="6" height="4" fill="#1e5a3a" />
            <rect x={x + 1} y={80 - (i % 2) * 4} width="4" height="2" fill="#2a6e4a" />
          </g>
        ))}

        {/* Small pixel houses/structures */}
        <g opacity="0.4">
          {/* House 1 */}
          <rect x="72" y="90" width="6" height="5" fill="#3a2a1a" />
          <polygon points="72,90 75,86 78,90" fill="#5a3a2a" />
          <rect x="74" y="92" width="2" height="3" fill="#ffcc00" opacity="0.6" />

          {/* House 2 */}
          <rect x="182" y="88" width="5" height="4" fill="#3a2a1a" />
          <polygon points="182,88 184.5,85 187,88" fill="#5a3a2a" />
          <rect x="183" y="89" width="1.5" height="3" fill="#ffcc00" opacity="0.5" />
        </g>

        {/* Water/ocean hint at bottom */}
        <rect x="0" y="112" width="320" height="8" fill="#0a1e3a" opacity="0.6" />
        {/* Water shimmer */}
        {[10, 45, 80, 120, 160, 200, 240, 280].map((x, i) => (
          <rect key={`w${i}`} x={x} y={114} width="8" height="1" fill="#1a4a7a" opacity="0.3">
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>

      {/* Pixel globe in the center — very subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
        <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#00e5ff" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="#00e5ff" strokeWidth="0.3" />
          <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="#00e5ff" strokeWidth="0.3" />
          <line x1="5" y1="35" x2="95" y2="35" stroke="#00e5ff" strokeWidth="0.3" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#00e5ff" strokeWidth="0.3" />
          <line x1="5" y1="65" x2="95" y2="65" stroke="#00e5ff" strokeWidth="0.3" />
        </svg>
      </div>
    </div>
  );
}
