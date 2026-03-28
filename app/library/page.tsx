"use client";

import MusicCard from "../components/MusicCard";

export default function LibraryPage() {
  const yourMusic = [
    { id: 4, title: "Blinding Lights", artist: "The Weeknd", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: 5, title: "Watermelon Sugar", artist: "Harry Styles", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: 6, title: "Say So", artist: "Doja Cat", cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: 7, title: "Good 4 U", artist: "Olivia Rodrigo", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: 8, title: "Don't Start Now", artist: "Dua Lipa", cover: "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=200&h=200&auto=format&fit=crop" },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-4 pt-6 pb-6 hide-scrollbar relative">
      <div className="mb-6 flex justify-between items-end">
        <h1 className="text-3xl font-bold text-slate-800">Your Library</h1>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        {["Playlists", "Artists", "Albums"].map((filter, i) => (
          <button
            key={filter}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${i === 0 ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" : "bg-white/40 text-slate-600 border-white/50 hover:bg-white/80"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="mb-6">
        <div className="space-y-1">
          {yourMusic.map((song) => (
            <MusicCard key={song.id} {...song} />
          ))}
        </div>
      </section>
    </main>
  );
}
