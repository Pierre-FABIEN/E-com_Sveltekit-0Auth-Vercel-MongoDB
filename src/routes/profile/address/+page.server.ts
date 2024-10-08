import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { createAddressSchema } from '$server/address/Schema/addressSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { createAddress } from '$server/address/createAddress';

export const load: PageServerLoad = async () => {
	// Initialize superform for the createAddressSchema
	const IcreateAddressSchema = await superValidate(zod(createAddressSchema));

	return {
		IcreateAddressSchema
	};
};

export const actions: Actions = {
	createAddress: async ({ request }) => {
		const formData = await request.formData();
		console.log('Form data:', formData);

		const form = await superValidate(formData, zod(createAddressSchema));
		console.log('Form:', form);

		if (!form.valid) {
			return fail(400, { message: 'Validation failed', form });
		}

		const { recipient, street, city, state, zip, country, userId } = form.data;

		try {
			await createAddress({
				recipient,
				street,
				city,
				state,
				zip,
				country,
				userId
			});

			return message(form, 'Address created successfully');
		} catch (error) {
			console.error('Error creating address:', error);
			return fail(500, { message: 'Address creation failed' });
		}
	}
};
