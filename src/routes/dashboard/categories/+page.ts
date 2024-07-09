export const load = (async ({ data }) => {
	const { IdeleteCategorySchema } = data;

	return {
		IdeleteCategorySchema
	};
}) satisfies App.PageLoad;
