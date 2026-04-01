"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMusicStore } from "@/lib/store";

export default function MiniPlayer() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    audioDuration,
    togglePlay,
    seekTo,
  } = useMusicStore();

  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // Progress bar interaction
  const updateProgress = (clientX: number) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newProgress = (clickX / rect.width) * 100;
    seekTo(newProgress);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateProgress(e.clientX);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    if ("touches" in e) {
      updateProgress((e as React.TouchEvent).touches[0].clientX);
    } else {
      updateProgress((e as React.MouseEvent).clientX);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        updateProgress((e as TouchEvent).touches[0].clientX);
      } else {
        updateProgress((e as MouseEvent).clientX);
      }
    };

    const handleEnd = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  // Don't render MiniPlayer on the /player page or if no song is loaded
  if (pathname === "/player" || !currentSong) return null;

  const cover = `https://img.youtube.com/vi/${currentSong.videoId}/maxresdefault.jpg`;

  return (
    <div className="fixed bottom-[86px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[420px] z-40">
      <div className="bg-primary rounded-[24px] p-2 flex flex-col shadow-[0_12px_35px_rgba(255,107,158,0.4)] transition-all hover:scale-[1.02] overflow-hidden">
        <Link
          href="/player"
          className="flex items-center pr-2 mb-1 cursor-pointer active:opacity-90 transition-opacity"
        >
          <div className="w-11 h-11 rounded-[14px] overflow-hidden shadow-sm shrink-0 relative bg-white/20 ml-1 mt-1">
            <img
              src={cover}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="ml-3 flex-1 overflow-hidden">
            <div className="flex items-baseline justify-between gap-2 mr-2">
              <h4 className="text-[13px] font-bold tracking-tight truncate text-white">
                {currentSong.title}
              </h4>
              <span className="text-[10px] text-white/70 font-medium shrink-0">
                {formatTime(currentTime)} / {formatTime(audioDuration)}
              </span>
            </div>
            <p className="text-[11px] text-white/80 truncate font-medium mt-0.5">
              {currentSong.artist}
            </p>
          </div>
        </Link>

        <div className="flex items-center px-2 pb-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePlay();
            }}
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-primary shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 mr-3"
          >
            {isPlaying ? (
              <Pause size={16} className="fill-current" />
            ) : (
              <Play size={16} className="fill-current ml-0.5" />
            )}
          </button>

          <div className="flex-1 relative">
            <div
              ref={progressRef}
              className="h-1 w-full bg-white/20 rounded-full overflow-hidden relative cursor-pointer group/progress"
              onClick={handleProgressClick}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div
                className="h-full bg-white/50 rounded-full absolute transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
              <div
                className="h-full bg-white rounded-full relative transition-all duration-75"
                style={{ width: `${progress}%` }}
              >
                <div
                  className={cn(
                    "absolute -top-1.5 right-0 w-4 h-4 bg-white rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.3)]",
                    "scale-0 group-hover/progress:scale-100 transition-transform duration-200",
                    isDragging &&
                      "scale-100 shadow-[0_0_0_4px_rgba(255,255,255,0.4)]"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
