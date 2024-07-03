import prisma from '$lib/prisma';

export const getAllCategories = async () => {
	try {
		const categories = await prisma.category.findMany();
		return categories;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw new Error('Could not fetch categories');
	}
};
