import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const { session, allUsers, allArticles, allProducts } = data;

	// Assurez-vous que la session est correctement définie et retourne les données
	return {
		allArticles,
		allProducts,
		allUsers,
		session
	};
};
