import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { updateUserAndAddressSchema } from '$zod/updateUserAndAddressSchema';
import { updateUserData } from '$requests/user/updateUserData';
import { getUsersById } from '$requests/user/getUsersById';
import { getAddressesByUserId } from '$requests/address/getAddressesByUserId';

export const load: PageServerLoad = async ({ params }) => {
	console.log('Loading user data for ID:', params.id);

	const user = await getUsersById(params.id);
	const addresses = await getAddressesByUserId(params.id);

	console.log('Loaded user data:', user, addresses);

	if (!user) {
		console.log('User not found');
		return fail(404, { message: 'User not found' });
	}

	const initialData = {
		id: user.id,
		role: user.role,
		addresses: addresses.map((address) => ({
			id: address.id,
			recipient: address.recipient,
			street: address.street,
			city: address.city,
			state: address.state,
			zip: address.zip,
			country: address.country
		}))
	};

	const IupdateUserAndAddressSchema = await superValidate(
		initialData,
		zod(updateUserAndAddressSchema)
	);

	return {
		initialData,
		IupdateUserAndAddressSchema
	};
};

export const actions: Actions = {
	updateUser: async ({ request }) => {
		console.log('updateUser action initiated.');

		const formData = await request.formData();
		console.log('Received form data:', formData);

		const form = await superValidate(formData, zod(updateUserSchema));
		console.log('Form validation result:', form);

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
			return fail(400, { form });
		}

		try {
			const userId = formData.get('userId');

			await updateUserData({ id: userId as string, data: form.data.name });

			return message(form, 'User updated successfully');
		} catch (error) {
			console.error('Error updating user:', error);
			return fail(500, { message: 'User update failed' });
		}
	}
};
