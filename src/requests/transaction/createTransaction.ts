import prisma from '$requests';

export const createTransaction = async (sessionId, orderId, orderTotal) => {
	console.log(`✅ Processing srghresdgdsrgreds ${sessionId} for order ${orderId}`);
	try {
		// Mise à jour des données de l'utilisateur dans la base de données        // await prisma.transaction.create({
		const updatedTransaction = await prisma.transaction.create({
			data: {
				stripePaymentId: sessionId,
				orderId: orderId,
				amount: orderTotal,
				status: 'pending'
			}
		});

		return updatedTransaction;
	} catch (error) {
		console.error('Error updating user:', error);
		throw new Error('Could not update user data');
	}
};
