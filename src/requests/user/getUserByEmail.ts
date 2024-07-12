import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) => {
	try {
		return await prisma.user.findUnique({
			where: { email }
		});
	} catch (error) {
		console.error('Error fetching user by email:', error);
		throw error;
	}
};

export default prisma;
