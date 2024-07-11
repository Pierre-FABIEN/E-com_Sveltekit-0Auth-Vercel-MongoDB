// src/lib/prisma/Request/order/addToCart.ts

import prisma from '$lib/prisma';

export const addToCart = async (userId: string, productId: string, quantity: number = 1) => {
	const pendingOrder = await prisma.order.findFirst({
		where: {
			userId: userId,
			status: 'PENDING'
		}
	});

	if (!pendingOrder) {
		throw new Error('No pending order found for user');
	}

	const existingItem = await prisma.orderItem.findFirst({
		where: {
			orderId: pendingOrder.id,
			productId: productId
		}
	});

	if (existingItem) {
		// Update the quantity of the existing item
		await prisma.orderItem.update({
			where: { id: existingItem.id },
			data: { quantity: existingItem.quantity + quantity }
		});
	} else {
		// Create a new order item
		await prisma.orderItem.create({
			data: {
				orderId: pendingOrder.id,
				productId: productId,
				quantity: quantity,
				price: (await prisma.product.findUnique({ where: { id: productId } })).price
			}
		});
	}
};
