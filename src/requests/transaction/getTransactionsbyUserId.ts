import prisma from '$requests';

export const getTransactionsbyUserId = async (userId) => {
	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId: userId
			},
			include: {
				order: true,
				user: true
			}
		});
		return transactions;
	} catch (error) {
		console.error('Error fetching transactions for user:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
