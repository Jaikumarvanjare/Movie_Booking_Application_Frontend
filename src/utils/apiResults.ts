import axios from "axios";
import type { ApiResponse } from "../types/api";

type SettledApiArray<T> = PromiseSettledResult<ApiResponse<T[]>>;

export const readApiArray = <T>(response?: ApiResponse<T[]>): T[] => (
  Array.isArray(response?.data) ? response.data : []
);

export const readSettledApiArray = <T>(result: SettledApiArray<T>): T[] => (
  result.status === "fulfilled" ? readApiArray(result.value) : []
);

export const isNotFoundApiError = (error: unknown) => (
  axios.isAxiosError(error) && error.response?.status === 404
);

export const hasNonEmptyListRejection = (...results: PromiseSettledResult<unknown>[]) => (
  results.some((result) => result.status === "rejected" && !isNotFoundApiError(result.reason))
);
