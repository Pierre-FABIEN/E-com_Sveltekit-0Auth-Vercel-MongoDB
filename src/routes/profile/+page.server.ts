import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { profileSchema, type ProfileSchema } from '$zod/profileSchema';
import { zod } from 'sveltekit-superforms/adapters';

import { checkOrRegister } from '$requests/user/checkOrRegister';
import { updateUserData } from '$requests/user/updateUserData';
import { getUserDetails } from '$requests/user/getUserDetails';
import { deleteAddressSchema } from '$zod/addressSchema';
import { deleteAddress } from '$requests/address/deleteAddress';

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

	const IdeleteAddressSchema = await superValidate(zod(deleteAddressSchema));

	return {
		userDetails,
		session,
		IdeleteAddressSchema
	};
};

export const actions: Actions = {
	deleteAddress: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData, 'form data');

		const form = await superValidate(formData, zod(deleteAddressSchema));

		console.log(form, 'form');
		if (!form.valid) return fail(400, { form });
		try {
			const addressId = formData.get('id') as string;
			await deleteAddress(addressId);
			return message(form, 'Address deleted successfully');
		} catch (error: any) {
			console.error('Error deleting address:', error);
			return fail(500, { form, error: 'An error occurred while deleting the address' });
		}
	}
};
