<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { deleteCategorySchema } from '$zod/categorySchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import Table from '$components/Table.svelte';

	export let data: any;

	const deleteCategory = superForm(data?.IdeleteCategorySchema ?? {}, {
		validators: zodClient(deleteCategorySchema),
		id: 'deleteCategory'
	});

	const { enhance: deleteCategoryEnhance, message: deleteCategoryMessage } = deleteCategory;

	let formattedData = [];

	if (data && data.categories) {
		formattedData = formatProductData(data.categories);
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} à ${hours}:${minutes}`;
	}

	const categoryColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'createdAt', label: 'Date de création', formatter: formatDate }
	];

	function formatProductData(categories: any[]) {
		return categories.map((category) => ({
			...category,
			createdAt: formatDate(category.createdAt)
		}));
	}

	// React to delete message changes
	$: if ($deleteCategoryMessage) {
		showNotification(
			$deleteCategoryMessage,
			$deleteCategoryMessage.includes('success') ? 'success' : 'error'
		);
	}
</script>

<div class="ccc m-5">
	<div class="w-[100%] mt-5">
		<Table
			name="Catégories"
			columns={categoryColumns}
			data={formattedData}
			deleteActionUrl="?/deleteCategory"
			newActionUrl="/dashboard/categories/create"
			editActionUrl="/dashboard/categories/"
			enhance={deleteCategoryEnhance}
		/>
	</div>
</div>
