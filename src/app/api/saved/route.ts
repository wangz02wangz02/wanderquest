import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// GET: fetch saved destinations for the logged-in user
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("saved_destinations")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ destinations: data });
}

// POST: save a destination
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { slug, city, country, countryCode } = body;

  if (!slug || !city || !country) {
    return NextResponse.json({ error: "slug, city, and country are required" }, { status: 400 });
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from("saved_destinations")
    .select("id")
    .eq("user_id", userId)
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already saved" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("saved_destinations")
    .insert({
      user_id: userId,
      slug,
      city,
      country,
      country_code: countryCode || "",
      notes: "",
      itinerary: "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ destination: data }, { status: 201 });
}

// DELETE: unsave a destination
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("saved_destinations")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PATCH: update notes/itinerary
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, notes, itinerary } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (notes !== undefined) updates.notes = notes;
  if (itinerary !== undefined) updates.itinerary = itinerary;

  const { data, error } = await supabase
    .from("saved_destinations")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ destination: data });
}
