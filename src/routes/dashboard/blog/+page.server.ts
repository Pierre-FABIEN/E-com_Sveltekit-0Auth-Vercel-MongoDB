// +page.server.ts
import type { PageServerLoad } from './posts/$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deletePostSchema } from '$server/posts/postSchema';

import { getPostById } from '$server/posts/getPostById';
import { deletePost } from '$server/posts/deletePost';
import { getAllPosts } from '$server/posts/getAllPosts';

export const load: PageServerLoad = async () => {
	const posts = await getAllPosts();
	const IdeletePostSchema = await superValidate(zod(deletePostSchema));

	return {
		IdeletePostSchema,
		posts
	};
};

export const actions: Actions = {
	deletePost: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData, 'form data');

		const form = await superValidate(formData, zod(deletePostSchema));
		const id = formData.get('id') as string;
		console.log('Received id:', id);
		if (!id) {
			console.log('No id provided');
			return fail(400, { message: 'Post ID is required' });
		}
		try {
			// Vérifier si la catégorie existe
			const existingPost = await getPostById(id);
			if (!existingPost) {
				console.log('Post not found:', id);
				return fail(400, { message: 'Post not found' });
			}
			console.log('Post found:', existingPost);

			// Supprimer la catégorie
			const deletedPost = await deletePost(id);
			console.log('Deleted category:', deletedPost);
			return message(form, 'Post deleted successfully');
		} catch (error) {
			console.error('Error deleting category:', error);
			return fail(500, { message: 'Post deletion failed' });
		}
	}
};
