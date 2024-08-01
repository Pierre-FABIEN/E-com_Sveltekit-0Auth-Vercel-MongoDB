import prisma from "$requests";

export async function deleteProductById(productId: string) {
	// Supprime d'abord les OrderItems associés au produit
	await prisma.orderItem.deleteMany({
		where: { productId: productId }
	});

	// Ensuite, supprime les catégories associées si nécessaire
	await prisma.productCategory.deleteMany({
		where: { productId: productId }
	});

	// Finalement, supprime le produit lui-même
	return await prisma.product.delete({
		where: { id: productId }
	});
}
