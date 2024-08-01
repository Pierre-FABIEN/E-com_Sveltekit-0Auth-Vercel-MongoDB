import prisma from "$server";

export const updateProductById = async (productId: string, data: any) => {
	return await prisma.product.update({
		where: { id: productId },
		data: data
	});
};
