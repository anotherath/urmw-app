"use client";

import { cn } from "@/lib/utils";

interface GenreCardProps {
  name: string;
  songCount: number;
  gradient: string;
}

export default function GenreCard({ name, songCount, gradient }: GenreCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl aspect-4/3 group cursor-pointer active:scale-95 transition-all shadow-md hover:shadow-lg">
      <div className={cn("absolute inset-0 opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-100", gradient)}></div>
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-bold text-lg leading-tight mb-1">{name}</h3>
        <p className="text-xs font-medium text-white/80">{songCount} Songs</p>
      </div>
    </div>
  );
}
