import prisma from '$lib/prisma';

export const getAllProducts = async () => {
	try {
		const products = await prisma.product.findMany();
		return products;
	} catch (error) {
		console.error('Error fetching products:', error);
		throw new Error('Could not fetch products');
	}
};
