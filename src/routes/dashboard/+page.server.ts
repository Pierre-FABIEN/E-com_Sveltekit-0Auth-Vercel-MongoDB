import { checkAuth } from '$lib/prisma/Request/checkAuth';

import { getAllUsers } from '$lib/prisma/Request/getAllUsers';
import { getAllProducts } from '$lib/prisma/Request/getAllProducts';
import { getAllOrders } from '$lib/prisma/Request/getAllOrders';
import { getAllAddress } from '$lib/prisma/Request/getAllAdress';

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
	// const allProducts = await getAllProducts();
	// const allOrders = await getAllOrders();

	return {
		// allOrders,
		// allProducts,
		allUsers,
		session
	};
};
