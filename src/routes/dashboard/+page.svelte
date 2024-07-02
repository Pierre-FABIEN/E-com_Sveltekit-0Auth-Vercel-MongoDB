<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Users from './Users.svelte';
	import Products from './Products.svelte';
	import Orders from './Orders.svelte';
	import Adress from './Adress.svelte';

	export let data: PageData;

	onMount(() => {
		console.log(data, 'data from dashboard');
	});
</script>

<div class="ccc">
	<div class="w-[100vw] rts">
		<div class="m-5">
			<Users Users={data.allUsers} />
		</div>
		<!-- <div class="w-[500px] m-5">
			<Adress Adress={data.allAdress} />
		</div> -->
		<!-- <div class="w-[700px] m-5">
			<Products Products={data.allProducts} />
		</div>
		<div class="w-[400px] m-5">
			<Orders Orders={data.allOrders} />
		</div> -->
	</div>
</div>
