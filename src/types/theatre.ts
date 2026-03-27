import { Show } from "./show";

export interface Theatre {
  id: string;
  name: string;
  city: string;
  description: string;
  pincode: number;
  address: string;
  ownerId?: string; // From Prisma relation
  movieIds?: string[];
  shows?: Show[]; // Relation from Prisma
  createdAt?: string;
  updatedAt?: string;
}