<script lang="ts">
	import { t } from '$UITools/Translations/index.js';
	import { onMount } from 'svelte';

	import { enter, exit } from './transition';
	import { onNavigate } from '$app/navigation';
	import Circle from '$components/three/Circle.svelte';

	let title: HTMLElement;
	let text: HTMLElement;
	let link: HTMLElement;
	let path: string | undefined | null;

	onNavigate((navigation) => {
		path = navigation.to?.route.id;
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="about" in:enter={{ path, title, text, link }} out:exit={{ path, title, text, link }}>
	<div>
		<h1 bind:this={title}>{$t('general.about-title')}</h1>
		<p bind:this={text}>{$t('general.about-text')}</p>
		<div class="linkabout" bind:this={link}>
			<a href="/">{$t('general.about-link')}</a>
		</div>
	</div>
	<Circle />
</div>

<style>
	.linkabout {
		transform-origin: center;
	}
	.about {
		position: absolute;
		width: 100vw;
	}
</style>
