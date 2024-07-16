import prisma from '$requests';

export const createTransactionInvalidated = async (dataTransaction, userId, orderId) => {
	console.log(dataTransaction, 'drsgdgdxrgxdr');

	const transactionData = {
		stripePaymentId: dataTransaction.stripePaymentId,
		amount: dataTransaction.amount,
		currency: dataTransaction.currency,
		customer_details_email: null,
		customer_details_name: null,
		customer_details_phone: null,
		status: dataTransaction.status,
		orderId: orderId,
		userId: userId,
		createdAt: dataTransaction.created
	};

	try {
		await prisma.transaction.create({ data: transactionData });
		console.log(`✅ Transaction ${dataTransaction.id} recorded successfully.`);
	} catch (error) {
		console.error(`⚠️ Failed to record transaction ${dataTransaction.id}:`, error);
	}
};
