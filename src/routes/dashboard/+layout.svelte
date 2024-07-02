<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="ccc">
	<nav class="flex items-center border space-x-4 lg:space-x-6 rcb w-[400px] p-3">
		<a href="/dashboard" class="text-sm font-medium transition-colors hover:text-primary">
			Accueil
		</a>
		<a
			href="/dashboard/utilisateurs"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Utilisateurs
		</a>
		<a
			href="/dashboard/ventes"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Ventes
		</a>
		<a
			href="/dashboard/produits"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Produits
		</a>
	</nav>
</div>

<slot {data} />
