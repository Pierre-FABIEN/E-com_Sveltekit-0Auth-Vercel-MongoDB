import prisma from "$server";

export async function getProductById(productId: string) {
	return await prisma.product.findUnique({
		where: { id: productId },
		include: { categories: true }
	});
}
