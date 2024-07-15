import prisma from '$requests';

export const addToCart = async (userId: string, productId: string, quantity: number = 1) => {
	try {
		console.log(
			`Starting addToCart for userId: ${userId}, productId: ${productId}, quantity: ${quantity}`
		);

		// Find pending order for the user
		const pendingOrder = await prisma.order.findFirst({
			where: {
				userId: userId,
				status: 'PENDING'
			}
		});
		console.log(`Pending order: ${JSON.stringify(pendingOrder)}`);

		if (!pendingOrder) {
			throw new Error('No pending order found for user');
		}

		// Check if the product is already in the order
		const existingItem = await prisma.orderItem.findFirst({
			where: {
				orderId: pendingOrder.id,
				productId: productId
			}
		});
		console.log(`Existing item: ${JSON.stringify(existingItem)}`);

		if (existingItem) {
			// Update the quantity of the existing item
			await prisma.orderItem.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + quantity }
			});
			console.log(
				`Updated item quantity for itemId: ${existingItem.id}, new quantity: ${existingItem.quantity + quantity}`
			);
		} else {
			// Get product price
			const product = await prisma.product.findUnique({ where: { id: productId } });
			if (!product) {
				throw new Error('Product not found');
			}
			console.log(`Product price: ${product.price}`);

			// Create a new order item
			await prisma.orderItem.create({
				data: {
					orderId: pendingOrder.id,
					productId: productId,
					quantity: quantity,
					price: product.price
				}
			});
			console.log(
				`Created new order item for orderId: ${pendingOrder.id}, productId: ${productId}, quantity: ${quantity}, price: ${product.price}`
			);
		}

		console.log(`addToCart completed successfully for userId: ${userId}, productId: ${productId}`);
	} catch (error) {
		console.error(`Error in addToCart for userId: ${userId}, productId: ${productId}:`, error);
		throw error;
	}
};
