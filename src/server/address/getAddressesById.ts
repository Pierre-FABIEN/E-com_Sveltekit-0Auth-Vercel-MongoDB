import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAddressById = async (id: string) => {
	try {
		const address = await prisma.address.findUnique({
			where: { id }
		});
		console.log('Address retrieved:', address);
		return address;
	} catch (error) {
		console.error('Error fetching address:', error);
		throw new Error('Could not fetch address');
	} finally {
		await prisma.$disconnect();
	}
};
