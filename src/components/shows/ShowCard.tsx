import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { appRoutes } from "../../utils/routes";
import type { Show } from "../../types/show";
import Badge from "../common/Badge";

interface ShowCardProps {
  show: Show;
  movieName?: string;
  theatreName?: string;
}

const ShowCard = ({ show, movieName, theatreName }: ShowCardProps) => {
  const { isAuthenticated } = useAuth();
  const showDate = new Date(show.timing);
  const isPast = showDate < new Date();

  return (
    <div className="group rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
      {(movieName || theatreName) && (
        <div className="mb-4 space-y-1 border-b border-slate-800/70 pb-4">
          {movieName && <p className="text-base font-semibold text-white">{movieName}</p>}
          {theatreName && <p className="text-sm text-slate-400">{theatreName}</p>}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-white">
            {showDate.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short"
            })}
          </p>
          <p className="font-medium text-brand-400 text-sm">
            {showDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">₹{show.price}</p>
          <p className="text-xs text-slate-500">per seat</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant={show.noOfSeats > 10 ? "success" : show.noOfSeats > 0 ? "warning" : "error"}>
          {show.noOfSeats} seats
        </Badge>
        {show.format && <Badge variant="info">{show.format}</Badge>}
        {isPast && <Badge variant="error">Past</Badge>}
      </div>

      {!isPast ? (
        isAuthenticated ? (
          <Link
            to={appRoutes.showBooking(show.id)}
            className="block w-full rounded-xl bg-gradient-to-r from-brand to-brand-500 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-all hover:from-brand-dark hover:to-brand hover:shadow-brand/40"
          >
            Book Now
          </Link>
        ) : (
          <Link
            to={appRoutes.signIn}
            className="block w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:bg-slate-700"
          >
            Sign in to Book
          </Link>
        )
      ) : (
        <div className="block w-full rounded-xl bg-slate-800/50 py-2.5 text-center text-sm text-slate-500">
          Show Ended
        </div>
      )}
    </div>
  );
};

export default ShowCard;
