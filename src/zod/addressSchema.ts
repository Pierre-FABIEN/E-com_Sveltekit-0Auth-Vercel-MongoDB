import { z } from 'zod';

// Schema for creating an Address
export const createAddressSchema = z.object({
	street: z.string().min(3, 'Street is required'),
	city: z.string().min(3, 'City is required'),
	state: z.string().min(3, 'State is required'),
	zip: z.string().min(3, 'Zip is required'),
	country: z.string().min(3, 'Country is required'),
	userId: z.string()
});

// Schema for updating an Address
export const updateAddressSchema = z.object({
	id: z.string(),
	street: z.string().min(1, 'Street is required').optional(),
	city: z.string().min(1, 'City is required').optional(),
	state: z.string().min(1, 'State is required').optional(),
	zip: z.string().min(1, 'Zip is required').optional(),
	country: z.string().min(1, 'Country is required').optional(),
	userId: z.string()
});

// Schema for deleting an Address
export const deleteAddressSchema = z.object({
	id: z.string(),
	userId: z.string()
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;
export type DeleteAddressSchema = z.infer<typeof deleteAddressSchema>;
