<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$UITools/shadcn/button';
	import * as Table from '$UITools/shadcn/table';
	import TableRow from '$UITools/shadcn/table/table-row.svelte';
	import TableCell from '$UITools/shadcn/table/table-cell.svelte';
	import * as AlertDialog from '$UITools/shadcn//alert-dialog';
	import { Input } from '$UITools/shadcn/input';
	import { Badge } from '$UITools/shadcn/badge';
	import { Toggle } from '$UITools/shadcn/toggle';

	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import PlusCircledIcon from 'svelte-radix/PlusCircled.svelte';

	import { deleteProductSchema } from '$lib/ZodSchema/productSchema';
	import { showNotification } from '$stores/Data/notificationStore';

	export let data: any;

	const deleteProduct = superForm(data.IdeleteProductSchema, {
		validators: zodClient(deleteProductSchema),
		id: 'deleteProduct'
	});

	const { enhance: deleteProductEnhance, message: deleteProductMessage } = deleteProduct;

	// Nouvelle variable pour le texte de recherche
	let searchQuery: string = '';

	// Pagination variables
	let currentPage: number = 1;
	let itemsPerPage: number = 5;

	// Fonction pour filtrer les produits
	$: filteredProducts = data.AllProducts.filter((product: any) =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Fonction pour paginer les produits
	$: paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Fonction pour changer de page
	function changePage(page: number) {
		currentPage = page;
	}

	$: if ($deleteProductMessage)
		showNotification(
			$deleteProductMessage,
			$deleteProductMessage.includes('success') ? 'success' : 'error'
		);
</script>

<div class="border p-2">
	<h1 class="my-5 text-xl">Produits</h1>
	<div class="rcb mb-5">
		<Input
			type="text"
			placeholder="Cherchez un produit"
			class="max-w-xs"
			bind:value={searchQuery}
		/>
		<a
			href="/dashboard/products/create"
			class="group relative inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md"
		>
			<Toggle>
				<span class="hidden">Creer un produit</span>
				<PlusCircledIcon class="w-7 h-7" />
			</Toggle>
		</a>
	</div>
	<div class="border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>name</Table.Head>
					<Table.Head>description</Table.Head>
					<Table.Head>price</Table.Head>
					<Table.Head>catégories</Table.Head>
					<Table.Head>images</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginatedProducts as product, i (i)}
					<TableRow>
						<TableCell>{product.name}</TableCell>
						<TableCell>{product.description.slice(0, 20)}...</TableCell>
						<TableCell>{product.price}</TableCell>
						<TableCell>
							{#each product.categories as category}
								<Badge class="m-1">
									{category.category.name}
								</Badge>
							{/each}
						</TableCell>
						<TableCell>
							{product.images.length}
						</TableCell>
						<TableCell class="rce">
							<AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]} variant="outline" class="m-1 p-1 text-xs">
										<Trash class="h-4 w-8" />
									</Button>
								</AlertDialog.Trigger>

								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This will permanently delete your account and
											remove your data from our servers.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<form method="POST" action="?/deleteProduct" use:deleteProductEnhance>
											<input type="hidden" name="productId" value={product.id} />
											<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>

							<Button variant="outline" class="m-1 p-1 text-xs">
								<a href="/dashboard/products/{product.id}">
									<PencilIcon class="h-4 w-8" />
								</a>
							</Button>
						</TableCell>
					</TableRow>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="pagination-controls mt-4 rce">
		{#if currentPage > 1}
			<Button on:click={() => changePage(currentPage - 1)}>Previous</Button>
		{/if}
		<div class="">
			{#each Array(Math.ceil(filteredProducts.length / itemsPerPage)) as _, pageIndex}
				<Button class="mx-1" on:click={() => changePage(pageIndex + 1)}>{pageIndex + 1}</Button>
			{/each}
		</div>
		{#if currentPage < Math.ceil(filteredProducts.length / itemsPerPage)}
			<Button on:click={() => changePage(currentPage + 1)}>Next</Button>
		{/if}
	</div>
</div>
