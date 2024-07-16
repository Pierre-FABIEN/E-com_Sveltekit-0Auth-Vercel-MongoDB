import prisma from '$requests';

export const createTransactionValidated = async (session, userId, orderId) => {
	console.log(`✅ Processing transaction ${session.id} for order ${orderId}`);

	const transactionData = {
		stripePaymentId: session.id,
		amount: session.amount_total / 100,
		currency: session.currency,
		customer_details_email: session.customer_details ? session.customer_details.email : null,
		customer_details_name: session.customer_details ? session.customer_details.name : null,
		customer_details_phone: session.customer_details ? session.customer_details.phone : null,
		status: session.payment_status,
		orderId: orderId,
		userId: userId,
		createdAt: new Date(session.created * 1000)
	};

	try {
		await prisma.transaction.create({ data: transactionData });
		console.log(`✅ Transaction ${session.id} recorded successfully.`);
	} catch (error) {
		console.error(`⚠️ Failed to record transaction ${session.id}:`, error);
	}
};
