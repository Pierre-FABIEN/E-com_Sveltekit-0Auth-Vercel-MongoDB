<script lang="ts">
	import { onMount } from 'svelte';

	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import Checkbox from '$UITools/shadcn/checkbox/checkbox.svelte';
	import { Label } from '$UITools/shadcn/label';

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

	let DataPrice: number = 0;
	let images: string[] = [];

	const handleImageUpload = (event: Event) => {
		const files = (event.target as HTMLInputElement).files;
		if (files) {
			images = [];
			const promises = Array.from(files).map((file) => {
				return new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = (e) => {
						if (e.target) {
							resolve(e.target.result as string);
						} else {
							reject('Failed to read file');
						}
					};
					reader.readAsDataURL(file);
				});
			});

			Promise.all(promises).then((base64Images) => {
				images = base64Images;
				$createProductData.images = images;
			});
		}
	};

	$: $createProductData.categoryId = data.AllCategories.filter(
		(category: any) => category.checked
	).map((category: any) => category.id);

	$: $createProductData.price = Number(DataPrice);
</script>

<div class="ccc mt-5">
	<div class="w-[80vw]">
		<SuperDebug data={$createProductData} />
		<form method="POST" action="?/createProduct" use:createProductEnhance class="space-y-4">
			<div>
				<Form.Field name="name" form={createProduct}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$createProductData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="price" form={createProduct}>
					<Form.Control let:attrs>
						<Form.Label>price</Form.Label>
						<Input {...attrs} type="number" bind:value={DataPrice} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="images" form={createProduct}>
					<Form.Control let:attrs>
						<Form.Label>Images</Form.Label>
						<input type="file" multiple on:change={handleImageUpload} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="description" form={createProduct}>
					<Form.Control let:attrs>
						<Form.Label>description</Form.Label>
						<Input {...attrs} type="text" bind:value={$createProductData.description} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">categories</h4>
				<Form.Field name="categoryId" form={createProduct}>
					<Form.Control let:attrs>
						{#if data.AllCategories.length > 0}
							{#each data.AllCategories as category (category.id)}
								<div class="my-3 flex items-center space-x-2">
									<Checkbox id={category.id} bind:checked={category.checked} />
									<Label
										for={category.id}
										class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{category.name}
									</Label>
								</div>
							{/each}
						{:else}
							<p>No categories found.</p>
						{/if}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<input type="hidden" name="categoryId" bind:value={$createProductData.categoryId} />
			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</div>
</div>
