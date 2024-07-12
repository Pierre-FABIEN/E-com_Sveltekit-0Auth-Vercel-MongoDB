// src/lib/functions/createStripeSession.ts

import Stripe from 'stripe';
import prisma from "$requests";
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2024-06-20'
});

export const createStripeSession = async (userId: string) => {
	const order = await prisma.order.findFirst({
		where: {
			userId: userId,
			status: 'PENDING'
		},
		include: {
			items: {
				include: {
					product: true
				}
			}
		}
	});

	if (!order) {
		throw new Error('No pending order found for user');
	}

	const lineItems = order.items.map((item) => ({
		price_data: {
			currency: 'usd',
			product_data: {
				name: item.product.name
			},
			unit_amount: item.price * 100 // Stripe requires amount in cents
		},
		quantity: item.quantity
	}));

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: lineItems,
		mode: 'payment',
		success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.FRONTEND_URL}/cancel`,
		metadata: {
			orderId: order.id
		}
	});

	// Update the pending transaction with Stripe session information
	await prisma.transaction.updateMany({
		where: {
			orderId: order.id,
			status: 'PENDING'
		},
		data: {
			stripePaymentId: session.id,
			amount: order.total * 100 // Update with the total amount in cents
		}
	});

	return session.url;
};
