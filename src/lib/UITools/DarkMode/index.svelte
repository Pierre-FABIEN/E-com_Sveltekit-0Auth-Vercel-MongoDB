<script lang="ts">
	import { onMount } from 'svelte';
	import { localStorageStore } from '$stores/Data/localStorageStore';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import Button from '$UITools/shadcn/button/button.svelte';

	const darkMode = localStorageStore('darkMode', false);

	onMount(() => {
		// Ce code sera exécuté uniquement côté client
		const theme = $darkMode ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);

		// Mettre à jour lorsque le store change
		darkMode.subscribe((value) => {
			document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
		});
	});

	function toggleDarkMode() {
		$darkMode = !$darkMode;
	}
</script>

<Button on:click={toggleDarkMode} variant="outline" size="icon">
	<Sun
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Moon
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
