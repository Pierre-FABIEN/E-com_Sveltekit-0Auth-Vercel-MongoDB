import prisma from '$server';

export async function deleteUser(userId: string) {
	try {
		// Désassocier les transactions de l'utilisateur
		await prisma.transaction.updateMany({
			where: { userId },
			data: { userId: null }
		});

		// Supprimer les commandes associées à l'utilisateur
		await prisma.order.deleteMany({
			where: { userId }
		});

		// Supprimer l'utilisateur
		await prisma.user.delete({
			where: { id: userId }
		});

		return { success: true };
	} catch (error) {
		throw new Error('Error deleting user: ' + error.message);
	}
}
