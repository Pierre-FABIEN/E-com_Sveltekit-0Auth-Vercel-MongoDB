import prisma from '$lib/prisma';

export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany({
			include: {
				addresses: true
			}
		});

		return users;
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new Error('Could not fetch users');
	}
};
