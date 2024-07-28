import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (title: string, content: string, authorId: string) => {
	console.log('Creating new post with title:', title);
	console.log('Creating new post with content:', content);
	console.log('Creating new post with authorId:', authorId);

	try {
		const post = await prisma.post.create({
			data: {
				title,
				content,
				authorId,
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
