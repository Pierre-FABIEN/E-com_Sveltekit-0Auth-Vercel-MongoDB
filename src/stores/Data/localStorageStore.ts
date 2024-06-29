import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export function localStorageStore<T>(key: string, initialValue: T): Writable<T> {
	// Vérifie si on est dans le navigateur
	const isBrowser: boolean = typeof window !== 'undefined';
	const storedValue: string | null = isBrowser ? localStorage.getItem(key) : null;
	const initial: T = storedValue ? JSON.parse(storedValue) : initialValue;
	const store: Writable<T> = writable(initial);

	if (isBrowser) {
		store.subscribe((value: T) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}
