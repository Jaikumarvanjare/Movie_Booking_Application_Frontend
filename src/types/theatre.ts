import type { Show } from "./show";

export interface Theatre {
  id: string;
  name: string;
  city: string;
  description?: string;
  pincode: number;
  address?: string;
  ownerId: string;
  movieIds?: string[];
  shows?: Show[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTheatrePayload {
  name: string;
  description?: string;
  city: string;
  pincode: number;
  address?: string;
}

export type UpdateTheatrePayload = Partial<CreateTheatrePayload>;

export interface UpdateTheatreMoviesPayload {
  movieIds: string[];
  insert: boolean;
}

export interface TheatreSearchParams {
  city?: string;
  pincode?: number;
  name?: string;
  movieId?: string;
  limit?: number;
  skip?: number;
}