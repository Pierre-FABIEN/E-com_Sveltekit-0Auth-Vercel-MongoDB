export const load = (async ({ data }) => {
	const { IdeleteCategorySchema, IdeleteProductSchema } = data;

	return {
		IdeleteCategorySchema,
		IdeleteProductSchema
	};
}) satisfies App.PageLoad;
