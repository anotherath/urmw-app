import SearchBar from "./components/SearchBar";
import MusicCard from "./components/MusicCard";
import PlaylistInitializer from "./components/PlaylistInitializer";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDuration(seconds: number) {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  if (hour < 22) return "Good Evening";
  return "Good Night";
}

export default async function Home() {
  if (!supabase) {
    return (
      <main className="flex-1 p-6 lg:px-8 lg:py-8">
        <div className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-[24px]">
          Configuration Error: Supabase environment variables are missing.
        </div>
      </main>
    );
  }

  // Fetch songs from Supabase
  const { data: songs, error } = await supabase
    .from("videos")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching songs from Supabase:", error);
  }

  const musicList = songs || [];

  return (
    <main className="flex-1 overflow-y-auto px-4 pt-6 pb-6 hide-scrollbar relative lg:px-8 lg:pt-8 lg:pb-8">
      {/* Initialize the Zustand store with songs from Supabase */}
      <PlaylistInitializer songs={musicList} />

      <div className="mb-8 pl-1">
        <h1 className="text-[28px] font-black text-(--text-main) tracking-tight mb-1 lg:text-4xl">
          {getGreeting()}
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 lg:text-base">
          Find your favorite music
        </p>
      </div>

      <SearchBar className="mb-8 lg:max-w-xl" />

      <section className="mb-6">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold text-(--text-main) lg:text-xl">My Music</h2>
        </div>

        {error ? (
          <div className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-[24px]">
            Failed to load music. Please try again.
          </div>
        ) : musicList.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-(--card-bg) border border-(--card-border) rounded-[24px]">
            No music found. Use the search to add some songs!
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
            {musicList.map((song) => (
              <MusicCard
                key={song.videoId}
                videoId={song.videoId}
                title={song.title}
                artist={song.artist}
                duration={formatDuration(song.duration)}
                cover={`https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
