import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProductCategories(productId: string) {
	const productWithCategories = await prisma.product.findUnique({
		where: { id: productId },
		include: {
			categories: {
				include: {
					category: true
				}
			}
		}
	});

	if (!productWithCategories) {
		throw new Error('Product not found');
	}

	return productWithCategories.categories.map((pc) => pc.category);
}
