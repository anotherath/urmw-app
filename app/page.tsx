import SearchBar from "./components/SearchBar";
import MusicCard from "./components/MusicCard";
import FloatingActionButton from "./components/FloatingActionButton";

export default function Home() {
  const recentlyPlayed = [
    {
      id: 1,
      title: "Peaches",
      artist: "Justin Bieber",
      duration: "3:18",
      cover:
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "As It Was",
      artist: "Harry Styles",
      duration: "2:47",
      cover:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Levitating",
      artist: "Dua Lipa",
      duration: "3:23",
      cover:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&h=400&auto=format&fit=crop",
    },
  ];

  const yourMusic = [
    {
      id: 4,
      title: "Blinding Lights",
      artist: "The Weeknd",
      duration: "3:20",
      cover:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      duration: "2:54",
      cover:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Say So",
      artist: "Doja Cat",
      duration: "3:57",
      cover:
        "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 7,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      duration: "2:58",
      cover:
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 8,
      title: "Don't Start Now",
      artist: "Dua Lipa",
      duration: "3:03",
      cover:
        "https://images.unsplash.com/photo-1420161907993-e29922204c6b?q=80&w=400&h=400&auto=format&fit=crop",
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-4 pt-6 pb-6 hide-scrollbar relative">
      <div className="mb-8 pl-1">
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight mb-1">
          Good Morning
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Find your favorite music
        </p>
      </div>

      <SearchBar className="mb-8" />

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">
          Recently Played
        </h2>
        <div className="space-y-3">
          {recentlyPlayed.map((song) => (
            <MusicCard key={song.id} {...song} isRecentlyPlayed />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold text-gray-900">Your Music</h2>
          <button className="text-[13px] font-semibold text-primary hover:text-primary-dark transition-colors">
            See all
          </button>
        </div>
        <div className="space-y-3">
          {yourMusic.map((song) => (
            <MusicCard key={song.id} {...song} />
          ))}
        </div>
      </section>

      {/* <FloatingActionButton /> */}
    </main>
  );
}
