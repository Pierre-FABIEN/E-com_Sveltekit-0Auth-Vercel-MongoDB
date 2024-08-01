import prisma from '$server';

export const deleteAddress = async (id) => {
	const deletedAddress = await prisma.address.delete({
		where: { id }
	});
	return deletedAddress;
};
