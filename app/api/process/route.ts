import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL || "";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("video_id");

  if (!videoId || !videoId.trim()) {
    return NextResponse.json({ error: "video_id is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${API_BASE}/process?video_id=${encodeURIComponent(videoId)}`,
      {
        headers: {
          "x-api-key": process.env.API_ACCESS_KEY || "",
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Process API error:", error);
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }
}
