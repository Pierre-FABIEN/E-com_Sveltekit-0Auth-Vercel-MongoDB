<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { deleteProductSchema } from '$zod/productSchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import Table from '$components/Table.svelte';

	export let data: any;

	console.log(data);

	const deleteProduct = superForm(data.IdeleteProductSchema, {
		validators: zodClient(deleteProductSchema),
		id: 'deleteProduct'
	});

	const { enhance: deleteProductEnhance, message: deleteProductMessage } = deleteProduct;

	const productColumns = [
		{ key: 'stock', label: 'Stock' },
		{ key: 'name', label: 'Nom' },
		{ key: 'price', label: 'Prix' },
		{ key: 'categories', label: 'Catégories' },
		{ key: 'images', label: 'Images nb' },
		{ key: 'description', label: 'Description' },
		{ key: 'createdAt', label: 'Date de création' }
	];

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} à ${hours}:${minutes}`;
	}

	function formatProductData(products: any[]) {
		return products.map((product) => ({
			...product,
			categories: Array.isArray(product.categories)
				? product.categories.map((cat: any) => cat.category.name).join(', ')
				: 'N/A',
			images: Array.isArray(product.images) ? product.images.length : 0,
			createdAt: formatDate(product.createdAt)
		}));
	}

	// React to delete message changes
	$: if ($deleteProductMessage) {
		showNotification(
			$deleteProductMessage,
			$deleteProductMessage.includes('success') ? 'success' : 'error'
		);
	}

	// Formater les données des produits
	const formattedData = formatProductData(data.products);
</script>

<div class="ccc m-5">
	<div class="w-[100%] mt-5">
		<Table
			name="Produits"
			columns={productColumns}
			data={formattedData}
			deleteActionUrl="?/deleteProduct"
			newActionUrl="/dashboard/products/create"
			editActionUrl="/dashboard/products/"
			enhance={deleteProductEnhance}
		/>
	</div>
</div>
