import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import prisma from '$requests';
import dotenv from 'dotenv';
import { getUserIdByOrderId } from '$requests/user/getUserIdByOrderId';
import { createTransactionValidated } from '$requests/transaction/createTransactionValidated';
import { createTransactionInvalidated } from '$requests/transaction/createTransactionInvalidated';

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
		case 'charge.failed':
			const charge = event.data.object;
			console.log('⚠️ Charge Failed:', charge);
			try {
				await handleChargeFailed(charge);
			} catch (error) {
				console.error('⚠️ Error handling charge failed:', error);
			}
			break;
		default:
			console.warn(`Unhandled event type ${event.type}`);
	}

	return json({ received: true }, { status: 200 });
}

async function handleCheckoutSession(session) {
	const orderId = session.metadata.order_id;

	if (!orderId) {
		console.error('⚠️ Order ID is missing in the session metadata');
		return;
	}

	const user = await getUserIdByOrderId(orderId);

	if (!user || !user.userId) {
		console.error('⚠️ User ID is missing for the provided order ID');
		return;
	}

	const userId = user.userId;

	try {
		// Create the transaction in the database
		await createTransactionValidated(session, userId, orderId);

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
	} catch (error) {
		console.error(`⚠️ Error processing order ${orderId}:`, error);
	}
}

async function handleChargeFailed(charge) {
	const paymentIntentId = charge.payment_intent;

	const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

	const amount = paymentIntent.amount;

	const currency = paymentIntent.currency;

	const status = charge.status;

	const stripePaymentId = paymentIntent.id;

	const createdAt = paymentIntent.created;

	const userId = paymentIntent.metadata.user_id;

	const orderId = paymentIntent.metadata.order_id;

	const dataTransaction = {
		stripePaymentId: stripePaymentId,
		amount: amount,
		currency: currency,
		customer_details_email: null,
		customer_details_name: null,
		customer_details_phone: null,
		status: status,
		orderId: orderId,
		userId: userId,
		createdAt: createdAt
	};

	try {
		// Log the failed payment attempt
		await createTransactionInvalidated(dataTransaction, userId, orderId);

		console.log(
			`⚠️ Payment failed for paymentIdfthdfthdfthdfthdthfntent ${paymentIntent} has been logged.`
		);
	} catch (error) {
		console.error(`⚠️ Error handling payment intent failed for order ${orderId}:`, error);
	}
}
