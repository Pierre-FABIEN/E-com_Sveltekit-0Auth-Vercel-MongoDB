import { getOrderById } from '$requests/orders/getOrderById';
import { getProductById } from '$requests/product/getProductById';
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
