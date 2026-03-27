export interface Show {
  id: string;
  theatreId: string;
  movieId: string;
  timing: string;
  noOfSeats: number;
  price: number;
  seatConfiguration?: string;
  format?: string;
  createdAt?: string;
  updatedAt?: string;
}