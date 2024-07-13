// src/routes/api/webhooks/stripe.ts
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import prisma from '$requests';
import dotenv from 'dotenv';

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
		console.error('⚠️  Webhook signature verification failed.', err.message);
		return json({ error: 'Webhook signature verification failed.' }, { status: 400 });
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;
			console.log('✅ Checkout Session:', session);
			// Fulfill the purchase
			await handleCheckoutSession(session);
			break;
		default:
			console.warn(`Unhandled event type ${event.type}`);
	}

	return json({ received: true }, { status: 200 });
}

async function handleCheckoutSession(session) {
	// Retrieve the order ID from the metadata
	const orderId = session.metadata.order_id;

	// Update the order status in the database
	await prisma.order.update({
		where: { id: orderId },
		data: { status: 'PAID' }
	});

	console.log(`✅ Order ${orderId} has been marked as paid.`);
}
