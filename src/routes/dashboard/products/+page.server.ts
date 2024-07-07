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
	const IdeleteProductSchema = await superValidate(zod(deleteProductSchema));
	const IdeleteCategorySchema = await superValidate(zod(deleteCategorySchema));

	return {
		IdeleteCategorySchema,
		IdeleteProductSchema
	};
};

export const actions: Actions = {
	deleteProduct: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(deleteProductSchema));
		const productId = formData.get('productId') as string;
		console.log('Received productId:', productId);
		if (!productId) {
			console.log('No productId provided');
			return fail(400, { message: 'Product ID is required' });
		}
		try {
			// Vérifier si le produit existe
			const existingProduct = await prisma.product.findUnique({
				where: { id: productId }
			});
			if (!existingProduct) {
				console.log('Product not found:', productId);
				return fail(400, { message: 'Product not found' });
			}
			console.log('Product found:', existingProduct);

			// Supprimer les images associées de Cloudinary
			const images = existingProduct.images;
			for (const imageUrl of images) {
				const publicId = getPublicIdFromUrl(imageUrl);
				if (publicId) {
					try {
						const result = await cloudinary.uploader.destroy(`products/${publicId}`);
						console.log('Delete Result:', result);
						if (result.result !== 'ok' && result.result !== 'not found') {
							console.error('Error deleting image from Cloudinary:', result);
							return fail(500, { message: 'Failed to delete image from Cloudinary' });
						}
					} catch (error) {
						console.error('Error deleting image from Cloudinary:', error);
						return fail(500, { message: 'Failed to delete image from Cloudinary' });
					}
				}
			}

			// Supprimer les relations de catégorie associées au produit
			const deletedCategories = await prisma.productCategory.deleteMany({
				where: { productId: productId }
			});
			console.log('Deleted product categories:', deletedCategories);

			// Supprimer le produit
			const deletedProduct = await prisma.product.delete({
				where: { id: productId }
			});
			console.log('Deleted product:', deletedProduct);
			return message(form, 'Product deleted successfully');
		} catch (error) {
			console.error('Error deleting product:', error);
			return fail(500, { message: 'Product deletion failed' });
		}
	},
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
