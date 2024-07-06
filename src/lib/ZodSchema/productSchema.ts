import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp'];

// Schema for creating a product
const createProductSchema = z.object({
	name: z.string().min(3, 'Name is required and should be at least 3 characters long'),
	description: z
		.string()
		.min(3, 'Description is required and should be at least 3 characters long'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z
		.array(z.string().min(1, 'Category ID must be a non-empty string'))
		.nonempty('At least one category ID is required'),
	images: z
		.any()
		.refine((files) => {
			return files?.[0]?.size <= MAX_FILE_SIZE;
		}, `Max image size is 5MB.`)
		.refine(
			(files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		)
});

// Schema for updating a product
const updateProductSchema = z.object({
	_id: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z.array(z.any()),
	images: z
		.any()
		.refine((files) => {
			return files?.[0]?.size <= MAX_FILE_SIZE;
		}, `Max image size is 5MB.`)
		.refine(
			(files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		)
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
