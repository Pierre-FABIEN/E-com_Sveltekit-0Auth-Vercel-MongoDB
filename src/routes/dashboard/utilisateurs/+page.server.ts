import { checkOrRegister } from '$requests/user/checkOrRegister';

import { getAllUsers } from '$requests/user/getAllUsers';
import { deleteUserSchema } from '$zod/userSchema';
import { zod } from 'sveltekit-superforms/adapters';

import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';

const allowedRoles = ['admin'];

// Fonction de chargement côté serveur
export const load: PageServerLoad = async ({ locals }) => {
	// Récupérer le rôle de l'utilisateur depuis la session
	const session = await locals.getSession();

	const user = await checkOrRegister(session);

	if (user && session) {
		session.user.role = user.role;
	}

	if (!allowedRoles.includes(user?.role as string)) {
		throw redirect(302, '/');
	}

	const IdeleteUserSchema = await superValidate(zod(deleteUserSchema));

	const allUsers = await getAllUsers();

	return {
		IdeleteUserSchema,
		allUsers,
		session
	};
};
