import { Booking } from "./booking";
import { Theatre } from "./theatre";

export type UserRole = "CUSTOMER" | "ADMIN" | "CLIENT";
export type UserStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: UserRole;
  userStatus?: UserStatus;
  theatres?: Theatre[]; // Owner relation
  bookings?: Booking[]; // User bookings
  createdAt?: string;
  updatedAt?: string;
}