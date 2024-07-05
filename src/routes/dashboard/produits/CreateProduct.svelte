<script lang="ts">
	import { filesProxy } from 'sveltekit-superforms';

	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import Checkbox from '$UITools/shadcn/checkbox/checkbox.svelte';
	import { Label } from '$UITools/shadcn/label';
	import * as Sheet from '$UITools/shadcn/sheet/index.js';

	export let data;
	export let createProductEnhance;
	export let createProduct;
	export let createProductData;

	let DataPrice: number = 0;

	const files = filesProxy(createProduct, 'images');

	$: $createProductData.categoryId = data.AllCategories.filter(
		(category: any) => category.checked
	).map((category: any) => category.id);

	$: $createProductData.price = Number(DataPrice);
</script>

<Sheet.Content side="right">
	<Sheet.Header>
		<Sheet.Title>Edit profile</Sheet.Title>
		<Sheet.Description>
			Make changes to your profile here. Click save when you're done.
		</Sheet.Description>
	</Sheet.Header>
	<div class="ccc mt-5">
		<form
			method="POST"
			enctype="multipart/form-data"
			action="?/createProduct"
			use:createProductEnhance
			class="space-y-4"
		>
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
	<Sheet.Footer>
		<Sheet.Close asChild let:builder>
			<Button builders={[builder]} type="submit">Save changes</Button>
		</Sheet.Close>
	</Sheet.Footer>
</Sheet.Content>
