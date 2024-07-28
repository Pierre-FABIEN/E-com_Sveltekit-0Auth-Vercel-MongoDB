import { getAllTransactionsDashboard } from '$requests/transaction/getAllTransactionsDashboard';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const transactions = await getAllTransactionsDashboard();

	return {
		transactions
	};
}) satisfies PageServerLoad;
