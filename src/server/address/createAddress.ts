import prisma from '$server';

export const createAddress = async (data) => {
	const newAddress = await prisma.address.create({
		data
	});
	return newAddress;
};
