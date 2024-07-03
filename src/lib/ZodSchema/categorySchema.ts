import { z } from 'zod';

// Schéma pour la création d'une catégorie
const createCategorySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	createdAt: z.date().optional(), // Auto-generated in the database, not required on create
	updatedAt: z.date().optional() // Auto-generated in the database, not required on create
});

// Schéma pour la mise à jour d'une catégorie
const updateCategorySchema = z.object({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
	name: z.string().min(1, 'Name is required'),
	updatedAt: z.date().optional() // Auto-generated in the database
});

// Schéma pour la suppression d'une catégorie
const deleteCategorySchema = z.object({
	id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
});

// Types TypeScript inférés des schémas Zod
type CreateCategory = z.infer<typeof createCategorySchema>;
type UpdateCategory = z.infer<typeof updateCategorySchema>;
type DeleteCategory = z.infer<typeof deleteCategorySchema>;

export { createCategorySchema, updateCategorySchema, deleteCategorySchema };
export type { CreateCategory, UpdateCategory, DeleteCategory };
