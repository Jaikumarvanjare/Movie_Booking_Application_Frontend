import type { Booking } from "./booking";

export interface Payment {
  id: string;
  amount: number;
  status: string;
  bookingId: string;
  booking?: Booking;
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
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  bookingId: string;
  amount: number;
}

export type RazorpayVerifyResponse = Booking;

export interface CreatePaymentPayload {
  bookingId: string;
  amount: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}
