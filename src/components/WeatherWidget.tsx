"use client";

interface WeatherData {
  current: {
    temp: number;
    description: string;
    weatherCode: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    description: string;
    weatherCode: number;
  }>;
}

// Map weather codes to pixel art backgrounds and colors
function getWeatherTheme(code: number) {
  if (code === 0 || code === 1) return { bg: "from-orange-900/40 to-blue-900/40", icon: "sun", color: "#ffcc00" };
  if (code === 2 || code === 3) return { bg: "from-gray-700/40 to-gray-900/40", icon: "cloud", color: "#9ca3af" };
  if (code >= 45 && code <= 48) return { bg: "from-gray-600/40 to-gray-800/40", icon: "fog", color: "#d1d5db" };
  if (code >= 51 && code <= 67) return { bg: "from-blue-900/40 to-gray-900/40", icon: "rain", color: "#60a5fa" };
  if (code >= 71 && code <= 77) return { bg: "from-blue-200/20 to-white/10", icon: "snow", color: "#e2e8f0" };
  if (code >= 80 && code <= 82) return { bg: "from-blue-800/40 to-gray-900/40", icon: "rain", color: "#3b82f6" };
  if (code >= 95) return { bg: "from-purple-900/40 to-gray-900/40", icon: "storm", color: "#a855f7" };
  return { bg: "from-blue-900/40 to-gray-900/40", icon: "cloud", color: "#9ca3af" };
}

function getWeatherPixelArt(icon: string) {
  switch (icon) {
    case "sun":
      return (
        <div className="relative w-8 h-8">
          <div className="absolute inset-1 bg-yellow-400 rounded-sm" />
          <div className="absolute top-0 left-3 w-2 h-1 bg-yellow-300" />
          <div className="absolute bottom-0 left-3 w-2 h-1 bg-yellow-300" />
          <div className="absolute left-0 top-3 w-1 h-2 bg-yellow-300" />
          <div className="absolute right-0 top-3 w-1 h-2 bg-yellow-300" />
        </div>
      );
    case "rain":
      return (
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1 w-6 h-3 bg-gray-400 rounded-sm" />
          <div className="absolute top-4 left-2 w-1 h-2 bg-blue-400" />
          <div className="absolute top-5 left-4 w-1 h-2 bg-blue-400" />
          <div className="absolute top-4 left-6 w-1 h-2 bg-blue-400" />
        </div>
      );
    case "snow":
      return (
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1 w-6 h-3 bg-gray-300 rounded-sm" />
          <div className="absolute top-4 left-2 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-5 left-4 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-6 left-3 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-4 left-5 w-1 h-1 bg-white rounded-full" />
        </div>
      );
    case "storm":
      return (
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1 w-6 h-3 bg-gray-500 rounded-sm" />
          <div className="absolute top-3 left-3 w-2 h-3 bg-yellow-300" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
        </div>
      );
    default:
      return (
        <div className="relative w-8 h-8">
          <div className="absolute top-1 left-1 w-6 h-4 bg-gray-400 rounded-sm" />
        </div>
      );
  }
}

function getDayLabel(dateStr: string, index: number) {
  if (index === 0) return "TODAY";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

export default function WeatherWidget({ weather }: { weather: WeatherData | null }) {
  if (!weather) {
    return (
      <div className="retro-card p-4 animate-pulse">
        <div className="h-16 bg-[#2a2a4a] rounded" />
      </div>
    );
  }

  const theme = getWeatherTheme(weather.current.weatherCode);

  return (
    <div className={`retro-card p-4 bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-pixel text-2xl" style={{ color: theme.color }}>
            {weather.current.temp}°
          </span>
          <p className="font-pixel text-[6px] text-gray-400 mt-1">
            {weather.current.description}
          </p>
        </div>
        {getWeatherPixelArt(theme.icon)}
      </div>

      <div className="flex gap-4 border-t border-[#2a2a4a] pt-2">
        {weather.forecast.map((day, i) => (
          <div key={day.date} className="text-center">
            <p className="font-pixel text-[5px] text-gray-500 mb-1">
              {getDayLabel(day.date, i)}
            </p>
            <p className="font-pixel text-[7px] text-gray-300">{day.high}°</p>
            <p className="font-pixel text-[6px] text-gray-500">{day.low}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}
