import { handle as authHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(authHandle, async ({ event, resolve }) => {
	const session = await event.locals.getSession();

	return resolve(event);
});
