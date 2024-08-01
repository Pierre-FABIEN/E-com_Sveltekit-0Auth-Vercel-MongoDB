import prisma from "$requests";

export const deleteProductCategories = async (productId: string) => {
	return await prisma.productCategory.deleteMany({
		where: { productId: productId }
	});
};
