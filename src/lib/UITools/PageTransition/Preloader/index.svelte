<script lang="ts">
	import { onMount } from 'svelte';
	let preloader: HTMLElement;
</script>

<div class="preloader" bind:this={preloader}>
	<div class="inloader"></div>
</div>

<style lang="scss">
	.preloader {
		width: 100vw;
		height: 100vh;
		position: absolute;
		z-index: 1000;
	}

	.inloader {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: blue;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			background-color: blue;
		}
		50% {
			transform: scale(1.5);
			background-color: red;
		}
		100% {
			transform: scale(1);
			background-color: blue;
		}
	}
</style>
