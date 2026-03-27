import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Movie } from "../../types/movie";

const CreateMoviePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<Partial<Movie>>({
    name: "",
    description: "",
    casts: [],
    trailerUrl: "",
    language: "English",
    releaseDate: "",
    director: "",
    releaseStatus: "UPCOMING",
    poster: "",
    theatreIds: []
  });

  const [castInput, setCastInput] = useState("");

  const handleChange = (key: keyof Movie, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addCast = () => {
    if (castInput.trim()) {
      handleChange("casts", [...(formData.casts || []), castInput.trim()]);
      setCastInput("");
    }
  };

  const removeCast = (index: number) => {
    const newCasts = formData.casts?.filter((_, i) => i !== index) || [];
    handleChange("casts", newCasts);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await apiClient.post("/movies", formData);
      setSuccess("Movie created successfully!");
      setTimeout(() => navigate("/movies"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Create New Movie</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Movie Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none focus:border-rose-600"
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />
        </div>

        <Input
          label="Director"
          value={formData.director}
          onChange={(e) => handleChange("director", e.target.value)}
          required
        />

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Casts</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none focus:border-rose-600"
              value={castInput}
              onChange={(e) => setCastInput(e.target.value)}
              placeholder="Add cast member"
            />
            <Button type="button" variant="secondary" onClick={addCast}>Add</Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.casts?.map((cast, idx) => (
              <span key={idx} className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-sm">
                {cast}
                <button type="button" onClick={() => removeCast(idx)} className="text-red-400">×</button>
              </span>
            ))}
          </div>
        </div>

        <Input
          label="Trailer URL"
          type="url"
          value={formData.trailerUrl}
          onChange={(e) => handleChange("trailerUrl", e.target.value)}
        />

        <Input
          label="Poster URL"
          type="url"
          value={formData.poster}
          onChange={(e) => handleChange("poster", e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Language</label>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Release Status</label>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
              value={formData.releaseStatus}
              onChange={(e) => handleChange("releaseStatus", e.target.value)}
            >
              <option>UPCOMING</option>
              <option>RELEASED</option>
              <option>BLOCKED</option>
            </select>
          </div>
        </div>

        <Input
          label="Release Date"
          type="date"
          value={formData.releaseDate}
          onChange={(e) => handleChange("releaseDate", e.target.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Movie"}
        </Button>
      </form>
    </div>
  );
};

export default CreateMoviePage;