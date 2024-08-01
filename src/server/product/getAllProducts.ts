import prisma from "$requests";

export const getproducts = async () => {
	try {
		const products = await prisma.product.findMany({
			include: {
				categories: {
					include: {
						category: true
					}
				}
			}
		});
		return products;
	} catch (error) {
		console.error('Error fetching products:', error);
		throw new Error('Could not fetch products');
	}
};
