import apiClient from "./axios";
import { ApiResponse } from "../types/api";
import {
  AuthData,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload
} from "../types/auth";

export const signUp = async (payload: SignUpPayload) => {
  const response = await apiClient.post<ApiResponse<AuthData>>(
    "/auth/signup",
    payload
  );
  return response.data;
};

export const signIn = async (payload: SignInPayload) => {
  const response = await apiClient.post<ApiResponse<AuthData>>(
    "/auth/signin",
    payload
  );
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await apiClient.patch<ApiResponse<null>>(
    "/auth/reset",
    payload
  );
  return response.data;
};