import { checkAuth } from '$lib/prisma/Request/checkAuth';

import { getAllUsers } from '$lib/prisma/Request/getAllUsers';

import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

const allowedRoles = ['admin'];

// Fonction de chargement côté serveur
export const load: LayoutServerLoad = async ({ locals }) => {
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
	// const allProducts = await getAllProducts();
	// const allOrders = await getAllOrders();

	return {
		// allOrders,
		// allProducts,
		allUsers,
		session
	};
};
