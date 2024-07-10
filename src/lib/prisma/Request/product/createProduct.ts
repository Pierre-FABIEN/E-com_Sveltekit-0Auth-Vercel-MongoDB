import prisma from '$lib/prisma';

export const createProduct = async (productData: {
	name: string;
	description: string;
	price: number;
	stock: number;
	images: string[];
}) => {
	return prisma.product.create({
		data: productData
	});
};
