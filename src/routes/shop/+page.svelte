<script lang="ts">
	import { enter, exit } from './transition';
	import { onNavigate } from '$app/navigation';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$shadcn/card/index.js';
	import { Button } from '$shadcn/button';
	import { addToCart, type OrderItem } from '$stores/Data/cartStore';

	let path: string | undefined | null;
	export let data;

	onNavigate((navigation) => {
		path = navigation.to?.route.id;
	});

	const handleAddToCart = (product: any) => {
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
	<title>shop</title>
	<meta name="description" content="shop this app" />
</svelte:head>

<div class="min-h-screen min-w-[100vw] absolute" in:enter={{ path }} out:exit={{ path }}>
	<div class="ccs min-w-screen min-h-screen">
		<h1 class="p-5 w-[80vw]">shop</h1>
		<div class="rcs w-[80vw]">
			{#each data.products as product}
				{#if product.stock > 20}
					<Card class="product-card w-[200px] m-5">
						<CardHeader class="w-[100%]">
							<img src={product.images[0]} alt={product.name} class="product-image object-cover" />
						</CardHeader>
						<CardContent>
							<CardTitle class="product-name">{product.name}</CardTitle>
							<p class="product-price">${product.price}</p>
						</CardContent>
						<CardFooter>
							<Button class="add-to-cart-button" on:click={() => handleAddToCart(product)}>
								Add to Cart
							</Button>
							<a href="/shop/{product.slug}">
								<Button class="add-to-cart-button">Page</Button>
							</a>
						</CardFooter>
					</Card>
				{/if}
			{/each}
		</div>
	</div>
</div>
