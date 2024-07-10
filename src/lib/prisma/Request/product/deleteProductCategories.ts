import prisma from '$lib/prisma';

export const deleteProductCategories = async (productId: string) => {
	return await prisma.productCategory.deleteMany({
		where: { productId: productId }
	});
};
