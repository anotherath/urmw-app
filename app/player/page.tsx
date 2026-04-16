"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/lib/store";

export default function PlayerPage() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    audioDuration,
    repeatMode,
    togglePlay,
    next,
    prev,
    cycleRepeatMode,
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

  if (!currentSong) {
    return (
      <main className="flex flex-col items-center justify-center flex-1 text-gray-400 dark:text-gray-500 lg:ml-0">
        <p className="text-lg font-medium">No song selected</p>
      </main>
    );
  }

  const cover = `https://img.youtube.com/vi/${currentSong.videoId}/maxresdefault.jpg`;

  return (
    <main className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:max-w-6xl lg:mx-auto lg:px-8 lg:py-8 lg:flex-1">
      {/* Album Art */}
      <div className="flex-1 flex flex-col px-6 gap-12 lg:flex-none lg:px-0 lg:w-[420px] xl:w-[480px]">
        <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={cover}
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Song Info + Progress + Controls */}
      <div className="flex-1 flex flex-col px-6 gap-12 lg:flex-none lg:px-0 lg:max-w-lg lg:justify-center">
        <div className="space-y-6">
          {/* Song Info */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/80 mb-2 block lg:text-xs">
                NOW PLAYING
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2 line-clamp-2 lg:text-4xl">
                {currentSong.title}
              </h2>

              <p className="text-base text-slate-400 font-medium line-clamp-1 lg:text-lg">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div
              ref={progressRef}
              className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden cursor-pointer group/progress relative backdrop-blur-sm"
              onClick={handleProgressClick}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div
                className="h-full bg-linear-to-r from-primary to-primary-dark rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(255,107,158,0.3)]"
                style={{ width: `${progress}%` }}
              />
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-lg",
                  "scale-0 group-hover/progress:scale-100 transition-transform duration-200",
                  isDragging && "scale-100",
                )}
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            </div>

            <div className="flex justify-between mt-3 text-[12px] font-bold text-slate-400 dark:text-slate-500 tabular-nums lg:text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(audioDuration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 lg:justify-center lg:gap-10 lg:px-0">
            {/* Shuffle – disabled for now */}
            <button
              className="text-gray-300 dark:text-gray-600 p-2 cursor-not-allowed"
              disabled
              title="Shuffle (coming soon)"
            >
              <Shuffle size={18} strokeWidth={2.2} />
            </button>

            {/* Previous */}
            <button
              onClick={() => prev()}
              className="text-gray-700 dark:text-gray-300 active:scale-90 transition-all p-2"
            >
              <SkipBack size={26} fill="currentColor" />
            </button>
            {/* Play / Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause size={32} className="fill-current" />
              ) : (
                <Play size={32} className="fill-current ml-0.5" />
              )}
            </button>
            {/* Next */}
            <button
              onClick={() => next()}
              className="text-gray-700 dark:text-gray-300 active:scale-90 transition-all p-2"
            >
              <SkipForward size={26} fill="currentColor" />
            </button>
            {/* Repeat Mode */}
            <button
              onClick={() => cycleRepeatMode()}
              className={cn(
                "p-2 active:scale-90 transition-all relative",
                repeatMode === "off"
                  ? "text-gray-400 dark:text-gray-500 hover:text-gray-600"
                  : "text-primary",
              )}
              title={
                repeatMode === "off"
                  ? "Repeat off"
                  : repeatMode === "all"
                    ? "Repeat all"
                    : "Repeat one"
              }
            >
              {repeatMode === "one" ? (
                <Repeat1 size={18} strokeWidth={2.2} />
              ) : (
                <Repeat size={18} strokeWidth={2.2} />
              )}
              {repeatMode !== "off" && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
