export const load = (async ({ data }) => {
	const { IupdateAddressSchema } = data;

	return {
		IupdateAddressSchema
	};
}) satisfies App.PageLoad;
