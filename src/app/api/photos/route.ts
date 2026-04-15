import { NextRequest, NextResponse } from "next/server";

// Fetch photos from Wikipedia for a destination or place
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const count = parseInt(request.nextUrl.searchParams.get("count") || "4");

  if (!query) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  try {
    // Search Wikipedia for pages related to the query
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${count}&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=800&exintro=true&explaintext=true&exlimit=${count}`,
      { next: { revalidate: 86400 } }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ error: "Failed to fetch from Wikipedia" }, { status: 500 });
    }

    const data = await searchRes.json();
    const pages = data.query?.pages || {};

    const results = Object.values(pages)
      .map((page: unknown) => {
        const p = page as Record<string, unknown>;
        const thumbnail = p.thumbnail as Record<string, unknown> | undefined;
        return {
          title: p.title as string,
          extract: ((p.extract as string) || "").slice(0, 200),
          imageUrl: thumbnail?.source as string | null,
        };
      })
      .filter((r) => r.imageUrl);

    return NextResponse.json({ photos: results });
  } catch {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
