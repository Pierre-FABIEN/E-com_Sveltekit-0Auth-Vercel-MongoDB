import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';

import { IncomingForm } from 'formidable';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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
		console.log('Request:', JSON.stringify(request, null, 2));

		const formData = await request.formData();
		console.log(formData, 'form data');

		const file = formData.get('file-upload');

		try {
			const parsedData = createProductSchema.parse({
				name: formData.get('name'),
				description: formData.get('description'),
				price: Number(formData.get('price')),
				images: formData.getAll('images'), // Ensure images are retrieved
				categoryId: formData.getAll('categoryId')
			});

			console.log('Parsed Data:', parsedData);

			// Perform further processing like saving the product to the database
			// For example: await saveProduct(parsedData);
		} catch (error: any) {
			console.error('Validation Error:', error);
			return fail(500, { error: 'Internal Server Error' });
		}
	}
};
