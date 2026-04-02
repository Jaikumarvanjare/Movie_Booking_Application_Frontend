import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type { Movie, CreateMoviePayload, UpdateMoviePayload } from "../types/movie";

export const getMovies = async (name?: string) => {
  const params = name ? { name } : {};
  const response = await apiClient.get<ApiResponse<Movie[]>>("/movies", { params });
  return response.data;
};

export const getMovieById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Movie>>(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (payload: CreateMoviePayload) => {
  const response = await apiClient.post<ApiResponse<Movie>>("/movies", payload);
  return response.data;
};

export const updateMovie = async (id: string, payload: UpdateMoviePayload) => {
  const response = await apiClient.patch<ApiResponse<Movie>>(`/movies/${id}`, payload);
  return response.data;
};

export const deleteMovie = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<null>>(`/movies/${id}`);
  return response.data;
};