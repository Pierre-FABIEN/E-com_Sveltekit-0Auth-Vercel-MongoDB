import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateCategory(data: { id: string; name: string }) {
	console.log('Updating category with data:', data);

	try {
		const updatedCategory = await prisma.category.update({
			where: { id: data.id },
			data: { name: data.name }
		});
		console.log('Category updated successfully:', updatedCategory);
		return updatedCategory;
	} catch (error) {
		console.error('Error updating category:', error);
		throw error;
	}
}

// Exemple d'utilisation
updateCategory({ id: 'category-id', name: 'Updated Category Name' })
	.then((category) => {
		console.log('Category updated:', category);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
