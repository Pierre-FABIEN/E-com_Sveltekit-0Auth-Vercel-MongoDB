// src/lib/prisma/Request/order/getPendingOrder.ts

import prisma from '$requests';

export const getPaidOrdersByUserId = async (userId: string) => {
	return await await prisma.order.findMany({
		where: {
			status: 'PAID',
			userId: userId // Récupérer seulement les commandes de l'utilisateur connecté
		},
		include: {
			items: true, // Inclure les éléments de la commande si nécessaire
			transactions: true // Inclure les transactions si nécessaire
		}
	});
};
