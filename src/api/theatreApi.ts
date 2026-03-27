import apiClient from "./axios";
import { ApiResponse } from "../types/api";
import { Theatre } from "../types/theatre";

export const getTheatres = async () => {
  const response = await apiClient.get<ApiResponse<Theatre[]>>("/theatres");
  return response.data;
};

export const getTheatreById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Theatre>>(`/theatres/${id}`);
  return response.data;
};