<script lang="ts">
	import { enter, exit } from './transition';
	import { onNavigate } from '$app/navigation';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$UITools/shadcn/card/index.js';
	import { Button } from '$UITools/shadcn/button';

	let path: string | undefined | null;
	export let data;

	onNavigate((navigation) => {
		path = navigation.to?.route.id;
	});

	console.log(data);
</script>

<svelte:head>
	<title>shop</title>
	<meta name="description" content="shop this app" />
</svelte:head>

<div class="shop" in:enter={{ path }} out:exit={{ path }}>
	<div class="pageShop">
		<h1 class="mt-0">shop</h1>
		<div class="rca w-[100vw]">
			{#each data.AllProducts as product}
				<Card class="product-card">
					<CardHeader>
						<img src={product.images[0]} alt={product.name} class="product-image" />
					</CardHeader>
					<CardContent>
						<CardTitle class="product-name">{product.name}</CardTitle>
						<p class="product-price">${product.price}</p>
					</CardContent>
					<CardFooter>
						<Button class="add-to-cart-button">Add to Cart</Button>
					</CardFooter>
				</Card>
			{/each}
		</div>
	</div>
</div>

<style>
	.shop {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		padding: 16px;
	}

	.product-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.product-price {
		color: #2ecc71;
		font-size: 1.1em;
		margin: 8px 0;
	}
</style>
