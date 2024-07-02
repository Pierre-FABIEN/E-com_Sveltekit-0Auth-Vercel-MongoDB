import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	const {
		session,
		allUsers
		// allProducts,
		// allOrders
	} = data;

	// Assurez-vous que la session est correctement définie et retourne les données
	return {
		// allOrders,
		// allProducts,
		allUsers,
		session
	};
}) satisfies LayoutLoad;
