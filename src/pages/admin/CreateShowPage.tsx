import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Movie } from "../../types/movie";
import { Theatre } from "../../types/theatre";

const CreateShowPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  
  const [formData, setFormData] = useState({
    theatreId: "",
    movieId: "",
    timing: "",
    noOfSeats: 100,
    price: 0,
    format: "2D"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatresRes] = await Promise.all([
          apiClient.get("/movies"),
          apiClient.get("/theatres")
        ]);
        setMovies(moviesRes.data.data || []);
        setTheatres(theatresRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await apiClient.post("/shows", {
        ...formData,
        noOfSeats: Number(formData.noOfSeats),
        price: Number(formData.price)
      });
      setSuccess("Show created successfully!");
      setTimeout(() => navigate("/shows"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create show");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Create New Show</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Select Theatre</label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            value={formData.theatreId}
            onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
            required
          >
            <option value="">Select a theatre</option>
            {theatres.map((theatre) => (
              <option key={theatre.id} value={theatre.id}>
                {theatre.name} - {theatre.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Select Movie</label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            value={formData.movieId}
            onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
            required
          >
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Show Timing"
          type="datetime-local"
          value={formData.timing}
          onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Number of Seats"
            type="number"
            min="1"
            value={formData.noOfSeats}
            onChange={(e) => setFormData({ ...formData, noOfSeats: parseInt(e.target.value) })}
            required
          />

          <Input
            label="Price (₹)"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Format</label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
          >
            <option>2D</option>
            <option>3D</option>
            <option>IMAX</option>
            <option>IMAX 3D</option>
          </select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Show"}
        </Button>
      </form>
    </div>
  );
};

export default CreateShowPage;