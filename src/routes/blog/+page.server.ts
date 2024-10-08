import { getAllPosts } from '$server/posts/getAllPosts';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const posts = await getAllPosts();
	return {
		posts
	};
}) satisfies PageServerLoad;
