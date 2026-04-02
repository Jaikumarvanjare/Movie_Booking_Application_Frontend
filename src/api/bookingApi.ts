import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type { Booking, CreateBookingPayload, UpdateBookingPayload } from "../types/booking";

export const createBooking = async (payload: CreateBookingPayload) => {
  const response = await apiClient.post<ApiResponse<Booking>>("/bookings", payload);
  return response.data;
};

export const getBookings = async () => {
  const response = await apiClient.get<ApiResponse<Booking[]>>("/bookings");
  return response.data;
};

export const getAllBookings = async () => {
  const response = await apiClient.get<ApiResponse<Booking[]>>("/bookings/all");
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
  return response.data;
};

export const updateBooking = async (id: string, payload: UpdateBookingPayload) => {
  const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}`, payload);
  return response.data;
};

export const cancelBooking = async (id: string) => {
  return updateBooking(id, { status: "CANCELLED" });
};