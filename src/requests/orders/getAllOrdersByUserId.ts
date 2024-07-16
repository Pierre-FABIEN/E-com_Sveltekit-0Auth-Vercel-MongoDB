// src/lib/prisma/Request/order/getPendingOrder.ts

import prisma from '$requests';

export const getAllOrdersByUserId = async (userId: string) => {
	return await await prisma.order.findMany({
		where: {
			userId: userId // Récupérer seulement les commandes de l'utilisateur connecté
		},
		include: {
			transactions: true // Inclure les transactions si nécessaire
		}
	});
};
