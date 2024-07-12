import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAddress = async () => {
	try {
		const addresses = await prisma.address.findMany({
			include: {
				user: true
			}
		});

		return addresses;
	} catch (error) {
		console.error('Error fetching addresses with users:', error);
	} finally {
		await prisma.$disconnect();
	}
};
