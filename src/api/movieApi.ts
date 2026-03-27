import apiClient from "./axios";
import { ApiResponse } from "../types/api";
import { Movie } from "../types/movie";

export const getMovies = async () => {
  const response = await apiClient.get<ApiResponse<Movie[]>>("/movies");
  return response.data;
};

export const getMovieById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Movie>>(`/movies/${id}`);
  return response.data;
};