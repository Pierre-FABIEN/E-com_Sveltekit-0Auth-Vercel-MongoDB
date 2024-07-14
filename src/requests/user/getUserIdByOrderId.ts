import prisma from '$requests';

// Fonction pour récupérer toutes les informations d'un utilisateur par son ID
export async function getUserIdByOrderId(orderId: string) {
	return await prisma.order.findUnique({
		where: { id: orderId },
		select: { userId: true }
	});
}
