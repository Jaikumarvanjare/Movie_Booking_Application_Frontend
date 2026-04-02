import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type {
  Theatre,
  CreateTheatrePayload,
  UpdateTheatrePayload,
  UpdateTheatreMoviesPayload,
  TheatreSearchParams,
} from "../types/theatre";
import type { Movie } from "../types/movie";

export const getTheatres = async (params?: TheatreSearchParams) => {
  const response = await apiClient.get<ApiResponse<Theatre[]>>("/theatres", { params });
  return response.data;
};

export const getTheatreById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Theatre>>(`/theatres/${id}`);
  return response.data;
};

export const createTheatre = async (payload: CreateTheatrePayload) => {
  const response = await apiClient.post<ApiResponse<Theatre>>("/theatres", payload);
  return response.data;
};

export const updateTheatre = async (id: string, payload: UpdateTheatrePayload) => {
  const response = await apiClient.patch<ApiResponse<Theatre>>(`/theatres/${id}`, payload);
  return response.data;
};

export const deleteTheatre = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<null>>(`/theatres/${id}`);
  return response.data;
};

export const updateTheatreMovies = async (id: string, payload: UpdateTheatreMoviesPayload) => {
  const response = await apiClient.patch<ApiResponse<Theatre>>(`/theatres/${id}/movies`, payload);
  return response.data;
};

export const getTheatreMovies = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Movie[]>>(`/theatres/${id}/movies`);
  return response.data;
};

export const checkTheatreMovie = async (theatreId: string, movieId: string) => {
  const response = await apiClient.get<ApiResponse<{ isPresent: boolean }>>(
    `/theatres/${theatreId}/movies/${movieId}`
  );
  return response.data;
};