export const load = (async ({ data }) => {
	const {
		IcreateCategorySchema,
		IupdateCategorySchema,
		IdeleteCategorySchema,

		IcreateProductSchema,
		IupdateProductSchema,
		IdeleteProductSchema
	} = data;

	return {
		IcreateCategorySchema,
		IupdateCategorySchema,
		IdeleteCategorySchema,

		IcreateProductSchema,
		IupdateProductSchema,
		IdeleteProductSchema
	};
}) satisfies App.PageLoad;
