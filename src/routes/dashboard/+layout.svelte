<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import Notification from '$components/notfication/Notification.svelte';

	export let data: LayoutData;
</script>

<Notification />
<div class="ccc">
	<nav class="flex items-center border space-x-4 lg:space-x-6 rcb w-[500px] p-3">
		<a
			href="/dashboard"
			class={`text-sm font-medium ${$page.url.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}
		>
			Accueil
		</a>
		<a
			href="/dashboard/utilisateurs"
			class={`text-sm font-medium ${$page.url.pathname === '/dashboard/utilisateurs' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}
		>
			Utilisateurs
		</a>
		<a
			href="/dashboard/ventes"
			class={`text-sm font-medium ${$page.url.pathname === '/dashboard/ventes' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}
		>
			Ventes
		</a>
		<a
			href="/dashboard/products"
			class={`text-sm font-medium ${$page.url.pathname === '/dashboard/products' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}
		>
			Produits
		</a>
		<a
			href="/dashboard/categories"
			class={`text-sm font-medium ${$page.url.pathname === '/dashboard/categories' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}
		>
			Categories
		</a>
	</nav>
</div>

<slot {data} />
