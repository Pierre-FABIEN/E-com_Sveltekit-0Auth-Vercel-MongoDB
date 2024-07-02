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
	<title>shop</title>
	<meta name="description" content="shop this app" />
</svelte:head>

<div class="shop">
	<div>
		<h1 bind:this={title}>ET HOP !</h1>

		<div class="linkshop" bind:this={link}>
			<a class="linkshop-link" href="/transitionAPI">LIEN ANIMATION</a>
		</div>
		<img class="logo" src="../logo.svg" alt="" style:--logo="logo" />
	</div>
</div>

<style>
	.linkshop {
		transform-origin: center;
	}

	.shop {
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

	:root {
		view-transition-name: none;
	}
</style>
