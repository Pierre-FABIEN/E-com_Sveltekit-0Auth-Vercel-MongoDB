import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deletePost = async (id: string) => {
	console.log('Deleting post with id:', id);

	try {
		const post = await prisma.post.delete({
			where: { id }
		});
		return post;
	} catch (error) {
		console.error('Error deleting post:', error);
	} finally {
		await prisma.$disconnect();
	}
};
