import prisma from "$server";

export async function deleteCategoryById(categoryId: string) {
	return await prisma.category.delete({
		where: { id: categoryId }
	});
}
