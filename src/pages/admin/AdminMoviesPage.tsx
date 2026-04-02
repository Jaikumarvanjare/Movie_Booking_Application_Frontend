import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteMovie, getMovies } from "../../api/movieApi";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/ToastContext";
import type { Movie } from "../../types/movie";
import { appRoutes } from "../../utils/routes";

const AdminMoviesPage = () => {
  const { showToast } = useToast();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadMovies = async () => {
    try {
      const response = await getMovies();
      setMovies(Array.isArray(response.data) ? response.data : []);
    } catch {
      showToast("Failed to load movies", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;

    setSubmitting(true);
    try {
      await deleteMovie(deletingId);
      showToast("Movie deleted successfully", "success");
      setDeletingId(null);
      setMovies((current) => current.filter((movie) => movie.id !== deletingId));
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete movie", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading movies..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Movies</h1>
          <p className="text-slate-400">Create, edit, and remove movie listings.</p>
        </div>
        <Link to={appRoutes.adminCreateMovie}>
          <Button>Add Movie</Button>
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 text-center text-slate-400">
          No movies available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <img
                    src={movie.poster}
                    alt={movie.name}
                    className="h-28 w-20 rounded-xl object-cover"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-white">{movie.name}</h2>
                      <Badge variant={movie.releaseStatus === "RELEASED" ? "success" : "warning"}>
                        {movie.releaseStatus}
                      </Badge>
                      <Badge variant="info">{movie.language}</Badge>
                    </div>
                    <p className="max-w-2xl text-sm text-slate-400">{movie.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span>Director: {movie.director}</span>
                      <span>
                        Release: {new Date(movie.releaseDate).toLocaleDateString("en-IN")}
                      </span>
                      <span>Cast: {movie.casts.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={appRoutes.movieDetails(movie.id)}>
                    <Button variant="ghost">View</Button>
                  </Link>
                  <Link to={appRoutes.adminEditMovie(movie.id)}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => setDeletingId(movie.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Movie" size="sm">
        <p className="mb-6 text-slate-400">
          Delete this movie from the platform? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>
            Cancel
          </Button>
          <Button variant="danger" disabled={submitting} onClick={handleDelete}>
            {submitting ? "Deleting..." : "Delete Movie"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMoviesPage;
