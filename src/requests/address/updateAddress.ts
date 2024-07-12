import prisma from '$requests';

export const updateAddress = async (id, data) => {
	const updatedAddress = await prisma.address.update({
		where: { id },
		data: data
	});
	return updatedAddress;
};
