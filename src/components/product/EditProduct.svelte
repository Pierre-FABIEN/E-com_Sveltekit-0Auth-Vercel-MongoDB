<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { filesProxy } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import Checkbox from '$UITools/shadcn/checkbox/checkbox.svelte';
	import { Label } from '$UITools/shadcn/label';
	import * as Sheet from '$UITools/shadcn/sheet/index.js';

	export let data;
	export let product;
	export let updateProduct;
	export let updateProductEnhance;
	export let updateProductData;

	// Stores for product data
	const productData = writable({
		name: '',
		price: 0,
		images: [] as File[],
		description: '',
		categoryId: [] as string[]
	});

	// Function to initialize the stores with product data
	const initializeProductData = () => {
		productData.set({
			name: product.name,
			price: product.price,
			images: product.images,
			description: product.description,
			categoryId: product.categories.map((category: any) => category.categoryId)
		});
	};

	// Initialize product data when the component is mounted
	onMount(() => {
		initializeProductData();
	});

	// Helper function to check if a category is selected
	const isCategorySelected = (categoryId: string) => {
		let selected = false;
		productData.update((current) => {
			selected = current.categoryId.includes(categoryId);
			return current;
		});
		return selected;
	};

	// Helper function to toggle category selection
	const toggleCategory = (categoryId: string) => {
		productData.update((current) => {
			if (current.categoryId.includes(categoryId)) {
				return {
					...current,
					categoryId: current.categoryId.filter((id) => id !== categoryId)
				};
			} else {
				return {
					...current,
					categoryId: [...current.categoryId, categoryId]
				};
			}
		});
	};

	// Function to handle file input change
	// Function to handle file input change
	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const filesArray = Array.from(input.files);
			productData.update((current) => ({
				...current,
				images: filesArray
			}));
		}
	};

	$: updateProductData = productData;
	$: console.log($updateProductData, 'updateProductData');
</script>

<Sheet.Content side="right">
	<form
		method="POST"
		enctype="multipart/form-data"
		action="?/updateProduct"
		use:updateProductEnhance
		class="space-y-4"
	>
		<Sheet.Header>
			<Sheet.Title>Edit product</Sheet.Title>
			<Sheet.Description>
				Make changes to your product here. Click save when you're done.
			</Sheet.Description>
		</Sheet.Header>
		<div class="ccs mt-5">
			<div class="w-[100%]">
				<Form.Field name="name" form={updateProduct}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$productData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="w-[100%]">
				<Form.Field name="price" form={updateProduct}>
					<Form.Control let:attrs>
						<Form.Label>Price</Form.Label>
						<Input {...attrs} type="number" bind:value={$productData.price} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="w-[100%]">
				<Form.Field name="images" form={updateProduct}>
					<Form.Control let:attrs>
						<Form.Label>Images</Form.Label>
						<input
							type="file"
							multiple
							name="images"
							accept="image/png, image/jpeg"
							on:change={handleFileChange}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="w-[100%]">
				<Form.Field name="description" form={updateProduct}>
					<Form.Control let:attrs>
						<Form.Label>Description</Form.Label>
						<Input {...attrs} type="text" bind:value={$productData.description} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="w-[100%]">
				<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Categories</h4>
				<Form.Field name="categoryId" form={updateProduct}>
					<Form.Control let:attrs>
						{#if data.AllCategories.length > 0}
							{#each data.AllCategories as category (category.id)}
								<div class="my-3 flex items-center space-x-2">
									<Checkbox
										id={category.id}
										checked={isCategorySelected(category.id)}
										on:click={() => toggleCategory(category.id)}
									/>
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
			<input type="hidden" name="categoryId" value={$productData.categoryId.join(',')} />
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]} type="submit">Save changes</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</form>
</Sheet.Content>
