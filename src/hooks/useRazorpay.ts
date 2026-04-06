import { useCallback, useState } from "react";
import { createRazorpayOrder, createPayment, verifyRazorpayPayment } from "../api/paymentApi";
import { RAZORPAY_KEY_ID } from "../utils/constants";
import type { Booking } from "../types/booking";

interface UseRazorpayReturn {
  initiatePayment: (booking: Booking) => Promise<void>;
  loading: boolean;
  error: string;
  paymentId: string | null;
}

/**
 * Encapsulates the full Razorpay 3-step checkout lifecycle:
 *   1. POST /payments/razorpay/order  → get Razorpay order
 *   2. Open Razorpay Checkout modal   → user pays
 *   3. POST /payments/razorpay/verify → verify signature
 *   4. POST /payments                 → record payment in DB
 */
export const useRazorpay = (
  onSuccess: (razorpayPaymentId: string) => void,
  onFailure: (message: string) => void
): UseRazorpayReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (booking: Booking) => {
      if (!window.Razorpay) {
        const msg = "Razorpay SDK failed to load. Please refresh and try again.";
        setError(msg);
        onFailure(msg);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // ── Step 1: Create Razorpay order on backend ──────────────────────
        const orderRes = await createRazorpayOrder({
          bookingId: booking.id,
          amount: booking.totalCost
        });

        const order = orderRes.data;

        if (!order?.id) {
          throw new Error("Failed to create payment order. Please try again.");
        }

        // ── Step 2: Open Razorpay Checkout UI ────────────────────────────
        await new Promise<void>((resolve, reject) => {
          const options: RazorpayOptions = {
            key: RAZORPAY_KEY_ID,
            amount: order.amount,        
            currency: order.currency || "INR",
            name: "CineBook",
            description: `Booking #${booking.id.slice(-8)}`,
            order_id: order.id,
            theme: { color: "#e11d48" }, 
            modal: {
              ondismiss: () => {
                reject(new Error("Payment cancelled by user."));
              }
            },
            handler: async (response: RazorpayPaymentResponse) => {
              try {
                // ── Step 3: Verify signature ────────────────────────────
                await verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: booking.id,
                  amount: booking.totalCost
                });

                // ── Step 4: Record payment in DB ────────────────────────
                await createPayment({
                  bookingId: booking.id,
                  amount: booking.totalCost,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id
                });

                setPaymentId(response.razorpay_payment_id);
                onSuccess(response.razorpay_payment_id);
                resolve();
              } catch (verifyErr: unknown) {
                const msg =
                  verifyErr instanceof Error
                    ? verifyErr.message
                    : "Payment verification failed.";
                reject(new Error(msg));
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Payment failed. Please try again.";
        setError(msg);
        onFailure(msg);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onFailure]
  );

  return { initiatePayment, loading, error, paymentId };
};
