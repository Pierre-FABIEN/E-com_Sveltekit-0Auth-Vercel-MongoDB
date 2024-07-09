<script lang="ts">
	import type { PageData } from './$types';
	import TableCategories from '$components/categories/TableCategories.svelte';
	export let data: PageData;

	console.log(data, 'data from page');
</script>

<div class="rcs m-5">
	<div class="w-[100%] m-5">
		<TableCategories {data} />
	</div>
</div>
