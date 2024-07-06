<script lang="ts">
	import TableProduct from '$components/product/TableProduct.svelte';
	import TableCategories from '$components/categories/TableCategories.svelte';

	export let data;

	// const createCategory = superForm(data.IcreateCategorySchema, {
	// 	validators: zodClient(createCategorySchema),
	// 	id: 'createCategory'
	// });

	// const updateCategory = superForm(data.IupdateCategorySchema, {
	// 	validators: zodClient(updateCategorySchema),
	// 	id: 'updateCategory'
	// });

	// const deleteCategory = superForm(data.IdeleteCategorySchema, {
	// 	validators: zodClient(deleteCategorySchema),
	// 	id: 'deleteCategory'
	// });

	// const {
	// 	form: createCategoryData,
	// 	enhance: createCategoryEnhance,
	// 	message: createCategoryMessage
	// } = createCategory;

	// const {
	// 	form: updateCategoryData,
	// 	enhance: updateCategoryEnhance,
	// 	message: updateCategoryMessage
	// } = updateCategory;

	// const { enhance: deleteCategoryEnhance, message: deleteCategoryMessage } = deleteCategory;
</script>

<div class="rcs m-5">
	<div class="w-[70%] m-5">
		<TableProduct {data} />
	</div>

	<!-- <div class="w-[20%] m-5">
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
	</div> -->
</div>
