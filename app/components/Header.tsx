"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 px-6 bg-(--bg-header) backdrop-blur-lg border-(--card-border) flex items-center justify-between transition-colors duration-500">
      <Link href="/">
        <h1 className="text-2xl font-black tracking-tighter text-primary">
          URMW
        </h1>
      </Link>

      <button
        onClick={toggleTheme}
        className={`w-10 h-10 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center border-none outline-none ${
          isDark 
            ? "bg-slate-800 text-yellow-400" 
            : "bg-slate-100 text-primary"
        }`}
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 fill-yellow-400/20 transition-all duration-500" />
        ) : (
          <Moon className="w-5 h-5 fill-primary/10 transition-all duration-500" />
        )}
      </button>
    </header>
  );
}
