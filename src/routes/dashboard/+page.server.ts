import { getAllTransactionsDashboard } from '$server/transaction/getAllTransactionsDashboard';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const transactions = await getAllTransactionsDashboard();

	return {
		transactions
	};
}) satisfies PageServerLoad;
