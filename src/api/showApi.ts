import apiClient from "./axios";
import { ApiResponse } from "../types/api";
import { Show } from "../types/show";

export const getShows = async () => {
  const response = await apiClient.get<ApiResponse<Show[]>>("/shows");
  return response.data;
};

export const getShowById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Show>>(`/shows/${id}`);
  return response.data;
};