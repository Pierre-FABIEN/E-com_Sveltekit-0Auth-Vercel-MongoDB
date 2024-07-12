import { error, json, redirect } from '@sveltejs/kit';
import { getUserAddresses } from '$lib/prisma/Request/user/getUserAddresses';
import type { Actions, PageServerLoad } from './$types';
import { checkOrRegister } from '$lib/prisma/Request/user/checkOrRegister';

const allowedRoles = ['user'];

export const load: PageServerLoad = async ({ locals }) => {
	// Récupérer le rôle de l'utilisateur depuis la session
	const session = await locals.getSession();
	let addresses;

	const user = await checkOrRegister(session);

	if (!allowedRoles.includes(user?.role as string)) {
		throw redirect(302, '/');
	}

	if (user && session) {
		session.user.role = user.role;
		addresses = await getUserAddresses(user.id);

		if (!addresses) {
			throw error(404, 'Aucune adresse trouvée pour cet utilisateur');
		}
	}

	return { addresses };
};

// Tu peux également ajouter des actions pour gérer d'autres fonctionnalités comme la modification ou la suppression d'adresses
export const actions: Actions = {
	// Exemple d'action pour mettre à jour une adresse
};
