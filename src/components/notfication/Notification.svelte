<script lang="ts">
	import { notification } from '$stores/Data/notificationStore';
	import * as Alert from '$UITools/shadcn/alert';
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
		console.log('Notification component received update:', value);
		message = value.message;
		type = value.type;
		show = value.show;
		animationClass = 'animate-slideIn';

		if (show) {
			setTimeout(() => {
				animationClass = 'animate-slideOut';
				setTimeout(() => {
					show = false;
				}, 500);
			}, 5000);
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
