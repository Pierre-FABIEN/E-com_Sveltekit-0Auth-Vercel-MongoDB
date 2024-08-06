import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';

import { updateProductSchema } from '$server/product/Schema/productSchema';

import { getCategoriesByIds } from '$server/categories/getCategoriesByIds';
import { updateProductById } from '$server/product/updateProductById';
import { deleteProductCategories } from '$server/product/deleteProductCategories';
import { getProductById } from '$server/product/getProductById';
import { connectProductToCategories } from '$server/product/connectProductToCategories';

import { getPublicIdFromUrl } from '$lib/utils/getPublicIdFromUrl';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const product = await getProductById(params.id);

		if (!product) {
			return fail(404, { message: 'Product not found' });
		}
		console.log('Product found:', product);

		const initialData = {
			_id: product.id,
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			categoryId: product.categories.map((cat) => cat.categoryId) as [string, ...string[]],
			images: [],
			existingImages: product.images
		};

		const IupdateProductSchema = await superValidate(initialData, zod(updateProductSchema));

		return {
			IupdateProductSchema
		};
	} catch (error) {
		console.error('Error loading product:', error);
		return fail(500, { message: 'An error occurred while loading the product' });
	}
};

export const actions: Actions = {
	updateProduct: async ({ request }) => {
		try {
			const formData = await request.formData();
			const form = await superValidate(formData, zod(updateProductSchema));

			if (!form.valid) {
				return fail(400, withFiles({ form }));
			}

			const productId = form.data._id;
			if (!productId) {
				return fail(400, { message: 'Invalid Product ID' });
			}

			const images = form.data.images;
			const existingImages = JSON.parse(formData.get('existingImages') as string) || [];
			const uploadedImageUrls: string[] = [];

			for (const image of images) {
				if (typeof image === 'string') {
					uploadedImageUrls.push(image);
				} else if (image instanceof File) {
					try {
						const buffer = await image.arrayBuffer();
						const base64String = Buffer.from(buffer).toString('base64');
						const uploadResponse = await cloudinary.uploader.upload(
							`data:${image.type};base64,${base64String}`,
							{
								folder: 'products'
							}
						);
						uploadedImageUrls.push(uploadResponse.secure_url);
					} catch (error) {
						return fail(500, { message: 'Image upload failed' });
					}
				}
			}

			if (uploadedImageUrls.length > 0) {
				for (const imageUrl of existingImages) {
					const publicId = getPublicIdFromUrl(imageUrl);
					if (publicId) {
						try {
							const result = await cloudinary.uploader.destroy(`products/${publicId}`);
							if (result.result !== 'ok' && result.result !== 'not found') {
								return fail(500, { message: 'Failed to delete image from Cloudinary' });
							}
						} catch (error) {
							return fail(500, { message: 'Failed to delete image from Cloudinary' });
						}
					}
				}
			}

			const categoryIds = form.data.categoryId[0].split(',').map((id) => id.trim());
			const existingCategories = await getCategoriesByIds(categoryIds);

			const existingCategoryIds = existingCategories.map((cat) => cat.id);
			const missingCategories = categoryIds.filter((id) => !existingCategoryIds.includes(id));

			if (missingCategories.length > 0) {
				return fail(400, {
					message: `The following categories do not exist: ${missingCategories.join(', ')}`
				});
			}

			try {
				await updateProductById(productId, {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					stock: form.data.stock,
					images: uploadedImageUrls.length > 0 ? uploadedImageUrls : existingImages
				});

				await deleteProductCategories(productId);

				await connectProductToCategories(productId, categoryIds);

				return message(form, 'Product updated successfully');
			} catch (error) {
				return fail(500, { message: 'Product update failed' });
			}
		} catch (error) {
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};
