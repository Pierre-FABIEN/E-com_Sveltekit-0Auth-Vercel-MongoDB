// src/stores/windowStore.ts
import { writable } from 'svelte/store';

interface WindowStore {
	scrollX: number;
	scrollY: number;
	// Vous pouvez ajouter d'autres propriétés si nécessaire
}

export function getInitialState(): WindowStore {
	return {
		scrollX: 0,
		scrollY: 0
	};
}

export const windowStore = writable<WindowStore>(getInitialState());
