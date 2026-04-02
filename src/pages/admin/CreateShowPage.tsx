import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../../api/movieApi";
import { createShow } from "../../api/showApi";
import { checkTheatreMovie, getTheatres } from "../../api/theatreApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import type { Movie } from "../../types/movie";
import type { Theatre } from "../../types/theatre";

const CreateShowPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [movieValidationMessage, setMovieValidationMessage] = useState("");
  const [movieValidationLoading, setMovieValidationLoading] = useState(false);
  const [movieAllowedInTheatre, setMovieAllowedInTheatre] = useState(true);

  const [formData, setFormData] = useState({
    theatreId: "",
    movieId: "",
    timing: "",
    noOfSeats: "120",
    seatConfiguration: "",
    price: "",
    format: "2D"
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [moviesRes, theatresRes] = await Promise.all([getMovies(), getTheatres()]);
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : []);
        setTheatres(Array.isArray(theatresRes.data) ? theatresRes.data : []);
      } catch {
        showToast("Failed to load data", "error");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  useEffect(() => {
    const validateMovieAssignment = async () => {
      if (!formData.theatreId || !formData.movieId) {
        setMovieAllowedInTheatre(true);
        setMovieValidationMessage("");
        return;
      }

      setMovieValidationLoading(true);

      try {
        const response = await checkTheatreMovie(formData.theatreId, formData.movieId);
        const isPresent = Boolean(response.data?.isPresent);

        setMovieAllowedInTheatre(isPresent);
        setMovieValidationMessage(
          isPresent
            ? "This movie is available in the selected theatre."
            : "Assign this movie to the theatre before creating a show."
        );
      } catch {
        setMovieAllowedInTheatre(false);
        setMovieValidationMessage("Unable to validate theatre and movie mapping.");
      } finally {
        setMovieValidationLoading(false);
      }
    };

    validateMovieAssignment();
  }, [formData.movieId, formData.theatreId]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!movieAllowedInTheatre) {
        throw new Error("Selected movie is not assigned to this theatre.");
      }

      await createShow({
        theatreId: formData.theatreId,
        movieId: formData.movieId,
        timing: new Date(formData.timing).toISOString(),
        noOfSeats: parseInt(formData.noOfSeats, 10),
        seatConfiguration: formData.seatConfiguration || undefined,
        price: parseFloat(formData.price),
        format: formData.format || undefined
      });

      showToast("Show created successfully!", "success");
      navigate("/shows");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create show");
      showToast("Failed to create show", "error");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <Loader text="Loading data..." />;

  return (
    <div className="mx-auto max-w-xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Add New Show</h1>
        <p className="text-slate-400">Schedule a new show for a movie at a theatre</p>
      </div>

      <div className="glass rounded-2xl p-8 shadow-2xl">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {(movieValidationLoading || movieValidationMessage) && (
          <div
            className={`mb-4 rounded-xl border p-3 text-sm ${
              movieAllowedInTheatre
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-300"
            }`}
          >
            {movieValidationLoading
              ? "Checking whether the selected theatre runs this movie..."
              : movieValidationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">Theatre</label>
            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
              value={formData.theatreId}
              onChange={(e) => handleChange("theatreId", e.target.value)}
              required
            >
              <option value="">Select a theatre</option>
              {theatres.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} - {t.city}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">Movie</label>
            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
              value={formData.movieId}
              onChange={(e) => handleChange("movieId", e.target.value)}
              required
            >
              <option value="">Select a movie</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Show Timing"
            type="datetime-local"
            value={formData.timing}
            onChange={(e) => handleChange("timing", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Number of Seats"
              type="number"
              placeholder="120"
              value={formData.noOfSeats}
              onChange={(e) => handleChange("noOfSeats", e.target.value)}
              required
            />
            <Input
              label="Price (₹)"
              type="number"
              placeholder="250"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">Format</label>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand"
                value={formData.format}
                onChange={(e) => handleChange("format", e.target.value)}
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
              </select>
            </div>
            <Input
              label="Seat Configuration (optional)"
              type="text"
              placeholder="JSON configuration"
              value={formData.seatConfiguration}
              onChange={(e) => handleChange("seatConfiguration", e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading || movieValidationLoading || !movieAllowedInTheatre}
          >
            {loading ? "Creating Show..." : "Create Show"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateShowPage;
