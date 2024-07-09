import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 2;
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
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 1_000_000, 'Max 1MB upload size.')
		.array()
});

// Schema for updating a product
const updateProductSchema = z.object({
	_id: z.string(),
	name: z.string().min(3, 'Name is required and should be at least 3 characters long'),
	description: z
		.string()
		.min(3, 'Description is required and should be at least 3 characters long'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z
		.array(z.string().min(1, 'Category ID must be a non-empty string'))
		.nonempty('At least one category ID is required'),
	images: z
		.array(
			z.union([
				z.string().url('Invalid URL format for image'), // Pour les URLs des images existantes
				z
					.instanceof(File)
					.refine(
						(file) => file.size <= MAX_FILE_SIZE,
						`Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
					)
					.refine(
						(file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
						'Only .jpg, .jpeg, .png and .webp formats are supported.'
					)
			])
		)
		.min(1, 'At least one image is required')
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
