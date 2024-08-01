import prisma from "$requests";

export const connectProductToCategories = async (productId: string, categoryIds: string[]) => {
	return prisma.productCategory.createMany({
		data: categoryIds.map((categoryId) => ({
			productId,
			categoryId
		}))
	});
};
