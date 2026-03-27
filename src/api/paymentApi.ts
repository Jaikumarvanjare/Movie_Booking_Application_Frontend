import apiClient from "./axios";
import { ApiResponse } from "../types/api";
import { Payment } from "../types/payment";

export interface CreatePaymentPayload {
  bookingId: string;
  amount: number;
}

export const createPayment = async (payload: CreatePaymentPayload) => {
  const response = await apiClient.post<ApiResponse<Payment>>(
    "/payments",
    payload
  );
  return response.data;
};

export const getPayments = async () => {
  const response = await apiClient.get<ApiResponse<Payment[]>>("/payments");
  return response.data;
};