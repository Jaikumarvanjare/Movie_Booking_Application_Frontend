import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../api/movieApi";
import MovieCard from "../components/movies/MovieCard";
import SearchBar from "../components/common/SearchBar";
import Loader from "../components/common/Loader";
import type { Movie } from "../types/movie";
import { appRoutes } from "../utils/routes";

type FilterTab = "ALL" | "RELEASED" | "UPCOMING";

const normalizeReleaseStatus = (status: string) => {
  const normalized = status.trim().toUpperCase().replace(/\s+/g, "_");
  return normalized === "NOW_SHOWING" || normalized === "NOWSHOWING" || normalized === "ACTIVE"
    ? "RELEASED"
    : normalized;
};

const releaseLabel = (status: string) => {
  return normalizeReleaseStatus(status)
    .toLowerCase()
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
};

const dayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
};

const stableDailyRank = (movie: Movie, seed: number) => {
  const value = `${movie.id}${movie.name}${seed}`;
  return value
    .split("")
    .reduce((sum, character) => ((sum * 31 + character.charCodeAt(0)) & 0x7fffffff), 0);
};

const popularityScore = (movie: Movie) => {
  let score = 0;
  if (normalizeReleaseStatus(movie.releaseStatus) === "RELEASED") score += 40;
  if (movie.poster?.trim()) score += 25;
  if (movie.trailerUrl?.trim()) score += 20;

  const releaseDate = new Date(movie.releaseDate);
  if (!Number.isNaN(releaseDate.getTime())) {
    const ageInDays = Math.floor((Date.now() - releaseDate.getTime()) / 86400000);
    if (ageInDays >= 0 && ageInDays <= 90) score += 15;
  }

  return score;
};

const getPopularMovies = (movies: Movie[]) => {
  const seed = new Date().getFullYear() * 1000 + dayOfYear(new Date());

  return [...movies]
    .sort((a, b) => {
      const scoreDiff = popularityScore(b) - popularityScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return stableDailyRank(a, seed) - stableDailyRank(b, seed);
    })
    .slice(0, 5);
};

const MoviesPage = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [showAllMovies, setShowAllMovies] = useState(false);

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
    setShowAllMovies(false);
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      !searchTerm ||
      movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "ALL" || normalizeReleaseStatus(movie.releaseStatus) === activeTab;
    return matchesSearch && matchesTab;
  });
  const visibleMovies = showAllMovies ? filteredMovies : filteredMovies.slice(0, 5);
  const carouselMovies = getPopularMovies(filteredMovies);

  const scrollCarousel = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth"
    });
  };

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
              onClick={() => {
                setActiveTab(tab.key);
                setShowAllMovies(false);
              }}
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
        <>
          <section className="relative mb-8">
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {carouselMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={appRoutes.movieDetails(movie.id)}
                  className="group relative h-[360px] min-w-[260px] snap-start overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:min-w-[320px]"
                >
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-sm font-semibold text-slate-400">
                      Poster unavailable
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="mb-3 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold text-white">
                      {releaseLabel(movie.releaseStatus)}
                    </span>
                    <h2 className="line-clamp-2 text-2xl font-extrabold text-white">{movie.name}</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-300">{movie.language}</p>
                  </div>
                </Link>
              ))}
            </div>

            {carouselMovies.length > 1 && (
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4">
                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  className="pointer-events-auto relative flex h-14 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/35 text-3xl font-light text-white opacity-90 backdrop-blur-md transition hover:bg-slate-950/65"
                  aria-label="Previous movie"
                >
                  ã
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  className="pointer-events-auto relative flex h-14 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/35 text-3xl font-light text-white opacity-90 backdrop-blur-md transition hover:bg-slate-950/65"
                  aria-label="Next movie"
                >
                  õ
                </button>
              </div>
            )}
          </section>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {visibleMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {filteredMovies.length > 5 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllMovies((current) => !current)}
                className="rounded-xl border border-brand/40 px-6 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
              >
                {showAllMovies ? "Show less" : `View more (${filteredMovies.length - 5})`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-5xl">üîç</p>
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
