import { z } from 'zod';

// Schema for creating an Address
export const createAddressSchema = z.object({
	recipient: z.string().min(3, 'recipient is required'),
	street: z.string().min(3, 'Street is required'),
	city: z.string().min(3, 'City is required'),
	state: z.string().min(3, 'State is required'),
	zip: z.string().min(3, 'Zip is required'),
	country: z.string().min(3, 'Country is required'),
	userId: z.string()
});

// Schema for deleting an Address
export const deleteAddressSchema = z.object({
	id: z.string()
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
export type DeleteAddressSchema = z.infer<typeof deleteAddressSchema>;
