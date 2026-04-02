import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById } from "../api/movieApi";
import { getShows } from "../api/showApi";
import { getTheatres } from "../api/theatreApi";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ShowCard from "../components/shows/ShowCard";
import { appRoutes } from "../utils/routes";
import type { Movie } from "../types/movie";
import type { Show } from "../types/show";
import type { Theatre } from "../types/theatre";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [movieRes, showsRes, theatresRes] = await Promise.all([
          getMovieById(id),
          getShows({ movieId: id }),
          getTheatres()
        ]);
        setMovie(movieRes.data);
        setShows(Array.isArray(showsRes.data) ? showsRes.data : []);
        setTheatres(Array.isArray(theatresRes.data) ? theatresRes.data : []);
      } catch {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const theatreMap = useMemo(() => new Map(theatres.map((theatre) => [theatre.id, theatre])), [theatres]);
  const theatreNames = Array.from(new Set(shows.map((show) => theatreMap.get(show.theatreId)?.name).filter(Boolean))) as string[];

  if (loading) return <Loader text="Loading movie..." />;
  if (error || !movie) return <div className="text-center text-red-400">{error || "Movie not found"}</div>;

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = movie.trailerUrl ? getYouTubeEmbedUrl(movie.trailerUrl) : null;

  return (
    <div className="animate-fade-in space-y-10">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <img src={movie.poster || "https://via.placeholder.com/1200x500"} alt="" className="h-full w-full object-cover opacity-20 blur-md" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        </div>

        <div className="relative grid gap-8 p-6 md:grid-cols-[280px_1fr] md:p-10">
          <div className="mx-auto w-56 overflow-hidden rounded-xl shadow-2xl shadow-black/40 md:mx-0 md:w-full">
            <img src={movie.poster || "https://via.placeholder.com/300x450?text=No+Poster"} alt={movie.name} className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant={movie.releaseStatus === "UPCOMING" ? "warning" : "success"} size="md">{movie.releaseStatus}</Badge>
              <Badge variant="info" size="md">{movie.language}</Badge>
              {shows.length > 0 && <Badge size="md">{shows.length} show{shows.length > 1 ? "s" : ""}</Badge>}
            </div>

            <h1 className="mb-3 text-3xl font-extrabold text-white md:text-4xl">{movie.name}</h1>
            <p className="mb-6 max-w-2xl leading-relaxed text-slate-300">{movie.description}</p>

            <div className="mb-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div>
                <p className="text-slate-500">Director</p>
                <p className="font-medium text-white">{movie.director}</p>
              </div>
              <div>
                <p className="text-slate-500">Release Date</p>
                <p className="font-medium text-white">
                  {new Date(movie.releaseDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-slate-500">Now Running At</p>
                <p className="font-medium text-white">{theatreNames.length > 0 ? theatreNames.slice(0, 2).join(", ") : "No active theatres yet"}</p>
              </div>
              <div className="col-span-2 md:col-span-3">
                <p className="text-slate-500">Cast</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {movie.casts?.map((cast, index) => (
                    <span key={index} className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                      {cast}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline">Watch Trailer</Button>
                </a>
              )}
              <Link to={appRoutes.shows}>
                <Button>{shows.length > 0 ? "Browse Showtimes" : "View All Shows"}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {embedUrl && (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Trailer</h2>
          <div className="aspect-video overflow-hidden rounded-xl border border-slate-800/50">
            <iframe
              src={embedUrl}
              title="Movie Trailer"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Available Shows</h2>
          {shows.length > 0 && <span className="text-sm text-slate-400">{shows.length} total</span>}
        </div>
        {shows.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                movieName={movie.name}
                theatreName={theatreMap.get(show.theatreId)?.name}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 text-center">
            <p className="text-lg font-semibold text-white">No showtimes available yet</p>
            <p className="mt-2 text-slate-400">This movie is listed, but no theatre has scheduled a show for it yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieDetailsPage;
