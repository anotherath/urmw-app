"use client";

import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/lib/store";

interface MusicCardProps {
  videoId: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
}

export default function MusicCard({
  videoId,
  title,
  artist,
  cover,
  duration,
}: MusicCardProps) {
  const { currentSong, isPlaying, playSongById, togglePlay } = useMusicStore();
  const isCurrentSong = currentSong?.videoId === videoId;

  const handleClick = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSongById(videoId);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-(--card-bg) border flex items-center p-3 rounded-[24px] gap-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 cursor-pointer group active:scale-[0.98]",
        isCurrentSong
          ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
          : "border-(--card-border)",
      )}
    >
      {/* Cover & Play overlay */}
      <div className="relative w-16 h-16 rounded-[16px] overflow-hidden shadow-sm shrink-0 bg-gray-50 dark:bg-slate-700 lg:w-20 lg:h-20">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity",
            isCurrentSong && isPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
          )}
        >
          {isCurrentSong && isPlaying ? (
            <Pause size={20} className="text-white fill-white lg:size-6" />
          ) : (
            <Play size={20} className="text-white fill-white ml-1 lg:size-6" />
          )}
        </div>
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0 pr-2">
        <h3
          className={cn(
            "font-semibold text-[15px] truncate mb-0.5 lg:text-base",
            isCurrentSong && "text-primary",
          )}
        >
          {title}
        </h3>
        <p className="text-[13px] text-gray-400 dark:text-gray-500 truncate font-medium lg:text-sm">
          {artist}
        </p>
      </div>

      {/* Duration */}
      <div className="shrink-0 px-2">
        <span
          className={cn(
            "text-[13px] font-medium transition-colors lg:text-sm",
            isCurrentSong
              ? "text-primary"
              : "text-gray-400 dark:text-gray-500 group-hover:text-(--text-main)",
          )}
        >
          {duration}
        </span>
      </div>
    </div>
  );
}
