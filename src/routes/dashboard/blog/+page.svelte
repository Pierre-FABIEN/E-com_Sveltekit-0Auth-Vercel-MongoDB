<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { deletePostSchema } from '$server/posts/postSchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import Table from '$components/Table.svelte';

	export let data: any;

	const posts = data.posts;

	const deletePost = superForm(data?.IdeletePostSchema ?? {}, {
		validators: zodClient(deletePostSchema),
		id: 'deletePost'
	});

	const { enhance: deletePostEnhance, message: deletePostMessage } = deletePost;

	let formattedData: any[] = [];

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} à ${hours}:${minutes}`;
	}

	const postColumns = [
		{ key: 'title', label: 'Title' },
		{ key: 'createdAt', label: 'Date de création', formatter: formatDate }
	];

	function formatPostData(posts: any[]) {
		return posts.map((post) => ({
			...post,
			createdAt: formatDate(post.createdAt)
		}));
	}

	// Format data on mount
	formattedData = formatPostData(posts);

	// React to delete message changes
	$: if ($deletePostMessage) {
		showNotification(
			$deletePostMessage,
			$deletePostMessage.includes('success') ? 'success' : 'error'
		);
	}

	console.log('Posts:', posts);
</script>

<div class="ccc m-5">
	<div class="w-[100%] mt-5">
		<Table
			name="Articles"
			columns={postColumns}
			data={formattedData}
			deleteActionUrl="?/deletePost"
			newActionUrl="/dashboard/blog/create"
			editActionUrl="/dashboard/blog/"
			enhance={deletePostEnhance}
		/>
	</div>
</div>
