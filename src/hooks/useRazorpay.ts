import { useCallback, useState } from "react";
import axios from "axios";
import { createRazorpayOrder, verifyRazorpayPayment } from "../api/paymentApi";
import { RAZORPAY_KEY_ID } from "../utils/constants";
import type { Booking } from "../types/booking";

interface UseRazorpayReturn {
  initiatePayment: (booking: Booking) => Promise<void>;
  loading: boolean;
  error: string;
  paymentId: string | null;
}

const getPaymentErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const backendMessage =
      data?.message ||
      data?.err ||
      data?.error?.description ||
      data?.error ||
      data?.details ||
      error.message;

    if (
      typeof backendMessage === "string" &&
      backendMessage.toLowerCase().includes("authentication failed")
    ) {
      return "Razorpay authentication failed. Check that backend Razorpay key ID and key secret are correct and both are from the same test/live mode.";
    }

    if (status === 401) {
      return "Your session has expired. Please sign in again before making payment.";
    }

    if (status === 403) {
      return typeof backendMessage === "string"
        ? backendMessage
        : "Payment request was rejected by the server. Please check your access and API configuration.";
    }

    return typeof backendMessage === "string"
      ? backendMessage
      : "Payment failed. Please try again.";
  }

  return error instanceof Error ? error.message : "Payment failed. Please try again.";
};

/**
 * Encapsulates the full Razorpay 3-step checkout lifecycle:
 *   1. POST /payments/razorpay/order  → get Razorpay order
 *   2. Open Razorpay Checkout modal   → user pays
 *   3. POST /payments/razorpay/verify → verify signature and finalize booking
 */
export const useRazorpay = (
  onSuccess: (razorpayPaymentId: string, booking: Booking) => void,
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

      if (!RAZORPAY_KEY_ID) {
        const msg = "Razorpay key is missing. Please configure VITE_RAZORPAY_KEY_ID.";
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
                const verifyResponse = await verifyRazorpayPayment({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  bookingId: booking.id,
                  amount: booking.totalCost
                });

                setPaymentId(response.razorpay_payment_id);
                onSuccess(response.razorpay_payment_id, verifyResponse.data);
                resolve();
              } catch (verifyErr: unknown) {
                const msg = getPaymentErrorMessage(verifyErr);
                reject(new Error(msg));
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      } catch (err: unknown) {
        const msg = getPaymentErrorMessage(err);
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
