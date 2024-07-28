export const load = (async ({ data }) => {
	const { IupdateCategorySchema } = data;

	return {
		IupdateCategorySchema
	};
}) satisfies App.PageLoad;
