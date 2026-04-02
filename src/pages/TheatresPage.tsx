import { useCallback, useEffect, useMemo, useState } from "react";
import { getMovies } from "../api/movieApi";
import { getTheatres } from "../api/theatreApi";
import Loader from "../components/common/Loader";
import SearchBar from "../components/common/SearchBar";
import TheatreCard from "../components/theatres/TheatreCard";
import type { Movie } from "../types/movie";
import type { Theatre, TheatreSearchParams } from "../types/theatre";

const TheatresPage = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: TheatreSearchParams = {};
        if (cityFilter) params.city = cityFilter;
        const [theatresRes, moviesRes] = await Promise.all([getTheatres(params), getMovies()]);
        setTheatres(Array.isArray(theatresRes.data) ? theatresRes.data : []);
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : []);
      } catch {
        setError("Failed to fetch theatres");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cityFilter]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const movieMap = useMemo(() => new Map(movies.map((movie) => [movie.id, movie.name])), [movies]);

  const filteredTheatres = theatres.filter((theatre) => {
    const query = searchTerm.trim().toLowerCase();
    const movieNames = (theatre.movieIds || []).map((movieId) => movieMap.get(movieId)?.toLowerCase()).filter(Boolean);

    return (
      !query ||
      theatre.name.toLowerCase().includes(query) ||
      theatre.city.toLowerCase().includes(query) ||
      theatre.address?.toLowerCase().includes(query) ||
      movieNames.some((movieName) => movieName?.includes(query))
    );
  });

  const cities = [...new Set(theatres.map((theatre) => theatre.city))].sort();

  if (loading) return <Loader text="Loading theatres..." />;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="mb-2">
        <h1 className="mb-2 text-3xl font-bold text-white">Theatres</h1>
        <p className="text-slate-400">Find theatres near you and see what is currently running there.</p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-800/50 bg-slate-900/40 p-5 lg:grid-cols-[1.2fr_auto]">
        <SearchBar placeholder="Search theatres, cities, or movie names..." onSearch={handleSearch} />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCityFilter("")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              !cityFilter ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Cities
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                cityFilter === city ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {filteredTheatres.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTheatres.map((theatre) => (
            <TheatreCard
              key={theatre.id}
              theatre={theatre}
              movieNames={(theatre.movieIds || []).map((movieId) => movieMap.get(movieId)).filter(Boolean) as string[]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-5xl">🏛️</p>
          <h3 className="mb-2 text-xl font-semibold text-white">No theatres found</h3>
          <p className="text-slate-400">Try a different city, movie title, or search term.</p>
        </div>
      )}
    </div>
  );
};

export default TheatresPage;
