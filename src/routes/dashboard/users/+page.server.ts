import { checkOrRegister } from '$requests/user/checkOrRegister';
import { getAllUsers } from '$requests/user/getAllUsers';
import { deleteUserSchema } from '$zod/userSchema';
import { zod } from 'sveltekit-superforms/adapters';

import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { deleteUser } from '$requests/user/deleteUser';

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

// Action pour supprimer un utilisateur
export const actions: Actions = {
	deleteUser: async ({ request }) => {
		const formData = await request.formData();
		console.log('Received form data:', formData);

		const id = formData.get('id') as string;

		const form = await superValidate(formData, zod(deleteUserSchema));

		try {
			await deleteUser(id);

			return message(form, 'User deleted successfully');
		} catch (error) {
			console.error('Error deleting user:', error);
			return { error: 'Failed to delete user' };
		}
	}
};
