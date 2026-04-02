import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";
import { getShowById } from "../../api/showApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import type { Show } from "../../types/show";
import { parseSeatSelection, serializeSeatSelection } from "../../utils/booking";
import { appRoutes } from "../../utils/routes";

const STEPS = ["Select Seats", "Review", "Payment"];

const BookShowPage = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    noOfSeats: 1,
    seatNumbers: ""
  });

  useEffect(() => {
    const fetchShow = async () => {
      if (!showId) return;

      try {
        const response = await getShowById(showId);
        setShow(response.data);
      } catch {
        setError("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  const handleSubmit = async () => {
    if (!show) return;

    setSubmitting(true);
    setError("");

    try {
      const payload: {
        theatreId: string;
        movieId: string;
        timing: string;
        noOfSeats: number;
        seat?: string;
      } = {
        theatreId: show.theatreId,
        movieId: show.movieId,
        timing: show.timing,
        noOfSeats: formData.noOfSeats
      };

      if (formData.seatNumbers.trim()) {
        const seats = parseSeatSelection(formData.seatNumbers);

        if (seats.length !== formData.noOfSeats) {
          throw new Error("Selected seat count must match the number of seats.");
        }

        payload.seat = serializeSeatSelection(seats);
      }

      const response = await createBooking(payload);
      const bookingId = response.data?.id;

      if (!bookingId) {
        throw new Error("Booking was created without an id.");
      }

      showToast("Booking created! Redirecting to payment...", "success");
      navigate(appRoutes.bookingPayment(bookingId));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create booking");
      showToast("Booking failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading show..." />;
  if (!show) return <div className="text-center text-red-400">Show not found</div>;

  const totalPrice = show.price * formData.noOfSeats;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  i <= step
                    ? "bg-brand text-white shadow-lg shadow-brand/30"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`hidden text-sm sm:block ${
                  i <= step ? "font-medium text-white" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-8 rounded ${
                  i < step ? "bg-brand" : "bg-slate-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 shadow-2xl">
        <div className="mb-6 rounded-xl bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Show Time</p>
              <p className="text-lg font-bold text-white">
                {new Date(show.timing).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Format</p>
              <p className="text-lg font-bold text-brand">{show.format || "Standard"}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <Input
              label="Number of Seats"
              type="number"
              min="1"
              max={show.noOfSeats}
              value={formData.noOfSeats}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  noOfSeats: Math.min(show.noOfSeats, parseInt(e.target.value, 10) || 1)
                })
              }
              required
            />

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Preferred Seat Numbers (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., A1, A2, A3"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
                value={formData.seatNumbers}
                onChange={(e) => setFormData({ ...formData, seatNumbers: e.target.value })}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Use seat labels like A1, A2. If provided, the count must match the number of seats.
              </p>
            </div>

            <Button className="w-full" size="lg" onClick={() => setStep(1)}>
              Continue to Review
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Booking Summary</h3>

            <div className="space-y-3 rounded-xl bg-slate-800/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Price per seat</span>
                <span className="font-medium text-white">₹{show.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Number of seats</span>
                <span className="font-medium text-white">{formData.noOfSeats}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Available seats</span>
                <span className="font-medium text-white">{show.noOfSeats}</span>
              </div>
              {formData.seatNumbers && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Seats</span>
                  <span className="font-medium text-white">{formData.seatNumbers}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-700 pt-3">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-brand">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button className="flex-1" size="lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Processing..." : "Confirm & Pay"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookShowPage;
