import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type {
  AuthData,
  ChangePasswordPayload,
  ForgotPasswordPayload,
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
  const response = await apiClient.post<ApiResponse<Record<string, never>>>(
    "/auth/reset-password",
    payload
  );
  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await apiClient.post<ApiResponse<Record<string, never>>>(
    "/auth/forgot-password",
    payload
  );
  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await apiClient.post<ApiResponse<Record<string, never>>>(
    "/auth/change-password",
    payload
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post<ApiResponse<Record<string, never>>>(
    "/auth/logout"
  );
  return response.data;
};
