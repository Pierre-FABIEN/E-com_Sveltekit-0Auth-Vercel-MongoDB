import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPostBySlug = async (slug: string) => {
	try {
		const post = await prisma.post.findUnique({
			where: { slug },
			include: {
				author: true
			}
		});
		return post;
	} catch (error) {
		console.error('Error retrieving post:', error);
	} finally {
		await prisma.$disconnect();
	}
};
