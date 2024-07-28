import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updatePost = async (id: string, title: string, content: string) => {
	try {
		const post = await prisma.post.update({
			where: { id },
			data: {
				title,
				content
			}
		});
		return post;
	} catch (error) {
		console.error('Error updating post:', error);
	} finally {
		await prisma.$disconnect();
	}
};
