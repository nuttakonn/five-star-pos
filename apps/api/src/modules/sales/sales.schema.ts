import { z } from 'zod';

export const createSaleSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().positive('Quantity must be positive'),
      unitPrice: z.number().nonnegative('Unit price cannot be negative'),
      costPrice: z.number().nonnegative('Cost price cannot be negative'),
    })).min(1, 'At least one item is required'),
    paymentMethod: z.enum(['cash', 'transfer']),
    totalAmount: z.number().positive('Total amount must be positive'),
    customerName: z.string().optional(),
    requestId: z.string().min(1, 'Request ID is required for idempotency'),
  }),
});
