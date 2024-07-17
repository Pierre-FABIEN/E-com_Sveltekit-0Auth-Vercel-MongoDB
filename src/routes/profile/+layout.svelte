<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	console.log(data, 'data from layout.svelte');
</script>

<slot {data} />
