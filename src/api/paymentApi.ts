import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type {
  Payment,
  CreatePaymentPayload,
  RazorpayOrderPayload,
  RazorpayOrderResponse,
  RazorpayVerifyPayload
} from "../types/payment";


export const createPayment = async (payload: CreatePaymentPayload) => {
  const response = await apiClient.post<ApiResponse<Payment>>("/payments", payload);
  return response.data;
};

export const getPayments = async () => {
  const response = await apiClient.get<ApiResponse<Payment[]>>("/payments");
  return response.data;
};

export const getPaymentById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
  return response.data;
};


export const createRazorpayOrder = async (payload: RazorpayOrderPayload) => {
  const response = await apiClient.post<ApiResponse<RazorpayOrderResponse>>(
    "/payments/razorpay/order",
    payload
  );
  return response.data;
};

export const verifyRazorpayPayment = async (payload: RazorpayVerifyPayload) => {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
    "/payments/razorpay/verify",
    payload
  );
  return response.data;
};