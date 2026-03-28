import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import MiniPlayer from "./components/MiniPlayer";
import BottomNav from "./components/BottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URMW",
  description: "You Are My World - Music App",
};

export const viewport = {
  themeColor: "#FF6B9E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 overscroll-none text-gray-900">
        <Header />
        <div className="pb-42">{children}</div>

        <MiniPlayer />
        <BottomNav />
      </body>
    </html>
  );
}
