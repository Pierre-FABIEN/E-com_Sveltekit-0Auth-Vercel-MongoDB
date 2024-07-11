// src/routes/api/save-cart/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async ({ request }) => {
	const cartData = await request.json();

	try {
		// Sauvegarde ou mise à jour des données du panier dans la base de données
		await prisma.cart.upsert({
			where: { userId: cartData.userId },
			update: { items: cartData.items, lastModified: cartData.lastModified },
			create: {
				userId: cartData.userId,
				items: cartData.items,
				lastModified: cartData.lastModified
			}
		});

		return json({ message: 'Cart saved successfully' });
	} catch (error) {
		return json({ error: 'Failed to save cart' }, { status: 500 });
	}
};
