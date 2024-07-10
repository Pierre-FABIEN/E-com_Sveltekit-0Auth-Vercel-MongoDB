import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	const { session } = data;

	// Assurez-vous que la session est correctement définie et retourne les données
	return {
		session
	};
}) satisfies LayoutLoad;
