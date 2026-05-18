export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:3000/mba/api/v1";

export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 5000);

export const API_KEY_SECRET = import.meta.env.VITE_API_KEY_SECRET?.trim() || "";

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

export const STORAGE_KEYS = {
  TOKEN: "cinebook_token",
  USER: "cinebook_user"
};
