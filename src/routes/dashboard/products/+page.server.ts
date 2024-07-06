import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';

import { superValidate, fail, message, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import cloudinary from '$lib/Cloudinary';

import { deleteProductSchema } from '$lib/ZodSchema/productSchema';

import { deleteCategorySchema } from '$lib/ZodSchema/categorySchema';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	const IdeleteProductSchema = await superValidate(zod(deleteProductSchema));
	const IdeleteCategorySchema = await superValidate(zod(deleteCategorySchema));

	return {
		IdeleteCategorySchema,
		IdeleteProductSchema
	};
};

export const actions: Actions = {
	// createProduct: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	const form = await superValidate(formData, zod(createProductSchema));
	// 	console.log(form, 'form');
	// 	console.log(form.data.categoryId, 'categoryId');
	// 	if (!form.valid) {
	// 		return fail(400, withFiles({ form }));
	// 	}
	// 	const images = formData.getAll('images') as File[];
	// 	const uploadedImageUrls: string[] = [];
	// 	for (const image of images) {
	// 		if (image instanceof File) {
	// 			try {
	// 				const buffer = await image.arrayBuffer();
	// 				const base64String = Buffer.from(buffer).toString('base64');
	// 				const uploadResponse = await cloudinary.uploader.upload(
	// 					`data:${image.type};base64,${base64String}`,
	// 					{
	// 						folder: 'products'
	// 					}
	// 				);
	// 				uploadedImageUrls.push(uploadResponse.secure_url);
	// 			} catch (error) {
	// 				console.error('Error uploading image:', error);
	// 				return fail(500, { message: 'Image upload failed' });
	// 			}
	// 		}
	// 	}
	// 	const categoryIds = form.data.categoryId as string[];
	// 	console.log(categoryIds, 'categoryIds');
	// 	// Vérifier l'existence des catégories
	// 	const existingCategories = await prisma.category.findMany({
	// 		where: {
	// 			id: { in: categoryIds }
	// 		},
	// 		select: {
	// 			id: true
	// 		}
	// 	});
	// 	console.log(existingCategories, 'existingCategories');
	// 	const existingCategoryIds = existingCategories.map((cat) => cat.id);
	// 	console.log(existingCategoryIds, 'existingCategoryIds');
	// 	const missingCategories = categoryIds.filter((id) => !existingCategoryIds.includes(id));
	// 	console.log(missingCategories, 'missingCategories');
	// 	if (missingCategories.length > 0) {
	// 		return fail(400, {
	// 			message: `The following categories do not exist: ${missingCategories.join(', ')}`
	// 		});
	// 	}
	// 	// Créer un produit dans la base de données avec les URLs des images uploadées
	// 	try {
	// 		const product = await prisma.product.create({
	// 			data: {
	// 				name: form.data.name,
	// 				description: form.data.description,
	// 				price: form.data.price,
	// 				images: uploadedImageUrls
	// 			}
	// 		});
	// 		// Créer les relations dans ProductCategory
	// 		const productCategoryData = existingCategoryIds.map((categoryId) => ({
	// 			productId: product.id,
	// 			categoryId: categoryId
	// 		}));
	// 		await prisma.productCategory.createMany({
	// 			data: productCategoryData
	// 		});
	// 		console.log(product, 'product');
	// 		return {
	// 			success: true,
	// 			product
	// 		};
	// 	} catch (error) {
	// 		console.error('Error creating product:', error);
	// 		return fail(500, { message: 'Product creation failed' });
	// 	}
	// },
	// updateProduct: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	console.log(formData, 'formData');
	// 	const form = await superValidate(formData, zod(updateProductSchema));
	// 	console.log(form, 'form');
	// 	if (!form.valid) {
	// 		return fail(400, withFiles({ form }));
	// 	}
	// 	const productId = form.data.id;
	// 	const images = formData.getAll('images') as File[];
	// 	const uploadedImageUrls: string[] = [];
	// 	for (const image of images) {
	// 		if (image instanceof File) {
	// 			try {
	// 				const buffer = await image.arrayBuffer();
	// 				const base64String = Buffer.from(buffer).toString('base64');
	// 				const uploadResponse = await cloudinary.uploader.upload(
	// 					`data:${image.type};base64,${base64String}`,
	// 					{
	// 						folder: 'products'
	// 					}
	// 				);
	// 				uploadedImageUrls.push(uploadResponse.secure_url);
	// 			} catch (error) {
	// 				console.error('Error uploading image:', error);
	// 				return fail(500, { message: 'Image upload failed' });
	// 			}
	// 		}
	// 	}
	// 	const categoryIds = form.data.categoryId as string[];
	// 	console.log(categoryIds, 'categoryIds');
	// 	// Vérifier l'existence des catégories
	// 	const existingCategories = await prisma.category.findMany({
	// 		where: {
	// 			id: { in: categoryIds }
	// 		},
	// 		select: {
	// 			id: true
	// 		}
	// 	});
	// 	const existingCategoryIds = existingCategories.map((cat) => cat.id);
	// 	const missingCategories = categoryIds.filter((id) => !existingCategoryIds.includes(id));
	// 	if (missingCategories.length > 0) {
	// 		return fail(400, {
	// 			message: `The following categories do not exist: ${missingCategories.join(', ')}`
	// 		});
	// 	}
	// 	// Mettre à jour le produit dans la base de données avec les URLs des nouvelles images uploadées
	// 	try {
	// 		const updatedProduct = await prisma.product.update({
	// 			where: { id: productId },
	// 			data: {
	// 				name: form.data.name,
	// 				description: form.data.description,
	// 				price: form.data.price,
	// 				images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined // Only update images if new ones are uploaded
	// 			}
	// 		});
	// 		// Mettre à jour les relations dans ProductCategory
	// 		await prisma.productCategory.deleteMany({
	// 			where: { productId: productId }
	// 		});
	// 		const productCategoryData = existingCategoryIds.map((categoryId) => ({
	// 			productId: productId,
	// 			categoryId: categoryId
	// 		}));
	// 		await prisma.productCategory.createMany({
	// 			data: productCategoryData
	// 		});
	// 		console.log(updatedProduct, 'updatedProduct');
	// 		return {
	// 			success: true,
	// 			product: updatedProduct
	// 		};
	// 	} catch (error) {
	// 		console.error('Error updating product:', error);
	// 		return fail(500, { message: 'Product update failed' });
	// 	}
	// },

	// createCategory: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	console.log(formData, 'formData');
	// 	const form = await superValidate(formData, zod(createCategorySchema));
	// 	console.log(form, 'form');
	// 	if (!form.valid) {
	// 		return fail(400, withFiles({ form }));
	// 	}
	// 	const categoryName = form.data.name;
	// 	// Vérifier si une catégorie avec le même nom existe déjà
	// 	const existingCategory = await prisma.category.findFirst({
	// 		where: { name: categoryName }
	// 	});
	// 	if (existingCategory) {
	// 		return fail(400, {
	// 			message: 'Category with this name already exists'
	// 		});
	// 	}
	// 	try {
	// 		// Créer une nouvelle catégorie dans la base de données
	// 		const newCategory = await prisma.category.create({
	// 			data: {
	// 				name: categoryName
	// 			}
	// 		});
	// 		console.log(newCategory, 'newCategory');
	// 		return message(form, 'Category created successfully');
	// 	} catch (error) {
	// 		console.error('Error creating category:', error);
	// 		return fail(500, { message: 'Category creation failed' });
	// 	}
	// },

	deleteProduct: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(deleteProductSchema));
		const productId = formData.get('productId') as string;
		console.log('Received productId:', productId);
		if (!productId) {
			console.log('No productId provided');
			return fail(400, { message: 'Product ID is required' });
		}
		try {
			// Vérifier si le produit existe
			const existingProduct = await prisma.product.findUnique({
				where: { id: productId }
			});
			if (!existingProduct) {
				console.log('Product not found:', productId);
				return fail(400, { message: 'Product not found' });
			}
			console.log('Product found:', existingProduct);
			// Supprimer les relations de catégorie associées au produit
			const deletedCategories = await prisma.productCategory.deleteMany({
				where: { productId: productId } // Utiliser productId comme string
			});
			console.log('Deleted product categories:', deletedCategories);
			// Supprimer le produit
			const deletedProduct = await prisma.product.delete({
				where: { id: productId } // Utiliser productId comme string
			});
			console.log('Deleted product:', deletedProduct);
			return message(form, 'product deleted successfully');
		} catch (error) {
			console.error('Error deleting product:', error);
			return fail(500, { message: 'Product deletion failed' });
		}
	},
	deleteCategory: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(deleteCategorySchema));
		const categoryId = formData.get('categoryId') as string;
		console.log('Received categoryId:', categoryId);
		if (!categoryId) {
			console.log('No categoryId provided');
			return fail(400, { message: 'Category ID is required' });
		}
		try {
			// Vérifier si la catégorie existe
			const existingCategory = await prisma.category.findUnique({
				where: { id: categoryId }
			});
			if (!existingCategory) {
				console.log('Category not found:', categoryId);
				return fail(400, { message: 'Category not found' });
			}
			console.log('Category found:', existingCategory);
			// Supprimer les relations de catégorie associées au produit
			const deletedProductCategories = await prisma.productCategory.deleteMany({
				where: { categoryId: categoryId } // Utiliser categoryId comme string
			});
			console.log('Deleted product categories:', deletedProductCategories);
			// Supprimer la catégorie
			const deletedCategory = await prisma.category.delete({
				where: { id: categoryId } // Utiliser categoryId comme string
			});
			console.log('Deleted category:', deletedCategory);
			return message(form, 'Category deleted successfully');
		} catch (error) {
			console.error('Error deleting category:', error);
			return fail(500, { message: 'Category deletion failed' });
		}
	}
};
