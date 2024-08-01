import prisma from "$requests";

export const getproductsAndCategories = async () => {
	try {
		const productsAndCategories = await prisma.product.findMany({
			include: {
				categories: {
					include: {
						category: true
					}
				}
			}
		});
		const categories = await prisma.category.findMany();
		return { products: productsAndCategories, categories };
	} catch (error) {
		console.error('Error fetching products and categories:', error);
		throw new Error('Could not fetch products and categories');
	}
};
