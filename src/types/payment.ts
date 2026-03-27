export interface Payment {
  id: string;
  amount: number;
  status: string;
  bookingId: string;
  createdAt?: string;
  updatedAt?: string;
}