import prisma from '$requests';

export const createTransactionInvalidated = async (dataTransaction, userId, orderId) => {
	console.log(dataTransaction, 'drsgdgdxrgxdr');
	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			user: true,
			address: true,
			items: {
				include: {
					product: true
				}
			}
		}
	});

	if (!order) {
		throw new Error(`Order ${orderId} not found`);
	}

	if (!order.address) {
		throw new Error(`Order ${orderId} has no associated address`);
	}
	const transactionData = {
		stripePaymentId: dataTransaction.id,
		amount: dataTransaction.amount_total / 100,
		currency: dataTransaction.currency,
		customer_details_email: dataTransaction.customer_details.email,
		customer_details_name: dataTransaction.customer_details.name,
		customer_details_phone: dataTransaction.customer_details.phone,
		status: dataTransaction.payment_status,
		orderId: orderId,
		userId: userId,
		createdAt: new Date(dataTransaction.created * 1000),
		app_user_name: order.user.name,
		app_user_email: order.user.email,
		app_user_recipient: order.address.recipient,
		app_user_street: order.address.street,
		app_user_city: order.address.city,
		app_user_state: order.address.state,
		app_user_zip: order.address.zip,
		app_user_country: order.address.country,
		products: order.items.map((item) => ({
			id: item.productId,
			name: item.product.name,
			price: item.product.price,
			quantity: item.quantity
		}))
	};

	try {
		await prisma.transaction.create({ data: transactionData });
		console.log(`✅ Transaction ${dataTransaction.id} recorded successfully.`);
	} catch (error) {
		console.error(`⚠️ Failed to record transaction ${dataTransaction.id}:`, error);
	}
};
