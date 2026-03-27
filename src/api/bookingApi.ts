import apiClient from "./axios";
import { ApiResponse } from "../types/api";
import { Booking } from "../types/booking";

export interface CreateBookingPayload {
  theatreId: string;
  movieId: string;
  timing: string;
  noOfSeats: number;
}

export const createBooking = async (payload: CreateBookingPayload) => {
  const response = await apiClient.post<ApiResponse<Booking>>(
    "/bookings",
    payload
  );
  return response.data;
};

export const getBookings = async () => {
  const response = await apiClient.get<ApiResponse<Booking[]>>("/bookings");
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await apiClient.put<ApiResponse<Booking>>(`/bookings/${id}`);
  return response.data;
};