// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';

import { deleteProductSchema } from '$zod/productSchema';
import { deleteCategorySchema } from '$zod/categorySchema';
import { getProductById } from '$requests/product/getProductById';
import { deleteProductCategories } from '$requests/product/deleteProductCategories';
import { deleteProductById } from '$requests/product/deleteProductById';
import { getCategoriesById } from '$requests/categories/getCategoriesById';
import { deleteCategoryById } from '$requests/categories/deleteCategoryById';
import { getPublicIdFromUrl } from '$lib/utils/getPublicIdFromUrl';

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
			const existingProduct = await getProductById(productId);
			if (!existingProduct) {
				console.log('Product not found:', productId);
				return fail(400, { message: 'Product not found' });
			}
			console.log('Product found:', existingProduct);

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

			const deletedCategories = await deleteProductCategories(productId);
			console.log('Deleted product categories:', deletedCategories);

			const deletedProduct = await deleteProductById(productId);
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
			const existingCategory = await getCategoriesById(categoryId);
			if (!existingCategory) {
				console.log('Category not found:', categoryId);
				return fail(400, { message: 'Category not found' });
			}
			console.log('Category found:', existingCategory);

			const deletedProductCategories = await deleteProductCategories(categoryId);
			console.log('Deleted product categories:', deletedProductCategories);

			const deletedCategory = await deleteCategoryById(categoryId);
			console.log('Deleted category:', deletedCategory);
			return message(form, 'Category deleted successfully');
		} catch (error) {
			console.error('Error deleting category:', error);
			return fail(500, { message: 'Category deletion failed' });
		}
	}
};
