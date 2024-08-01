// $lib/prismaOperations.ts

import prisma from '$server';

// Function to find a category by ID
export async function getCategoriesById(categoryId: string) {
	return await prisma.category.findUnique({
		where: { id: categoryId }
	});
}
