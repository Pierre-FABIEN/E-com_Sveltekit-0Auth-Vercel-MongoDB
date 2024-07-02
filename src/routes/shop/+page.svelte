<script lang="ts">
	import { enter, exit } from './transition';
	import { onNavigate } from '$app/navigation';

	let title: HTMLElement;
	let text: HTMLElement;
	let link: HTMLElement;
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

<div class="shop" in:enter={{ path, title, text, link }} out:exit={{ path, title, text, link }}>
	{#each data.AllProducts as product}
		<img src={product.images[0]} alt="First image" />
		<p>{product.name}</p>
		<h1>{product.price}</h1>
	{/each}
</div>
