import { NextRequest, NextResponse } from "next/server";

// Fetch scenic, high-quality photos from Wikipedia for a destination or place
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const count = parseInt(request.nextUrl.searchParams.get("count") || "4");

  if (!query) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  try {
    // Search with "landmark scenic" appended to prioritize scenic photos
    const searchTerm = `${query} landmark scenic`;
    const fetchCount = count * 2; // Fetch more to filter for ones with images

    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=${fetchCount}&prop=pageimages|extracts|pageviews&piprop=thumbnail&pithumbsize=1200&exintro=true&explaintext=true&exlimit=${fetchCount}&pvipdays=30`,
      { next: { revalidate: 86400 } }
    );

    if (!searchRes.ok) {
      // Fallback: try without "landmark scenic"
      const fallbackRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${count}&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=1200&exintro=true&explaintext=true&exlimit=${count}`,
        { next: { revalidate: 86400 } }
      );
      if (!fallbackRes.ok) {
        return NextResponse.json({ error: "Failed to fetch from Wikipedia" }, { status: 500 });
      }
      const fallbackData = await fallbackRes.json();
      const pages = fallbackData.query?.pages || {};
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
      return NextResponse.json({ photos: results.slice(0, count) });
    }

    const data = await searchRes.json();
    const pages = data.query?.pages || {};

    const results = Object.values(pages)
      .map((page: unknown) => {
        const p = page as Record<string, unknown>;
        const thumbnail = p.thumbnail as Record<string, unknown> | undefined;
        // Get page views for sorting by popularity
        const pageviews = p.pageviews as Record<string, number> | undefined;
        const totalViews = pageviews
          ? Object.values(pageviews).reduce((sum, v) => sum + (v || 0), 0)
          : 0;
        return {
          title: p.title as string,
          extract: ((p.extract as string) || "").slice(0, 200),
          imageUrl: thumbnail?.source as string | null,
          views: totalViews,
        };
      })
      .filter((r) => r.imageUrl)
      // Sort by page views (most viewed = most popular/scenic)
      .sort((a, b) => b.views - a.views)
      .slice(0, count)
      .map(({ views: _v, ...rest }) => rest);

    return NextResponse.json({ photos: results });
  } catch {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
