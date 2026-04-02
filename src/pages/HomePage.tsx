import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../api/movieApi";
import { getShows } from "../api/showApi";
import { getTheatres } from "../api/theatreApi";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import MovieCard from "../components/movies/MovieCard";
import type { Movie } from "../types/movie";
import type { Show } from "../types/show";
import type { Theatre } from "../types/theatre";
import { appRoutes } from "../utils/routes";

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showsRes, theatresRes] = await Promise.all([
          getMovies(),
          getShows(),
          getTheatres()
        ]);
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : []);
        setShows(Array.isArray(showsRes.data) ? showsRes.data : []);
        setTheatres(Array.isArray(theatresRes.data) ? theatresRes.data : []);
      } catch {
        console.error("Failed to fetch homepage data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nowShowing = movies.filter((movie) => movie.releaseStatus === "RELEASED");
  const upcoming = movies.filter((movie) => movie.releaseStatus === "UPCOMING");
  const liveShows = shows.filter((show) => new Date(show.timing) >= new Date());

  return (
    <div className="space-y-16">
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-slate-800/50 bg-[radial-gradient(circle_at_top,_rgba(225,29,72,0.18),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.9),_rgba(2,6,23,1))] px-6 text-center">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand/10 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-40 h-60 w-60 rounded-full bg-brand-500/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 animate-fade-in-up">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-brand-300">Movie Booking Platform</p>
          <h1 className="mb-4 text-5xl font-extrabold leading-tight md:text-7xl">
            Book Movies with <span className="text-gradient">CineBook</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Browse the latest movies, explore theatres near you, compare showtimes, and confirm seats in a single flow built on your current backend routes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={appRoutes.movies}>
              <Button size="lg">Explore Movies</Button>
            </Link>
            <Link to={appRoutes.shows}>
              <Button variant="outline" size="lg">View Shows</Button>
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <Loader text="Loading homepage..." />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6">
              <p className="text-sm uppercase tracking-wider text-slate-500">Now Showing</p>
              <p className="mt-2 text-3xl font-bold text-white">{nowShowing.length}</p>
              <p className="mt-1 text-sm text-slate-400">Active movie releases customers can book today.</p>
            </div>
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6">
              <p className="text-sm uppercase tracking-wider text-slate-500">Upcoming Shows</p>
              <p className="mt-2 text-3xl font-bold text-white">{liveShows.length}</p>
              <p className="mt-1 text-sm text-slate-400">Scheduled showtimes currently visible in the app.</p>
            </div>
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6">
              <p className="text-sm uppercase tracking-wider text-slate-500">Theatres</p>
              <p className="mt-2 text-3xl font-bold text-white">{theatres.length}</p>
              <p className="mt-1 text-sm text-slate-400">Cities and theatres available for bookings.</p>
            </div>
          </section>

          {nowShowing.length > 0 && (
            <section className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Now Showing</h2>
                <Link to={appRoutes.movies} className="text-sm text-brand transition hover:text-brand-400">View All →</Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {nowShowing.slice(0, 8).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
                <Link to={appRoutes.movies} className="text-sm text-brand transition hover:text-brand-400">View All →</Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {upcoming.slice(0, 4).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {movies.length === 0 && (
            <section className="flex flex-col items-center justify-center py-20 text-center">
              <p className="mb-2 text-5xl">🎥</p>
              <h3 className="mb-2 text-xl font-semibold text-white">No movies yet</h3>
              <p className="text-slate-400">Check back soon for exciting releases.</p>
            </section>
          )}
        </>
      )}

      <section className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-8 text-center">
        <h3 className="mb-2 text-2xl font-bold text-white">Ready to book?</h3>
        <p className="mb-6 text-slate-400">
          Sign up now and get instant access to book your favourite movies.
        </p>
        <Link to={appRoutes.signUp}>
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
