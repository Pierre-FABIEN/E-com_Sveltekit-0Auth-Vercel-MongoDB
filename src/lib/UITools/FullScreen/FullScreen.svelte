<script lang="ts">
	import Button from '$UITools/shadcn/button/button.svelte';
	import { Expand } from 'lucide-svelte';
	import { Shrink } from 'lucide-svelte';

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
		} else {
			if (doc.exitFullscreen) {
				doc.exitFullscreen();
			} else if (doc.webkitExitFullscreen) {
				doc.webkitExitFullscreen();
			}
		}
	}
</script>

<Button on:click={toggleFullScreen} variant="outline" size="icon">
	<Expand
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Shrink
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle screen</span>
</Button>
