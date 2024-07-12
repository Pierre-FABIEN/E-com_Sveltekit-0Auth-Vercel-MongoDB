export const load = (async ({ data }) => {
	const { addresses, IpaymentSchema } = data;

	return {
		addresses,
		IpaymentSchema
	};
}) satisfies App.PageLoad;
