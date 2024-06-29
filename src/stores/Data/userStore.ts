import { writable } from 'svelte/store';

export const users = writable([]);
export const loading = writable(false);
export const error = writable(null);

export const fetchUsers = async () => {
    loading.set(true);
    error.set(null);

    try {
        const res = await fetch('/api');
        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        users.set(data.data); // Assurez-vous que la clé correspond au format JSON renvoyé
        return data.data;
    } catch (err: any) {
        error.set(err.message);
        return null;
    } finally {
        loading.set(false);
    }
};
