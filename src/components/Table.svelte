<script lang="ts">
	import { Button } from '$shadcn/button';
	import * as Table from '$shadcn/table';
	import TableRow from '$shadcn/table/table-row.svelte';
	import TableCell from '$shadcn/table/table-cell.svelte';
	import { Input } from '$shadcn/input';
	import * as Select from '$shadcn/select';

	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	export let columns: Array<{ key: string; label: string }>;
	export let data: any = [];

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
	let paginatedItems = [];

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
</script>

<div class="rcs w-[100%]">
	<div class="w-[100%]">
		<div class="border p-2">
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
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each paginatedItems as item, i (i)}
							<TableRow>
								{#each columns as column}
									<TableCell>{item[column.key]}</TableCell>
								{/each}
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
