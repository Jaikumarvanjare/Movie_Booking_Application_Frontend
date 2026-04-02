export type UserRole = "CUSTOMER" | "ADMIN" | "CLIENT";
export type UserStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: UserRole;
  userStatus?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}