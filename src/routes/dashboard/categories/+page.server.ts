import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';
import { deleteProductSchema } from '$lib/ZodSchema/productSchema';
import { deleteCategorySchema } from '$lib/ZodSchema/categorySchema';
import prisma from '$lib/prisma';

function getPublicIdFromUrl(url: string): string | null {
	const regex = /\/([^/]+)\.[a-z]+$/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

export const load: PageServerLoad = async () => {
	const IdeleteCategorySchema = await superValidate(zod(deleteCategorySchema));

	return {
		IdeleteCategorySchema
	};
};

export const actions: Actions = {
	deleteCategory: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(deleteCategorySchema));
		const categoryId = formData.get('categoryId') as string;
		console.log('Received categoryId:', categoryId);
		if (!categoryId) {
			console.log('No categoryId provided');
			return fail(400, { message: 'Category ID is required' });
		}
		try {
			// Vérifier si la catégorie existe
			const existingCategory = await prisma.category.findUnique({
				where: { id: categoryId }
			});
			if (!existingCategory) {
				console.log('Category not found:', categoryId);
				return fail(400, { message: 'Category not found' });
			}
			console.log('Category found:', existingCategory);

			// Supprimer les relations de catégorie associées au produit
			const deletedProductCategories = await prisma.productCategory.deleteMany({
				where: { categoryId: categoryId }
			});
			console.log('Deleted product categories:', deletedProductCategories);

			// Supprimer la catégorie
			const deletedCategory = await prisma.category.delete({
				where: { id: categoryId }
			});
			console.log('Deleted category:', deletedCategory);
			return message(form, 'Category deleted successfully');
		} catch (error) {
			console.error('Error deleting category:', error);
			return fail(500, { message: 'Category deletion failed' });
		}
	}
};
