import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const updateCategory = async (data: { id: string; name: string }) => {
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
};
