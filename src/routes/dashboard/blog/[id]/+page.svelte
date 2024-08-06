<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import * as Form from '$shadcn/form';
	import { Input } from '$shadcn/input';
	import { Button } from '$shadcn/button';
	import * as Sheet from '$shadcn/sheet/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateCategorySchema } from '$server/categories/Schema/categorySchema.js';
	import { showNotification } from '$stores/Data/notificationStore';
	import Editor from '@tinymce/tinymce-svelte';
	import { env } from '$env/dynamic/public';
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
		categoryId = $page.params.id;
		console.log('Category ID on mount:', categoryId);
	});

	$: if ($updateCategoryMessage === 'Category updated successfully') {
		showNotification($updateCategoryMessage, 'success');
		setTimeout(() => goto('/dashboard/categories/'), 0);
		console.log('showNotification');
	}

	let init = {
		height: 500,
		menubar: false,
		plugins: [
			'advlist autolink lists link image charmap anchor searchreplace visualblocks code fullscreen insertdatetime media table preview help wordcount'
		],
		toolbar:
			'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
	};
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
			<div class="w-[100%]">
				<Form.Field name="content" form={createPost}>
					<Form.Control let:attrs>
						<Form.Label>Content</Form.Label>
						<Editor
							apiKey={env.PUBLIC_TINYMCE_API_KEY}
							bind:value={$updateCategory.content}
							{...init}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<input type="hidden" name="content" bind:value={$updateCategory.content} />
			<input type="hidden" name="categoryId" value={categoryId} />
			<Button type="submit">Save changes</Button>
		</form>
	</div>
</div>
