import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    brand: z.string().min(1, { message: 'Brand is required' }),
    model: z.string().min(1, { message: 'Model is required' }),
    year: z.number().int().min(1886, { message: 'Year must be a valid integer' }),
    price: z.number().positive({ message: 'Price must be a positive number' }),
    category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible']),
    description: z.string().min(1, { message: 'Description is required' }),
    quantity: z.number().int().nonnegative({ message: 'Quantity must be a non-negative integer' }),
    inStock: z.boolean().refine(val => typeof val === 'boolean', {
      message: 'Stock status is required',
    }),
    imageUrl: z.string({ required_error: 'Image url is required' }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    price: z.number().positive().optional(),
    category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible']).optional(),
    description: z.string().optional(),
    quantity: z.number().positive().optional(),
    inStock: z.boolean().optional(),
    imageUrl: z.string().optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
