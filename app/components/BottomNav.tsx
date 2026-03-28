"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "HOME", href: "/", icon: Home },
    { label: "SEARCH", href: "/search", icon: Search },
    { label: "MUSIC", href: "/player", icon: AudioLines },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      <nav className="flex justify-between items-center h-16 px-8 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full pt-2 transition-colors duration-200 w-16",
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600",
              )}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1.5"
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
