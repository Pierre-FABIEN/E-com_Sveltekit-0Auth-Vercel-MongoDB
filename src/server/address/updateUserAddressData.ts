import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUserAddressData = async (addressData: {
	id: string;
	recipient: string;
	street: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}) => {
	try {
		const { id, recipient, street, city, state, zip, country } = addressData;

		const updatedAddress = await prisma.address.update({
			where: { id },
			data: {
				recipient,
				street,
				city,
				state,
				zip,
				country
			}
		});

		console.log('Address updated:', updatedAddress);
		return updatedAddress;
	} catch (error) {
		console.error('Error updating address:', error);
		throw new Error('Could not update address');
	} finally {
		await prisma.$disconnect();
	}
};
