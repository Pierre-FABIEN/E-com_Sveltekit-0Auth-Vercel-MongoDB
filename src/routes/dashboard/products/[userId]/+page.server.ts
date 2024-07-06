import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';

import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import prisma from '$lib/prisma';
import cloudinary from '$lib/Cloudinary';

import { updateProductSchema } from '$lib/ZodSchema/productSchema';

export const load: PageServerLoad = async () => {
	const IupdateProductSchema = await superValidate(zod(updateProductSchema));

	return {
		IupdateProductSchema
	};
};

export const actions: Actions = {
	updateProduct: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData, 'formData');

		const form = await superValidate(formData, zod(updateProductSchema));
		console.log(form, 'form');

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		const productId = form.data.id;
		const images = formData.getAll('images') as File[];
		const uploadedImageUrls: string[] = [];

		for (const image of images) {
			if (image instanceof File) {
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
					console.error('Error uploading image:', error);
					return fail(500, { message: 'Image upload failed' });
				}
			}
		}

		const categoryIds = form.data.categoryId as string[];
		console.log(categoryIds, 'categoryIds');

		// Vérifier l'existence des catégories
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
			return fail(400, {
				message: `The following categories do not exist: ${missingCategories.join(', ')}`
			});
		}

		// Mettre à jour le produit dans la base de données avec les URLs des nouvelles images uploadées
		try {
			const updatedProduct = await prisma.product.update({
				where: { id: productId },
				data: {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined // Only update images if new ones are uploaded
				}
			});

			// Mettre à jour les relations dans ProductCategory
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

			console.log(updatedProduct, 'updatedProduct');
			return {
				success: true,
				product: updatedProduct
			};
		} catch (error) {
			console.error('Error updating product:', error);
			return fail(500, { message: 'Product update failed' });
		}
	}
};
