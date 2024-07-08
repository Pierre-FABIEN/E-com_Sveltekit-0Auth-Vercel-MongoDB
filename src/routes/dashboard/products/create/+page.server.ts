import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';
import prisma from '$lib/prisma';
import { createProductSchema } from '$lib/ZodSchema/productSchema';

// Fonction de conversion de FormData
function convertFormData(formData: FormData) {
	const data: any = {};
	formData.forEach((value, key) => {
		if (key === 'images') {
			if (!data.images) data.images = [];
			const images = JSON.parse(value as string);
			images.forEach((image: any) => {
				data.images.push(image);
			});
		} else if (key === 'price') {
			data[key] = parseFloat(value as string);
		} else if (key === 'categoryId') {
			data[key] = [value];
		} else {
			data[key] = value;
		}
	});
	return data;
}

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

		// Convertir FormData en un format compatible
		const convertedData = convertFormData(formData);
		console.log(convertedData, 'convertedData');

		const form = await superValidate(convertedData, zod(createProductSchema));
		console.log(form, 'form');

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
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

		const categoryIdsString = formData.get('categoryId') as string;
		const categoryIds = categoryIdsString.split(',').map((id) => id.trim());
		console.log(categoryIds, 'categoryIds');

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

		try {
			const product = await prisma.product.create({
				data: {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					images: uploadedImageUrls
				}
			});

			await prisma.productCategory.createMany({
				data: existingCategoryIds.map((categoryId) => ({
					productId: product.id,
					categoryId
				}))
			});

			console.log('Product created:', product);
			return message(form, 'Valid form!');
		} catch (error) {
			console.error('Error creating product:', error);
			return fail(500, { message: 'Product creation failed' });
		}
	}
};
