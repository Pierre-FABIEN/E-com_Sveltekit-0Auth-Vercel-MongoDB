<script lang="ts">
	import type { PageData } from './$types';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$shadcn/card/index.js';
	import { Button } from '$shadcn/button';
	import { addToCart, type OrderItem } from '$stores/Data/cartStore';

	export let data: PageData;

	const handleAddToCart = () => {
		const product = data.product;
		const orderItem: OrderItem = {
			id: product.id,
			product: {
				id: product.id,
				name: product.name,
				price: product.price,
				images: product.images
			},
			quantity: 1,
			price: product.price
		};
		addToCart(orderItem);
	};
</script>

<svelte:head>
	<title>{data.product.name}</title>
	<meta name="description" content={data.product.description} />
</svelte:head>

<div class="min-h-screen flex items-center justify-center">
	<Card class="w-full max-w-2xl shadow-md rounded-lg overflow-hidden">
		<CardHeader class="w-full">
			<img src={data.product.images[0]} alt={data.product.name} class="w-full h-64 object-cover" />
		</CardHeader>
		<CardContent class="p-6">
			<CardTitle class="text-3xl font-bold mb-4">{data.product.name}</CardTitle>
			<p class="text-gray-700 text-base mb-4">{data.product.description}</p>
			<p class="text-2xl text-gray-900 font-semibold">${data.product.price}</p>
		</CardContent>
		<CardFooter class="p-6 flex justify-end">
			<Button class="bg-blue-500 text-white py-2 px-4 rounded" on:click={handleAddToCart}>
				Add to Cart
			</Button>
		</CardFooter>
	</Card>
</div>
