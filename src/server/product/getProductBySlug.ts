import prisma from '$server';

export async function getProductBySlug(slug: string) {
	return await prisma.product.findUnique({
		where: { slug: slug },
		include: { categories: true }
	});
}
