import { checkAuth } from '$lib/functions/checkAuth';
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

	return {
		session
	};
};
