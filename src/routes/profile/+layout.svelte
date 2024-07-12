<script lang="ts">
	import type { LayoutData } from './$types';
	import Notification from '$components/notfication/Notification.svelte';

	export let data: LayoutData;
</script>

<Notification />

<slot {data} />
