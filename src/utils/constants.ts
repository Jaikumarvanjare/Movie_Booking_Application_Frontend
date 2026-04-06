export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/mba/api/v1";

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

export const STORAGE_KEYS = {
  TOKEN: "cinebook_token",
  USER: "cinebook_user"
};