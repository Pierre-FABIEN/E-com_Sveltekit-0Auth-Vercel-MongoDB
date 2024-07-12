<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Button from '$shadcn/button/button.svelte';
	import { Expand } from 'lucide-svelte';
	import { Shrink } from 'lucide-svelte';

	// Store to keep track of fullscreen state
	const isFullScreen = writable(false);

	// Function to toggle fullscreen mode
	function toggleFullScreen(): void {
		const doc: any = document; // Type assertion to include non-standard properties
		const docElm: any = document.documentElement; // Type assertion for non-standard properties

		if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			} else if (docElm.webkitRequestFullscreen) {
				docElm.webkitRequestFullscreen();
			}
			isFullScreen.set(true);
		} else {
			if (doc.exitFullscreen) {
				doc.exitFullscreen();
			} else if (doc.webkitExitFullscreen) {
				doc.webkitExitFullscreen();
			}
			isFullScreen.set(false);
		}
	}

	// Function to handle fullscreen change events
	function handleFullScreenChange(): void {
		const doc: any = document;
		isFullScreen.set(!!doc.fullscreenElement || !!doc.webkitFullscreenElement);
	}

	// Listen for fullscreen change events
	onMount(() => {
		document.addEventListener('fullscreenchange', handleFullScreenChange);
		document.addEventListener('webkitfullscreenchange', handleFullScreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullScreenChange);
			document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
		};
	});
</script>

<Button on:click={toggleFullScreen} class="mx-2" variant="outline" size="icon">
	{#if $isFullScreen}
		<Shrink class="h-[1.2rem] w-[1.2rem] transition-all" />
	{:else}
		<Expand class="h-[1.2rem] w-[1.2rem] transition-all" />
	{/if}
	<span class="sr-only">Toggle screen</span>
</Button>
