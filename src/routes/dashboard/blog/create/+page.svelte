<script lang="ts">
	import * as Form from '$shadcn/form';
	import { Input } from '$shadcn/input';
	import { Button } from '$shadcn/button';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { postSchema } from '$server/posts/Schema/postSchema.js';
	import { showNotification } from '$stores/Data/notificationStore.js';
	import { goto } from '$app/navigation';

	import Editor from '$components/Editor.svelte';

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
		console.log('showNotification');
	}

	console.log(data);
</script>

<div class="ccc">
	<div class="m-5 p-5 border w-[400px]">
		<form method="POST" action="?/createPost" use:createPostEnhance class="space-y-4">
			<div class="ccs mt-5">
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
					<Editor />
				</div>
			</div>
			<input type="hidden" name="authorId" value={data.user.id} />
			<Button type="submit">Save changes</Button>
		</form>
	</div>
</div>
