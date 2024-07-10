import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import prisma from '$lib/prisma';
import cloudinary from '$lib/Cloudinary';
import { updateProductSchema } from '$lib/ZodSchema/productSchema';

// Function to extract the public ID from a Cloudinary URL
function getPublicIdFromUrl(url: string): string | null {
	const regex = /\/([^/]+)\.[a-z]+$/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		const product = await prisma.product.findUnique({
			where: { id: params.productId },
			include: { categories: true }
		});

		if (!product) {
			return fail(404, { message: 'Product not found' });
		}

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
			console.log('formData:', formData);
			const form = await superValidate(formData, zod(updateProductSchema));
			console.log('Form Data:', form.data);

			if (!form.valid) {
				console.log('Validation errors:', form.errors);
				return fail(400, withFiles({ form }));
			}

			const productId = form.data._id;
			if (!productId) {
				console.error('Product ID is missing or invalid:', productId);
				return fail(400, { message: 'Invalid Product ID' });
			}
			console.log('Product ID:', productId);

			const images = form.data.images;
			console.log('Images:', images);

			const existingImages = JSON.parse(formData.get('existingImages') as string) || [];
			console.log('Existing Images:', existingImages);

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
						console.log('Uploaded Image URL:', uploadResponse.secure_url);
					} catch (error) {
						console.error('Error uploading image:', error);
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
							console.log('Delete Result image existing to delete:', result);
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
			}

			// Split the categoryId string into an array of strings
			const categoryIds = form.data.categoryId[0].split(',').map((id) => id.trim());
			console.log('Category IDs:', categoryIds);

			const existingCategories = await prisma.category.findMany({
				where: {
					id: { in: categoryIds }
				},
				select: {
					id: true
				}
			});

			const existingCategoryIds = existingCategories.map((cat) => cat.id);
			const missingCategories = categoryIds.filter((id) => !existingCategoryIds.includes(id));

			if (missingCategories.length > 0) {
				console.log('Missing Categories:', missingCategories);
				return fail(400, {
					message: `The following categories do not exist: ${missingCategories.join(', ')}`
				});
			}

			try {
				const updatedProduct = await prisma.product.update({
					where: { id: productId },
					data: {
						name: form.data.name,
						description: form.data.description,
						price: form.data.price,
						stock: form.data.stock,
						images: uploadedImageUrls.length > 0 ? uploadedImageUrls : existingImages
					}
				});

				console.log('Updated Product:', updatedProduct);

				await prisma.productCategory.deleteMany({
					where: { productId: productId }
				});

				const productCategoryData = existingCategoryIds.map((categoryId) => ({
					productId: productId,
					categoryId: categoryId
				}));

				await prisma.productCategory.createMany({
					data: productCategoryData
				});

				return message(form, 'Product updated successfully');
			} catch (error) {
				console.error('Error updating product:', error);
				return fail(500, { message: 'Product update failed' });
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};
