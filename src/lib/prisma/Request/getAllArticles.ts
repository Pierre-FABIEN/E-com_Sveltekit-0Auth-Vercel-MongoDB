import prisma from '$lib/prisma';

export const getAllArticles = async () => {
	try {
		const articles = await prisma.article.findMany();
		return articles;
	} catch (error) {
		console.error('Error fetching articles:', error);
		throw new Error('Could not fetch articles');
	}
};
