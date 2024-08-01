import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

import { checkOrRegister } from '$server/user/checkOrRegister';

const allowedRoles = ['user'];

// Fonction de chargement côté serveur
export const load: LayoutServerLoad = async ({ locals }) => {
	// Récupérer le rôle de l'utilisateur depuis la session
	const session = await locals.getSession();

	const user = await checkOrRegister(session);

	if (user && session) {
		session.user.role = user.role;
		session.user.id = user.id;
		session.user.image = user.image;
	}

	if (!allowedRoles.includes(user?.role as string)) {
		throw redirect(302, '/');
	}
	return {
		session
	};
};
