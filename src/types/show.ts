export interface Show {
  id: string;
  theatreId: string;
  movieId: string;
  timing: string;
  noOfSeats: number;
  seatConfiguration?: string;
  price: number;
  format?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShowPayload {
  theatreId: string;
  movieId: string;
  timing: string;
  noOfSeats: number;
  seatConfiguration?: string;
  price: number;
  format?: string;
}

export interface UpdateShowPayload {
  timing?: string;
  noOfSeats?: number;
  seatConfiguration?: string;
  price?: number;
  format?: string;
}

export interface ShowSearchParams {
  theatreId?: string;
  movieId?: string;
}