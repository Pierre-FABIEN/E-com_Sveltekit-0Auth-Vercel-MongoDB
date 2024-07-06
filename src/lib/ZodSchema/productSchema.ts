import { z } from 'zod';

// Schema for creating a product
const createProductSchema = z.object({
	name: z.string().min(3, 'Name is required'),
	description: z.string().min(3, 'Description is required'),
	price: z.number().positive('Price must be a positive number'),
	//categoryId: z.array(z.any()),
	images: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 100_000, 'Max 100 kB upload size.')
		.array()
});

// Schema for updating a product
const updateProductSchema = z.object({
	_id: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z.array(z.any()),
	images: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 100_000, 'Max 100 kB upload size.')
		.array()
});

// Schema for deleting a product
const deleteProductSchema = z.object({
	_id: z.string()
});

// TypeScript types inferred from the Zod schemas
type CreateProduct = z.infer<typeof createProductSchema>;
type UpdateProduct = z.infer<typeof updateProductSchema>;
type DeleteProduct = z.infer<typeof deleteProductSchema>;

export { createProductSchema, updateProductSchema, deleteProductSchema };
export type { CreateProduct, UpdateProduct, DeleteProduct };
