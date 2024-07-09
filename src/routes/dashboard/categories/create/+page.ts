export const load = (async ({ data }) => {
	const { IcreateCategorySchema } = data;

	return {
		IcreateCategorySchema
	};
}) satisfies App.PageLoad;
