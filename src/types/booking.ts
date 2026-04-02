export interface Booking {
  id: string;
  theatreId: string;
  movieId: string;
  userId: string;
  timing: string;
  noOfSeats: number;
  totalCost: number;
  status: string;
  seat?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingPayload {
  theatreId: string;
  movieId: string;
  timing: string;
  noOfSeats: number;
  seat?: string;
}

export interface UpdateBookingPayload {
  timing?: string;
  noOfSeats?: number;
  totalCost?: number;
  status?: string;
  seat?: string;
}