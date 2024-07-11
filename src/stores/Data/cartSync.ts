// src/stores/cartSync.ts
import { cart } from './cartStore';
import { get } from 'svelte/store';

let lastSynced = Date.now();

const syncCart = async () => {
	const currentCart = get(cart);

	console.log(currentCart);

	if (currentCart.lastModified > lastSynced) {
		try {
			await fetch('/api/save-cart', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(currentCart)
			});
			lastSynced = Date.now();
		} catch (error) {
			console.error('Failed to sync cart:', error);
		}
	}
};

const startSync = () => {
	setInterval(syncCart, 30000); // Sync every 30 seconds
};

export { startSync };
