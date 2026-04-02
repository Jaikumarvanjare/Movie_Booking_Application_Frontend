import { useEffect, useMemo, useState } from "react";
import { getMovies } from "../api/movieApi";
import { getShows } from "../api/showApi";
import { getTheatres } from "../api/theatreApi";
import Loader from "../components/common/Loader";
import SearchBar from "../components/common/SearchBar";
import ShowCard from "../components/shows/ShowCard";
import type { Movie } from "../types/movie";
import type { Show } from "../types/show";
import type { Theatre } from "../types/theatre";

const ShowsPage = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedTheatreId, setSelectedTheatreId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showsRes, moviesRes, theatresRes] = await Promise.all([
          getShows(),
          getMovies(),
          getTheatres()
        ]);
        setShows(Array.isArray(showsRes.data) ? showsRes.data : []);
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : []);
        setTheatres(Array.isArray(theatresRes.data) ? theatresRes.data : []);
      } catch {
        setError("Failed to fetch shows");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const movieMap = useMemo(() => new Map(movies.map((movie) => [movie.id, movie])), [movies]);
  const theatreMap = useMemo(() => new Map(theatres.map((theatre) => [theatre.id, theatre])), [theatres]);

  const filteredShows = shows.filter((show) => {
    const movie = movieMap.get(show.movieId);
    const theatre = theatreMap.get(show.theatreId);
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      movie?.name.toLowerCase().includes(query) ||
      theatre?.name.toLowerCase().includes(query) ||
      theatre?.city.toLowerCase().includes(query);
    const matchesMovie = !selectedMovieId || show.movieId === selectedMovieId;
    const matchesTheatre = !selectedTheatreId || show.theatreId === selectedTheatreId;

    return Boolean(matchesSearch && matchesMovie && matchesTheatre);
  });

  const groupedShows = filteredShows.reduce<Record<string, Show[]>>((groups, show) => {
    const dateKey = new Date(show.timing).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    groups[dateKey] = groups[dateKey] ? [...groups[dateKey], show] : [show];
    return groups;
  }, {});

  if (loading) return <Loader text="Loading shows..." />;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="mb-2">
        <h1 className="mb-2 text-3xl font-bold text-white">Available Shows</h1>
        <p className="text-slate-400">Browse showtimes by movie, theatre, and city.</p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-800/50 bg-slate-900/40 p-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <SearchBar placeholder="Search by movie, theatre, or city..." onSearch={setSearchTerm} />
        <select
          value={selectedMovieId}
          onChange={(e) => setSelectedMovieId(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-brand"
        >
          <option value="">All Movies</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>{movie.name}</option>
          ))}
        </select>
        <select
          value={selectedTheatreId}
          onChange={(e) => setSelectedTheatreId(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-brand"
        >
          <option value="">All Theatres</option>
          {theatres.map((theatre) => (
            <option key={theatre.id} value={theatre.id}>{theatre.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {Object.keys(groupedShows).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedShows).map(([date, dateShows]) => (
            <section key={date}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {date}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dateShows.map((show) => (
                  <ShowCard
                    key={show.id}
                    show={show}
                    movieName={movieMap.get(show.movieId)?.name}
                    theatreName={theatreMap.get(show.theatreId)?.name}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-5xl">🎭</p>
          <h3 className="mb-2 text-xl font-semibold text-white">No shows available</h3>
          <p className="text-slate-400">
            {searchTerm || selectedMovieId || selectedTheatreId
              ? "Try clearing the filters or search term."
              : "Check back later for new showtimes."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowsPage;
