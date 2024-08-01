import prisma from '$server';

// Fonction pour récupérer toutes les informations d'un utilisateur par son ID
export async function getUsersById(userId: string) {
	return await prisma.user.findUnique({
		where: { id: userId }
	});
}
