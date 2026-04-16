"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Search, AudioLines, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      if (!theme) localStorage.setItem("theme", "dark");
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

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Player", href: "/player", icon: AudioLines },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-(--bg-header) backdrop-blur-lg border-t border-(--card-border) shadow-[0_-10px_40px_rgba(0,0,0,0.04)] lg:fixed lg:left-0 lg:top-0 lg:bottom-auto lg:translate-x-0 lg:w-64 lg:h-full lg:max-w-none lg:border-t-0 lg:border-r lg:shadow-none lg:flex lg:flex-col lg:px-5 lg:py-6">
      <Link href="/" className="hidden lg:block mb-8 px-2">
        <h1 className="text-3xl font-black tracking-tighter text-primary">
          URMW
        </h1>
      </Link>

      <nav className="flex justify-between items-center h-16 px-8 pb-safe lg:flex-col lg:h-auto lg:items-stretch lg:justify-start lg:gap-1 lg:px-0 lg:pb-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full pt-2 transition-colors duration-200 w-16 lg:flex-row lg:justify-start lg:gap-3 lg:w-full lg:px-3 lg:py-2.5 lg:rounded-xl ",
                isActive
                  ? "text-primary lg:bg-primary/10"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 lg:hover:bg-gray-100 lg:dark:hover:bg-slate-800",
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1.5 lg:mb-0"
              />
              <span className="hidden lg:inline text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop theme toggle */}
      <div className="hidden lg:block mt-auto px-2 pt-4">
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-300 border-none outline-none",
            isDark
              ? "text-yellow-400 hover:bg-slate-800"
              : "text-primary hover:bg-slate-100",
          )}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 fill-yellow-400/20" />
          ) : (
            <Moon className="w-5 h-5 fill-primary/10" />
          )}
          <span className="text-sm font-medium">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </div>
  );
}
