// src/lib/functions/checkAuth.ts

import prisma from "$requests";
import { getPendingOrder } from '../orders/getPendingOrder';

export const checkOrRegister = async (session: any) => {
	let user;

	if (session?.user?.email) {
		try {
			user = await prisma.user.findUnique({
				where: {
					email: session.user.email
				}
			});

			if (!user) {
				user = await prisma.user.create({
					data: {
						name: session.user.name,
						email: session.user.email,
						image: session.user.image,
						role: 'user',
						orders: {
							create: {
								status: 'PENDING',
								total: 0,
								transactions: {
									create: {
										stripePaymentId: '', // Empty initially, will be updated after payment
										amount: 0, // Amount will be updated after payment
										status: 'PENDING'
									}
								}
							}
						}
					}
				});

				session.user.id = user.id;
				session.user.role = user.role;
				session.order = await getPendingOrder(user.id);
			}
		} catch (error) {
			console.error('Error fetching or creating user:', error);
		}
	}

	return user;
};
