import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
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
