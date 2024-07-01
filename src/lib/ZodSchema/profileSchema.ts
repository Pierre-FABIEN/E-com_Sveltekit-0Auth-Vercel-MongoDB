import { z } from 'zod';

export const profileSchema = z.object({
	id: z.string(),
	address: z.string().min(5, { message: 'Address is required' }),
	city: z.string().min(2, { message: 'City is required' }),
	postalcode: z.string().regex(/^\d{5}$/, { message: 'Please enter a valid 5-digit postal code' }),
	phone: z.string().regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit phone number' })
});

export type ProfileSchema = z.infer<typeof profileSchema>;
