<script lang="ts">
	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import Checkbox from '$UITools/shadcn/checkbox/checkbox.svelte';
	import { Label } from '$UITools/shadcn/label';

	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm, filesProxy } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { createProductSchema } from '$lib/ZodSchema/productSchema';

	export let data: {
		IcreateProductSchema: SuperValidated<Infer<typeof createProductSchema>>;
		AllCategories: any;
		AllProducts: any;
	};

	console.log(data);

	const createProduct = superForm(data.IcreateProductSchema, {
		validators: zodClient(createProductSchema),
		id: 'createProduct'
	});

	const {
		form: createProductData,
		enhance: createProductEnhance,
		message: createProductMessage
	} = createProduct;

	let DataPrice: number = 0;

	const files = filesProxy(createProduct, 'images');

	// Mettre à jour les IDs de catégories sélectionnées
	$: $createProductData.categoryId = data.AllCategories.filter(
		(category: any) => category.checked
	).map((category: any) => category.id);

	$: $createProductData.price = Number(DataPrice);

	$: console.log($createProductData.categoryId, '$createProductData.categoryId');
</script>

<div class="rcs m-5">
	<SuperDebug data={$createProductData} />
	<form
		method="POST"
		enctype="multipart/form-data"
		action="?/createProduct"
		use:createProductEnhance
		class="space-y-4"
	>
		<div class="w-[100%]">
			<Form.Field name="name" form={createProduct}>
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} type="text" bind:value={$createProductData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="w-[100%]">
			<Form.Field name="price" form={createProduct}>
				<Form.Control let:attrs>
					<Form.Label>Price</Form.Label>
					<Input {...attrs} type="number" bind:value={DataPrice} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="w-[100%]">
			<Form.Field name="images" form={createProduct}>
				<Form.Control let:attrs>
					<Form.Label>Images</Form.Label>
					<input
						type="file"
						multiple
						name="images"
						accept="image/png, image/jpeg"
						bind:files={$files}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="w-[100%]">
			<Form.Field name="description" form={createProduct}>
				<Form.Control let:attrs>
					<Form.Label>Description</Form.Label>
					<Input {...attrs} type="text" bind:value={$createProductData.description} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="w-[100%]">
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

		<Button type="submit">Save changes</Button>
	</form>
</div>
