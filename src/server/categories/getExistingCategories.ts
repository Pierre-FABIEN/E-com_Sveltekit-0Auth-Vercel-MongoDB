// $lib/prisma/Request/categories/getExistingCategories.ts
import prisma from "$server";

export const getExistingCategories = async (categoryIds: string[]) => {
	return await prisma.category.findMany({
		where: {
			id: { in: categoryIds }
		},
		select: {
			id: true
		}
	});
};
