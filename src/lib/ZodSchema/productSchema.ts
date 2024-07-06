import { z } from 'zod';

// Schema for creating a product
const createProductSchema = z.object({
	name: z.string().min(3, 'Name is required'),
	description: z.string().min(3, 'Description is required'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z
		.array(z.string().min(1, 'Category ID must be a non-empty string'))
		.nonempty('At least one category ID is required'),
	images: z
		.array(
			z
				.instanceof(File, { message: 'Please upload a file.' })
				.refine((file) => file.size < 100_000, {
					message: 'Max 100 kB upload size.'
				})
		)
		.nonempty('At least one image is required.')
});

// Schema for updating a product
const updateProductSchema = z.object({
	_id: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z.array(z.any()),
	images: z
		.array(
			z
				.instanceof(File, { message: 'Please upload a file.' })
				.refine((file) => file.size < 100_000, {
					message: 'Max 100 kB upload size.'
				})
		)
		.nonempty('At least one image is required.')
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
