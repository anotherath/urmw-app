import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://ytm-to-tele-production.up.railway.app";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || !q.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`, {
      headers: {
        "x-api-key": process.env.API_ACCESS_KEY || "",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}
