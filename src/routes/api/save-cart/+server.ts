import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async ({ request }) => {
	const cartData = await request.json();

	console.log('Received cart data:', cartData);

	// Vérifiez que les champs nécessaires sont présents et valides
	if (
		!cartData.id ||
		typeof cartData.id !== 'string' ||
		!cartData.userId ||
		typeof cartData.userId !== 'string' ||
		!Array.isArray(cartData.items) ||
		cartData.total === undefined ||
		typeof cartData.total !== 'number'
	) {
		console.error('Invalid cart data:', cartData);
		return json({ error: 'Invalid cart data' }, { status: 400 });
	}

	// Assurez-vous que chaque item dans le panier a les champs nécessaires
	for (const item of cartData.items) {
		if (
			!item.id ||
			!item.product ||
			!item.product.id ||
			typeof item.product.id !== 'string' ||
			!item.product.name ||
			typeof item.product.name !== 'string' ||
			item.product.price === undefined ||
			typeof item.product.price !== 'number' ||
			!Array.isArray(item.product.images) ||
			item.quantity === undefined ||
			typeof item.quantity !== 'number' ||
			item.price === undefined ||
			typeof item.price !== 'number'
		) {
			console.error('Invalid item data in cart:', item);
			return json({ error: 'Invalid item data in cart' }, { status: 400 });
		}
	}

	try {
		// Convert cart items to the expected format for Prisma
		const formattedItems = cartData.items.map((item) => ({
			id: item.id,
			productId: item.product.id,
			quantity: item.quantity,
			price: item.price
		}));

		console.log('Formatted items:', formattedItems);

		// Start a transaction
		await prisma.$transaction(async (prisma) => {
			const existingOrder = await prisma.order.findUnique({
				where: { id: cartData.id }
			});

			console.log('Existing order:', existingOrder);

			if (existingOrder) {
				// If the order exists, update it
				await prisma.order.update({
					where: { id: cartData.id },
					data: {
						items: {
							deleteMany: {} // Supprimez les items existants
						},
						total: cartData.total,
						updatedAt: new Date()
					}
				});
				// Ajoutez les nouveaux items après suppression des anciens
				await prisma.order.update({
					where: { id: cartData.id },
					data: {
						items: {
							create: formattedItems // Créez de nouveaux items
						}
					}
				});
				console.log('Order updated:', cartData.id);
			} else {
				// If the order does not exist, create it
				await prisma.order.create({
					data: {
						id: cartData.id,
						userId: cartData.userId,
						items: {
							create: formattedItems
						},
						total: cartData.total,
						status: 'PENDING',
						createdAt: new Date(),
						updatedAt: new Date()
					}
				});
				console.log('Order created:', cartData.id);
			}
		});

		return json({ message: 'Cart saved successfully' });
	} catch (error) {
		console.error('Failed to save cart:', error);
		return json({ error: 'Failed to save cart' }, { status: 500 });
	}
};
