import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import prisma from '$lib/prisma';
import cloudinary from '$lib/Cloudinary';
import { updateProductSchema } from '$lib/ZodSchema/productSchema';

function getPublicIdFromUrl(url: string): string | null {
	const regex = /\/([^/]+)\.[a-z]+$/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Charger les données du produit avec ses catégories associées
		const product = await prisma.product.findUnique({
			where: { id: params.productId },
			include: { categories: true }
		});

		// Si le produit n'est pas trouvé, retourner une erreur 404
		if (!product) {
			return fail(404, { message: 'Product not found' });
		}

		// Créer les données initiales à partir des informations du produit
		const initialData = {
			_id: product.id,
			name: product.name,
			description: product.description,
			price: product.price,
			categoryId: product.categories.map((cat) => cat.categoryId) as [string, ...string[]],
			images: product.images
		};

		console.log(initialData, 'initialData');

		// Valider les données initiales avec superValidate et zod
		const IupdateProductSchema = await superValidate(initialData, zod(updateProductSchema));

		// Retourner les données validées
		return {
			IupdateProductSchema
		};
	} catch (error) {
		console.error('Error loading product:', error);
		return fail(500, { message: 'An error occurred while loading the product' });
	}
};

export const actions: Actions = {
	updateProduct: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(updateProductSchema));
		console.log('Form Data:', form.data);

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
			return fail(400, withFiles({ form }));
		}

		const productId = form.data._id;
		const images = form.data.images;
		const deletedImages = formData.deletedImages || [];
		const uploadedImageUrls: string[] = [];

		for (const image of images) {
			if (typeof image === 'string') {
				uploadedImageUrls.push(image); // URL existante
			} else if (image instanceof File) {
				try {
					const buffer = await image.arrayBuffer();
					const base64String = Buffer.from(buffer).toString('base64');

					const uploadResponse = await cloudinary.uploader.upload(
						`data:${image.type};base64,${base64String}`,
						{
							folder: 'products'
						}
					);

					uploadedImageUrls.push(uploadResponse.secure_url);
				} catch (error) {
					console.error('Error uploading image:', error);
					return fail(500, { message: 'Image upload failed' });
				}
			}
		}

		const categoryIds = form.data.categoryId;
		console.log('Category IDs:', categoryIds);

		const existingCategories = await prisma.category.findMany({
			where: {
				id: { in: categoryIds }
			},
			select: {
				id: true
			}
		});

		const existingCategoryIds = existingCategories.map((cat) => cat.id);
		const missingCategories = categoryIds.filter((id) => !existingCategoryIds.includes(id));

		if (missingCategories.length > 0) {
			return fail(400, {
				message: `The following categories do not exist: ${missingCategories.join(', ')}`
			});
		}

		console.log('Deleted Images:', deletedImages);
		for (const imageUrl of deletedImages) {
			const publicId = getPublicIdFromUrl(imageUrl);
			console.log('Public ID:', publicId);

			if (publicId) {
				try {
					const result = await cloudinary.uploader.destroy(`products/${publicId}`);
					console.log('Delete Result:', result);
					if (result.result !== 'ok' && result.result !== 'not found') {
						console.error('Error deleting image from Cloudinary:', result);
						return fail(500, { message: 'Failed to delete image from Cloudinary' });
					}
				} catch (error) {
					console.error('Error deleting image from Cloudinary:', error);
					return fail(500, { message: 'Failed to delete image from Cloudinary' });
				}
			}
		}

		try {
			const updatedProduct = await prisma.product.update({
				where: { id: productId },
				data: {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined // Only update images if new ones are uploaded
				}
			});

			await prisma.productCategory.deleteMany({
				where: { productId: productId }
			});

			const productCategoryData = existingCategoryIds.map((categoryId) => ({
				productId: productId,
				categoryId: categoryId
			}));

			await prisma.productCategory.createMany({
				data: productCategoryData
			});

			console.log(updatedProduct, 'updatedProduct');
			return message(form, 'Product updated successfully');
		} catch (error) {
			console.error('Error updating product:', error);
			return fail(500, { message: 'Product update failed' });
		}
	}
};
