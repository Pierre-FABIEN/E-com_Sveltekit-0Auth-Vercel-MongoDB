export const load = (async ({ data }) => {
	const { addresses } = data;

	return {
		addresses
	};
}) satisfies App.PageLoad;
