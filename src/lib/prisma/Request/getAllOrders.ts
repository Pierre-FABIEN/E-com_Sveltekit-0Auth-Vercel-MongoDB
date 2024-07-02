import prisma from '$lib/prisma';

export const getAllOrders = async () => {
	try {
		const orders = await prisma.order.findMany();
		// Récupérer les utilisateurs associés pour chaque commande
		const ordersWithUsers = await Promise.all(
			orders.map(async (order) => {
				const user = await prisma.user.findUnique({
					where: { id: order.userId }					
				});
				return { ...order, user };
			})
		);

		return ordersWithUsers;
	} catch (error) {
		console.error('Error fetching orders:', error);
		throw new Error('Could not fetch orders');
	}
};
