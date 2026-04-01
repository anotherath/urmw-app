"use client";

import { useEffect } from "react";
import { useMusicStore, Song } from "@/lib/store";

interface PlaylistInitializerProps {
  songs: Song[];
}

/**
 * Client component that receives server-fetched songs and
 * populates the Zustand store on mount / when data changes.
 */
export default function PlaylistInitializer({ songs }: PlaylistInitializerProps) {
  const setPlaylist = useMusicStore((s) => s.setPlaylist);

  useEffect(() => {
    if (songs.length > 0) {
      setPlaylist(songs);
    }
  }, [songs, setPlaylist]);

  return null;
}
