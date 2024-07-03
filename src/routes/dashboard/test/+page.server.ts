// src/routes/dashboard/produits/+page.server.ts
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from '$lib/schema';

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schema));

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		// Traitement des fichiers
		const images = formData.getAll('images') as File[];
		images.forEach((image) => {
			if (image instanceof File) {
				console.log(image);
				// TODO: Process each image file
			}
		});

		return message(form, 'You have uploaded valid files!');
	}
};
