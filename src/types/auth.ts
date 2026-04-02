import type { UserRole, UserStatus } from "./user";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  userRole: UserRole;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  userRole: UserRole;
  userStatus?: UserStatus;
}

export interface AuthData {
  accessToken?: string;
  token?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  user?: AuthUserData;
}
