<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import TableProduct from '$components/product/TableProduct.svelte';
	import TableCategories from '$components/categories/TableCategories.svelte';

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
		message: createProductMessage
	} = createProduct;

	const {
		form: updateProductData,
		enhance: updateProductEnhance,
		message: updateProductMessage
	} = updateProduct;

	const { enhance: deleteProductEnhance, message: deleteProductMessage } = deleteProduct;

	const {
		form: createCategoryData,
		enhance: createCategoryEnhance,
		message: createCategoryMessage
	} = createCategory;

	const {
		form: updateCategoryData,
		enhance: updateCategoryEnhance,
		message: updateCategoryMessage
	} = updateCategory;

	const { enhance: deleteCategoryEnhance, message: deleteCategoryMessage } = deleteCategory;

	console.log(data, 'data');
	$: console.log('createCategoryData', $createCategoryData);
</script>

<div class="rcs m-5">
	<div class="w-[70%] m-5">
		<TableProduct
			{data}
			{createProduct}
			{createProductData}
			{createProductEnhance}
			{deleteProductEnhance}
			{updateProduct}
			{updateProductData}
			{updateProductEnhance}
		/>
	</div>

	<div class="w-[20%] m-5">
		<TableCategories
			{data}
			{createCategory}
			{createCategoryData}
			{createCategoryEnhance}
			{deleteCategoryEnhance}
			{updateCategory}
			{updateCategoryData}
			{updateCategoryEnhance}
		/>
	</div>
</div>
