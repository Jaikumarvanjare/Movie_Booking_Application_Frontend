export interface Booking {
  id: string;
  timing: string;
  noOfSeats: number;
  totalCost: number;
  status: string;
  seat?: string; // Prisma has single String, but if API sends array, use: string | string[]
  userId?: string;
  showId?: string;
  createdAt?: string;
  updatedAt?: string;
}