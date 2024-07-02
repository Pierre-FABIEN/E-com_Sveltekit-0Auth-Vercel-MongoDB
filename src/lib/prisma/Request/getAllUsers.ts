import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany({
			include: {
				addresses: true,
				orders: {
					include: {
						products: true,
						address: true
					}
				}
			}
		});

		return users;
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new Error('Could not fetch users');
	} finally {
		await prisma.$disconnect();
	}
};
