import type { Theatre } from "../../types/theatre";

interface TheatreCardProps {
  theatre: Theatre;
  movieNames?: string[];
}

const TheatreCard = ({ theatre, movieNames = [] }: TheatreCardProps) => {
  return (
    <div className="group rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white transition group-hover:text-brand-400">
            {theatre.name}
          </h3>
        </div>
        {(theatre.movieIds?.length || movieNames.length) > 0 && (
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
            {movieNames.length || theatre.movieIds?.length || 0} movie{(movieNames.length || theatre.movieIds?.length || 0) > 1 ? "s" : ""}
          </span>
        )}
      </div>
      {theatre.description && (
        <p className="mb-3 text-sm leading-relaxed text-slate-400">{theatre.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {theatre.city}
        </span>
        <span className="text-slate-600">·</span>
        <span>{theatre.pincode}</span>
        {theatre.address && (
          <>
            <span className="text-slate-600">·</span>
            <span>{theatre.address}</span>
          </>
        )}
      </div>
      {movieNames.length > 0 && (
        <div className="mt-4 border-t border-slate-800/70 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Running Movies
          </p>
          <div className="flex flex-wrap gap-2">
            {movieNames.slice(0, 4).map((movieName) => (
              <span key={movieName} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                {movieName}
              </span>
            ))}
            {movieNames.length > 4 && (
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                +{movieNames.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TheatreCard;
