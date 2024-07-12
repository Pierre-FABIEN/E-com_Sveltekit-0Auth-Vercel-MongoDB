import prisma from '$lib/prisma';

// Fonction pour récupérer toutes les informations d'un utilisateur par son ID
export async function getUserDetails(userId: string) {
	return await prisma.user.findUnique({
		where: { id: userId },
		include: {
			addresses: true,
			orders: {
				include: {
					items: true,
					statusHistory: true,
					transactions: true
				}
			}
		}
	});
}
