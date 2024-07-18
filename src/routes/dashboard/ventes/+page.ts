import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
	const { transactions } = data;
	return {
		transactions
	};
}) satisfies PageLoad;
