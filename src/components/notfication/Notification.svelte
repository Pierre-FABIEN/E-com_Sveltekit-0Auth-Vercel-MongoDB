<script lang="ts">
	import { notification } from '$stores/Data/notificationStore';
	import * as Alert from '$shadcn/alert';
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	interface Notification {
		message: string;
		type: 'info' | 'success' | 'error';
		show: boolean;
	}

	let message: string = '';
	let type: 'info' | 'success' | 'error' = 'info';
	let show: boolean = false;
	let animationClass: string = 'animate-slideIn';

	const unsubscribe: Unsubscriber = notification.subscribe((value: Notification) => {
		message = value.message;
		type = value.type;
		show = value.show;
		animationClass = 'animate-slideIn';

		if (show) {
			console.log('Notification will be shown');
			setTimeout(() => {
				animationClass = 'animate-slideOut';
				setTimeout(() => {
					show = false;
					console.log('Notification hidden');
				}, 500); // Doit être égal à la durée de l'animation de slideOut
			}, 5000); // Durée d'affichage de la notification avant de disparaître
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if show}
	<Alert.Root
		class="fixed bottom-4 right-4 max-w-[200px] border {type === 'success'
			? 'border-green-400 bg-green-500'
			: 'border-red-400 bg-red-500'} px-4 py-3 text-white {animationClass}"
		role="alert"
	>
		<Alert.Description>
			{message}
		</Alert.Description>
	</Alert.Root>
{/if}
