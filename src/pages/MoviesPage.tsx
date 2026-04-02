import { useCallback, useEffect, useState } from "react";
import { getMovies } from "../api/movieApi";
import MovieCard from "../components/movies/MovieCard";
import SearchBar from "../components/common/SearchBar";
import Loader from "../components/common/Loader";
import type { Movie } from "../types/movie";

type FilterTab = "ALL" | "RELEASED" | "UPCOMING";

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getMovies();
        setMovies(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      !searchTerm ||
      movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "ALL" || movie.releaseStatus === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "ALL", label: "All Movies" },
    { key: "RELEASED", label: "Now Showing" },
    { key: "UPCOMING", label: "Coming Soon" },
  ];

  if (loading) return <Loader text="Loading movies..." />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Movies</h1>
        <p className="text-slate-400">Discover and explore the latest movies</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-slate-800/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-brand text-white shadow-lg shadow-brand/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <SearchBar
          placeholder="Search by name or director..."
          onSearch={handleSearch}
          className="sm:w-72"
        />
      </div>

      {/* Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-5xl">🔍</p>
          <h3 className="mb-2 text-xl font-semibold text-white">No movies found</h3>
          <p className="text-slate-400">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "No movies available in this category"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;