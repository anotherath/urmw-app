"use client";

import { User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 px-6 bg-slate-50/95 backdrop-blur-lg  flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <h1 className="text-2xl font-black tracking-tighter text-gray-900">
          URMW
        </h1>
      </Link>

      <Link
        href="/library"
        className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <User size={24} strokeWidth={2.25} />
      </Link>
    </header>
  );
}
