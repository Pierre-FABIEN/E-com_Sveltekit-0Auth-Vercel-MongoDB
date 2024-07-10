import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';
import prisma from '$lib/prisma';

import { createProductSchema } from '$lib/ZodSchema/productSchema';

export const load: PageServerLoad = async () => {
	const IcreateProductSchema = await superValidate(zod(createProductSchema));
	return {
		IcreateProductSchema
	};
};

export const actions: Actions = {
	createProduct: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData, 'formData');

		const form = await superValidate(formData, zod(createProductSchema));
		console.log(form, 'form');

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
			return fail(400, withFiles({ form }));
		}

		const images = formData.getAll('images') as File[];
		console.log(images, 'images');

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

		// Traiter les categoryId comme un tableau de chaînes
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
					stock: form.data.stock,
					images: uploadedImageUrls
				}
			});

			// Connecter les catégories au produit via ProductCategory
			await prisma.productCategory.createMany({
				data: existingCategoryIds.map((categoryId) => ({
					productId: product.id,
					categoryId
				}))
			});

			return message(form, 'Product created successfully');
		} catch (error) {
			console.error('Error creating product:', error);
			return fail(500, { message: 'Product creation failed' });
		}
	}
};
