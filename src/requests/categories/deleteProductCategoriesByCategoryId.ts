import prisma from '$requests';

// Function to delete product categories by category ID
export async function deleteProductCategoriesByCategoryId(categoryId: string) {
	return await prisma.productCategory.deleteMany({
		where: { categoryId: categoryId }
	});
}
