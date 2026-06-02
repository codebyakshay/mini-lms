import { z } from "zod";

export const FreeAPIProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  price: z.number(),
  category: z.string(),
});

export type FreeAPIProduct = z.infer<typeof FreeAPIProductSchema>;

export const FreeAPIUserSchema = z.object({
  id: z.number(),
  name: z.object({
    title: z.string(),
    first: z.string(),
    last: z.string(),
  }),
  email: z.string(),
  picture: z.object({
    large: z.string(),
    medium: z.string(),
    thumbnail: z.string(),
  }),
});

export type FreeAPIUser = z.infer<typeof FreeAPIUserSchema>;

export interface APIResponse<T> {
  status: number;
  message: string;
  data: {
    data: T[];
  };
}
