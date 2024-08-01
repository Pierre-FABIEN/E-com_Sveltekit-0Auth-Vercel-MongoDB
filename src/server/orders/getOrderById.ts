import prisma from '$server';

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
