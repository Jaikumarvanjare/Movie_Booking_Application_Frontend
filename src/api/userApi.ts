import apiClient from "./axios";
import type { ApiResponse } from "../types/api";
import type { User, UserRole, UserStatus } from "../types/user";

export interface UpdateUserPayload {
  userRole?: UserRole;
  userStatus?: UserStatus;
}

interface BackendProfileUser {
  id: string;
  name: string;
  email: string;
  about?: string;
  profilePhotoUrl?: string;
  role: UserRole;
  status?: UserStatus;
  createdAt?: string;
}

interface ProfileResponse {
  user: BackendProfileUser;
}

export interface UpdateProfilePayload {
  name?: string;
  about?: string;
  profilePhotoUrl?: string;
}

const normalizeProfileUser = (user: BackendProfileUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  about: user.about,
  profilePhotoUrl: user.profilePhotoUrl,
  userRole: user.role,
  userStatus: user.status,
  createdAt: user.createdAt
});

export const getCurrentProfile = async () => {
  const response = await apiClient.get<ApiResponse<ProfileResponse>>("/users/me");
  return {
    ...response.data,
    data: {
      user: normalizeProfileUser(response.data.data.user)
    }
  };
};

export const updateCurrentProfile = async (payload: UpdateProfilePayload) => {
  const response = await apiClient.patch<ApiResponse<ProfileResponse>>("/users/me", payload);
  return {
    ...response.data,
    data: {
      user: normalizeProfileUser(response.data.data.user)
    }
  };
};

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  const response = await apiClient.patch<ApiResponse<User>>(`/user/${id}`, payload);
  return response.data;
};
