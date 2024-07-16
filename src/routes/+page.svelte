<script lang="ts">
	import { onMount } from 'svelte';
	import { hoverable } from '$UITools/Cursor/cursorHelpers';
	import { t } from '$UITools/Translations/index';
	import * as Table from '$shadcn/table';

	import Box from './../components/three/Box.svelte';
	import Slider from '$components/Slider/Slider.svelte';
	import { fetchMockData } from '$lib/utils/mockService';
	import { enter, exit } from './transition';
	import { onNavigate } from '$app/navigation';
	//import { users, loading, error, fetchUsers } from '$stores/Data/userStore';

	let title: HTMLElement;
	let path: string | undefined | null;
	let focal: any[] = [];

	let stripe: any;

	onNavigate((navigation) => {
		path = navigation.to?.route.id;
	});

	onMount(async () => {
		fetchMockData;
		//focal = await fetchUsers();
	});
</script>

<svelte:head>
	<title>Page d'exemple</title>
	<meta name="description" content="Ceci est une description de la page d'exemple." />
</svelte:head>

<div class="home" in:enter={{ path }} out:exit={{ path }}>
	<div class="page absolute w-[100vw] pt-[70px] ccc">
		<h1 bind:this={title}>{$t('general.home-title')}</h1>

		<div class="linkhome">
			<a data-sveltekit-preload-data href="/shop" use:hoverable={'first'}
				>{$t('general.home-link')}</a
			>
		</div>

		<Slider />
		<Box />
	</div>
</div>

<style lang="scss">
	.home {
		position: absolute;
	}
</style>
