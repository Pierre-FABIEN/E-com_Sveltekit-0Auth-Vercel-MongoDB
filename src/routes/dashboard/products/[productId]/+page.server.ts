import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import prisma from '$lib/prisma';
import cloudinary from '$lib/Cloudinary';
import { updateProductSchema } from '$lib/ZodSchema/productSchema';

function convertFormData(formData: FormData) {
	const data: any = {};
	formData.forEach((value, key) => {
		if (key === 'images' && (typeof value === 'string' || value instanceof File)) {
			if (!data.images) data.images = [];
			data.images.push(value);
		} else if (key === 'price') {
			data[key] = parseFloat(value as string);
		} else if (key === 'categoryId') {
			data[key] = value.toString().split(',');
		} else {
			data[key] = value;
		}
	});
	return data;
}

export const load: PageServerLoad = async ({ params }) => {
	const product = await prisma.product.findUnique({
		where: { id: params.productId },
		include: { categories: true }
	});

	if (!product) {
		return fail(404, { message: 'Product not found' });
	}

	const initialData = {
		_id: product.id,
		name: product.name,
		description: product.description,
		price: product.price,
		categoryId: product.categories.map((cat) => cat.categoryId),
		images: product.images
	};

	const IupdateProductSchema = await superValidate(initialData, zod(updateProductSchema));
	return {
		IupdateProductSchema
	};
};

export const actions: Actions = {
	updateProduct: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData, 'formData');

		// Convertir FormData en un format compatible
		const convertedData = convertFormData(formData);
		console.log(convertedData);

		const form = await superValidate(convertedData, zod(updateProductSchema));
		console.log(form, 'form');

		if (!form.valid) {
			console.log('Validation errors:', form.errors);
			return fail(400, withFiles({ form }));
		}

		const productId = form.data._id;
		const images = form.data.images;
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
		console.log(categoryIds, 'categoryIds');

		// Vérifier l'existence des catégories
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

		// Mettre à jour le produit dans la base de données avec les URLs des nouvelles images uploadées
		try {
			const updatedProduct = await prisma.product.update({
				where: { id: productId },
				data: {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					images: uploadedImageUrls // Mettre à jour avec les nouvelles URLs des images
				}
			});

			// Mettre à jour les relations dans ProductCategory
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
