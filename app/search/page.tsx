"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import GenreCard from "../components/GenreCard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("Genre");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["Genre", "Popular", "Recently"];

  const genres = [
    { id: 1, name: "Pop", songCount: 240, gradient: "bg-linear-to-br from-primary to-primary-dark" },
    { id: 2, name: "R&B", songCount: 180, gradient: "bg-gradient-to-br from-purple-400 to-indigo-500" },
    { id: 3, name: "Hip Hop", songCount: 320, gradient: "bg-gradient-to-br from-orange-400 to-amber-500" },
    { id: 4, name: "Chill", songCount: 156, gradient: "bg-gradient-to-br from-teal-400 to-emerald-500" },
    { id: 5, name: "K-Pop", songCount: 420, gradient: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600" },
    { id: 6, name: "Jazz", songCount: 95, gradient: "bg-gradient-to-br from-slate-600 to-slate-800" },
  ];

  const searchResults = [
    { id: 1, title: "Levitating", artist: "Dua Lipa", duration: "3:23", cover: "https://images.unsplash.com/photo-1493225457124-a1a2b534dda4?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: 2, title: "Levitating (feat. DaBaby)", artist: "Dua Lipa", duration: "3:23", cover: "https://images.unsplash.com/photo-1493225457124-a1a2b534dda4?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: 3, title: "Don't Start Now", artist: "Dua Lipa", duration: "3:03", cover: "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=200&h=200&auto=format&fit=crop" },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-4 pt-6 pb-6 hide-scrollbar relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Search</h1>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full glass rounded-full py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg shadow-sm"
            placeholder="Songs, artists, or genres"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!searchQuery ? (
        <>
          <div className="flex space-x-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap active:scale-95",
                  activeTab === tab
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white/50 text-slate-600 hover:bg-white/80"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Browse all</h2>
            <div className="grid grid-cols-2 gap-4">
              {genres.map((genre) => (
                <GenreCard key={genre.id} {...genre} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="mt-6">
          <h2 className="text-md font-semibold text-slate-500 mb-4">Results for "{searchQuery}"</h2>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.id} className="flex items-center gap-3 group">
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <img src={result.cover} alt={result.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{result.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 truncate">{result.artist}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-xs text-slate-400">{result.duration}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all active:scale-90 group-hover:scale-110">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
