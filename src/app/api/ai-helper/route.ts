import { NextRequest, NextResponse } from "next/server";

// Template-based AI writing helper for travel notes and itineraries
// Generates smart suggestions based on destination data without external AI API

interface HelperRequest {
  type: "itinerary" | "notes" | "tips";
  city: string;
  country: string;
  funPlaces: string[];
  days?: number;
}

function generateItinerary(city: string, country: string, funPlaces: string[], days: number): string {
  const lines: string[] = [];
  const shuffled = [...funPlaces].sort(() => Math.random() - 0.5);

  for (let d = 1; d <= days; d++) {
    lines.push(`Day ${d}:`);
    if (d === 1) {
      lines.push(`  Morning: Arrive in ${city}, settle into your accommodation`);
      lines.push(`  Afternoon: Explore ${shuffled[0] || "the city center"} — take your time getting oriented`);
      lines.push(`  Evening: Find a local restaurant for an authentic ${country} dinner`);
    } else if (d === days) {
      const place = shuffled[Math.min(d, shuffled.length - 1)] || "a local market";
      lines.push(`  Morning: Visit ${place} for a final adventure`);
      lines.push(`  Afternoon: Pick up souvenirs, revisit your favorite spot`);
      lines.push(`  Evening: Farewell dinner — reflect on your ${city} journey`);
    } else {
      const idx = Math.min(d - 1, shuffled.length - 1);
      const nextIdx = Math.min(d, shuffled.length - 1);
      lines.push(`  Morning: Head to ${shuffled[idx] || "a notable landmark"}`);
      lines.push(`  Afternoon: Explore ${shuffled[nextIdx] || "the local neighborhood"}`);
      lines.push(`  Evening: Try ${d % 2 === 0 ? "street food near the city center" : "a highly-rated local restaurant"}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function generateNotes(city: string, country: string, funPlaces: string[]): string {
  const tips = [
    `${city} is best visited during the shoulder season for fewer crowds.`,
    `Don't miss ${funPlaces[0]} — it's the top attraction for a reason.`,
    `Try to learn a few basic phrases in the local language before arriving.`,
    `The area around ${funPlaces[1] || "the city center"} has great food options.`,
    `Consider getting a local SIM card or portable WiFi for navigation.`,
    `${funPlaces[2] || "The main market"} is worth at least half a day.`,
    `Pack comfortable walking shoes — ${city} is best explored on foot.`,
    `Book any popular tours or attractions in advance to avoid disappointment.`,
  ];

  const selected = tips.sort(() => Math.random() - 0.5).slice(0, 4);
  return `Travel Notes for ${city}, ${country}:\n\n` + selected.map((t) => `• ${t}`).join("\n");
}

function generateTips(city: string, country: string): string {
  const categories = [
    {
      title: "Getting Around",
      tips: [
        `Research public transit options in ${city} before arriving`,
        `Walking tours are a great way to orient yourself on day one`,
        `Download offline maps of ${city} in case of spotty wifi`,
      ],
    },
    {
      title: "Food & Drink",
      tips: [
        `Ask locals for restaurant recommendations — tourist areas are often overpriced`,
        `Try the local breakfast — it's the most authentic meal of the day`,
        `Street food in ${country} is often the best culinary experience`,
      ],
    },
    {
      title: "Budget Tips",
      tips: [
        `Many museums in ${city} have free or discounted days`,
        `Consider staying in neighborhoods just outside the tourist center`,
        `Local markets are great for affordable meals and unique souvenirs`,
      ],
    },
  ];

  return categories
    .map((cat) => {
      const tip = cat.tips[Math.floor(Math.random() * cat.tips.length)];
      return `${cat.title}: ${tip}`;
    })
    .join("\n\n");
}

export async function POST(request: NextRequest) {
  const body: HelperRequest = await request.json();
  const { type, city, country, funPlaces, days = 3 } = body;

  if (!city || !country) {
    return NextResponse.json({ error: "city and country are required" }, { status: 400 });
  }

  let suggestion = "";

  switch (type) {
    case "itinerary":
      suggestion = generateItinerary(city, country, funPlaces || [], days);
      break;
    case "notes":
      suggestion = generateNotes(city, country, funPlaces || []);
      break;
    case "tips":
      suggestion = generateTips(city, country);
      break;
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json({ suggestion });
}
