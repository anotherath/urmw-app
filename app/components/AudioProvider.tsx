"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMusicStore } from "@/lib/store";

const PRELOAD_THRESHOLD = 15; // seconds before end to start preloading

/**
 * Global audio element + event wiring.
 * Handles: play/pause sync, ended, preloading next track.
 */
export default function AudioProvider() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const preloadRef = useRef<HTMLLinkElement | null>(null);
  const hasPreloaded = useRef(false);

  const setAudioRef = useMusicStore((s) => s.setAudioRef);
  const syncTime = useMusicStore((s) => s.syncTime);

  // Register the audio element once
  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
    return () => setAudioRef(null);
  }, [setAudioRef]);

  // Preload next song's stream URL via <link rel="prefetch">
  const preloadNext = useCallback(() => {
    if (hasPreloaded.current) return;

    const { getNextSong, getStreamUrl, repeatMode } = useMusicStore.getState();
    // Don't preload if repeat-one (same song loops)
    if (repeatMode === "one") return;

    const nextSong = getNextSong();
    if (!nextSong) return;

    const url = getStreamUrl(nextSong);
    if (!url) return;

    // Clean up old prefetch link if any
    if (preloadRef.current) {
      preloadRef.current.remove();
      preloadRef.current = null;
    }

    // Use link prefetch — browser-managed, no extra RAM
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "fetch";
    link.href = url;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    preloadRef.current = link;
    hasPreloaded.current = true;
  }, []);

  // Wire up audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => useMusicStore.setState({ isPlaying: true });
    const onPause = () => useMusicStore.setState({ isPlaying: false });

    const onTimeUpdate = () => {
      const ct = audio.currentTime;
      const dur = audio.duration || 0;
      syncTime(ct, dur);

      // Preload next track when nearing the end
      if (dur > 0 && dur - ct <= PRELOAD_THRESHOLD) {
        preloadNext();
      }
    };

    const onEnded = () => {
      const { repeatMode } = useMusicStore.getState();
      // repeat-one is handled by audio.loop, so this won't fire for it
      // For "all" and "off", call next()
      hasPreloaded.current = false;

      // Clean up prefetch link
      if (preloadRef.current) {
        preloadRef.current.remove();
        preloadRef.current = null;
      }

      if (repeatMode !== "one") {
        useMusicStore.getState().next();
      }
    };

    // When loading a new song, auto-play once ready
    const onCanPlay = () => {
      const { isPlaying } = useMusicStore.getState();
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    // Reset preload flag when src changes
    const onLoadStart = () => {
      hasPreloaded.current = false;
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("loadstart", onLoadStart);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("loadstart", onLoadStart);

      // Clean up prefetch link
      if (preloadRef.current) {
        preloadRef.current.remove();
        preloadRef.current = null;
      }
    };
  }, [syncTime, preloadNext]);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      crossOrigin="anonymous"
      playsInline
    />
  );
}
