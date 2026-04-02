import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type { User, UserRole, UserStatus } from "../types/user";

export interface UpdateUserPayload {
  userRole?: UserRole;
  userStatus?: UserStatus;
}

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  const response = await apiClient.patch<ApiResponse<User>>(`/user/${id}`, payload);
  return response.data;
};
