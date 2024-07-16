import prisma from '$requests';

export const getcategories = async () => {
	try {
		const categories = await prisma.category.findMany();
		return categories;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw new Error('Could not fetch categories');
	}
};
