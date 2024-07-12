import { getSuggestions } from '$requests/OpenCage/index.js';

export const GET = async ({ url }) => {
	const query = url.searchParams.get('q');
	if (!query) {
		return new Response(JSON.stringify({ suggestions: [] }), { status: 200 });
	}

	try {
		const suggestions = await getSuggestions(query);
		return new Response(JSON.stringify({ suggestions }), { status: 200 });
	} catch (error) {
		console.error('Error fetching address suggestions:', error);
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};
