import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../api/bookingApi";
import { createPayment } from "../../api/paymentApi";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import type { Booking } from "../../types/booking";
import { appRoutes } from "../../utils/routes";

const MakePaymentPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        navigate(appRoutes.bookings, { replace: true });
        return;
      }

      try {
        const response = await getBookingById(bookingId);
        setBooking(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load booking for payment.");
      } finally {
        setPageLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, navigate]);

  if (pageLoading) {
    return <Loader text="Loading payment details..." />;
  }

  if (!bookingId || !booking) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
        {error || "Booking not found."}
      </div>
    );
  }

  const amount = booking.totalCost;

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      await createPayment({ bookingId, amount });
      setSuccess(true);
      showToast("Payment successful! Booking confirmed.", "success");
      setTimeout(() => navigate(appRoutes.bookings), 2500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Payment failed. Please try again.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="animate-scale-in mx-auto max-w-md rounded-2xl border border-green-500/20 bg-green-900/10 p-10 text-center"
          style={{ boxShadow: "0 0 30px rgba(34,197,94,0.2)" }}
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl animate-pulse-glow">
            ✓
          </div>
          <h2 className="mb-2 text-2xl font-extrabold text-green-400">Payment Successful!</h2>
          <p className="mb-1 text-slate-300">Your booking has been confirmed.</p>
          <p className="text-sm text-slate-500">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <h1 className="mb-6 text-center text-2xl font-extrabold text-white">
            Complete Payment
          </h1>

          <div className="mb-6 overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="p-5">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">Booking ID</p>
                <p className="font-mono text-sm text-white">{booking.id}</p>
              </div>
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">Show Time</p>
                <p className="text-sm text-white">
                  {new Date(booking.timing).toLocaleString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Booking Status</p>
                <p className="text-sm text-white">{booking.status}</p>
              </div>
            </div>
            <div className="border-t border-slate-700/50 bg-slate-800/50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Amount</span>
                <span className="text-3xl font-extrabold text-gradient">₹{amount}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handlePayment} className="w-full" size="lg" disabled={loading}>
              {loading ? "Processing..." : `Pay ₹${amount}`}
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate(appRoutes.bookings)}
              className="w-full"
              disabled={loading}
            >
              Cancel & Go Back
            </Button>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            This is a demo payment. No actual money will be deducted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentPage;
