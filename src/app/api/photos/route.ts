import { NextRequest, NextResponse } from "next/server";

// Fetch the iconic Wikipedia page image for an exact landmark or city name
// Uses direct page lookup (not search) so "Eiffel Tower" gets THE Eiffel Tower photo
async function getPageImage(title: string): Promise<{ title: string; extract: string; imageUrl: string | null } | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title || title,
      extract: (data.extract || "").slice(0, 200),
      imageUrl: data.originalimage?.source || data.thumbnail?.source || null,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const places = request.nextUrl.searchParams.get("places"); // comma-separated landmark names

  if (!query && !places) {
    return NextResponse.json({ error: "q or places is required" }, { status: 400 });
  }

  try {
    if (places) {
      // Fetch exact Wikipedia images for each specific landmark
      const placeNames = places.split(",").map((p) => p.trim()).filter(Boolean);
      const results = await Promise.all(placeNames.map(getPageImage));
      const photos = results.filter((r): r is NonNullable<typeof r> => r !== null && r.imageUrl !== null);
      return NextResponse.json({ photos });
    }

    // Single query — get the direct page image
    const result = await getPageImage(query!);
    if (result?.imageUrl) {
      return NextResponse.json({ photos: [result] });
    }

    // Fallback: try with different formatting
    const fallback = await getPageImage(query!.replace(/-/g, " "));
    if (fallback?.imageUrl) {
      return NextResponse.json({ photos: [fallback] });
    }

    return NextResponse.json({ photos: [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
