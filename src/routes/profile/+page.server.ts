import { checkOrRegister } from '$lib/prisma/Request/user/checkOrRegister';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { profileSchema, type ProfileSchema } from '$lib/ZodSchema/profileSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { updateUserData } from '$lib/prisma/Request/user/updateUserData';
import { getUserDetails } from '$lib/prisma/Request/user/getUserDetails';

const allowedRoles = ['user', 'admin'];

// Fonction de chargement côté serveur
export const load: PageServerLoad = async (event) => {
	const { locals } = event;

	// Récupérer le rôle de l'utilisateur depuis la session
	const session: any = await locals.getSession();

	const user = await checkOrRegister(session);
	if (user && session) {
		session.user.role = user.role;
		session.user.id = user.id;
		session.user.image = user.image;
	}

	if (!allowedRoles.includes(user?.role as string)) {
		throw redirect(302, '/');
	}

	const userDetails = await getUserDetails(user.id);

	const formProfil = await superValidate(zod(profileSchema));

	return {
		userDetails,
		formProfil,
		session
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(profileSchema));

		if (!form.valid) return fail(400, { form });

		try {
			const userData: ProfileSchema = {
				...form.data,
				id: formData.get('id') as string,
				address: formData.get('address') as string,
				city: formData.get('city') as string,
				postalCode: formData.get('postalCode') as string,
				phoneNumber: formData.get('phoneNumber') as string
			};

			await updateUserData(userData);

			return message(form, 'User created successfully');
		} catch (error: any) {
			console.error('Error creating user:', error);
			if (error.message === 'One or more workspaces do not exist') {
				return fail(400, { form, error: error.message });
			}
			return fail(500, { form, error: 'An error occurred while creating the user' });
		}
	}
};
