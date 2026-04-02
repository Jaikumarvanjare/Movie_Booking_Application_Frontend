import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../../api/movieApi";
import { deleteShow, getShows } from "../../api/showApi";
import { getTheatres } from "../../api/theatreApi";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/ToastContext";
import type { Movie } from "../../types/movie";
import type { Show } from "../../types/show";
import type { Theatre } from "../../types/theatre";
import { appRoutes } from "../../utils/routes";

const AdminShowsPage = () => {
  const { showToast } = useToast();
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
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
        showToast("Failed to load shows", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const movieMap = useMemo(() => new Map(movies.map((movie) => [movie.id, movie.name])), [movies]);
  const theatreMap = useMemo(() => new Map(theatres.map((theatre) => [theatre.id, theatre.name])), [theatres]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    try {
      await deleteShow(deletingId);
      setShows((current) => current.filter((show) => show.id !== deletingId));
      showToast("Show deleted successfully", "success");
      setDeletingId(null);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete show", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading shows..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Shows</h1>
          <p className="text-slate-400">Review schedules, pricing, and seat capacity.</p>
        </div>
        <Link to={appRoutes.adminCreateShow}>
          <Button>Add Show</Button>
        </Link>
      </div>

      {shows.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 text-center text-slate-400">
          No shows scheduled yet.
        </div>
      ) : (
        <div className="space-y-4">
          {shows.map((show) => (
            <div key={show.id} className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">{movieMap.get(show.movieId) || "Unknown Movie"}</h2>
                    {show.format && <Badge variant="info">{show.format}</Badge>}
                    <Badge variant={show.noOfSeats > 0 ? "success" : "error"}>{show.noOfSeats} seats</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                    <span>{theatreMap.get(show.theatreId) || show.theatreId}</span>
                    <span>{new Date(show.timing).toLocaleString("en-IN")}</span>
                    <span>₹{show.price}</span>
                  </div>
                  {show.seatConfiguration && (
                    <p className="text-xs text-slate-500">Seat config saved</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link to={appRoutes.adminEditShow(show.id)}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => setDeletingId(show.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Show" size="sm">
        <p className="mb-6 text-slate-400">Delete this show schedule? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button variant="danger" disabled={submitting} onClick={handleDelete}>
            {submitting ? "Deleting..." : "Delete Show"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminShowsPage;
