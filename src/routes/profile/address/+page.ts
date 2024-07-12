import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
	const { IcreateAddressSchema } = data;
	return { IcreateAddressSchema };
}) satisfies PageLoad;
