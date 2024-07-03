import type { PageServerLoad } from './$types';
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
