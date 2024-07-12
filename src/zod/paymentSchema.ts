import { z } from 'zod';

export const paymentSchema = z.object({
	orderId: z.string(),
	addressId: z.string()
});

export type PaymentSchema = z.infer<typeof paymentSchema>;
