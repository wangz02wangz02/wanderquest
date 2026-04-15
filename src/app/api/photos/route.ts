import { NextRequest, NextResponse } from "next/server";

// Check if a URL likely points to a real photo (not a map, icon, logo, etc.)
function isGoodImage(url: string): boolean {
  const lower = url.toLowerCase();
  return !(
    lower.includes(".svg") ||
    lower.includes("map") ||
    lower.includes("icon") ||
    lower.includes("flag_of") ||
    lower.includes("logo") ||
    lower.includes("diagram") ||
    lower.includes("chart") ||
    lower.includes("location") ||
    lower.includes("coat_of_arms") ||
    lower.includes("symbol") ||
    lower.includes("pictogram") ||
    lower.includes("locator") ||
    lower.includes("blank") ||
    lower.includes("placeholder")
  );
}

// Direct Wikipedia page summary lookup (exact title)
async function directPageLookup(
  title: string
): Promise<{
  title: string;
  extract: string;
  imageUrl: string | null;
} | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const imageUrl =
      data.originalimage?.source || data.thumbnail?.source || null;
    return {
      title: data.title || title,
      extract: (data.extract || "").slice(0, 200),
      imageUrl: imageUrl && isGoodImage(imageUrl) ? imageUrl : null,
    };
  } catch {
    return null;
  }
}

// Search Wikipedia for articles matching a query — returns best matching page title
async function searchWikipedia(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.query?.search;
    if (!results || results.length === 0) return null;
    // Skip disambiguation pages
    for (const r of results) {
      if (
        !r.snippet?.includes("may refer to") &&
        !r.snippet?.includes("disambiguation")
      ) {
        return r.title;
      }
    }
    return results[0].title;
  } catch {
    return null;
  }
}

// Get the best photo from a page using MediaWiki pageimages API
// This is better than the summary API for getting actual photos
async function getPagePhoto(
  title: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=original&format=json&origin=*`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as { original?: { source: string } };
    const url = page?.original?.source;
    return url && isGoodImage(url) ? url : null;
  } catch {
    return null;
  }
}

// Get multiple images from a Wikipedia page's media list
async function getPageMediaImages(
  title: string,
  limit: number = 3
): Promise<string[]> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const images: string[] = [];
    for (const item of data.items || []) {
      if (item.type === "image" && item.srcset && item.srcset.length > 0) {
        const src = item.srcset[item.srcset.length - 1]?.src;
        if (src && isGoodImage(src)) {
          const lower = src.toLowerCase();
          // Extra filtering for media-list junk
          if (
            lower.includes("commons-logo") ||
            lower.includes("edit-lapis") ||
            lower.includes("ambox") ||
            lower.includes("question_book") ||
            lower.includes("wiki-") ||
            lower.includes("arrow") ||
            lower.includes("cscr-") ||
            lower.includes("stub")
          ) {
            continue;
          }
          let url = src.startsWith("//") ? `https:${src}` : src;
          // Upscale thumbnails to 800px
          url = url.replace(/\/(\d+)px-/, "/800px-");
          images.push(url);
          if (images.length >= limit) break;
        }
      }
    }
    return images;
  } catch {
    return [];
  }
}

// Try to get an image for a Wikipedia page title
// Uses summary API + pageimages API + media-list as fallbacks
async function lookupPageImage(
  pageTitle: string
): Promise<{
  title: string;
  extract: string;
  imageUrl: string | null;
} | null> {
  const page = await directPageLookup(pageTitle);
  if (page?.imageUrl) return page;

  // Page exists but no good main image — try the pageimages API
  if (page) {
    const photoUrl = await getPagePhoto(pageTitle);
    if (photoUrl) return { ...page, imageUrl: photoUrl };

    // Try media-list for the first good image
    const mediaImages = await getPageMediaImages(pageTitle, 1);
    if (mediaImages.length > 0) return { ...page, imageUrl: mediaImages[0] };
  }

  return page;
}

// Robust image fetcher: tries multiple strategies to find a great image
async function getPageImage(
  title: string,
  cityContext?: string
): Promise<{
  title: string;
  extract: string;
  imageUrl: string | null;
} | null> {
  // 1. Direct page lookup (fastest — works for exact Wikipedia titles)
  const direct = await lookupPageImage(title);
  if (direct?.imageUrl) return direct;

  // 2. If we have city context, search with it first (more specific = better)
  if (cityContext) {
    const contextTitle = await searchWikipedia(`${title} ${cityContext}`);
    if (contextTitle) {
      const result = await lookupPageImage(contextTitle);
      if (result?.imageUrl) return result;
    }
  }

  // 3. Search Wikipedia without context
  const searchTitle = await searchWikipedia(title);
  if (searchTitle) {
    const result = await lookupPageImage(searchTitle);
    if (result?.imageUrl) return result;
  }

  // 4. Simplified title — strip generic suffixes and retry
  const simplified = title
    .replace(
      /\b(District|Quarter|Tour|Day Trip|Trek|Cruise|Shows?|Nightlife|Shopping|Route|Sunrise|Sunset|Outer|Inner|Electric Town|Weekend|Ride|Hike|Visit|Seawall|Bar|Ruins|Penguins)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
  if (simplified !== title && simplified.length > 2) {
    // Try WITHOUT city context first — city can mislead for day-trip destinations
    const simplifiedSearch = await searchWikipedia(simplified);
    if (simplifiedSearch) {
      const result = await lookupPageImage(simplifiedSearch);
      if (result?.imageUrl) return result;
    }
    // Then try WITH city context
    if (cityContext) {
      const simplifiedContextSearch = await searchWikipedia(
        `${simplified} ${cityContext}`
      );
      if (simplifiedContextSearch) {
        const result = await lookupPageImage(simplifiedContextSearch);
        if (result?.imageUrl) return result;
      }
    }
  }

  // Return whatever we have (may have extract text but no image)
  return direct;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const places = request.nextUrl.searchParams.get("places"); // comma-separated
  const city = request.nextUrl.searchParams.get("city") || undefined;
  const count = parseInt(request.nextUrl.searchParams.get("count") || "1");

  if (!query && !places) {
    return NextResponse.json(
      { error: "q or places is required" },
      { status: 400 }
    );
  }

  try {
    if (places) {
      // Multiple places — get one image per place
      const placeNames = places
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const results = await Promise.all(
        placeNames.map((p) => getPageImage(p, city))
      );
      const photos = results.filter(
        (r): r is NonNullable<typeof r> => r !== null && r.imageUrl !== null
      );
      return NextResponse.json({ photos });
    }

    // Single query
    const result = await getPageImage(query!, city);
    if (result?.imageUrl) {
      if (count > 1) {
        // Get additional images from the article's media list
        const extraImages = await getPageMediaImages(result.title, count - 1);
        const photos = [
          result,
          ...extraImages.map((url) => ({
            title: result.title,
            extract: "",
            imageUrl: url,
          })),
        ];
        return NextResponse.json({ photos });
      }
      return NextResponse.json({ photos: [result] });
    }

    // Fallback: if everything failed, try the city name itself
    if (city) {
      const cityResult = await getPageImage(city);
      if (cityResult?.imageUrl) {
        return NextResponse.json({
          photos: [{ ...cityResult, title: query || city }],
        });
      }
    }

    return NextResponse.json({ photos: [] });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}
