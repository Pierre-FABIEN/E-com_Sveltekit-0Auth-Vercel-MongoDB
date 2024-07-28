import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPosts = async () => {
	try {
		const posts = await prisma.post.findMany({
			include: {
				author: true
			}
		});
		return posts;
	} catch (error) {
		console.error('Error retrieving posts:', error);
	} finally {
		await prisma.$disconnect();
	}
};
