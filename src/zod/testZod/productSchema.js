import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
		.array(z.any())
		.refine((files) => Array.isArray(files) && files.length > 0, 'At least one image is required.')
		.refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), `Max image size is 2MB.`)
		.refine(
			(files) => files.every((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		)
});

// Sample data for validation
const formData = {
	name: 'aaaaaaaaaaaaaa',
	price: 111,
	description: 'aaaaaaaaaaaaaaa',
	images: [
		{
			size: 205079,
			type: 'image/jpeg',
			name: 'topographic-multicolored-linear-background-abstraction-with-place-for-text-map-line-of-topography-abstract-topographic-map-concept-topographic-multicolored-linear-background-with-copy-space-vector.jpg',
			lastModified: 1720620538376
		},
		{
			size: 220487,
			type: 'image/jpeg',
			name: 'abstract-topographic-map-background-abstract-topographic-map-background-imitation-of-a-geographical-map-geographic-map-conceptual-design-elegant-background-for-presentations-free-vector.jpg',
			lastModified: 1720620538376
		}
	],
	categoryId: ['668cecc7cdf5b79cd52ad96c'],
	__superform_id: 'createProduct'
};

try {
	createProductSchema.parse(formData);
	console.log('Validation passed');
} catch (e) {
	console.error('Validation errors:', e.errors);
}
