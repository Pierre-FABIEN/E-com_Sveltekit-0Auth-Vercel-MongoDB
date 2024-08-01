import prisma from "$requests";

export async function deleteCategoryById(categoryId: string) {
	return await prisma.category.delete({
		where: { id: categoryId }
	});
}
