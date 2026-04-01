"use client";

import { Search, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ placeholder = "Search for music...", className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative w-full", className)}>
      <div 
        className={cn(
          "flex items-center glass rounded-full px-4 py-3 transition-all duration-300",
          isFocused ? "shadow-md ring-2 ring-primary/40 bg-(--card-bg)" : "shadow-sm hover:shadow"
        )}
      >
        <Search size={20} className={cn("transition-colors", isFocused ? "text-primary" : "text-slate-400 dark:text-gray-500")} />
        <input 
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-(--text-main) placeholder:text-slate-400 dark:placeholder:text-gray-500 font-medium"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="text-slate-400 dark:text-gray-500 hover:text-primary transition-colors">
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
}
