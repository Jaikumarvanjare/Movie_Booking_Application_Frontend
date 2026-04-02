import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import Badge from "../common/Badge";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const isUpcoming = movie.releaseStatus === "UPCOMING";

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/50 transition-all duration-300 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster || "https://via.placeholder.com/300x450?text=No+Poster"}
          alt={movie.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <Badge variant={isUpcoming ? "warning" : "success"}>
            {movie.releaseStatus}
          </Badge>
        </div>

        {/* Language badge */}
        <div className="absolute right-3 top-3">
          <Badge variant="info">{movie.language}</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-lg font-bold text-white transition group-hover:text-brand-400">
          {movie.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {movie.description}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {movie.director}
          </span>
          <span>
            {new Date(movie.releaseDate).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
