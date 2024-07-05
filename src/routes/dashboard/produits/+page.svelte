<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$UITools/shadcn/button';
	import * as Sheet from '$UITools/shadcn/sheet/index.js';
	import * as Table from '$UITools/shadcn/table';
	import TableRow from '$UITools/shadcn/table/table-row.svelte';
	import TableCell from '$UITools/shadcn/table/table-cell.svelte';
	import CreateProduct from './CreateProduct.svelte';
	import { Input } from '$UITools/shadcn/input';

	import {
		createProductSchema,
		updateProductSchema,
		deleteProductSchema
	} from '$lib/ZodSchema/productSchema';

	import {
		createCategorySchema,
		updateCategorySchema,
		deleteCategorySchema
	} from '$lib/ZodSchema/categorySchema';

	export let data: {
		IcreateProductSchema: SuperValidated<Infer<typeof createProductSchema>>;
		IupdateProductSchema: SuperValidated<Infer<typeof updateProductSchema>>;
		IdeleteProductSchema: SuperValidated<Infer<typeof deleteProductSchema>>;

		IcreateCategorySchema: SuperValidated<Infer<typeof createCategorySchema>>;
		IupdateCategorySchema: SuperValidated<Infer<typeof updateCategorySchema>>;
		IdeleteCategorySchema: SuperValidated<Infer<typeof deleteCategorySchema>>;
		AllCategories: typeof updateCategorySchema;
		AllProducts: any;
	};

	const createProduct = superForm(data.IcreateProductSchema, {
		validators: zodClient(createProductSchema),
		id: 'createProduct'
	});

	const updateProduct = superForm(data.IupdateProductSchema, {
		validators: zodClient(updateProductSchema),
		id: 'updateProduct'
	});

	const deleteProduct = superForm(data.IdeleteProductSchema, {
		validators: zodClient(deleteProductSchema),
		id: 'deleteProduct'
	});

	const createCategory = superForm(data.IcreateCategorySchema, {
		validators: zodClient(createCategorySchema),
		id: 'createCategory'
	});

	const updateCategory = superForm(data.IupdateCategorySchema, {
		validators: zodClient(updateCategorySchema),
		id: 'updateCategory'
	});

	const deleteCategory = superForm(data.IdeleteCategorySchema, {
		validators: zodClient(deleteCategorySchema),
		id: 'deleteCategory'
	});

	const {
		form: createProductData,
		enhance: createProductEnhance,
		message: createProductMessage,
		validate: createProductValidate
	} = createProduct;

	const {
		form: updateProductData,
		enhance: updateProductEnhance,
		message: updateProductMessage,
		validate: updateProductValidate
	} = updateProduct;

	const { enhance: deleteProductEnhance, message: deleteProductMessage } = deleteProduct;

	const {
		form: createCategoryData,
		enhance: createCategoryEnhance,
		message: createCategoryMessage,
		validate: createCategoryValidate
	} = createCategory;

	const {
		form: updateCategoryData,
		enhance: updateCategoryEnhance,
		message: updateCategoryMessage,
		validate: updateCategoryValidate
	} = updateCategory;

	const { enhance: deleteCategoryEnhance, message: deleteCategoryMessage } = deleteCategory;

	// Nouvelle variable pour le texte de recherche
	let searchQuery: string = '';

	// Pagination variables
	let currentPage: number = 1;
	let itemsPerPage: number = 10;

	// Fonction pour filtrer les produits
	$: filteredProducts = data.AllProducts.filter((product) =>
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
</script>

<div class="ccc">
	<div class="w-[80vw]">
		<div class="rcb">
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

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>name</Table.Head>
					<Table.Head>description</Table.Head>
					<Table.Head>price</Table.Head>
					<Table.Head>images</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each paginatedProducts as product, i (i)}
					<TableRow>
						<TableCell>{product.name}</TableCell>
						<TableCell>{product.description}</TableCell>
						<TableCell>{product.price}</TableCell>
						<!-- <TableCell>
							{#each product.images as image}
								<img src={image} alt={product.name} class="w-16 h-16 object-cover" />
							{/each}
						</TableCell> -->
					</TableRow>
				{/each}
			</Table.Body>
		</Table.Root>

		<!-- Pagination Controls -->
		<div class="pagination-controls mt-4">
			{#if currentPage > 1}
				<Button on:click={() => changePage(currentPage - 1)}>Previous</Button>
			{/if}

			{#each Array(Math.ceil(filteredProducts.length / itemsPerPage)) as _, pageIndex}
				<Button class="mx-1" on:click={() => changePage(pageIndex + 1)}>{pageIndex + 1}</Button>
			{/each}

			{#if currentPage < Math.ceil(filteredProducts.length / itemsPerPage)}
				<Button on:click={() => changePage(currentPage + 1)}>Next</Button>
			{/if}
		</div>
	</div>
</div>
