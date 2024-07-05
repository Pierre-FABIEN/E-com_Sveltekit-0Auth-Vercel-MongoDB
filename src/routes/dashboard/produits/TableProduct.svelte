<script lang="ts">
	import { Button } from '$UITools/shadcn/button';
	import * as Sheet from '$UITools/shadcn/sheet/index.js';
	import * as Table from '$UITools/shadcn/table';
	import TableRow from '$UITools/shadcn/table/table-row.svelte';
	import TableCell from '$UITools/shadcn/table/table-cell.svelte';
	import * as AlertDialog from '$UITools/shadcn//alert-dialog';
	import CreateProduct from './CreateProduct.svelte';
	import { Input } from '$UITools/shadcn/input';

	import Trash from 'svelte-radix/Trash.svelte';

	export let data: any;
	export let createProductEnhance;
	export let createProduct;
	export let createProductData;
	export let deleteProductEnhance;
	export let deleteProductMessage;

	// Nouvelle variable pour le texte de recherche
	let searchQuery: string = '';

	// Pagination variables
	let currentPage: number = 1;
	let itemsPerPage: number = 10;

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

	function deleteProduct(id: number) {
		// Remplacer cette logique par la logique de suppression réelle (ex: appel API)
		data.AllProducts = data.AllProducts.filter((product: any) => product.id !== id);
	}

	$: console.log($deleteProductMessage);
</script>

<div class="w-[500px] border p-2">
	<h1 class="my-5">Produits</h1>
	<div class="rcb mb-5">
		<Input
			type="text"
			placeholder="Cherchez un produit"
			class="max-w-xs"
			bind:value={searchQuery}
		/>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">Créer un produit</Button>
			</Sheet.Trigger>
			<CreateProduct {data} {createProductEnhance} {createProduct} {createProductData} />
		</Sheet.Root>
	</div>
	<div class="border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>name</Table.Head>
					<Table.Head>description</Table.Head>
					<Table.Head>price</Table.Head>
					<!-- <Table.Head>images</Table.Head> -->
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginatedProducts as product, i (i)}
					<TableRow>
						<TableCell>{product.name}</TableCell>
						<TableCell>{product.description.slice(0, 20)}...</TableCell>
						<TableCell>{product.price}</TableCell>
						<!-- <TableCell>
								{#each product.images as image}
									<img src={image} alt={product.name} class="w-16 h-16 object-cover" />
								{/each}
							</TableCell> -->
						<TableCell>
							<AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]} variant="outline" class="ml-0 p-1 text-xs">
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
						</TableCell>
					</TableRow>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination Controls -->
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
