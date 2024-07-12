import prisma from '$requests';

export async function getOrderById(orderId: string) {
	return await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			items: {
				include: {
					product: true
				}
			}
		}
	});
}
