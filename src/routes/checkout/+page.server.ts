import { error, json, redirect } from '@sveltejs/kit';
import { getUserAddresses } from '$requests/user/getUserAddresses';
import type { Actions, PageServerLoad } from './$types';

import { checkOrRegister } from '$requests/user/checkOrRegister';
import { updateOrder } from '$requests/orders/updateOrder';

import { paymentSchema } from '$zod/paymentSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { getOrderById } from '$requests/orders/getOrderById';

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2024-06-20'
});

const allowedRoles = ['user'];

export const load: PageServerLoad = async ({ locals }) => {
	// Récupérer le rôle de l'utilisateur depuis la session
	const session = await locals.getSession();
	let addresses;

	const user = await checkOrRegister(session);

	if (!allowedRoles.includes(user?.role as string)) {
		throw redirect(302, '/');
	}

	if (user && session) {
		session.user.role = user.role;
		addresses = await getUserAddresses(user.id);

		if (!addresses) {
			throw error(404, 'Aucune adresse trouvée pour cet utilisateur');
		}
	}

	const IpaymentSchema = await superValidate(zod(paymentSchema));

	return { addresses, IpaymentSchema };
};

// Tu peux également ajouter des actions pour gérer d'autres fonctionnalités comme la modification ou la suppression d'adresses
export const actions: Actions = {
	checkout: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(paymentSchema));
		const orderId = form.data.orderId;
		const addressId = form.data.addressId;

		const order = await getOrderById(orderId);

		const userId = order.userId;

		console.log(order, 'order');

		if (!order) {
			return json({ error: 'Order not found' }, { status: 404 });
		}

		await updateOrder(orderId, addressId);

		console.log(orderId, 'rolsdghdlkrgjh');

		const lineItems = order.items.map((item) => ({
			price_data: {
				currency: 'eur', // Changer 'usd' en 'eur' pour utiliser les euros
				product_data: {
					name: item.product.name
				},
				unit_amount: item.price * 100 // Stripe s'attend à des montants en centimes
			},
			quantity: item.quantity
		}));

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: `${request.headers.get('origin')}/profile`,
			cancel_url: `${request.headers.get('origin')}/profile`,
			metadata: {
				order_id: orderId
			},
			payment_intent_data: {
				metadata: {
					user_id: userId,
					order_id: orderId
				}
			}
		});

		throw redirect(303, session.url);
	}
};
