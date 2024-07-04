import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createProduct(data: {
	name: string;
	description: string;
	price: number;
	images: string[];
	categoryId: string[];
}) {
	return prisma.product.create({
		data: {
			name: data.name,
			description: data.description,
			price: data.price,
			images: data.images,
			categories: {
				connect: data.categoryId.map((id: string) => ({ id }))
			}
		}
	});
}
