import { create } from "zustand";

const STREAM_BASE = "https://urmw-stream.anotheralltimehigh.workers.dev";

export interface Song {
  videoId: string;
  title: string;
  artist: string;
  duration: number;
  fileId: string;
}

export type RepeatMode = "off" | "one" | "all";

interface MusicState {
  // Playlist
  playlist: Song[];
  currentIndex: number;
  currentSong: Song | null;

  // Playback
  isPlaying: boolean;
  repeatMode: RepeatMode;

  // Audio timing (synced from the <audio> element)
  currentTime: number;
  audioDuration: number;
  progress: number;

  // Audio element ref (single global instance, managed by AudioProvider)
  audioRef: HTMLAudioElement | null;

  // Actions
  setPlaylist: (songs: Song[]) => void;
  playSong: (index: number) => void;
  playSongById: (videoId: string) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  cycleRepeatMode: () => void;
  seekTo: (percent: number) => void;
  syncTime: (currentTime: number, duration: number) => void;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
  getStreamUrl: (song?: Song | null) => string;
  getNextSong: () => Song | null;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  // State
  playlist: [],
  currentIndex: 0,
  currentSong: null,
  isPlaying: false,
  repeatMode: "off",
  currentTime: 0,
  audioDuration: 0,
  progress: 0,
  audioRef: null,

  // Set the whole playlist (e.g., from Supabase data)
  setPlaylist: (songs) => {
    const state = get();
    if (
      state.playlist.length === songs.length &&
      state.playlist[0]?.videoId === songs[0]?.videoId
    ) {
      return;
    }
    const currentSong = songs[0] || null;
    set({
      playlist: songs,
      currentIndex: 0,
      currentSong,
    });
    if (state.audioRef && currentSong) {
      state.audioRef.src = state.getStreamUrl(currentSong);
      state.audioRef.load();
    }
  },

  // Play a specific song by index — always auto-plays
  playSong: (index) => {
    const { playlist, audioRef } = get();
    if (index < 0 || index >= playlist.length) return;

    const song = playlist[index];
    const url = `${STREAM_BASE}/?id=${song.fileId}`;

    set({
      currentIndex: index,
      currentSong: song,
      isPlaying: true,
      currentTime: 0,
      progress: 0,
      audioDuration: 0,
    });

    if (audioRef) {
      audioRef.pause();
      audioRef.src = url;
      audioRef.load();
      audioRef.play().catch((err) => {
        if (err?.name !== "AbortError") console.error(err);
      });
    }
  },

  // Play a specific song by videoId
  playSongById: (videoId) => {
    const { playlist } = get();
    const index = playlist.findIndex((s) => s.videoId === videoId);
    if (index !== -1) {
      get().playSong(index);
    }
  },

  // Toggle play/pause
  togglePlay: () => {
    const { audioRef, isPlaying, currentSong, getStreamUrl } = get();
    if (!audioRef || !currentSong) return;

    if (isPlaying) {
      audioRef.pause();
    } else {
      const expectedSrc = getStreamUrl(currentSong);
      if (!audioRef.src || !audioRef.src.includes(currentSong.fileId)) {
        audioRef.src = expectedSrc;
        audioRef.load();
        set({ isPlaying: true });
      } else {
        audioRef.play().catch((err) => {
          if (err?.name !== "AbortError") console.error(err);
        });
      }
    }
    // isPlaying is synced via audio events in AudioProvider
  },

  // Next track — skip button always goes to next regardless of repeat mode
  next: () => {
    const { currentIndex, playlist, repeatMode } = get();

    let nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        // End of playlist, no repeat — stop
        set({ isPlaying: false });
        return;
      }
    }
    get().playSong(nextIndex);
  },

  // Previous track
  prev: () => {
    const { currentIndex, currentTime, playlist, repeatMode } = get();

    // If more than 3 seconds in, restart current song
    if (currentTime > 3) {
      const { audioRef } = get();
      if (audioRef) {
        audioRef.currentTime = 0;
      }
      set({ currentTime: 0, progress: 0 });
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === "all") {
        prevIndex = playlist.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    get().playSong(prevIndex);
  },

  // Cycle: off → all → one → off
  cycleRepeatMode: () => {
    const { repeatMode, audioRef } = get();
    const modes: RepeatMode[] = ["off", "all", "one"];
    const idx = modes.indexOf(repeatMode);
    const nextMode = modes[(idx + 1) % modes.length];

    // Use the native loop attribute for repeat-one (memory efficient)
    if (audioRef) {
      audioRef.loop = nextMode === "one";
    }

    set({ repeatMode: nextMode });
  },

  // Seek to a percentage
  seekTo: (percent) => {
    const { audioRef } = get();
    if (!audioRef || !audioRef.duration) return;
    const time = (percent / 100) * audioRef.duration;
    audioRef.currentTime = time;
    set({ currentTime: time, progress: percent });
  },

  // Sync time from the audio element's timeupdate event
  syncTime: (currentTime, duration) => {
    const progress = duration ? (currentTime / duration) * 100 : 0;
    set({ currentTime, audioDuration: duration, progress });
  },

  // Set the audio element ref
  setAudioRef: (ref) => {
    set({ audioRef: ref });
    if (ref && !ref.src) {
      const { currentSong, getStreamUrl } = get();
      if (currentSong) {
        ref.src = getStreamUrl(currentSong);
        ref.load();
      }
    }
  },

  // Get stream URL for a song (defaults to current)
  getStreamUrl: (song) => {
    const s = song ?? get().currentSong;
    if (!s) return "";
    return `${STREAM_BASE}/?id=${s.fileId}`;
  },

  // Get the next song in the playlist (for preloading)
  getNextSong: () => {
    const { currentIndex, playlist, repeatMode } = get();
    let nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) {
      if (repeatMode === "all") nextIndex = 0;
      else return null;
    }
    return playlist[nextIndex] || null;
  },
}));
