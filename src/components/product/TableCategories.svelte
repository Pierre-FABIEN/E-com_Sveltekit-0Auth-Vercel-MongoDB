<script lang="ts">
	import { Button } from '$UITools/shadcn/button';
	import * as Sheet from '$UITools/shadcn/sheet/index.js';
	import * as Table from '$UITools/shadcn/table';
	import TableRow from '$UITools/shadcn/table/table-row.svelte';
	import TableCell from '$UITools/shadcn/table/table-cell.svelte';
	import * as AlertDialog from '$UITools/shadcn//alert-dialog';
	//import CreateCategory from './CreateCategory.svelte';
	import { Input } from '$UITools/shadcn/input';
	import PencilIcon from 'svelte-radix/Pencil1.svelte';

	import Trash from 'svelte-radix/Trash.svelte';
	//import EditCategory from './EditCategory.svelte';

	export let data: any;
	export let createCategoryEnhance;

	export let createCategory;
	export let createCategoryData;
	export let deleteCategoryEnhance;

	export let updateCategory;
	export let updateCategoryData;
	export let updateCategoryEnhance;

	// Nouvelle variable pour le texte de recherche
	let searchQuery: string = '';

	// Pagination variables
	let currentPage: number = 1;
	let itemsPerPage: number = 5;

	// Fonction pour filtrer les categories
	$: filteredCategories = data.AllCategories.filter((category: any) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Fonction pour paginer les categories
	$: paginatedCategories = filteredCategories.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Fonction pour changer de page
	function changePage(page: number) {
		currentPage = page;
	}
</script>

<div class="border p-2">
	<h1 class="my-5">Category</h1>
	<div class="rcb mb-5">
		<Input
			type="text"
			placeholder="Cherchez un categorie"
			class="max-w-xs"
			bind:value={searchQuery}
		/>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">Créer un categorie</Button>
			</Sheet.Trigger>
			<!-- <CreateCategory {data} {createCategoryEnhance} {createCategory} {createCategoryData} /> -->
		</Sheet.Root>
	</div>
	<div class="border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>name</Table.Head>
					<!-- <Table.Head>images</Table.Head> -->
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginatedCategories as category, i (i)}
					<TableRow>
						<TableCell>{category.name}</TableCell>
						<!-- <TableCell>{category.description.slice(0, 20)}...</TableCell> -->
						<!-- <TableCell>{category.price}</TableCell> -->
						<!-- <TableCell>
								{#each category.images as image}
									<img src={image} alt={category.name} class="w-16 h-16 object-cover" />
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
										<form method="POST" action="?/deleteCategory" use:deleteCategoryEnhance>
											<input type="hidden" name="categoryId" value={category.id} />
											<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</TableCell>

						<TableCell>
							<Sheet.Root>
								<Sheet.Trigger asChild let:builder>
									<Button builders={[builder]} variant="outline" class="ml-0 p-1 text-xs">
										<PencilIcon class="h-4 w-8" />
									</Button>
								</Sheet.Trigger>
								<!-- <EditCategory
									{data}
									{category}
									{updateCategory}
									{updateCategoryData}
									{updateCategoryEnhance}
								/> -->
							</Sheet.Root>
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
			{#each Array(Math.ceil(filteredCategories.length / itemsPerPage)) as _, pageIndex}
				<Button class="mx-1" on:click={() => changePage(pageIndex + 1)}>{pageIndex + 1}</Button>
			{/each}
		</div>
		{#if currentPage < Math.ceil(filteredCategories.length / itemsPerPage)}
			<Button on:click={() => changePage(currentPage + 1)}>Next</Button>
		{/if}
	</div>
</div>
