<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import * as Form from '$UITools/shadcn/form';
	import { Input } from '$UITools/shadcn/input';
	import { Button } from '$UITools/shadcn/button';
	import * as Sheet from '$UITools/shadcn/sheet/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateCategorySchema } from '$lib/ZodSchema/categorySchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import { goto } from '$app/navigation';

	export let data;
	let categoryId: string;

	// Initialisation du formulaire superForm
	const updateCategory = superForm(data.IupdateCategorySchema, {
		validators: zodClient(updateCategorySchema),
		id: 'updateCategory'
	});

	const {
		form: updateCategoryData,
		enhance: updateCategoryEnhance,
		message: updateCategoryMessage
	} = updateCategory;

	onMount(() => {
		const $page = get(page);
		categoryId = $page.params.categoryId;
		console.log('Category ID on mount:', categoryId);
	});

	$: console.log('Update Category Message:', data);

	$: if ($updateCategoryMessage === 'Category updated successfully') {
		showNotification($updateCategoryMessage, 'success');
		setTimeout(() => goto('/dashboard/categories/'), 0);
		console.log('showNotification');
	}
</script>

<div class="ccc">
	<div class="m-5 p-5 border w-[400px]">
		<form method="POST" action="?/updateCategory" use:updateCategoryEnhance class="space-y-4">
			<div class="ccs mt-5">
				<div class="w-[100%]">
					<Form.Field name="name" form={updateCategory}>
						<Form.Control let:attrs>
							<Form.Label>Name</Form.Label>
							<Input {...attrs} type="text" bind:value={$updateCategoryData.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
			<input type="hidden" name="categoryId" value={categoryId} />
			<Button type="submit">Save changes</Button>
		</form>
	</div>
</div>
