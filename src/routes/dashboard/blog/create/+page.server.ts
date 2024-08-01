import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { postSchema } from '$server/posts/postSchema';
import { createPost } from '$server/posts/createPost';
import { checkOrRegister } from '$server/user/checkOrRegister';

// Fonction de chargement
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	const user = await checkOrRegister(session);

	const IpostSchema = await superValidate(zod(postSchema));
	console.log('Load function executed. Schema:', IpostSchema);
	return {
		IpostSchema,
		user
	};
};

export const actions: Actions = {
	createPost: async ({ request }) => {
		console.log('createPost action initiated.');

		const formData = await request.formData();
		console.log('Received form data:', formData);

		const form = await superValidate(formData, zod(postSchema));
		console.log('Form validation result:', form);

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
			return fail(400, { form });
		}

		try {
			console.log('Creating new post with title:', form.data.title);

			await createPost(form.data.title, form.data.content, form.data.authorId);

			return message(form, 'Post created successfully');
		} catch (error) {
			console.error('Error creating post:', error);
			return fail(500, { message: 'Post creation failed' });
		}
	}
};
