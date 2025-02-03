import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        product: z.string().nonempty({ message: 'Product is required' }),
        quantity: z.number().min(1, { message: 'Quantity is required' }),
      }),
    ),
    status: z.enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled']).default('Pending'),
    transaction: z
      .object({
        id: z.string(),
        transactionStatus: z.string(),
        bank_status: z.string(),
        sp_code: z.string(),
        sp_message: z.string(),
        method: z.string(),
        date_time: z.string(),
      })
      .optional(),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    totalPrice: z.number().optional(),
    status: z.enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled']).default('Pending'),
    transaction: z
      .object({
        id: z.string().optional(),
        transactionStatus: z.string().optional(),
        bank_status: z.string(),
        sp_code: z.string().optional(),
        sp_message: z.string().optional(),
        method: z.string().optional(),
        date_time: z.string().optional(),
      })
      .optional(),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
