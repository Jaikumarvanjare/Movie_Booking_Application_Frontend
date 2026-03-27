import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../api/movieApi";
import Loader from "../components/common/Loader";
import { Movie } from "../types/movie";

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getMovies();
        setMovies(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        setError("Failed to load movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Now Showing</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="group rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-rose-600"
          >
            <div className="mb-4 aspect-[2/3] overflow-hidden rounded-lg">
              <img
                src={movie.poster || "https://via.placeholder.com/300x450?text=No+Poster"}
                alt={movie.name}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">{movie.name}</h2>
            <p className="line-clamp-2 text-sm text-slate-400">{movie.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{movie.language}</span>
              <span>{movie.releaseStatus}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;