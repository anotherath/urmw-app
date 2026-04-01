"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import SearchResultCard from "../components/SearchResultCard";
import { Loader2, SearchX } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

  // Fetch already-downloaded video IDs from Supabase on mount
  useEffect(() => {
    async function fetchDownloaded() {
      try {
        const res = await fetch("/api/downloaded");
        const json = await res.json();
        if (json.ids && json.ids.length > 0) {
          setDownloadedIds(new Set(json.ids));
        }
      } catch {
        // Silently fail – worst case, download icons show for everything
      }
    }
    fetchDownloaded();
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();

      if (json.error) {
        setError(json.error);
        setResults([]);
      } else {
        setResults(json.data || []);
      }
    } catch {
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      doSearch(query);
    }
  }, [query, doSearch]);

  const handleDownload = async (videoId: string) => {
    if (downloadingIds.has(videoId) || downloadedIds.has(videoId)) return;

    setDownloadingIds((prev) => new Set(prev).add(videoId));

    try {
      const res = await fetch(
        `/api/process?video_id=${encodeURIComponent(videoId)}`,
      );
      const json = await res.json();

      if (res.ok) {
        setDownloadedIds((prev) => new Set(prev).add(videoId));
        // Revalidate server data so home page shows the new song
        router.refresh();
      } else {
        alert(json.detail || json.error || "Download failed");
      }
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(videoId);
        return next;
      });
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 pt-6 pb-6 hide-scrollbar relative">
      <div className="mb-8 pl-1">
        <h1 className="text-[28px] font-black text-(--text-main) tracking-tight mb-1">
          Search
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Find your favorite music from YouTube
        </p>
      </div>

      <SearchBar className="mb-8" defaultValue={query} />

      <section className="mb-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Searching for &ldquo;{query}&rdquo;...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-[24px]">
            {error}
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-lg font-bold text-(--text-main)">
                Search Results
              </h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                {results.length} results
              </span>
            </div>
            <div className="space-y-3">
              {results.map((result) => (
                <SearchResultCard
                  key={result.id}
                  videoId={result.id}
                  title={result.title}
                  artist={result.artist}
                  duration={formatDuration(result.duration)}
                  cover={`https://img.youtube.com/vi/${result.id}/mqdefault.jpg`}
                  isDownloading={downloadingIds.has(result.id)}
                  isDownloaded={downloadedIds.has(result.id)}
                  onDownload={() => handleDownload(result.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <SearchX size={40} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              No results found for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}

        {/* Initial State */}
        {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <SearchX size={40} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
              Search for a song to get started
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
