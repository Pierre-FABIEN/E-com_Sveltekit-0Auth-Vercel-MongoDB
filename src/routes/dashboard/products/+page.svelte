<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$UITools/shadcn/button';
	import * as Table from '$UITools/shadcn/table';
	import TableRow from '$UITools/shadcn/table/table-row.svelte';
	import TableCell from '$UITools/shadcn/table/table-cell.svelte';
	import * as AlertDialog from '$UITools/shadcn/alert-dialog';
	import { Input } from '$UITools/shadcn/input';
	import { Badge } from '$UITools/shadcn/badge';
	import { Toggle } from '$UITools/shadcn/toggle';

	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import PlusCircledIcon from 'svelte-radix/PlusCircled.svelte';

	import { deleteProductSchema } from '$lib/ZodSchema/productSchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

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

	// Variables pour le tri
	let sortColumn: string = '';
	let sortDirection: string = 'asc';

	// Fonction pour trier les produits
	const sortProducts = (column: string) => {
		console.log('sortProducts called with column:', column);
		if (sortColumn === column) {
			// Inverser la direction du tri
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// Définir la nouvelle colonne de tri
			sortColumn = column;
			sortDirection = 'asc';
		}

		// Trier les produits
		data.AllProducts.sort((a: any, b: any) => {
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

		// Mettre à jour les produits filtrés et paginés
		updateFilteredAndPaginatedProducts();

		console.log('sorted products:', data.AllProducts); // Log pour vérifier le résultat du tri
	};

	// Fonction pour filtrer et paginer les produits
	const updateFilteredAndPaginatedProducts = () => {
		filteredProducts = data.AllProducts.filter((product: any) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase())
		);

		paginatedProducts = filteredProducts.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage
		);
	};

	// Initialisation des produits filtrés et paginés
	let filteredProducts = [];
	let paginatedProducts = [];

	// Initialisation des produits filtrés et paginés à partir des données initiales
	updateFilteredAndPaginatedProducts();

	// Fonction pour changer de page
	function changePage(page: number) {
		currentPage = page;
		updateFilteredAndPaginatedProducts();
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

	// Réagir aux changements de message de suppression
	$: if ($deleteProductMessage)
		showNotification(
			$deleteProductMessage,
			$deleteProductMessage.includes('success') ? 'success' : 'error'
		);
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
							<Table.Head>
								<div
									style="border-right: 1px solid rgb(30, 41, 59); border-radius: 0px; padding-right: 5px"
									class="rcb"
								>
									stock
									<button on:click={() => sortProducts('stock')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>
							<Table.Head>
								<div
									style="border-right: 1px solid rgb(30, 41, 59); border-radius: 0px; padding-right: 5px"
									class="rcb"
								>
									name
									<button on:click={() => sortProducts('name')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>
							<Table.Head>
								<div
									style="border-right: 1px solid rgb(30, 41, 59); border-radius: 0px; padding-right: 5px"
									class="rcb"
								>
									price
									<button on:click={() => sortProducts('price')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>
							<Table.Head>
								<div
									style="border-right: 1px solid rgb(30, 41, 59); border-radius: 0px; padding-right: 5px"
									class="rcb"
								>
									catégories
									<button on:click={() => sortProducts('categories')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>
							<Table.Head>
								<div
									style="border-right: 1px solid rgb(30, 41, 59); border-radius: 0px; padding-right: 5px"
									class="rcb"
								>
									images
									<button on:click={() => sortProducts('images')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>
							<Table.Head>
								<div
									style="border-right: 1px solid rgb(30, 41, 59); border-radius: 0px; padding-right: 5px"
									class="rcb"
								>
									description
									<button on:click={() => sortProducts('description')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>

							<Table.Head>
								<div
									style="border-right: 1px solid rgb(30, 41, 59); border-radius: 0px; padding-right: 5px"
									class="rcb"
								>
									date de création
									<button on:click={() => sortProducts('createdAt')}>
										<ChevronDown class="cursor-pointer" />
									</button>
								</div>
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each paginatedProducts as product, i (i)}
							<TableRow>
								<TableCell>{product.stock}</TableCell>
								<TableCell>{product.name}</TableCell>
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
								<TableCell>{product.description.slice(0, 20)}...</TableCell>
								<TableCell>{formatDate(product.createdAt)}</TableCell>

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
	</div>
</div>
