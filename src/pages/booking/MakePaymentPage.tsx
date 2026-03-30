import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../../api/paymentApi";
import Button from "../../components/common/Button";
import { Show } from "../../types/show";

interface PaymentState {
  bookingId: string;
  amount: number;
  showDetails: Show;
}

const MakePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const state = location.state as PaymentState | null;

  useEffect(() => {
    if (!state?.bookingId) {
      navigate("/bookings");
    }
  }, [state, navigate]);

  if (!state) return null;

  const { bookingId, amount, showDetails } = state;

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      await createPayment({
        bookingId,
        amount
      });
      setSuccess(true);
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-green-800 bg-green-900/20 p-8 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h2 className="mb-2 text-2xl font-bold text-green-400">Payment Successful!</h2>
        <p className="text-slate-300">Your booking has been confirmed.</p>
        <p className="mt-4 text-sm text-slate-400">Redirecting to your bookings...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Complete Payment</h1>

      <div className="mb-6 rounded-lg bg-slate-800 p-4">
        <div className="mb-2 text-sm text-slate-400">Booking ID</div>
        <div className="font-mono text-sm text-white mb-4">{bookingId}</div>
        
        <div className="mb-2 text-sm text-slate-400">Show Time</div>
        <div className="text-white mb-4">{new Date(showDetails.timing).toLocaleString()}</div>

        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Amount to Pay</span>
            <span className="text-2xl font-bold text-rose-600">₹{amount}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}

      <div className="space-y-3">
        <Button 
          onClick={handlePayment} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={() => navigate("/bookings")} 
          className="w-full"
          disabled={loading}
        >
          Cancel & Go Back
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        This is a demo payment. No actual money will be deducted.
      </p>
    </div>
  );
};

export default MakePaymentPage;