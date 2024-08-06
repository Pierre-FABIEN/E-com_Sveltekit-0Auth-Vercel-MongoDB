<script lang="ts">
	// Import the necessary type
	import type { PageData } from './$types';

	// Define the data property
	export let data: PageData;
</script>

{#each data.post as article}
	<div class="border rounded m-5 p-5">
		<h1>{article.title}</h1>
	</div>
	<div class="border rounded m-5 p-5">
		{@html article.content}
	</div>
{/each}
