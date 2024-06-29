<script lang="ts">
	import gsap from 'gsap';
	import { onMount, onDestroy, tick } from 'svelte';
	import { get } from 'svelte/store';
	import {
		setDomLoaded,
		setFirstLoadComplete,
		loadingStates
	} from '$stores/UX/initialLoaderStore';

	let initalLoader: HTMLElement;
	let observer: IntersectionObserver;

	onMount(async () => {
		await tick(); // Attend que Svelte mette à jour le DOM
		setupObserver();
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});

	async function setupObserver() {		
		observer = new IntersectionObserver(
			(entries) => {				
				entries.forEach((entry) => {
					if (entry.isIntersecting) {						
						setDomLoaded(true);
						animateIn();
						observer.unobserve(initalLoader);
					}
				});
			},
			{ threshold: 0.5 }
		);
		observer.observe(initalLoader);
	}

	function animateIn() {
		if (!initalLoader) return;
		gsap.fromTo(
			initalLoader.querySelectorAll('.letter'),
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				duration: 0.2,
				stagger: 0.1,
				ease: 'power2.out',
				onComplete: checkLoadingComplete
			}
		);
	}

	function checkLoadingComplete() {
		const currentLoadingStates = get(loadingStates);
		if (Object.values(currentLoadingStates).every((state) => state === true)) {
			animateOut();
		} else {
			// Réessaye dans 500 ms
			setTimeout(checkLoadingComplete, 200);
		}
	}

	function animateOut() {
		if (!initalLoader) return;
		gsap.to(initalLoader.querySelectorAll('.letter'), {
			opacity: 0,
			y: -20,
			duration: 0.2,
			stagger: 0.1,
			ease: 'power2.in',
			onComplete: () => {
				setFirstLoadComplete(true);
			}
		});
	}
</script>

<div class="initalLoader" bind:this={initalLoader}>
	{#each Array.from('Bienvenue') as letter, i (letter + i)}
		<span class="letter">{letter}</span>
	{/each}
</div>

<style lang="scss">
	.letter {
		opacity: 0;
	}
</style>
