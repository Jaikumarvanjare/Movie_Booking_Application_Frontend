import { UserRole } from "./user";

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

export interface AuthData {
  accessToken?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    userRole: UserRole;
  };
}