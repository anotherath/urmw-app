"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Shuffle,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlayerPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const song = {
    title: "Ethereal Echoes",
    artist: "The Curated Flow",
    cover:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&h=600&auto=format&fit=crop",
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <main className="flex flex-col">
      <div className="flex-1 flex flex-col px-6 gap-12">
        {/* Album Art */}
        <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={song.cover}
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Song Info + Progress + Controls */}
        <div className="space-y-6">
          {/* Song Info */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-500 mb-1 block">
                NOW PLAYING
              </span>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight leading-snug mb-1 line-clamp-2">
                {song.title}
              </h2>

              <p className="text-base text-gray-500 font-medium line-clamp-1">
                {song.artist}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: "42%" }}
              />
            </div>

            <div className="flex justify-between mt-2 text-[11px] font-medium text-gray-500">
              <span>01:42</span>
              <span>04:15</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4">
            <button className="text-gray-400 hover:text-gray-600 active:scale-90 transition-all p-2">
              <Shuffle size={18} strokeWidth={2.2} />
            </button>

            <button className="text-gray-700 active:scale-90 transition-all p-2">
              <SkipBack size={26} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause size={32} className="fill-current" />
              ) : (
                <Play size={32} className="fill-current ml-0.5" />
              )}
            </button>

            <button className="text-gray-700 active:scale-90 transition-all p-2">
              <SkipForward size={26} fill="currentColor" />
            </button>

            <button className="text-gray-400 hover:text-gray-600 active:scale-90 transition-all p-2">
              <Repeat size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
