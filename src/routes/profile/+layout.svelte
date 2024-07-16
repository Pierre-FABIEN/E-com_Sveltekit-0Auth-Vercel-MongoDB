<script lang="ts">
	import type { LayoutData } from './$types';
	import Notification from '$components/notfication/Notification.svelte';

	export let data: LayoutData;

	console.log(data, 'data from layout.svelte');
</script>

<Notification />

<slot {data} />
