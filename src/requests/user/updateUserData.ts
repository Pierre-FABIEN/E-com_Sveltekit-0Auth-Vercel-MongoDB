import prisma from '$requests';

export const updateUserData = async (userData: any) => {
	console.log(userData, 'userData');
	try {
		// Mise à jour des données de l'utilisateur dans la base de données
		const updatedUser = await prisma.user.update({
			where: { id: userData.id },
			data: {
				address: userData.address,
				city: userData.city,
				postalCode: userData.postalCode,
				phoneNumber: userData.phoneNumber
			}
		});

		console.log('User updated:', updatedUser);
		return updatedUser;
	} catch (error) {
		console.error('Error updating user:', error);
		throw new Error('Could not update user data');
	}
};
