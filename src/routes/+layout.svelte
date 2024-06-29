<script lang="ts">
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';

	import App from '$lib/js/index';
	//import { registerServiceWorker } from '$UITools/serviceWorker';
	import Head from '$components/Head.svelte';

	import Loader from '$UITools/InitialLoader/index.svelte';
	import SmoothScroller from '$UITools/SmoothScroller/index.svelte';
	import NotificationWrapper from '$UITools/Notifications/NotificationWrapper.svelte';
	import {
		firstLoadComplete,
		loadingStates,
		setFirstOpen,
		setRessourceToValide
	} from '$stores/UX/initialLoaderStore';

	export let data
	let token;

	onNavigate(async (navigation) => {
		if (!document.startViewTransition) return;

		//console.log("1. Capture de l'état actuel du DOM");

		await new Promise<void>((resolve) => {
			document.startViewTransition(async () => {
				// console.log("2. Déclenchement de la transition - Préparation de l'animation");
				// // Préparation des éléments pour l'animation de sortie
				// // Exemple : document.querySelector('.ma-classe').classList.add('etat-sortie');

				// console.log("3. Début de l'animation de sortie");
				// // Insérez ici la logique pour déclencher les animations de sortie

				// // Attendez un délai approprié pour permettre l'animation de sortie
				// // Exemple : await new Promise(resolve => setTimeout(resolve, 1000));

				// console.log("4. Mise à jour du DOM et début de l'animation d'entrée", navigation);
				// // Ici, vous pouvez attendre la fin de la navigation si nécessaire
				// //await navigation.complete;

				// // Appliquez des animations d'entrée ou d'autres transformations nécessaires
				// // Exemple : document.querySelector('.nouvelle-classe').classList.add('etat-entree');

				// // Assurez-vous que toutes les animations sont terminées avant de résoudre la promesse
				// // Exemple : await new Promise(resolve => setTimeout(resolve, 1000));

				// console.log("5. Fin de l'animation et nettoyage");
				// // Nettoyage des styles temporaires ou des classes utilisées pour l'animation

				resolve(); // Fin de la transition
			});
		});
	});

	onMount(async () => {
		new App();
		//registerServiceWorker();
		// Détermine le premier chargement de l'application
		setFirstOpen(true);
		setRessourceToValide(true);

		//console.log(data, 'oiuhesiuh');	
		
		function getTokenFromCookies() {
			const cookieValue = document.cookie
			.split('; ')
			.find(row => row.startsWith('token='))
			?.split('=')[1];
			return cookieValue;
		}

		token = getTokenFromCookies();

		console.log(token);
		
	});


</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width" />
	<link rel="manifest" href="/pwa/manifest.webmanifest" />
	<meta name="theme-color" content="#4285f4" />
</svelte:head>

{#if !$firstLoadComplete}
	<Loader />
{/if}

<NotificationWrapper />
<Head />

<SmoothScroller>
	<main>
		<slot />
	</main>
</SmoothScroller>

<style lang="scss" global>
	@import './src/styles/main';
</style>
