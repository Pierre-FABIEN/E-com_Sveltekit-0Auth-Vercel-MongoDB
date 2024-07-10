import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { updateCategorySchema } from '$lib/ZodSchema/categorySchema';
import { updateCategory } from '$lib/prisma/Request/categories/updateCategory';
import { getCategoriesById } from '$lib/prisma/Request/categories/getCategoriesById';

export const load: PageServerLoad = async ({ params }) => {
	console.log('Loading category data for ID:', params.categoryId);

	const category = await getCategoriesById(params.categoryId);

	if (!category) {
		console.log('Category not found');
		return fail(404, { message: 'Category not found' });
	}

	const initialData = {
		id: category.id,
		name: category.name
	};

	const IupdateCategorySchema = await superValidate(initialData, zod(updateCategorySchema));
	console.log('Loaded category data:', IupdateCategorySchema);

	return {
		IupdateCategorySchema
	};
};

export const actions: Actions = {
	updateCategory: async ({ request }) => {
		console.log('updateCategory action initiated.');

		const formData = await request.formData();
		console.log('Received form data:', formData);

		const form = await superValidate(formData, zod(updateCategorySchema));
		console.log('Form validation result:', form);

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
			return fail(400, { form });
		}

		try {
			const categoryId = formData.get('categoryId');

			await updateCategory({ id: categoryId as string, name: form.data.name });

			return message(form, 'Category updated successfully');
		} catch (error) {
			console.error('Error updating category:', error);
			return fail(500, { message: 'Category update failed' });
		}
	}
};
