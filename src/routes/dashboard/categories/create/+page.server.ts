import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';
import prisma from '$lib/prisma';
import { createCategorySchema } from '$lib/ZodSchema/categorySchema';

// Fonction de conversion de FormData
export const load: PageServerLoad = async () => {
	const IcreateCategorySchema = await superValidate(zod(createCategorySchema));
	return {
		IcreateCategorySchema
	};
};

export const actions: Actions = {
	createCategory: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData, 'formData');

		const form = await superValidate(formData, zod(createCategorySchema));
		console.log(form, 'form');

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
			return fail(400, withFiles({ form }));
		}

		try {
			return message(form, 'Category created successfully');
		} catch (error) {
			console.error('Error creating category:', error);
			return fail(500, { message: 'Category creation failed' });
		}
	}
};
