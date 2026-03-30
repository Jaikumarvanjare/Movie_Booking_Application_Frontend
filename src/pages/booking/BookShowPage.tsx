import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShowById } from "../../api/showApi";
import { createBooking } from "../../api/bookingApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { Show } from "../../types/show";

const BookShowPage = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    noOfSeats: 1,
    seatNumbers: "" // comma separated for display
  });

  useEffect(() => {
    const fetchShow = async () => {
      if (!showId) return;
      try {
        const response = await getShowById(showId);
        setShow(response.data);
      } catch (err) {
        setError("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [showId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!show) return;
    
    setSubmitting(true);
    setError("");

    try {
      // Note: Using API spec from swagger (theatreId, movieId, timing)
      // If your backend expects showId instead, change this payload
      const payload = {
        theatreId: show.theatreId,
        movieId: show.movieId,
        timing: show.timing,
        noOfSeats: formData.noOfSeats
      };

      const response = await createBooking(payload);
      const bookingId = response.data?.id;
      
      // Redirect to payment page with booking details
      navigate("/payment", {
        state: {
          bookingId,
          amount: show.price * formData.noOfSeats,
          showDetails: show
        }
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!show) return <div className="text-center text-red-400">Show not found</div>;

  const totalPrice = show.price * formData.noOfSeats;

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-2 text-3xl font-bold text-white">Book Tickets</h1>
      <p className="mb-6 text-slate-400">Show Time: {new Date(show.timing).toLocaleString()}</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}

      <div className="mb-6 rounded-lg bg-slate-800 p-4">
        <div className="flex justify-between mb-2">
          <span className="text-slate-300">Price per seat</span>
          <span className="text-white">₹{show.price}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-slate-300">Available seats</span>
          <span className="text-white">{show.noOfSeats}</span>
        </div>
        <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
          <span className="font-semibold text-white">Total</span>
          <span className="font-bold text-rose-600">₹{totalPrice}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Number of Seats"
          type="number"
          min="1"
          max={show.noOfSeats}
          value={formData.noOfSeats}
          onChange={(e) => setFormData({ ...formData, noOfSeats: parseInt(e.target.value) || 1 })}
          required
        />

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Preferred Seat Numbers (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., A1, A2, A3"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none focus:border-rose-600"
            value={formData.seatNumbers}
            onChange={(e) => setFormData({ ...formData, seatNumbers: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">Enter comma-separated seat numbers if you have preferences</p>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Processing..." : "Proceed to Payment"}
        </Button>
      </form>
    </div>
  );
};

export default BookShowPage;