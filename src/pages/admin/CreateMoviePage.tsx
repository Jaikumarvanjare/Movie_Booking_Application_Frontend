import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMovie } from "../../api/movieApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useToast } from "../../context/ToastContext";

const CreateMoviePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    castsInput: "",
    trailerUrl: "",
    language: "English",
    releaseDate: "",
    director: "",
    releaseStatus: "UPCOMING",
    poster: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const casts = formData.castsInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      await createMovie({
        name: formData.name,
        description: formData.description,
        casts,
        trailerUrl: formData.trailerUrl,
        language: formData.language,
        releaseDate: new Date(formData.releaseDate).toISOString(),
        director: formData.director,
        releaseStatus: formData.releaseStatus,
        poster: formData.poster,
      });

      showToast("Movie created successfully!", "success");
      navigate("/movies");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create movie");
      showToast("Failed to create movie", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Add New Movie</h1>
        <p className="text-slate-400">Fill in the details to add a new movie</p>
      </div>

      <div className="glass rounded-2xl p-8 shadow-2xl">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          <Input
            label="Movie Name"
            type="text"
            placeholder="e.g., Avengers: Endgame"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
            <textarea
              placeholder="Movie description..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
            />
          </div>

          <Input
            label="Cast (comma-separated)"
            type="text"
            placeholder="Robert Downey Jr, Chris Evans, Scarlett Johansson"
            value={formData.castsInput}
            onChange={(e) => handleChange("castsInput", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Director"
              type="text"
              placeholder="e.g., Russo Brothers"
              value={formData.director}
              onChange={(e) => handleChange("director", e.target.value)}
              required
            />
            <Input
              label="Language"
              type="text"
              placeholder="English"
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Release Date"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => handleChange("releaseDate", e.target.value)}
              required
            />
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">Release Status</label>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
                value={formData.releaseStatus}
                onChange={(e) => handleChange("releaseStatus", e.target.value)}
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="RELEASED">Released</option>
              </select>
            </div>
          </div>

          <Input
            label="Trailer URL"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={formData.trailerUrl}
            onChange={(e) => handleChange("trailerUrl", e.target.value)}
            required
          />

          <Input
            label="Poster URL"
            type="url"
            placeholder="https://image-url.com/poster.jpg"
            value={formData.poster}
            onChange={(e) => handleChange("poster", e.target.value)}
            required
          />

          {formData.poster && (
            <div className="mb-4">
              <p className="mb-2 text-sm text-slate-400">Poster Preview</p>
              <img
                src={formData.poster}
                alt="Poster preview"
                className="h-40 w-28 rounded-lg object-cover border border-slate-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating Movie..." : "Create Movie"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateMoviePage;
