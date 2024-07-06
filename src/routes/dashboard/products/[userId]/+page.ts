export const load = (async ({ data }) => {
	const { IupdateProductSchema } = data;

	return {
		IupdateProductSchema
	};
}) satisfies App.PageLoad;
