<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: posts = data.posts;
</script>

{#if posts}
	{#each posts as post}
		<div class="border rounded m-5 p-5">
			<a href="/blog/{post.id}">
				<h1>{post.title}</h1>
			</a>
		</div>
	{/each}
{/if}
