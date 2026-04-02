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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMoviePayload {
  name: string;
  description: string;
  casts: string[];
  trailerUrl: string;
  language: string;
  releaseDate: string;
  director: string;
  releaseStatus: string;
  poster: string;
}

export type UpdateMoviePayload = Partial<CreateMoviePayload>;