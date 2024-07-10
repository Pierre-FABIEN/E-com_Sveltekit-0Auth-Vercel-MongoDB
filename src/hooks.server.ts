// src/hooks.server.ts

import { handle as authHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { getUserByEmail } from '$lib/prisma/Request/user/getUserByEmail';

export const handle = sequence(authHandle, async ({ event, resolve }) => {
	const session = await event.locals.getSession();

	if (session?.user?.email) {
		try {
			const user = await getUserByEmail(session.user.email);

			if (user) {
				event.locals.role = user.role;
			}
		} catch (error) {
			console.error('Error fetching user role:', error);
		}
	}

	return resolve(event);
});
