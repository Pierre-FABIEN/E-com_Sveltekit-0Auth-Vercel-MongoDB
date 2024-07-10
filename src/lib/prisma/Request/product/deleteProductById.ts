import prisma from '$lib/prisma';

export async function deleteProductById(productId: string) {
	return await prisma.product.delete({
		where: { id: productId }
	});
}
