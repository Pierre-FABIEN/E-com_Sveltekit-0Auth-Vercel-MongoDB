import { z } from 'zod';

// Définir le schéma pour une image
const imageSchema = z.object({
	name: z.string().min(1, 'Image name cannot be empty'),
	size: z.number().max(1_000_000, 'Image size cannot exceed 1MB'),
	type: z.enum(['image/jpeg', 'image/png', 'image/webp']),
	lastModified: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
});

// Schéma pour créer un produit
const createProductSchema = z.object({
	name: z.string().min(3, 'Name is required and should be at least 3 characters long'),
	description: z
		.string()
		.min(3, 'Description is required and should be at least 3 characters long'),
	price: z.number().positive('Price must be a positive number'),
	categoryId: z.string().min(1, 'Category ID must be a non-empty string'),
	images: z.array(imageSchema).min(1, 'At least one image is required')
});

// Définir les données de test
const testData = {
	name: 'Mon équipe',
	description: 'fghsd fgth fy',
	price: 12,
	categoryId: '66855356025bd899d5c068f9',
	images: [
		{
			name: 'topographic-multicolored-linear-background-abstraction-with[..82/202..]c-multicolored-linear-background-with-copy-space-vector.jpg',
			size: 20050079,
			type: 'image/jpeg',
			lastModified: '2024-06-11T13:37:25.031Z'
		},
		{
			name: '1000_F_355354804_E4Vuy60lzNM03wSvrLuyu0gkqqqYW1nb.jpg',
			size: 20304137,
			type: 'image/jpeg',
			lastModified: '2024-06-11T13:32:58.140Z'
		}
	]
};

// Effectuer la validation
try {
	createProductSchema.parse(testData);
	console.log('Validation successful!');
} catch (e) {
	if (e instanceof z.ZodError) {
		console.error('Validation errors:', e.errors);
	} else {
		console.error('Unknown error:', e);
	}
}
