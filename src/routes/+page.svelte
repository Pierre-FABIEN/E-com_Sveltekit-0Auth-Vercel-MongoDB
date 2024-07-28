<script lang="ts">
	import { hoverable } from '$UITools/Cursor/cursorHelpers';
	import { t } from '$UITools/Translations/index';

	import Box from './../components/three/Box.svelte';
	import Slider from '$components/Slider/Slider.svelte';
	import { enter, exit } from './transition';
	import { onNavigate } from '$app/navigation';

	let title: HTMLElement;
	let path: string | undefined | null;

	let coco = 1;
	let popo = 0;

	$: popo = coco * 2;

	$: {
		console.log(popo);
	}

	$: onNavigate((navigation) => {
		path = navigation.to?.route.id;
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
		<button on:click={() => (coco += 1)}>{coco}</button>
		<p>{popo}</p>
	</div>
</div>

<style lang="scss">
	.home {
		position: absolute;
	}
</style>
