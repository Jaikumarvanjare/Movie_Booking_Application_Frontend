export interface Payment {
  id: string;
  amount: number;
  status: string;
  bookingId: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ── Razorpay-specific payloads ──────────────────────────────────────────────

export interface RazorpayOrderPayload {
  bookingId: string;
  amount: number; // in rupees — backend converts to paise
}

export interface RazorpayOrderResponse {
  id: string;         // Razorpay order id  e.g. "order_..."
  amount: number;     // in paise
  currency: string;   // "INR"
  receipt?: string;
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
  amount: number;
}

export interface CreatePaymentPayload {
  bookingId: string;
  amount: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}