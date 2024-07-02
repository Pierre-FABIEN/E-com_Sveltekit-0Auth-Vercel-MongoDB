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
		<h1 bind:this={title}>Transition avec l'utilisation de API</h1>
		<div class="linkshop" bind:this={link}>
			<a class="linkshop-link" href="/transitionAPI/cible">LIEN ANIMATION</a>
		</div>
		<img class="logo" src="/logo.svg" alt="" style:--logo="logo" />
	</div>
</div>

<style lang="scss" global>
	.linkshop {
		transform-origin: center;
	}
	.shop {
		position: absolute;
		width: 100vw;
	}
	.logo {
		position: absolute;
		margin-right: auto;
		right: 0;
		margin-left: auto;
		transform: scale(1);

		width: 200px;
		height: 200px;
		view-transition-name: var(--logo);
	}

	:root {
		view-transition-name: none;
	}

	.logo {
		width: 200px;
		height: 200px;
		view-transition-name: var(--logo);
	}
</style>
