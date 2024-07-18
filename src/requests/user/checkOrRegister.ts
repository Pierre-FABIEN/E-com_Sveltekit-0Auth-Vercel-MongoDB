// src/lib/functions/checkAuth.ts

import prisma from '$requests';
import { getPendingOrder } from '../orders/getPendingOrder';

export const checkOrRegister = async (session) => {
	if (!session?.user?.email) {
		return null;
	}

	try {
		let user = await prisma.user.findUnique({
			where: {
				email: session.user.email
			},
			include: {
				orders: {
					where: {
						status: 'PENDING'
					}
				}
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
							total: 0
						}
					}
				}
			});

			session.user.id = user?.id;
			session.user.role = user?.role;
		} else if (user.role !== 'admin' && user.orders.length === 0) {
			await prisma.order.create({
				data: {
					userId: user.id,
					status: 'PENDING',
					total: 0
				}
			});

			session.order = await getPendingOrder(user.id);
		}

		return user;
	} catch (error) {
		console.error('Error fetching or creating user:', error);
		throw new Error('Failed to fetch or create user');
	}
};
