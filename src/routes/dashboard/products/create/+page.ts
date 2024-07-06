export const load = (async ({ data }) => {
	const { IcreateProductSchema } = data;

	return {
		IcreateProductSchema
	};
}) satisfies App.PageLoad;
