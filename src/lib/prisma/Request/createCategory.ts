import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createCategory(data: { name: string }) {
	return prisma.category.create({
		data: {
			name: data.name
		}
	});
}

// Exemple d'utilisation
createCategory({ name: 'New Category' })
	.then((category) => {
		console.log('Category created:', category);
	})
	.catch((error) => {
		console.error('Error creating category:', error);
	});
