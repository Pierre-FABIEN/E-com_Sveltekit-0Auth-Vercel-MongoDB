<script lang="ts">
	// Import necessary modules and components
	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import Checkbox from '$UITools/shadcn/checkbox/checkbox.svelte';
	import { Label } from '$UITools/shadcn/label';
	import * as Drawer from '$UITools/shadcn/drawer/index.js';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateProductSchema } from '$lib/ZodSchema/productSchema';
	import { Textarea } from '$UITools/shadcn/textarea';
	import { showNotification } from '$stores/Data/notificationStore';
	import { goto } from '$app/navigation';

	// Define the data type for the input data
	export let data: {
		IupdateProductSchema: SuperValidated<Infer<typeof updateProductSchema>>;
		AllCategories: any[];
		AllProducts: any[];
	};

	// Define the Product type
	type Product = {
		_id: string;
		name: string;
		price: number;
		description: string;
		categoryId: string[];
		images: (string | File)[];
	};

	// Initialize the form with validation
	const updateProduct = superForm(data.IupdateProductSchema, {
		validators: zodClient(updateProductSchema),
		id: 'updateProduct'
	});

	const {
		form: updateProductData,
		enhance: updateProductEnhance,
		message: updateProductMessage
	} = updateProduct;

	let productId: string;
	productId = $page.params.productId;

	let images: (string | File)[] = [];
	let initialImages: string[] = [];

	// Function to add images
	const addImage = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const newFiles = Array.from(input.files);
			images = [...images, ...newFiles];
			$updateProductData.images = images;
		}
	};

	// Function to remove images
	const removeImage = (index: number) => {
		images = images.filter((_, i) => i !== index);
		$updateProductData.images = images;
	};

	// Function to handle form submission
	const handleSubmit = (event: Event) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		// Filter current images and identify deleted images
		const currentImages = images.filter((img) => typeof img === 'string') as string[];
		const deletedImages = initialImages.filter((img) => !currentImages.includes(img));

		// Append images to formData
		images.forEach((image) => {
			if (typeof image === 'string') {
				formData.append('images', image);
			} else {
				formData.append('images', image);
			}
		});
		formData.append('deletedImages', JSON.stringify(deletedImages));

		// Append other form fields with correct type conversion
		formData.append('name', $updateProductData.name);
		formData.append('price', $updateProductData.price.toString());
		formData.append('description', $updateProductData.description);

		// Submit the form data
		fetch(event.target.action, {
			method: 'POST',
			body: formData
		})
			.then((response) => {
				console.log(response, 'updateProductResponse');
				// showNotification('Product updated successfully.', 'success');
				// setTimeout(() => goto('/dashboard/products/'), 2000);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// Initialize the component on mount
	onMount(() => {
		images = $updateProductData.images;
		initialImages = images.filter((img) => typeof img === 'string') as string[];
	});

	// Handle price change
	const handlePriceChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		updateProductData.update((data) => {
			data.price = parseFloat(target.value);
			return data;
		});
	};

	$: console.log($updateProductMessage, 'updateProductMessage');
</script>

<div class="ccc">
	<div class="m-5 p-5 border w-[400px]">
		<form
			method="POST"
			enctype="multipart/form-data"
			action="?/updateProduct"
			use:updateProductEnhance
			class="space-y-4"
			on:submit={handleSubmit}
		>
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
						<Input
							{...attrs}
							type="number"
							bind:value={$updateProductData.price}
							on:input={handlePriceChange}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="w-[100%]">
				<Form.Field name="images" form={updateProduct}>
					<Form.Control let:attrs>
						<Drawer.Root>
							<Drawer.Trigger asChild let:builder>
								<Button builders={[builder]} variant="outline">Manage Photos</Button>
							</Drawer.Trigger>
							<Drawer.Content>
								<div class="mx-auto w-full">
									<Drawer.Header>
										<Drawer.Title>Manage Photos</Drawer.Title>
										<Drawer.Description>Upload and manage your product photos.</Drawer.Description>
									</Drawer.Header>
									<div class="p-4 pb-0 flex flex-row w-full space-x-4">
										<div
											class="ccc w-[300px] h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg relative"
										>
											<input
												type="file"
												multiple
												accept="image/png, image/jpeg"
												on:change={addImage}
												class="absolute opacity-0 w-full h-full cursor-pointer z-10"
											/>
											<div class="text-center pointer-events-none">
												<svg
													class="mx-auto h-12 w-12 text-gray-400"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
													aria-hidden="true"
												>
													<path
														d="M28 8H20v12H8v8h12v12h8V28h12v-8H28V8z"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
												</svg>
												<div class="mt-2 text-sm text-gray-600">
													<label
														class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
														for="file-input"
													>
														<span>Upload a file</span>
													</label>
												</div>
												<p class="text-xs text-gray-500">PNG, JPG up to 100kB</p>
											</div>
										</div>
										<div class="mt-3 flex flex-wrap gap-2 flex-1">
											{#each images as image, index}
												<div class="relative w-[100px] h-[100px]">
													{#if typeof image === 'string'}
														<img src={image} alt="" class="w-full h-full object-cover rounded" />
													{:else}
														<img
															src={URL.createObjectURL(image)}
															alt=""
															class="w-full h-full object-cover rounded"
														/>
													{/if}
													<button
														class="w-[32px] h-[32px] absolute top-0 right-0 p-1 bg-red-500 text-white"
														on:click={() => removeImage(index)}>X</button
													>
												</div>
											{/each}
										</div>
									</div>
									<Drawer.Footer>
										<Drawer.Close asChild let:builder>
											<Button builders={[builder]} variant="outline">Close</Button>
										</Drawer.Close>
									</Drawer.Footer>
								</div>
							</Drawer.Content>
						</Drawer.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="w-[100%]">
				<Form.Field name="description" form={updateProduct}>
					<Form.Control let:attrs>
						<Form.Label>Description</Form.Label>
						<Textarea {...attrs} bind:value={$updateProductData.description} />
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
										on:click={() => {
											const index = $updateProductData.categoryId.indexOf(category.id);
											if (index === -1) {
												$updateProductData.categoryId = [
													...$updateProductData.categoryId,
													category.id
												];
											} else {
												$updateProductData.categoryId = $updateProductData.categoryId.filter(
													(id) => id !== category.id
												);
											}
										}}
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
			<input type="hidden" name="categoryId" bind:value={$updateProductData.categoryId} />
			<input type="hidden" name="_id" value={$updateProductData._id} />
			<Button type="submit">Save changes</Button>
		</form>
	</div>
</div>
