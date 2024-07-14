// src/routes/api/webhooks/stripe.ts
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import prisma from '$requests';
import dotenv from 'dotenv';
import { getUserIdByOrderId } from '$requests/user/getUserIdByOrderId';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2024-06-20'
});

export async function POST({ request }) {
	const sig = request.headers.get('stripe-signature');
	const body = await request.text(); // Utilisez request.text() pour obtenir le corps brut

	let event;

	try {
		event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
		console.log('✅ Webhook verified and received:', event);
	} catch (err) {
		console.error('⚠️ Webhook signature verification failed.', err.message);
		return json({ error: 'Webhook signature verification failed.' }, { status: 400 });
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;
			console.log('✅ Checkout Session:', session);
			// Fulfill the purchase
			try {
				await handleCheckoutSession(session);
			} catch (error) {
				console.error('⚠️ Error handling checkout session:', error);
			}
			break;
		default:
			console.warn(`Unhandled event type ${event.type}`);
	}

	return json({ received: true }, { status: 200 });
}

async function handleCheckoutSession(session) {
	const orderId = session.metadata.order_id;
	const user = await getUserIdByOrderId(orderId);

	if (!user || !user.userId) {
		console.error('⚠️ User ID is missing for the provided order ID');
		return;
	}

	const userId = user.userId;

	try {
		// Create the transaction in the database
		await createTransaction(session, userId, orderId);

		// Retrieve the order items
		const orderItems = await prisma.orderItem.findMany({
			where: { orderId: orderId },
			include: { product: true }
		});

		// Update the order status to PAID
		await prisma.order.update({
			where: { id: orderId },
			data: { status: 'PAID' }
		});

		// Deduct the quantities from the products in stock
		for (const item of orderItems) {
			const newStock = item.product.stock - item.quantity;
			if (newStock < 0) {
				throw new Error(`Not enough stock for product ID ${item.productId}`);
			}

			await prisma.product.update({
				where: { id: item.productId },
				data: { stock: newStock }
			});
		}

		console.log(`✅ Order ${orderId} has been marked as paid and stock has been updated.`);

		// Create a new pending order
		const newOrder = await prisma.order.create({
			data: {
				userId: userId,
				status: 'PENDING',
				total: 0,
				addressId: null,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});
		console.log(`✅ New pending order created with ID: ${newOrder.id}`);
	} catch (error) {
		console.error(`⚠️ Error processing order ${orderId}:`, error);
	}
}

async function createTransaction(session, userId, orderId) {
	const transactionData = {
		stripePaymentId: session.id,
		amount: session.amount_total / 100,
		currency: session.currency,
		customer_details_email: session.customer_details.email,
		customer_details_name: session.customer_details.name,
		customer_details_phone: session.customer_details.phone,
		status: session.payment_status,
		orderId: orderId,
		userId: userId,
		customerEmail: session.customer_details.email,
		createdAt: new Date(session.created * 1000)
	};

	try {
		await prisma.transaction.create({ data: transactionData });
		console.log(`✅ Transaction ${session.id} recorded successfully.`);
	} catch (error) {
		console.error(`⚠️ Failed to record transaction ${session.id}:`, error);
	}
}
