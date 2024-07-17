<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';

	import App from '$lib/js/index';
	import Head from '$components/Head.svelte';

	import Loader from '$UITools/InitialLoader/index.svelte';
	import SmoothScroller from '$UITools/SmoothScroller/index.svelte';
	import Notification from '$components/notfication/Notification.svelte';

	import {
		firstLoadComplete,
		setFirstOpen,
		setRessourceToValide
	} from '$stores/UX/initialLoaderStore';
	import { setCart } from '$stores/Data/cartStore';
	import { startSync } from '$stores/Data/cartSync';

	export let data;

	onNavigate(async (navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) return;

		await new Promise<void>((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve(); // Fin de la transition
			});
		});
	});

	onMount(async () => {
		new App();
		setFirstOpen(true);
		setRessourceToValide(true);

		if (data.session.orders) {
			const items = data.session.orders;
			setCart(items.id, items.userId, items.items, items.total);
			startSync();
		}
	});

	console.log(data, 'data from +page.svelte');
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width" />
	<link rel="manifest" href="/pwa/manifest.webmanifest" />
	<meta name="theme-color" content="#4285f4" />
</svelte:head>

{#if !$firstLoadComplete}
	<Loader />
{/if}

{#if $firstLoadComplete}
	<Notification />
	<Head {data} />

	<SmoothScroller>
		<main>
			<slot {data} />
		</main>
	</SmoothScroller>
{/if}

<style lang="scss" global>
	main {
		min-height: 100vh;
		padding-top: 70px;
	}
</style>
