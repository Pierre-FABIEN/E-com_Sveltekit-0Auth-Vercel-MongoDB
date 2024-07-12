import prisma from '$requests';

export const deleteAddress = async (id) => {
	const deletedAddress = await prisma.address.delete({
		where: { id }
	});
	return deletedAddress;
};
