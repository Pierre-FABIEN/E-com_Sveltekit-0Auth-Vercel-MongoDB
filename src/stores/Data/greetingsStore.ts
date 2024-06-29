import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const greetingsStore: Writable<App.Greeting[]> = writable([]);

export const setGreetings = (greetings: App.Greeting[]) => {
	greetingsStore.set(greetings);
};

export const addGreeting = (greeting: App.Greeting) => {
	greetingsStore.update((currentGreetings) => [...currentGreetings, greeting]);
};

export const updateGreetingInStore = (id: string, updatedFields: Partial<App.Greeting>) => {
	greetingsStore.update((currentGreetings) =>
		currentGreetings.map((g) => (g._id === id ? { ...g, ...updatedFields } : g))
	);
};

export const deleteGreetingFromStore = (id: string) => {
	greetingsStore.update((currentGreetings) => currentGreetings.filter((g) => g._id !== id));
};
