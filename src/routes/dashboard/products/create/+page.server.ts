// src/routes/your-route/+page.server.ts
import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';
import { createProductSchema } from '$lib/ZodSchema/productSchema';
import { createProduct } from '$lib/prisma/Request/product/createProduct';
import { connectProductToCategories } from '$lib/prisma/Request/product/connectProductToCategories';
import { getCategoriesByIds } from '$lib/prisma/Request/categories/getCategoriesByIds';

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

		const categoryIdsString = formData.get('categoryId') as string;
		const categoryIds = categoryIdsString.split(',').map((id) => id.trim());

		const existingCategories = await getCategoriesByIds(categoryIds);
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

		try {
			const product = await createProduct({
				name: form.data.name,
				description: form.data.description,
				price: form.data.price,
				stock: form.data.stock,
				images: uploadedImageUrls
			});

			await connectProductToCategories(product.id, existingCategoryIds);

			return message(form, 'Product created successfully');
		} catch (error) {
			console.error('Error creating product:', error);
			return fail(500, { message: 'Product creation failed' });
		}
	}
};
