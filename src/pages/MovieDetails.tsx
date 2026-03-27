import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../api/movieApi";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { Movie } from "../types/movie";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const response = await getMovieById(id);
        setMovie(response.data);
      } catch (err) {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <Loader />;
  if (error || !movie) return <div className="text-center text-red-400">{error || "Movie not found"}</div>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-[2/3] overflow-hidden rounded-xl">
        <img
          src={movie.poster || "https://via.placeholder.com/500x750?text=No+Poster"}
          alt={movie.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="text-white">
        <h1 className="mb-4 text-4xl font-bold">{movie.name}</h1>
        <p className="mb-6 text-slate-300 leading-relaxed">{movie.description}</p>
        
        <div className="space-y-3 text-sm">
          <p><span className="font-semibold text-slate-200">Director:</span> {movie.director}</p>
          <p><span className="font-semibold text-slate-200">Language:</span> {movie.language}</p>
          <p><span className="font-semibold text-slate-200">Release Date:</span> {movie.releaseDate}</p>
          <p><span className="font-semibold text-slate-200">Status:</span> {movie.releaseStatus}</p>
          <p><span className="font-semibold text-slate-200">Cast:</span> {movie.casts?.join(", ")}</p>
        </div>

        {movie.trailerUrl && (
          <a
            href={movie.trailerUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-rose-600 hover:underline"
          >
            Watch Trailer →
          </a>
        )}

        <div className="mt-8">
          <Link to="/shows">
            <Button>Book Tickets</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;