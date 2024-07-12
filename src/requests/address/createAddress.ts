import prisma from '$requests';

export const createAddress = async (data) => {
	const newAddress = await prisma.address.create({
		data: data
	});
	return newAddress;
};
