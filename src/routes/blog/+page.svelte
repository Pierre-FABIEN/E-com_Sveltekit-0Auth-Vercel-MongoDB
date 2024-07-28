<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const posts = data.posts;
</script>

{#if posts}
	{#each posts as post}
		<h1>{post.title}</h1>
		<p>{post.content}</p>
	{/each}
{/if}
