// src/stores/notificationStore.ts
import { writable } from 'svelte/store';

interface Notification {
	message: string;
	type: 'info' | 'success' | 'error';
	show: boolean;
}

export const notification = writable<Notification>({
	message: '',
	type: 'info',
	show: false
});

notification.subscribe((value) => {
	console.log('Notification store updated:', value);
});

export function showNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
	console.log('showNotification called with:', { message, type });
	notification.set({ message, type, show: true });
}
