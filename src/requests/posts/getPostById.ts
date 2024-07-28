import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPostById = async (id: string) => {
	try {
		const post = await prisma.post.findUnique({
			where: { id },
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
