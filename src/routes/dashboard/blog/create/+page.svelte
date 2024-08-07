<script lang="ts">
	import * as Form from '$shadcn/form';
	import { Input } from '$shadcn/input';
	import { Button } from '$shadcn/button';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { postSchema } from '$server/posts/Schema/postSchema.js';
	import { showNotification } from '$stores/Data/notificationStore.js';
	import { goto } from '$app/navigation';
	import Editor from '@tinymce/tinymce-svelte';
	import { env } from '$env/dynamic/public';

	export let data;

	const createPost = superForm(data.IpostSchema, {
		validators: zodClient(postSchema),
		id: 'createPost'
	});

	const {
		form: createPostData,
		enhance: createPostEnhance,
		message: createPostMessage
	} = createPost;

	$: if ($createPostMessage === 'Post created successfully') {
		showNotification($createPostMessage, 'success');
		setTimeout(() => goto('/dashboard/blog/'), 0);
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
	<div class="m-5 p-5 border w-[80vw]">
		<form method="POST" action="?/createPost" use:createPostEnhance class="space-y-4">
			<div class="w-[100%]">
				<Form.Field name="title" form={createPost}>
					<Form.Control let:attrs>
						<Form.Label>Title</Form.Label>
						<Input {...attrs} type="text" bind:value={$createPostData.title} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="w-[100%]">
				<Form.Field name="content" form={createPost}>
					<Form.Control let:attrs>
						<Form.Label>Content</Form.Label>
						<Editor
							apiKey={env.PUBLIC_TINYMCE_API_KEY}
							bind:value={$createPostData.content}
							{...init}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<input type="hidden" name="content" bind:value={$createPostData.content} />
			{#if data.user}
				<input type="hidden" name="authorId" value={data.user.id} />
			{/if}
			<Button type="submit">Save changes</Button>
		</form>
	</div>
</div>
