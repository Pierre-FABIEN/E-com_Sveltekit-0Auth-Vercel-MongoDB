<script lang="ts">
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

<button on:click={toggleFullScreen}>Go Fullscreen</button>
