import { getAllTransactions } from '$requests/transaction/getAllTransactions';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const transactions = await getAllTransactions();
	console.log(transactions, 'transactions');

	return {
		transactions
	};
}) satisfies PageServerLoad;
