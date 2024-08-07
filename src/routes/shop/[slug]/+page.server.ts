import { getProductBySlug } from '$server/product/getProductBySlug';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const productSlug = params.slug;
	const product = await getProductBySlug(productSlug);

	if (!product) {
		return {
			status: 404,
			error: new Error('product not found')
		};
	}

	return {
		product
	};
}) satisfies PageServerLoad;
