import { getOrderById } from '$requests/orders/getOrderById';
import { getTransactionById } from '$requests/transaction/getTransactionById';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const transactionId = params.id;
	const transaction = await getTransactionById(transactionId);

	if (!transaction) {
		return {
			status: 404,
			error: new Error('transaction not found')
		};
	}

	return {
		transaction
	};
}) satisfies PageServerLoad;
