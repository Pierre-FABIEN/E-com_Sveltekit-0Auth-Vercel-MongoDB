export const load = (async ({ data }) => {
	const { addresses, IOrderSchema } = data;

	return {
		addresses,
		IOrderSchema
	};
}) satisfies App.PageLoad;
