"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MiniPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Dữ liệu bài hát (tạm thời hardcode)
  const song = {
    title: "Forever and Ever and Always (The Softer Version)",
    artist: "Ryan Mack",
    cover: "https://img.youtube.com/vi/bRBzj1Sqvk4/maxresdefault.jpg",
  };

  const src =
    "https://urmw-stream.anotheralltimehigh.workers.dev/?id=CQACAgUAAxkDAAMsacf6eYYM4Q5Def9fVGXfCLkIXPAAAsEgAAKZKEBWjxx7LOP9Jsc6BA";

  // format time
  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // Đồng bộ trạng thái chơi nhạc từ thẻ audio thực tế
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // play / pause logic
  const togglePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  // sync audio time -> UI
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      const ct = audio.currentTime;
      const dur = audio.duration;

      setCurrentTime(ct);
      if (dur) {
        setDuration(dur);
        setProgress((ct / dur) * 100);
      }
    };

    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  // cập nhật progress (click + drag)
  const updateProgress = (clientX: number) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newProgress = (clickX / rect.width) * 100;

    setProgress(newProgress);

    const dur = audioRef.current.duration;
    if (dur) {
      audioRef.current.currentTime = (newProgress / 100) * dur;
    }
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

  const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    if ("touches" in e) {
      updateProgress((e as TouchEvent).touches[0].clientX);
    } else {
      updateProgress((e as MouseEvent).clientX);
    }
  };

  const handleGlobalEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMove);
      document.addEventListener("mouseup", handleGlobalEnd);
      document.addEventListener("touchmove", handleGlobalMove);
      document.addEventListener("touchend", handleGlobalEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMove);
      document.removeEventListener("mouseup", handleGlobalEnd);
      document.removeEventListener("touchmove", handleGlobalMove);
      document.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [isDragging]);

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        crossOrigin="anonymous"
        playsInline
      />

      {/* Chỉ hiển thị MiniPlayer UI nếu không phải đang ở trang /player */}
      {pathname !== "/player" && (
        <div className="fixed bottom-[86px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[420px] z-40">
          <div className="bg-primary rounded-[24px] p-2 flex flex-col shadow-[0_12px_35px_rgba(255,107,158,0.4)] transition-all hover:scale-[1.02] overflow-hidden">
            <Link
              href="/player"
              className="flex items-center pr-2 mb-1 cursor-pointer active:opacity-90 transition-opacity"
            >
              <div className="w-11 h-11 rounded-[14px] overflow-hidden shadow-sm shrink-0 relative bg-white/20 ml-1 mt-1">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex items-baseline justify-between gap-2 mr-2">
                  <h4 className="text-[13px] font-bold tracking-tight truncate text-white">
                    {song.title}
                  </h4>
                  <span className="text-[10px] text-white/70 font-medium shrink-0">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 truncate font-medium mt-0.5">
                  {song.artist}
                </p>
              </div>
            </Link>

            <div className="flex items-center px-2 pb-2">
              <button
                onClick={togglePlay}
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
                          "scale-100 shadow-[0_0_0_4px_rgba(255,255,255,0.4)]",
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
