import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Product name is required." }).min(1),
    description: z
      .string({ required_error: "Description is required." })
      .min(1),
    price: z.number({ required_error: "Price is required." }).positive(),
    category: z.string({ required_error: "Category is required." }).min(1),
    stock: z.number().int().nonnegative().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

export const productUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  images: z.array(z.string()).optional(),
});
