<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$UITools/shadcn/button';
	import * as Table from '$UITools/shadcn/table';
	import TableRow from '$UITools/shadcn/table/table-row.svelte';
	import TableCell from '$UITools/shadcn/table/table-cell.svelte';
	import * as AlertDialog from '$UITools/shadcn/alert-dialog';
	import { Input } from '$UITools/shadcn/input';
	import { Toggle } from '$UITools/shadcn/toggle';
	import * as Select from '$UITools/shadcn/select';

	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import PlusCircledIcon from 'svelte-radix/PlusCircled.svelte';

	import { deleteCategorySchema } from '$lib/ZodSchema/categorySchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	export let data: any;

	const deleteCategory = superForm(data.IdeleteCategorySchema, {
		validators: zodClient(deleteCategorySchema),
		id: 'deleteCategory'
	});

	const { enhance: deleteCategoryEnhance, message: deleteCategoryMessage } = deleteCategory;

	// New variable for search text
	let searchQuery: string = '';

	// Pagination variables
	let currentPage: number = 1;
	let itemsPerPage: number = 5;

	const optionPage = [
		{ label: '5', value: 5 },
		{ label: '10', value: 10 },
		{ label: '15', value: 15 },
		{ label: '20', value: 20 }
	];

	// Sorting variables
	let sortColumn: string = '';
	let sortDirection: string = 'asc';

	// Function to sort categories
	const sortCategories = (column: string) => {
		console.log('sortCategories called with column:', column);
		if (sortColumn === column) {
			// Toggle sort direction
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// Set new sort column
			sortColumn = column;
			sortDirection = 'asc';
		}

		// Sort categories
		data.AllCategories.sort((a: any, b: any) => {
			let aValue = a[column];
			let bValue = b[column];

			if (typeof aValue === 'string') {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (aValue < bValue) {
				return sortDirection === 'asc' ? -1 : 1;
			}
			if (aValue > bValue) {
				return sortDirection === 'asc' ? 1 : -1;
			}
			return 0;
		});

		// Update filtered and paginated categories
		updateFilteredAndPaginatedCategories();

		console.log('sorted categories:', data.AllCategories); // Log to check the sorting result
	};

	// Function to filter and paginate categories
	const updateFilteredAndPaginatedCategories = () => {
		filteredCategories = data.AllCategories.filter((category: any) =>
			category.name.toLowerCase().includes(searchQuery.toLowerCase())
		);

		paginatedCategories = filteredCategories.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage
		);
	};

	// Initialize filtered and paginated categories
	let filteredCategories = [];
	let paginatedCategories = [];

	// Initialize filtered and paginated categories from initial data
	updateFilteredAndPaginatedCategories();

	// Function to change page
	function changePage(page: number) {
		currentPage = page;
		updateFilteredAndPaginatedCategories();
	}

	// Function to change items per page
	function changeItemsPerPage(items: number) {
		itemsPerPage = items;
		currentPage = 1; // Reset to first page
		updateFilteredAndPaginatedCategories();
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

	// React to delete message changes
	$: if ($deleteCategoryMessage) {
		updateFilteredAndPaginatedCategories();
		showNotification(
			$deleteCategoryMessage,
			$deleteCategoryMessage.includes('success') ? 'success' : 'error'
		);
	}
</script>

<div class="rcs m-5">
	<div class="w-[100%] m-5">
		<div class="border p-2">
			<h1 class="my-5 text-xl">Produits</h1>
			<div class="rcb mb-5">
				<Input
					type="text"
					placeholder="Cherchez un produit"
					class="max-w-xs"
					bind:value={searchQuery}
				/>
				<div class="rcc nowrap">
					<div class="ccc">
						<Select.Root portal={null}>
							<Select.Trigger class="w-[150px]">
								<Select.Value placeholder="Items par page" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Pages</Select.Label>
									{#each optionPage as option}
										<Select.Item
											value={option.value}
											on:click={() => changeItemsPerPage(option.value)}>{option.label}</Select.Item
										>
									{/each}
								</Select.Group>
							</Select.Content>
							<Select.Input name="itemsPerPage" />
						</Select.Root>
					</div>

					<a
						href="/dashboard/categories/create"
						class="group relative inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md"
					>
						<Toggle>
							<span class="hidden">Créer un produit</span>
							<PlusCircledIcon class="w-7 h-7" />
						</Toggle>
					</a>
				</div>
			</div>
			<div class="border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="border-r-[1px] border-r-[#1e293b] rounded-none pr-[5px]">
								<div class="rcb">
									name
									<button on:click={() => sortCategories('name')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>

							<Table.Head class="border-r-[1px] border-r-[#1e293b] rounded-none pr-[5px]">
								<div class="rcb">
									date de création
									<button on:click={() => sortCategories('createdAt')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>

							<Table.Head
								class="w-[150px] text-center border-r-[1px] border-r-[#1e293b] rounded-none pr-[5px]"
							>
								<div class="rcb">Edition</div>
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each paginatedCategories as category, i (i)}
							<TableRow>
								<TableCell>{category.name}</TableCell>
								<TableCell>{formatDate(category.createdAt)}</TableCell>

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
