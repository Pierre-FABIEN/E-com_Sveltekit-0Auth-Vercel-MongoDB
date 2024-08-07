// Import necessary types and functions
import type { PageServerLoad } from './$types';
import { getPostBySlug } from '$server/posts/getPostBySlug';

// Define the load function
export const load = (async ({ params }) => {
	// Extract postslug from parameters
	const postslug = params.slug;

	// Fetch the post data by ID
	const post = await getPostBySlug(postslug);

	// If no post is found, return a 404 status and an error
	if (!post) {
		return {
			status: 404,
			error: new Error('post not found')
		};
	}

	// Return the post data in an array
	return {
		post: [post] // Ensuring it returns an array
	};
}) satisfies PageServerLoad;
