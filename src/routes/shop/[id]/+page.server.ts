import { getOrderById } from '$server/orders/getOrderById';
import { getProductById } from '$server/product/getProductById';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const productId = params.id;
	const product = await getProductById(productId);

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
