import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (
	title: string,
	content: string,
	authorId: string,
	slug: string
) => {
	try {
		const post = await prisma.post.create({
			data: {
				title,
				content,
				authorId,
				slug,
				createdAt: new Date()
			}
		});
		return post;
	} catch (error) {
		console.error('Error creating post:', error);
	} finally {
		await prisma.$disconnect();
	}
};
