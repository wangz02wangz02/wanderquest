import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  const country = request.nextUrl.searchParams.get("country");

  if (!city || !country) {
    return NextResponse.json({ error: "city and country are required" }, { status: 400 });
  }

  // Search Open Library for books related to the destination
  const query = encodeURIComponent(`${city} ${country} travel`);
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${query}&limit=5&fields=title,author_name,first_publish_year,cover_i,key`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }

  const data = await res.json();

  const books = (data.docs || []).slice(0, 5).map((doc: Record<string, unknown>) => ({
    title: doc.title as string,
    author: ((doc.author_name as string[]) || ["Unknown"])[0],
    year: doc.first_publish_year as number | null,
    coverId: doc.cover_i as number | null,
    key: doc.key as string,
  }));

  return NextResponse.json({ books });
}
