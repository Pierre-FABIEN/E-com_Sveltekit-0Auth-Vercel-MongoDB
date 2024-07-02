// src/routes/api/create-checkout-session.ts
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15'
});

const prisma = new PrismaClient();

export async function POST({ request }) {
	const { orderId } = await request.json();

	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: { products: true }
	});

	if (!order) {
		return json({ error: 'Order not found' }, { status: 404 });
	}

	const lineItems = order.products.map((product) => ({
		price_data: {
			currency: 'usd',
			product_data: {
				name: product.name
			},
			unit_amount: product.price * 100
		},
		quantity: 1
	}));

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: lineItems,
		mode: 'payment',
		success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${request.headers.get('origin')}/cancel`,
		metadata: {
			order_id: orderId
		}
	});

	await prisma.transaction.create({
		data: {
			stripePaymentId: session.id,
			orderId: order.id,
			amount: order.total,
			status: 'pending'
		}
	});

	return json({ id: session.id });
}
