import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCategory = async (data: { name: string }) => {
	return prisma.category.create({
		data: {
			name: data.name
		}
	});
};
