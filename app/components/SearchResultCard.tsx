"use client";

import { Download, Check, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  videoId: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isDownloading?: boolean;
  isDownloaded?: boolean;
  onDownload?: () => void;
}

export default function SearchResultCard({
  title,
  artist,
  cover,
  duration,
  isDownloading = false,
  isDownloaded = false,
  onDownload,
}: SearchResultCardProps) {
  return (
    <div className="bg-(--card-bg) border border-(--card-border) flex items-center p-3 rounded-[24px] gap-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 group active:scale-[0.98]">
      {/* Thumbnail */}
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

      {/* Song Info */}
      <div className="flex-1 min-w-0 pr-1">
        <h3 className="font-semibold text-[15px] truncate mb-0.5">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-[13px] text-gray-400 dark:text-gray-500 truncate font-medium">
            {artist}
          </p>
          <span className="text-[11px] text-gray-300 dark:text-gray-600 shrink-0">
            •
          </span>
          <span className="text-[12px] text-gray-400 dark:text-gray-500 font-medium shrink-0">
            {duration}
          </span>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDownload?.();
        }}
        disabled={isDownloading || isDownloaded}
        className={cn(
          "shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
          isDownloaded
            ? "bg-green-500/10 text-green-500 cursor-default"
            : isDownloading
              ? "bg-primary/10 text-primary cursor-wait"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
        )}
      >
        {isDownloaded ? (
          <Check size={18} strokeWidth={2.5} />
        ) : isDownloading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
      </button>
    </div>
  );
}
