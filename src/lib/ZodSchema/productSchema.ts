import { z } from 'zod';

// Schéma pour la création d'un produit
const createProductSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'description is required'),
	price: z.number().positive('Price must be a positive number'),
	images: z.array(z.any()).optional(),
	categoryId: z.array(z.string().url('You have to select a category'))
});

// Schéma pour la mise à jour d'un produit
const updateProductSchema = z.object({
	_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'description is required'),
	price: z.number().positive('Price must be a positive number'),
	images: z.array(z.any()).optional(),
	categoryId: z.array(z.string().url('You have to select a category'))
});

// Schéma pour la suppression d'un produit
const deleteProductSchema = z.object({
	_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
});

// TypeScript types inferred from the Zod schemas
type CreateProduct = z.infer<typeof createProductSchema>;
type UpdateProduct = z.infer<typeof updateProductSchema>;
type DeleteProduct = z.infer<typeof deleteProductSchema>;

export { createProductSchema, updateProductSchema, deleteProductSchema };
export type { CreateProduct, UpdateProduct, DeleteProduct };
