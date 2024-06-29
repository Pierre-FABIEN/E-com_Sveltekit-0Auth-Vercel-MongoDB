<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Props du composant
	export let message = '';
	export let type = 'info'; // Types possibles : 'success', 'error', 'info'

	// État de la visibilité de la notification
	let isVisible = true;

	// Cycle de vie : monté du composant
	onMount(() => {
		// Définir un timer pour masquer la notification après 5 secondes
		const timer = setTimeout(() => {
			isVisible = false;
			dispatch('dismiss'); // Émettre l'événement personnalisé lors de la fermeture
		}, 4000);

		// Nettoyage : annuler le timer si le composant est détruit
		return () => clearTimeout(timer);
	});

	// Fonction pour fermer la notification manuellement
	function closeNotification() {
		isVisible = false;
		dispatch('dismiss'); // Émettre l'événement personnalisé lors de la fermeture
	}
</script>

{#if isVisible}
	<div class={`notification ${type}`} aria-live="assertive">
		<span>{message}</span>
		<button
			data-testid="button-close-notification"
			on:click={closeNotification}
			aria-label="Fermer la notification"
		>
			X
		</button>
	</div>
{/if}

<style>
	.notification-wrapper {
		position: fixed;
		top: 20px;
		right: 20px;
		width: 200px;
		z-index: 9999999;
	}

	.notification {
		padding: 10px;
		margin-bottom: 10px; /* Espacement entre les notifications */
		color: white;
	}

	.notification.success {
		background-color: green;
	}

	.notification.error {
		background-color: red;
	}

	.notification.info {
		background-color: blue;
	}
</style>
