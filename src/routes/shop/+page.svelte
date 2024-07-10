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

<div class="min-h-screen w-[100vw] absolute" in:enter={{ path }} out:exit={{ path }}>
	<div class="ccc min-w-screen min-h-screen">
		<h1 class="p-5 w-[80vw]">shop</h1>
		<div class="rcs w-[80vw]">
			{#each data.AllProducts as product}
				<Card class="product-card w-[200px] m-5">
					<CardHeader class="w-[100%]">
						<img src={product.images[0]} alt={product.name} class="product-image object-cover" />
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
