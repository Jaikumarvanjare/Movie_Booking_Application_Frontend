import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../api/bookingApi";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { useRazorpay } from "../../hooks/useRazorpay";
import type { Booking } from "../../types/booking";
import { appRoutes } from "../../utils/routes";

// ── Small inline Razorpay logo SVG ───────────────────────────────────────────
const RazorpayLogo = () => (
  <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    <path
      d="M13.87 0L0 32h9.13L23 0h-9.13zM23 0l-9.13 18.28L23 32h9.13L23 0z"
      fill="#3395FF"
    />
    <text x="36" y="24" fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="700" fill="#FFFFFF">
      Razorpay
    </text>
  </svg>
);

// ── Step indicator ────────────────────────────────────────────────────────────
const steps = ["Select Seats", "Review", "Payment"];

const StepBar = ({ current }: { current: number }) => (
  <div className="mb-8 flex items-center justify-center gap-2">
    {steps.map((label, i) => (
      <div key={label} className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
              i < current
                ? "bg-brand text-white shadow-lg shadow-brand/30"
                : i === current
                ? "bg-brand text-white shadow-lg shadow-brand/40 ring-2 ring-brand/30"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </div>
          <span
            className={`hidden text-sm sm:block ${
              i <= current ? "font-medium text-white" : "text-slate-500"
            }`}
          >
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={`mx-2 h-0.5 w-8 rounded ${
              i < current ? "bg-brand" : "bg-slate-800"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// ── Success screen ────────────────────────────────────────────────────────────
const PaymentSuccess = ({ paymentId }: { paymentId: string }) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div
      className="animate-scale-in mx-auto max-w-md rounded-2xl border border-green-500/20 bg-green-900/10 p-10 text-center"
      style={{ boxShadow: "0 0 40px rgba(34,197,94,0.18)" }}
    >
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl animate-pulse-glow">
        ✓
      </div>
      <h2 className="mb-2 text-2xl font-extrabold text-green-400">Payment Successful!</h2>
      <p className="mb-1 text-slate-300">Your booking has been confirmed.</p>
      {paymentId && (
        <p className="mt-3 rounded-lg bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-400">
          Txn ID: {paymentId}
        </p>
      )}
      <p className="mt-4 text-sm text-slate-500">Redirecting to your bookings...</p>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const MakePaymentPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState(false);
  const [finalPaymentId, setFinalPaymentId] = useState("");

  // ── Razorpay hook callbacks (stable refs) ──────────────────────────────────
  const handleSuccess = useCallback(
    (razorpayPaymentId: string) => {
      setFinalPaymentId(razorpayPaymentId);
      setSuccess(true);
      showToast("Payment successful! Booking confirmed. 🎉", "success");
      setTimeout(() => navigate(appRoutes.bookings), 3000);
    },
    [navigate, showToast]
  );

  const handleFailure = useCallback(
    (message: string) => {
      showToast(message, "error");
    },
    [showToast]
  );

  const { initiatePayment, loading, error } = useRazorpay(handleSuccess, handleFailure);

  // ── Load booking ───────────────────────────────────────────────────────────
  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        navigate(appRoutes.bookings, { replace: true });
        return;
      }
      try {
        const response = await getBookingById(bookingId);
        setBooking(response.data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to load booking for payment.";
        setPageError(msg);
      } finally {
        setPageLoading(false);
      }
    };
    loadBooking();
  }, [bookingId, navigate]);

  // ── Render states ──────────────────────────────────────────────────────────
  if (pageLoading) return <Loader text="Loading payment details..." />;

  if (!bookingId || !booking) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
        {pageError || "Booking not found."}
      </div>
    );
  }

  if (success) return <PaymentSuccess paymentId={finalPaymentId} />;

  const amount = booking.totalCost;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Step indicator — locked to step 2 (Payment) */}
        <StepBar current={2} />

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <h1 className="mb-6 text-center text-2xl font-extrabold text-white">
            Complete Payment
          </h1>

          {/* Booking summary card */}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Seats</p>
                  <p className="text-sm font-semibold text-white">{booking.noOfSeats}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Status</p>
                  <p className="text-sm text-white">{booking.status}</p>
                </div>
              </div>
            </div>

            {/* Total amount */}
            <div className="border-t border-slate-700/50 bg-slate-800/50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Amount</span>
                <span className="text-3xl font-extrabold text-gradient">₹{amount}</span>
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Pay button — Razorpay branded */}
          <div className="space-y-3">
            <button
              id="razorpay-pay-btn"
              onClick={() => initiatePayment(booking)}
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#3395FF] px-6 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#2277DD] hover:shadow-[0_0_24px_rgba(51,149,255,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="text-base">Pay ₹{amount} with</span>
                  <RazorpayLogo />
                </>
              )}

              {/* shimmer effect */}
              {!loading && (
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              )}
            </button>

            <Button
              variant="ghost"
              onClick={() => navigate(appRoutes.bookings)}
              className="w-full"
              disabled={loading}
            >
              Cancel &amp; Go Back
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span>🔒</span> 256-bit SSL
            </span>
            <span className="h-3 w-px bg-slate-700" />
            <span className="flex items-center gap-1">
              <span>✅</span> PCI DSS Compliant
            </span>
            <span className="h-3 w-px bg-slate-700" />
            <span className="flex items-center gap-1">
              <span>⚡</span> Instant Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentPage;
