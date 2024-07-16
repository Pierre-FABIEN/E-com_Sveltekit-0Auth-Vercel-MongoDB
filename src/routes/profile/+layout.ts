import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	const { session, orders, transactions } = data;

	// Assurez-vous que la session est correctement définie et retourne les données
	return {
		session,
		orders,
		transactions
	};
}) satisfies LayoutLoad;
