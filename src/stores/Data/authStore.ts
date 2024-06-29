import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Initialisation du store avec un état initial et un type
export const authStore: Writable<App.IAuthStore> = writable({
	userId: null,
	role: null,
	isAuthenticated: false,
	currentSessionId: undefined, // Initialisez à undefined ou null
	sessions: [] // Initialisez avec un tableau vide
});

// Fonction pour initialiser le store
export function initializeAuthStore() {
	let unsubscribe: (() => void) | null = null;
	return {
		promise: new Promise<void>((resolve) => {
			unsubscribe = authStore.subscribe(({ isAuthenticated }) => {
				if (isAuthenticated !== null) {
					resolve();
					if (unsubscribe) {
						unsubscribe();
					}
				}
			});
		}),
		unsubscribe: () => {
			if (unsubscribe) {
				unsubscribe();
			}
		}
	};
}
