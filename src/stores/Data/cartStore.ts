// src/stores/cartStore.ts
import { writable } from 'svelte/store';

export const cart = writable({
	items: [],
	lastModified: Date.now()
});

let isModified = false;

cart.subscribe((currentCart) => {
	localStorage.setItem('cart', JSON.stringify(currentCart));
});

export const addToCart = (product: any) => {
	cart.update((currentCart) => {
		const itemIndex = currentCart.items.findIndex((item) => item.product.id === product.id);
		if (itemIndex !== -1) {
			currentCart.items[itemIndex].quantity += 1;
		} else {
			currentCart.items.push({ product, quantity: 1 });
		}
		currentCart.lastModified = Date.now();
		isModified = true;
		return currentCart;
	});
};

export const removeFromCart = (productId: any) => {
	cart.update((currentCart) => {
		currentCart.items = currentCart.items.filter((item) => item.product.id !== productId);
		currentCart.lastModified = Date.now();
		isModified = true;
		return currentCart;
	});
};

export const updateCartItem = (productId, quantity) => {
	cart.update((currentCart) => {
		const itemIndex = currentCart.items.findIndex((item) => item.product.id === productId);
		if (itemIndex !== -1) {
			currentCart.items[itemIndex].quantity = quantity;
		}
		currentCart.lastModified = Date.now();
		isModified = true;
		return currentCart;
	});
};
