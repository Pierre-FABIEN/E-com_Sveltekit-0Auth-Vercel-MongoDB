<script lang="ts">
	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import Checkbox from '$UITools/shadcn/checkbox/checkbox.svelte';
	import { Label } from '$UITools/shadcn/label';

	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { updateProductSchema } from '$lib/ZodSchema/productSchema';

	export let data: {
		IupdateProductSchema: SuperValidated<Infer<typeof updateProductSchema>>;
		AllCategories: any[];
		AllProducts: any[];
	};

	const updateProduct = superForm(data.IupdateProductSchema, {
		validators: zodClient(updateProductSchema),
		id: 'updateProduct'
	});

	const {
		form: updateProductData,
		enhance: updateProductEnhance,
		message: updateProductMessage
	} = updateProduct;

	import * as Drawer from '$UITools/shadcn/drawer/index.js';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let userId: string;

	// Subscribe to the $page store to get the URL parameters
	$: userId = $page.params.userId;

	// Stores for product data
	const productData = writable({
		name: '',
		price: 0,
		images: [] as File[],
		description: '',
		categoryId: [] as string[]
	});

	// Function to initialize the stores with product data
	const initializeProductData = (userId: string) => {
		const product = data.AllProducts.find((product: any) => product.id === userId);
		if (product) {
			productData.set({
				name: product.name,
				price: product.price,
				images: product.images,
				description: product.description,
				categoryId: product.categories.map((category: any) => category.categoryId)
			});
			// Update the form data
			updateProductData.update((current) => ({
				...current,
				name: product.name,
				price: product.price,
				description: product.description,
				categoryId: product.categories.map((category: any) => category.categoryId)
			}));
		} else {
			console.error('Product not found for userId:', userId);
		}
	};

	// Initialize product data when the component is mounted
	onMount(() => {
		initializeProductData(userId);
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

	$: console.log($updateProductData, 'updateProductData');
	$: console.log($productData, 'productData');
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	action="?/updateProduct"
	use:updateProductEnhance
	class="space-y-4"
>
	<div class="ccs mt-5">
		<div class="w-[100%]">
			<Form.Field name="name" form={updateProduct}>
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} type="text" bind:value={$updateProductData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="w-[100%]">
			<Form.Field name="price" form={updateProduct}>
				<Form.Control let:attrs>
					<Form.Label>Price</Form.Label>
					<Input {...attrs} type="number" bind:value={$updateProductData.price} />
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

		<Drawer.Root>
			<Drawer.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">Open Drawer</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<div class="mx-auto w-full max-w-sm">
					<Drawer.Header>
						<Drawer.Title>Move Goal</Drawer.Title>
						<Drawer.Description>Set your daily activity goal.</Drawer.Description>
					</Drawer.Header>
					<div class="p-4 pb-0">
						<div class="flex items-center justify-center space-x-2">Les images ici</div>
					</div>
					<Drawer.Footer>
						<Button>Submit</Button>
						<Drawer.Close asChild let:builder>
							<Button builders={[builder]} variant="outline">Cancel</Button>
						</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>

		<div class="w-[100%]">
			<Form.Field name="description" form={updateProduct}>
				<Form.Control let:attrs>
					<Form.Label>Description</Form.Label>
					<Input {...attrs} type="text" bind:value={$updateProductData.description} />
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
									checked={$updateProductData.categoryId.includes(category.id)}
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
		<input type="hidden" name="categoryId" value={$updateProductData.categoryId.join(',')} />
	</div>
	<Button type="submit">Save changes</Button>
</form>
