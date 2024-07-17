<script lang="ts">
	import { Button } from '$shadcn/button';
	import * as Table from '$shadcn/table';
	import TableRow from '$shadcn/table/table-row.svelte';
	import TableCell from '$shadcn/table/table-cell.svelte';
	import { Input } from '$shadcn/input';
	import * as Select from '$shadcn/select';
	import { Toggle } from '$shadcn/toggle';
	import * as AlertDialog from '$shadcn/alert-dialog';

	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import PlusCircledIcon from 'svelte-radix/PlusCircled.svelte';
	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import Trash from 'svelte-radix/Trash.svelte';

	export let columns: Array<{ key: string; label: string }>;
	export let data: any = [];
	export let deleteActionUrl: string = '';
	export let editActionUrl: string = '';
	export let newActionUrl: string = '';
	export let name: string = '';
	export let message: any;
	export let enhance: (form: HTMLFormElement) => void = () => {};

	// Variable for search text
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

	// Function to sort items
	const sortItems = (column: string) => {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}

		data.sort((a: any, b: any) => {
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

		updateFilteredAndPaginatedItems();
	};

	// Function to filter and paginate items
	const updateFilteredAndPaginatedItems = () => {
		filteredItems = data.filter((item: any) =>
			Object.values(item).some((value) =>
				String(value).toLowerCase().includes(searchQuery.toLowerCase())
			)
		);

		paginatedItems = filteredItems.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage
		);
	};

	// Initialize filtered and paginated items
	let filteredItems = [];
	let paginatedItems: any[] = [];

	// Initialize filtered and paginated items from initial data
	updateFilteredAndPaginatedItems();

	// Function to change page
	function changePage(page: number) {
		currentPage = page;
		updateFilteredAndPaginatedItems();
	}

	// Function to change items per page
	function changeItemsPerPage(items: number) {
		itemsPerPage = items;
		currentPage = 1; // Reset to first page
		updateFilteredAndPaginatedItems();
	}

	// Function to delete an item
	const deleteItem = (id: string) => {
		data = data.filter((item) => item.id !== id);
		updateFilteredAndPaginatedItems();
	};
</script>

<div class="rcs w-[100%]">
	<div class="w-[100%]">
		<div class="border p-2">
			<h2 class="text-2xl font-bold mb-5">{name}</h2>
			<div class="rcb mb-5 w-[100%]">
				<Input
					type="text"
					placeholder="Cherchez dans le tableau"
					class="max-w-xs"
					bind:value={searchQuery}
					on:input={updateFilteredAndPaginatedItems}
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
					{#if newActionUrl}
						<a
							data-sveltekit-preload-data
							href={newActionUrl}
							class="group relative inline-flex items-center mx-5 space-x-2 border border-transparent text-sm font-medium rounded-md"
						>
							<Toggle>
								<span class="hidden">Créer un produit</span>
								<PlusCircledIcon class="w-7 h-7" />
							</Toggle>
						</a>
					{/if}
				</div>
			</div>
			<div class="border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							{#each columns as column}
								<Table.Head class="border-r-[1px] border-r-[#1e293b] rounded-none pr-[5px]">
									<div class="rcb">
										{column.label}
										<button on:click={() => sortItems(column.key)}>
											<ChevronDown class="cursor-pointer" />
										</button>
									</div>
								</Table.Head>
							{/each}
							{#if editActionUrl || deleteActionUrl}
								<Table.Head
									class="w-[150px] text-center border-r-[1px] border-r-[#1e293b] rounded-none pr-[5px]"
								>
									Actions
								</Table.Head>
							{/if}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each paginatedItems as item, i (i)}
							<TableRow>
								{#each columns as column}
									<TableCell>{item[column.key]}</TableCell>
								{/each}
								{#if editActionUrl || deleteActionUrl}
									<TableCell class="rce">
										{#if editActionUrl}
											<Button variant="outline" class="m-1 p-1 text-xs">
												<a data-sveltekit-preload-data href={`${editActionUrl}${item.id}`}>
													<PencilIcon class="h-4 w-8" />
												</a>
											</Button>
										{/if}
										{#if deleteActionUrl}
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
															This action cannot be undone. This will permanently delete the item.
														</AlertDialog.Description>
													</AlertDialog.Header>
													<AlertDialog.Footer>
														<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
														<form
															method="POST"
															action={deleteActionUrl}
															use:enhance
															on:submit={() => deleteItem(item.id)}
														>
															<input type="hidden" name="id" value={item.id} />
															<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
														</form>
													</AlertDialog.Footer>
												</AlertDialog.Content>
											</AlertDialog.Root>
										{/if}
									</TableCell>
								{/if}
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
					{#each Array(Math.ceil(filteredItems.length / itemsPerPage)) as _, pageIndex}
						<Button class="mx-1" on:click={() => changePage(pageIndex + 1)}>{pageIndex + 1}</Button>
					{/each}
				</div>
				{#if currentPage < Math.ceil(filteredItems.length / itemsPerPage)}
					<Button on:click={() => changePage(currentPage + 1)}>Next</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
