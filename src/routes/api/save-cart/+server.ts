import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async ({ request }) => {
	const cartData = await request.json();
	console.log(cartData, 'cartData');

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

		// Sauvegarde ou mise à jour des données du panier dans la base de données
		await prisma.order.upsert({
			where: { id: cartData.id },
			update: {
				items: {
					deleteMany: {}, // Delete existing items
					create: formattedItems // Create new items
				},
				total: cartData.total,
				updatedAt: new Date()
			},
			create: {
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

		return json({ message: 'Cart saved successfully' });
	} catch (error) {
		console.error('Failed to save cart:', error);
		return json({ error: 'Failed to save cart' }, { status: 500 });
	}
};
