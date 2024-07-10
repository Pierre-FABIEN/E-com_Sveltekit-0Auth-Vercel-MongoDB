import prisma from '$lib/prisma';

export const connectProductToCategories = async (productId: string, categoryIds: string[]) => {
	return prisma.productCategory.createMany({
		data: categoryIds.map((categoryId) => ({
			productId,
			categoryId
		}))
	});
};
