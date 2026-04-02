import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById, updateMovie } from "../../api/movieApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { appRoutes } from "../../utils/routes";

const EditMoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    castsInput: "",
    trailerUrl: "",
    language: "English",
    releaseDate: "",
    director: "",
    releaseStatus: "UPCOMING",
    poster: ""
  });

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      try {
        const response = await getMovieById(id);
        const movie = response.data;
        setFormData({
          name: movie.name,
          description: movie.description,
          castsInput: movie.casts.join(", "),
          trailerUrl: movie.trailerUrl,
          language: movie.language,
          releaseDate: movie.releaseDate.slice(0, 10),
          director: movie.director,
          releaseStatus: movie.releaseStatus,
          poster: movie.poster
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");
    try {
      await updateMovie(id, {
        name: formData.name,
        description: formData.description,
        casts: formData.castsInput.split(",").map((cast) => cast.trim()).filter(Boolean),
        trailerUrl: formData.trailerUrl,
        language: formData.language,
        releaseDate: new Date(formData.releaseDate).toISOString(),
        director: formData.director,
        releaseStatus: formData.releaseStatus,
        poster: formData.poster
      });
      showToast("Movie updated successfully", "success");
      navigate(appRoutes.adminMovies);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update movie");
      showToast("Failed to update movie", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading movie..." />;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Edit Movie</h1>
        <p className="text-slate-400">Update the movie details to keep listings accurate.</p>
      </div>

      <div className="glass rounded-2xl p-8 shadow-2xl">
        {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-1">
          <Input label="Movie Name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
            />
          </div>
          <Input label="Cast (comma-separated)" value={formData.castsInput} onChange={(e) => handleChange("castsInput", e.target.value)} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Director" value={formData.director} onChange={(e) => handleChange("director", e.target.value)} required />
            <Input label="Language" value={formData.language} onChange={(e) => handleChange("language", e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Release Date" type="date" value={formData.releaseDate} onChange={(e) => handleChange("releaseDate", e.target.value)} required />
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">Release Status</label>
              <select
                value={formData.releaseStatus}
                onChange={(e) => handleChange("releaseStatus", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="RELEASED">Released</option>
              </select>
            </div>
          </div>
          <Input label="Trailer URL" type="url" value={formData.trailerUrl} onChange={(e) => handleChange("trailerUrl", e.target.value)} required />
          <Input label="Poster URL" type="url" value={formData.poster} onChange={(e) => handleChange("poster", e.target.value)} required />
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate(appRoutes.adminMovies)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMoviePage;
