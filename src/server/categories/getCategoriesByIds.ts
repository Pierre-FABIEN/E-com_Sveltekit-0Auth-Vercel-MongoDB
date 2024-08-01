// $lib/prisma/Request/categories/getCategoriesByIds.ts
import prisma from "$server";

export const getCategoriesByIds = async (categoryIds: string[]) => {
	return await prisma.category.findMany({
		where: {
			id: { in: categoryIds }
		},
		select: {
			id: true
		}
	});
};
