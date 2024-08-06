// Import necessary types and functions
import { getPostById } from '$server/posts/getPostById';
import type { PageServerLoad } from './$types';

// Define the load function
export const load = (async ({ params }) => {
	// Extract postId from parameters
	const postId = params.id;
	// Fetch the post data by ID
	const post = await getPostById(postId);

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
