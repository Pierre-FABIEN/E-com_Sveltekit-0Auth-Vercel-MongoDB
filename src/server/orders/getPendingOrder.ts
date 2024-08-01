// src/lib/prisma/Request/order/getPendingOrder.ts

import prisma from "$server";

export const getPendingOrder = async (userId: string) => {
	return await prisma.order.findFirst({
		where: {
			userId: userId,
			status: 'PENDING'
		},
		include: {
			items: {
				include: {
					product: true
				}
			}
		}
	});
};
