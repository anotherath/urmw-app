import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!supabase) {
    console.error("Supabase client is not initialized (missing env vars).");
    return NextResponse.json({ ids: [] });
  }

  try {
    const { data, error } = await supabase
      .from("videos")
      .select("videoId");

    if (error) {
      console.error("Error fetching downloaded IDs:", error);
      return NextResponse.json({ ids: [] });
    }

    const ids = (data || []).map((row: { videoId: string }) => row.videoId);
    return NextResponse.json({ ids });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ ids: [] });
  }
}
