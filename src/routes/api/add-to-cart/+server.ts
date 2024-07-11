// src/routes/api/add-to-cart/+server.ts

import type { RequestHandler } from '@sveltejs/kit';
import { addToCart } from '$lib/prisma/Request/orders/addToCart';

export const POST: RequestHandler = async ({ request }) => {
	const { productId, userId } = await request.json();

	try {
		await addToCart(userId, productId, 1);
		return new Response(JSON.stringify({ message: 'Product added to cart' }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to add to cart' }), { status: 500 });
	}
};
