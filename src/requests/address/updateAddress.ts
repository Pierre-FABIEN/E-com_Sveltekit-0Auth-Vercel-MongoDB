// src/requests/address/updateAddress.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateAddressData {
	recipient: string;
	street: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}

export const updateAddress = async (id: string, data: UpdateAddressData) => {
	try {
		const updatedAddress = await prisma.address.update({
			where: { id },
			data
		});
		return updatedAddress;
	} catch (error) {
		console.error('Error updating address:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
