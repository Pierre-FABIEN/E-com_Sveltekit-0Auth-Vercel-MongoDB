// src/stores/cartStore.ts
import { writable } from 'svelte/store';

export type OrderItem = {
	id: string;
	product: {
		id: string;
		name: string;
		price: number;
		images: string[];
	};
	quantity: number;
	price: number;
};

export const cart = writable({
	items: [] as OrderItem[],
	lastModified: Date.now()
});

export const setCart = (items: OrderItem[]) => {
	cart.set({
		items,
		lastModified: Date.now()
	});
};

export const addToCart = (product: OrderItem) => {
	cart.update((currentCart) => {
		const itemIndex = currentCart.items.findIndex((item) => item.product.id === product.product.id);
		if (itemIndex !== -1) {
			currentCart.items[itemIndex].quantity += 1;
		} else {
			currentCart.items.push(product);
		}
		currentCart.lastModified = Date.now();
		return currentCart;
	});
};

export const removeFromCart = (productId: string) => {
	console.log('Removing product from cart:', productId);

	cart.update((currentCart) => {
		currentCart.items = currentCart.items.filter((item) => item.product.id !== productId);
		currentCart.lastModified = Date.now();
		return currentCart;
	});
};

export const updateCartItem = (productId: string, quantity: number) => {
	cart.update((currentCart) => {
		const itemIndex = currentCart.items.findIndex((item) => item.product.id === productId);
		if (itemIndex !== -1) {
			currentCart.items[itemIndex].quantity = quantity;
		}
		currentCart.lastModified = Date.now();
		return currentCart;
	});
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
	cart.update((currentCart) => {
		const itemIndex = currentCart.items.findIndex((item) => item.product.id === productId);
		if (itemIndex !== -1) {
			currentCart.items[itemIndex].quantity = quantity;
		}
		currentCart.lastModified = Date.now();
		return currentCart;
	});
};

cart.subscribe((currentCart) => {
	console.log('Cart updated:', currentCart);
});
