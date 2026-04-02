import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovies } from "../../api/movieApi";
import { getShowById, updateShow } from "../../api/showApi";
import { checkTheatreMovie, getTheatres } from "../../api/theatreApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import type { Movie } from "../../types/movie";
import type { Show } from "../../types/show";
import type { Theatre } from "../../types/theatre";
import { appRoutes } from "../../utils/routes";

const EditShowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [showData, setShowData] = useState<Show | null>(null);
  const [mappingMessage, setMappingMessage] = useState("");
  const [formData, setFormData] = useState({
    theatreId: "",
    movieId: "",
    timing: "",
    noOfSeats: "",
    seatConfiguration: "",
    price: "",
    format: "2D"
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [showRes, moviesRes, theatresRes] = await Promise.all([
          getShowById(id),
          getMovies(),
          getTheatres()
        ]);
        const show = showRes.data;
        setShowData(show);
        setFormData({
          theatreId: show.theatreId,
          movieId: show.movieId,
          timing: show.timing.slice(0, 16),
          noOfSeats: String(show.noOfSeats),
          seatConfiguration: show.seatConfiguration || "",
          price: String(show.price),
          format: show.format || "2D"
        });
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : []);
        setTheatres(Array.isArray(theatresRes.data) ? theatresRes.data : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load show");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    const validate = async () => {
      if (!formData.theatreId || !formData.movieId) return;
      try {
        const response = await checkTheatreMovie(formData.theatreId, formData.movieId);
        setMappingMessage(
          response.data?.isPresent
            ? "The selected theatre already supports this movie."
            : "This theatre does not currently have this movie assigned."
        );
      } catch {
        setMappingMessage("Unable to validate the theatre and movie mapping.");
      }
    };

    validate();
  }, [formData.movieId, formData.theatreId]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");
    try {
      if (showData && (formData.movieId !== showData.movieId || formData.theatreId !== showData.theatreId)) {
        const mapping = await checkTheatreMovie(formData.theatreId, formData.movieId);
        if (!mapping.data?.isPresent) {
          throw new Error("Assign this movie to the theatre before saving the show.");
        }
      }

      await updateShow(id, {
        timing: new Date(formData.timing).toISOString(),
        noOfSeats: parseInt(formData.noOfSeats, 10),
        seatConfiguration: formData.seatConfiguration || undefined,
        price: parseFloat(formData.price),
        format: formData.format || undefined
      });
      showToast("Show updated successfully", "success");
      navigate(appRoutes.adminShows);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to update show");
      showToast("Failed to update show", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading show..." />;

  return (
    <div className="mx-auto max-w-xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Edit Show</h1>
        <p className="text-slate-400">Update show timing, pricing, and seat information.</p>
      </div>

      <div className="glass rounded-2xl p-8 shadow-2xl">
        {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
        {mappingMessage && <div className="mb-4 rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-300">{mappingMessage}</div>}
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Theatre</label>
              <select value={formData.theatreId} disabled className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-400 outline-none">
                {theatres.map((theatre) => (
                  <option key={theatre.id} value={theatre.id}>{theatre.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Movie</label>
              <select value={formData.movieId} disabled className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-400 outline-none">
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.name}</option>
                ))}
              </select>
            </div>
          </div>
          <Input label="Show Timing" type="datetime-local" value={formData.timing} onChange={(e) => handleChange("timing", e.target.value)} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Number of Seats" type="number" value={formData.noOfSeats} onChange={(e) => handleChange("noOfSeats", e.target.value)} required />
            <Input label="Price (₹)" type="number" step="0.01" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">Format</label>
              <select value={formData.format} onChange={(e) => handleChange("format", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none transition-all focus:border-brand">
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
              </select>
            </div>
            <Input label="Seat Configuration" value={formData.seatConfiguration} onChange={(e) => handleChange("seatConfiguration", e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate(appRoutes.adminShows)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save Show"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShowPage;
