// src/lib/prisma/Request/order/getPendingOrder.ts

import prisma from '$server';

export const updateOrder = async (orderId, addressId) => {
	return await prisma.order.update({
		where: { id: orderId },
		data: {
			addressId: addressId // Ajouter l'adresse à la commande
		}
	});
};
