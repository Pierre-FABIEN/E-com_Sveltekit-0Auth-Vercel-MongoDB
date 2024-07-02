<script lang="ts">
	import { t } from '$UITools/Translations/index.js';
	import { onMount } from 'svelte';

	import { enter, exit } from './transition';
	import { onNavigate } from '$app/navigation';
	import Circle from '$components/three/Circle.svelte';

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
		<p>{product.name}</p>
	{/each}
</div>
