"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface MusicCardProps {
  title: string;
  artist: string;
  cover: string;
  duration: string; // Thêm trường thời gian
  isRecentlyPlayed?: boolean;
}

export default function MusicCard({
  title,
  artist,
  cover,
  duration,
  isRecentlyPlayed = false,
}: MusicCardProps) {
  return (
    <div className="bg-(--card-bg) border border-(--card-border) flex items-center p-3 rounded-[24px] gap-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 cursor-pointer group active:scale-[0.98]">
      {/* Ảnh bìa & Nút Play khi hover */}
      <div className="relative w-16 h-16 rounded-[16px] overflow-hidden shadow-sm shrink-0 bg-gray-50 dark:bg-slate-700">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={20} className="text-white fill-white ml-1" />
        </div>
      </div>

      {/* Thông tin bài hát */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="font-semibold text-[15px] truncate mb-0.5">
          {title}
        </h3>
        <p className="text-[13px] text-gray-400 dark:text-gray-500 truncate font-medium">
          {artist}
        </p>
      </div>

      {/* Hiển thị thời gian (Thay thế cho nút Heart) */}
      <div className="shrink-0 px-2">
        <span className="text-[13px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-(--text-main) transition-colors">
          {duration}
        </span>
      </div>
    </div>
  );
}
