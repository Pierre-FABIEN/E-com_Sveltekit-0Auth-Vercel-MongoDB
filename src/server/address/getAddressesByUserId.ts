// src/requests/address/getAddressesByUserId.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAddressesByUserId = async (userId: string) => {
	try {
		const addresses = await prisma.address.findMany({
			where: { userId }
		});
		console.log('Addresses retrieved for user:', userId, addresses);
		return addresses;
	} catch (error) {
		console.error('Error fetching addresses:', error);
		throw new Error('Could not fetch addresses');
	} finally {
		await prisma.$disconnect();
	}
};
