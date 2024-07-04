import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';

import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';

import {
	createProductSchema,
	updateProductSchema,
	deleteProductSchema
} from '$lib/ZodSchema/productSchema';

import {
	createCategorySchema,
	updateCategorySchema,
	deleteCategorySchema
} from '$lib/ZodSchema/categorySchema';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	const IcreateProductSchema = await superValidate(zod(createProductSchema));
	const IupdateProductSchema = await superValidate(zod(updateProductSchema));
	const IdeleteProductSchema = await superValidate(zod(deleteProductSchema));

	const IcreateCategorySchema = await superValidate(zod(createCategorySchema));
	const IupdateCategorySchema = await superValidate(zod(updateCategorySchema));
	const IdeleteCategorySchema = await superValidate(zod(deleteCategorySchema));

	return {
		IcreateCategorySchema,
		IupdateCategorySchema,
		IdeleteCategorySchema,

		IcreateProductSchema,
		IupdateProductSchema,
		IdeleteProductSchema
	};
};

export const actions: Actions = {
	createProduct: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(createProductSchema));
		console.log(form, 'form');
		console.log(form.data.categoryId, 'categoryId');

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
					images: uploadedImageUrls
				}
			});

			// Créer les relations dans ProductCategory
			const productCategoryData = existingCategoryIds.map((categoryId) => ({
				productId: product.id,
				categoryId: categoryId
			}));

			await prisma.productCategory.createMany({
				data: productCategoryData
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
