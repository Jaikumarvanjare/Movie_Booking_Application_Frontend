import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovies } from "../../api/movieApi";
import {
  getTheatreById,
  updateTheatre,
  updateTheatreMovies
} from "../../api/theatreApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import type { Movie } from "../../types/movie";
import { appRoutes } from "../../utils/routes";

const EditTheatrePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [assignedMovieIds, setAssignedMovieIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    pincode: "",
    address: ""
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [theatreRes, moviesRes] = await Promise.all([getTheatreById(id), getMovies()]);
        const theatre = theatreRes.data;
        setFormData({
          name: theatre.name,
          description: theatre.description || "",
          city: theatre.city,
          pincode: String(theatre.pincode),
          address: theatre.address || ""
        });
        setAssignedMovieIds(theatre.movieIds || []);
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load theatre");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const movieLookup = useMemo(
    () => new Map(movies.map((movie) => [movie.id, movie.name])),
    [movies]
  );

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMovieToggle = async (movieId: string) => {
    if (!id) return;
    const isAssigned = assignedMovieIds.includes(movieId);

    try {
      await updateTheatreMovies(id, { movieIds: [movieId], insert: !isAssigned });
      setAssignedMovieIds((current) =>
        isAssigned ? current.filter((value) => value !== movieId) : [...current, movieId]
      );
      showToast(isAssigned ? "Movie removed from theatre" : "Movie assigned to theatre", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update theatre movies", "error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");
    try {
      await updateTheatre(id, {
        name: formData.name,
        description: formData.description || undefined,
        city: formData.city,
        pincode: parseInt(formData.pincode, 10),
        address: formData.address || undefined
      });
      showToast("Theatre updated successfully", "success");
      navigate(appRoutes.adminTheatres);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update theatre");
      showToast("Failed to update theatre", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading theatre..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in-up">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">Edit Theatre</h1>
        <p className="text-slate-400">Update theatre details and manage the movie catalogue available in it.</p>
      </div>

      <div className="glass rounded-2xl p-8 shadow-2xl">
        {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-1">
          <Input label="Theatre Name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="City" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} required />
            <Input label="Pincode" type="number" value={formData.pincode} onChange={(e) => handleChange("pincode", e.target.value)} required />
          </div>
          <Input label="Address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate(appRoutes.adminTheatres)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving..." : "Save Theatre"}
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Manage Theatre Movies</h2>
          <p className="text-sm text-slate-400">Toggle movies that should be available for show creation in this theatre.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {movies.map((movie) => {
            const assigned = assignedMovieIds.includes(movie.id);
            return (
              <button
                key={movie.id}
                type="button"
                onClick={() => handleMovieToggle(movie.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  assigned
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{movie.name}</p>
                    <p className="text-xs text-slate-500">{movieLookup.get(movie.id)}</p>
                  </div>
                  <span className={`text-xs font-semibold ${assigned ? "text-emerald-400" : "text-slate-500"}`}>
                    {assigned ? "Assigned" : "Not Assigned"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditTheatrePage;
