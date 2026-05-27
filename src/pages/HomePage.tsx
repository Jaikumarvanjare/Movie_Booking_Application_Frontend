import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../api/movieApi";
import Loader from "../components/common/Loader";
import MovieCard from "../components/movies/MovieCard";
import { useAuth } from "../hooks/useAuth";
import type { Movie } from "../types/movie";
import { readSettledApiArray } from "../utils/apiResults";
import { appRoutes } from "../utils/routes";

type StatusFilter = "ALL" | "RELEASED" | "UPCOMING";

const normalizeReleaseStatus = (status: string) => {
  const normalized = status.trim().toUpperCase().replace(/\s+/g, "_");
  return normalized === "NOW_SHOWING" || normalized === "NOWSHOWING" || normalized === "ACTIVE"
    ? "RELEASED"
    : normalized;
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

const getPopularMovies = (movies: Movie[], nowShowing: Movie[]) => {
  const source = nowShowing.length >= 5 ? nowShowing : movies;
  const seed = new Date().getFullYear() * 1000 + dayOfYear(new Date());

  return [...source]
    .sort((a, b) => {
      const scoreDiff = popularityScore(b) - popularityScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return stableDailyRank(a, seed) - stableDailyRank(b, seed);
    })
    .slice(0, 5);
};

const firstNameFor = (name?: string) => {
  return name?.trim().split(/\s+/)[0] || "";
};

const releaseLabel = (status: string) => {
  return normalizeReleaseStatus(status)
    .toLowerCase()
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
};

const HomePage = () => {
  const { user } = useAuth();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const firstName = firstNameFor(user?.name);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await Promise.allSettled([getMovies()]);
        setMovies(readSettledApiArray(moviesRes[0]));
      } catch {
        console.error("Failed to fetch homepage data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMovies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return movies.filter((movie) => {
      const matchesSearch = !query || movie.name.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "ALL" || normalizeReleaseStatus(movie.releaseStatus) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [movies, searchTerm, statusFilter]);

  const nowShowing = useMemo(
    () => filteredMovies.filter((movie) => normalizeReleaseStatus(movie.releaseStatus) === "RELEASED"),
    [filteredMovies]
  );
  const upcoming = useMemo(
    () => filteredMovies.filter((movie) => normalizeReleaseStatus(movie.releaseStatus) === "UPCOMING"),
    [filteredMovies]
  );
  const popularMovies = useMemo(
    () => getPopularMovies(filteredMovies, nowShowing),
    [filteredMovies, nowShowing]
  );

  const scrollCarousel = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth"
    });
  };

  if (loading) return <Loader text="Loading movies..." />;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      <section>
        <div>
          <p className="text-sm font-bold text-brand">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-white">
            Find your next show
          </h1>
        </div>
      </section>

      <section className="space-y-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            Search
          </span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-14 w-full rounded-2xl border border-brand/30 bg-slate-900/80 pl-24 pr-4 text-white outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(225,29,72,0.16)]"
            placeholder="Search movies by name"
            type="search"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["ALL", "All"],
            ["RELEASED", "Now showing"],
            ["UPCOMING", "Coming soon"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value as StatusFilter)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                statusFilter === value
                  ? "border-brand bg-brand text-white"
                  : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-brand/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {popularMovies.length > 0 && (
        <section className="relative">
          <div
            ref={carouselRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {popularMovies.map((movie) => (
              <Link
                key={movie.id}
                to={appRoutes.movieDetails(movie.id)}
                className="group relative h-[390px] min-w-[280px] snap-start overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:min-w-[320px]"
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

          {popularMovies.length > 1 && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                className="pointer-events-auto relative flex h-14 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/35 text-3xl font-light text-white opacity-90 backdrop-blur-md transition hover:bg-slate-950/65"
                aria-label="Previous movie"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                className="pointer-events-auto relative flex h-14 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/35 text-3xl font-light text-white opacity-90 backdrop-blur-md transition hover:bg-slate-950/65"
                aria-label="Next movie"
              >
                ›
              </button>
            </div>
          )}
        </section>
      )}

      {filteredMovies.length === 0 ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <h2 className="text-2xl font-bold text-white">No movies found</h2>
          <p className="mt-2 text-slate-400">Try a different movie name or release filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("ALL");
            }}
            className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Clear filters
          </button>
        </section>
      ) : (
        <>
          {nowShowing.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Now showing</h2>
                <Link to={appRoutes.movies} className="text-sm font-semibold text-brand transition hover:text-brand-400">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-5">
                {nowShowing.slice(0, 5).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Coming soon</h2>
                <Link to={appRoutes.movies} className="text-sm font-semibold text-brand transition hover:text-brand-400">
                  View all
                </Link>
              </div>
              <div className="grid gap-3">
                {upcoming.slice(0, 5).map((movie) => (
                  <Link
                    key={movie.id}
                    to={appRoutes.movieDetails(movie.id)}
                    className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-brand/40"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-800">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-white">{movie.name}</h3>
                      <p className="text-sm text-slate-400">
                        {new Date(movie.releaseDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand">{releaseLabel(movie.releaseStatus)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
