import { z } from 'zod';

// Schema for creating a product
const createProductSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z.array(z.string())
});

// Schema for updating a product
const updateProductSchema = z.object({
	_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z.array(z.string())
});

// Schema for deleting a product
const deleteProductSchema = z.object({
	_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
});

// TypeScript types inferred from the Zod schemas
type CreateProduct = z.infer<typeof createProductSchema>;
type UpdateProduct = z.infer<typeof updateProductSchema>;
type DeleteProduct = z.infer<typeof deleteProductSchema>;

export { createProductSchema, updateProductSchema, deleteProductSchema };
export type { CreateProduct, UpdateProduct, DeleteProduct };
