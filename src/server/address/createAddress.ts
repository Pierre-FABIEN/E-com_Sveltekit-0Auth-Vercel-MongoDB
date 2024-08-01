import prisma from '$server';

export const createAddress = async (data: any) => {
	const newAddress = await prisma.address.create({
		data
	});
	return newAddress;
};
