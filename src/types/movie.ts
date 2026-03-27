import { Show } from "./show";

export interface Movie {
  id: string;
  name: string;
  description: string;
  casts: string[];
  trailerUrl: string;
  language: string;
  releaseDate: string;
  director: string;
  releaseStatus: string;
  poster: string;
  theatreIds: string[];
  shows?: Show[]; // Relation from Prisma
  createdAt?: string;
  updatedAt?: string;
}