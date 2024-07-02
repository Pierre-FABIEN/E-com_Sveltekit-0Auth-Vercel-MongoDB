<script lang="ts">
	import { onMount } from 'svelte';

	import Users from './Users.svelte';

	export let data;

	onMount(() => {
		console.log(data, 'data from dashboard');
	});
</script>

<div class="ccc">
	<nav
		class="flex items-center space-x-4 lg:space-x-6 rounded-lg border shadow-sm mt-5 rcb p-3 px-5"
	>
		<a href="/examples/dashboard" class="text-sm font-medium transition-colors hover:text-primary">
			Accueil
		</a>
		<a
			href="/examples/dashboard"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Utilisateurs
		</a>
		<a
			href="/examples/dashboard"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Ventes
		</a>
		<a
			href="/examples/dashboard"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Produits
		</a>
	</nav>

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
