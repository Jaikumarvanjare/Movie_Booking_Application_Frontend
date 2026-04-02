import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTheatre, getTheatres } from "../../api/theatreApi";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/ToastContext";
import type { Theatre } from "../../types/theatre";
import { appRoutes } from "../../utils/routes";

const AdminTheatresPage = () => {
  const { showToast } = useToast();
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTheatres = async () => {
    try {
      const response = await getTheatres();
      setTheatres(Array.isArray(response.data) ? response.data : []);
    } catch {
      showToast("Failed to load theatres", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;

    setSubmitting(true);
    try {
      await deleteTheatre(deletingId);
      showToast("Theatre deleted successfully", "success");
      setTheatres((current) => current.filter((theatre) => theatre.id !== deletingId));
      setDeletingId(null);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete theatre", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading theatres..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Theatres</h1>
          <p className="text-slate-400">Update theatre details and assigned movies.</p>
        </div>
        <Link to={appRoutes.adminCreateTheatre}>
          <Button>Add Theatre</Button>
        </Link>
      </div>

      {theatres.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 text-center text-slate-400">
          No theatres available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {theatres.map((theatre) => (
            <div key={theatre.id} className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">{theatre.name}</h2>
                  <p className="text-sm text-slate-400">{theatre.description || "No description provided."}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>{theatre.city}</span>
                    <span>{theatre.pincode}</span>
                    {theatre.address && <span>{theatre.address}</span>}
                    <span>{theatre.movieIds?.length || 0} movie assignments</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={appRoutes.adminEditTheatre(theatre.id)}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => setDeletingId(theatre.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Theatre" size="sm">
        <p className="mb-6 text-slate-400">Delete this theatre? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button variant="danger" disabled={submitting} onClick={handleDelete}>
            {submitting ? "Deleting..." : "Delete Theatre"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTheatresPage;
