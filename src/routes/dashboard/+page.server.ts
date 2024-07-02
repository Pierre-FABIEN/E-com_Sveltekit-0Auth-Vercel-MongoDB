import { checkAuth } from '$lib/prisma/Request/checkAuth';

import { getAllUsers } from '$lib/prisma/Request/getAllUsers';
import { getAllProducts } from '$lib/prisma/Request/getAllProducts';
import { getAllArticles } from '$lib/prisma/Request/getAllArticles';

import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
const allowedRoles = ['admin'];

// Fonction de chargement côté serveur
export const load: PageServerLoad = async ({ locals }) => {
	// Récupérer le rôle de l'utilisateur depuis la session
	const session = await locals.getSession();

	const user = await checkAuth(session);
	if (user && session) {
		session.user.role = user.role;
	}

	if (!allowedRoles.includes(user?.role as string)) {
		throw redirect(302, '/');
	}

	const allUsers = await getAllUsers();
	const allProducts = await getAllProducts();
	const allArticles = await getAllArticles();

	return {
		allArticles,
		allProducts,
		allUsers,
		session
	};
};
