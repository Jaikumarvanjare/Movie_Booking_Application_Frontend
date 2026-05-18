import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type {
  Show,
  CreateShowPayload,
  UpdateShowPayload,
  ShowSearchParams
} from "../types/show";

export const getShows = async (params?: ShowSearchParams) => {
  const response = await apiClient.get<ApiResponse<Show[]>>("/shows", { params });
  return response.data;
};

export const getShowById = async (id: string) => {
  const response = await getShows();
  const show = Array.isArray(response.data)
    ? response.data.find((item) => item.id === id) ?? null
    : null;

  if (!show) {
    throw new Error("Show not found");
  }

  return {
    ...response,
    data: show
  };
};

export const createShow = async (payload: CreateShowPayload) => {
  const response = await apiClient.post<ApiResponse<Show>>("/shows", payload);
  return response.data;
};

export const updateShow = async (id: string, payload: UpdateShowPayload) => {
  const response = await apiClient.patch<ApiResponse<Show>>(`/shows/${id}`, payload);
  return response.data;
};

export const deleteShow = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<null>>(`/shows/${id}`);
  return response.data;
};
