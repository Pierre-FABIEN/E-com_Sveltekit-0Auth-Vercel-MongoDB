<script lang="ts">
	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import Checkbox from '$UITools/shadcn/checkbox/checkbox.svelte';
	import { Label } from '$UITools/shadcn/label';
	import * as Drawer from '$UITools/shadcn/drawer/index.js';

	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { filesFieldProxy, superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { createProductSchema } from '$lib/ZodSchema/productSchema';
	import { Textarea } from '$UITools/shadcn/textarea';
	import { showNotification } from '$stores/Data/notificationStore';
	import { goto } from '$app/navigation';

	export let data: {
		IcreateProductSchema: SuperValidated<Infer<typeof createProductSchema>>;
		AllCategories: any;
		AllProducts: any;
	};

	const createProduct = superForm(data.IcreateProductSchema, {
		validators: zodClient(createProductSchema),
		id: 'createProduct',
		resetForm: true
	});

	const {
		form: createProductData,
		enhance: createProductEnhance,
		message: createProductMessage
	} = createProduct;

	let DataPrice: number = 0;
	const files = filesFieldProxy(createProduct, 'images');
	const { values, valueErrors } = files;

	$: $createProductData.categoryId = data.AllCategories.filter(
		(category: any) => category.checked
	).map((category: any) => category.id);

	$: $createProductData.price = Number(DataPrice);

	$: if ($createProductMessage === 'Product created successfully') {
		goto('/dashboard/products');
		showNotification($createProductMessage, 'success');
	}

	$: console.log($valueErrors, 'valueErrors');
	$: console.log($createProductMessage, 'createProductMessage');
</script>

<div class="ccc">
	<div class="m-5 p-5 border w-[80vw]">
		<form
			method="POST"
			enctype="multipart/form-data"
			action="?/createProduct"
			use:createProductEnhance
			class="space-y-4"
		>
			<div class="rtb">
				<div class="ccc" style="width: calc(100% - 320px);">
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
						<Form.Field name="description" form={createProduct}>
							<Form.Control let:attrs>
								<Form.Label>Description</Form.Label>
								<Textarea {...attrs} bind:value={$createProductData.description} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="w-[100%]">
						<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Categories</h4>
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
				</div>
				<div class="ccc w-[300px]">
					<div class="p-4 pb-0 flex flex-row space-x-4 ccc">
						<div
							class="ccc w-[300px] h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg relative"
						>
							<Form.Field name="images" form={createProduct}>
								<Form.Control let:attrs>
									<input
										multiple
										bind:files={$values}
										name="images"
										accept="image/png, image/jpeg"
										type="file"
										class="absolute opacity-0 w-full h-full cursor-pointer z-10"
									/>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
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
								<p class="text-xs text-gray-500">PNG, JPG up to 1MB</p>
							</div>
						</div>
						<div class="mt-3 flex flex-wrap gap-2 flex-1 w-[300px] rts">
							{#each $values as image}
								<div class="relative w-[65px] h-[65px]">
									<img
										src={URL.createObjectURL(image)}
										alt=""
										class="w-full h-full object-cover rounded"
									/>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<input type="hidden" name="categoryId" bind:value={$createProductData.categoryId} />

			<Button type="submit">Save changes</Button>
		</form>
	</div>
</div>
