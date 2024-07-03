import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	const { session, allUsers } = data;

	// Assurez-vous que la session est correctement définie et retourne les données
	return {
		allUsers,
		session
	};
}) satisfies LayoutLoad;
