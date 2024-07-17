import prisma from '$requests';

export const createTransactionValidated = async (session, userId, orderId) => {
	console.log(`✅ Processing transaction ${session.id} for order ${orderId}`);

	// Fetch order and user details
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
		createdAt: new Date(session.created * 1000),
		app_user_name: order.user.name,
		app_user_email: order.user.email,
		app_user_recipient: order.address ? order.address.recipient : '',
		app_user_street: order.address ? order.address.street : '',
		app_user_city: order.address ? order.address.city : '',
		app_user_state: order.address ? order.address.state : '',
		app_user_zip: order.address ? order.address.zip : '',
		app_user_country: order.address ? order.address.country : '',
		products: order.items.map((item) => ({
			id: item.productId,
			name: item.product.name,
			price: item.product.price,
			quantity: item.quantity
		}))
	};

	try {
		// Start a transaction to ensure atomicity
		await prisma.$transaction(async (prisma) => {
			// Create the transaction record
			await prisma.transaction.create({ data: transactionData });
		});
	} catch (error) {
		console.error(`⚠️ Failed to process transaction ${session.id}:`, error);
	}
};
