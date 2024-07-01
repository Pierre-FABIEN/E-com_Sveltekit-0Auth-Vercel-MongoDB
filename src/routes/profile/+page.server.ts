import { checkAuth } from '$lib/functions/checkAuth';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { profileSchema } from '$lib/ZodSchema/profileSchema';
import { zod } from 'sveltekit-superforms/adapters';

const allowedRoles = ['user', 'admin'];

// Fonction de chargement côté serveur
export const load: PageServerLoad = async (event) => {
	const { locals } = event;

	// Récupérer le rôle de l'utilisateur depuis la session
	const session = await locals.getSession();
	const user = await checkAuth(session);
	if (user && session) {
		session.user.role = user.role;
	}

	if (!allowedRoles.includes(user?.role as string)) {
		throw redirect(302, '/');
	}

	const formProfil = await superValidate(zod(profileSchema));

	return {
		formProfil,
		session
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const validationResult = profileSchema.safeParse(Object.fromEntries(formData));

		if (!validationResult.success) {
			return {
				status: 400,
				errors: validationResult.error.flatten()
			};
		}

		// Process the valid data
		console.log(validationResult.data);

		return {
			success: true
		};
	}
};
