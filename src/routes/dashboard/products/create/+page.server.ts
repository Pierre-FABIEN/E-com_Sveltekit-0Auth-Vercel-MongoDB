import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';

import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';

import { createProductSchema } from '$lib/ZodSchema/productSchema';

import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	const IcreateProductSchema = await superValidate(zod(createProductSchema));

	return {
		IcreateProductSchema
	};
};

export const actions: Actions = {
	createProduct: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(createProductSchema));

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

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

		// Correction de la transformation de categoryId en tableau
		const categoryIdsString = formData.get('categoryId') as string;
		const categoryIds = categoryIdsString.split(',').map((id) => id.trim());
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

		console.log(existingCategories, 'existingCategories');

		const existingCategoryIds = existingCategories.map((cat) => cat.id);
		console.log(existingCategoryIds, 'existingCategoryIds');

		const missingCategories = categoryIds.filter((id) => !existingCategoryIds.includes(id));
		console.log(missingCategories, 'missingCategories');

		if (missingCategories.length > 0) {
			return fail(400, {
				message: `The following categories do not exist: ${missingCategories.join(', ')}`
			});
		}

		// Créer un produit dans la base de données avec les URLs des images uploadées
		try {
			const product = await prisma.product.create({
				data: {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					images: uploadedImageUrls,
					categories: {
						connect: existingCategoryIds.map((id) => ({ id }))
					}
				}
			});

			console.log(product, 'product');
			return {
				success: true,
				product
			};
		} catch (error) {
			console.error('Error creating product:', error);
			return fail(500, { message: 'Product creation failed' });
		}
	}
};
