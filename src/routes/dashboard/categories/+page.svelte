<script lang="ts">
	import { Button } from '$UITools/shadcn/button';
	import * as Sheet from '$UITools/shadcn/sheet/index.js';
	import * as Table from '$UITools/shadcn/table';
	import TableRow from '$UITools/shadcn/table/table-row.svelte';
	import TableCell from '$UITools/shadcn/table/table-cell.svelte';
	import * as AlertDialog from '$UITools/shadcn//alert-dialog';
	import { Input } from '$UITools/shadcn/input';

	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import PlusCircledIcon from 'svelte-radix/PlusCircled.svelte';

	import { deleteCategorySchema } from '$lib/ZodSchema/categorySchema';
	import { showNotification } from '$stores/Data/notificationStore';

	import { Toggle } from '$UITools/shadcn/toggle';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: any;

	const deleteCategory = superForm(data.IdeleteCategorySchema, {
		validators: zodClient(deleteCategorySchema),
		id: 'deleteCategory'
	});

	const { enhance: deleteCategoryEnhance, message: deleteCategoryMessage } = deleteCategory;

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

	$: if ($deleteCategoryMessage)
		showNotification(
			$deleteCategoryMessage,
			$deleteCategoryMessage.includes('success') ? 'success' : 'error'
		);

	$: if ($deleteCategoryMessage) {
		console.log('showNotification');
	}
</script>

<div class="rcs m-5">
	<div class="w-[100%] m-5">
		<div class="border p-2">
			<h1 class="my-5">Category</h1>
			<div class="rcb mb-5">
				<Input
					type="text"
					placeholder="Cherchez un categorie"
					class="max-w-xs"
					bind:value={searchQuery}
				/>
				<a
					href="/dashboard/categories/create"
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
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each paginatedCategories as category, i (i)}
							<TableRow>
								<TableCell>{category.name}</TableCell>
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
													This action cannot be undone. This will permanently delete your account
													and remove your data from our servers.
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

									<Button variant="outline" class="m-1 p-1 text-xs">
										<a href="/dashboard/categories/{category.id}">
											<PencilIcon class="h-4 w-8" />
										</a>
									</Button>
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
	</div>
</div>
