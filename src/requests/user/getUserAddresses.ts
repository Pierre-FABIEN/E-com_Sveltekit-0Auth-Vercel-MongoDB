import prisma from "$requests";

// Fonction pour récupérer les adresses d'un utilisateur par son ID
export async function getUserAddresses(userId: string) {
	return await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			addresses: true // Récupère uniquement les adresses de l'utilisateur
		}
	});
}
