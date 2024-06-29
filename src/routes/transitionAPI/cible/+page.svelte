<script lang="ts">
	import gsap from 'gsap';
	import { t } from '$UITools/Translations/index.js';
	import { onMount } from 'svelte';

	let title: HTMLElement;
	let link: HTMLElement;

	onMount(() => {
		const tl = gsap.timeline();

		tl.from(title, { duration: 0.7, autoAlpha: 0, y: -30, ease: 'back.out(1.7)' }).from(
			link,
			{ duration: 0.7, autoAlpha: 0, x: -30, ease: 'back.out(1.7)' },
			'-=0.5'
		);
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="about">
	<div>
		<h1 bind:this={title}>ET HOP !</h1>

		<div class="linkabout" bind:this={link}>
			<a class="linkabout-link" href="/transitionAPI">LIEN ANIMATION</a>
		</div>
		<img class="logo" src="../logo.svg" alt="" style:--logo="logo" />
	</div>
</div>

<style>
	.linkabout {
		transform-origin: center;
	}
	.about {
		position: absolute;
		width: 100vw;
	}
	.logo {
		position: absolute;
		right: 40vw;
		margin-right: auto;
		margin-left: auto;
		transform: scale(4);
	}
</style>
