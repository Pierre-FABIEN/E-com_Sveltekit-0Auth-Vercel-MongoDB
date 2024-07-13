// src/routes/success/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const session_id = url.searchParams.get('session_id');

	return { session_id };
};
