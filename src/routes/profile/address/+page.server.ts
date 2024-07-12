import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { createAddressSchema } from '$zod/addressSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { createAddress } from '$requests/address/createAddress';

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

		// Create the address in the database
		try {
			const address = await createAddress(form.data);
			return message(form, 'Address created successfully');
		} catch (error) {
			console.error('Error creating product:', error);
			return fail(500, { message: 'Product creation failed' });
		}
	}
};
