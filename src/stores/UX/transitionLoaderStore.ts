import { writable } from 'svelte/store';

export const transitionLoader = writable(false);

export function setTransitionLoader(value: boolean) {
	transitionLoader.set(value);
}
