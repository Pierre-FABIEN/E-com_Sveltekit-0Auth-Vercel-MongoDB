<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import type { PageData } from './$types';

	import { ChevronDown, Search } from 'lucide-svelte';
	import * as Avatar from '$UITools/shadcn/avatar';
	import { Button } from '$UITools/shadcn/button';
	import * as Card from '$UITools/shadcn/card';
	import * as Command from '$UITools/shadcn/command';
	import * as Popover from '$UITools/shadcn/popover';
	import { Input } from '$UITools/shadcn/input';

	export let Products;

	// Store pour le texte de recherche
	let searchQuery = writable('');

	// Store pour la page actuelle et le nombre d'éléments par page
	let currentPage = writable(1);
	let itemsPerPage = writable(4);

	// Utilisateurs filtrés en fonction de la recherche
	let filteredProducts = writable(Products);

	// Met à jour la liste des produits filtrés chaque fois que la recherche change
	searchQuery.subscribe((query) => {
		if (query) {
			filteredProducts.set(
				Products.filter(
					(product: any) =>
						product.name.toLowerCase().includes(query.toLowerCase()) ||
						product.description.toLowerCase().includes(query.toLowerCase())
				)
			);
		} else {
			filteredProducts.set(Products);
		}
	});

	// Calcul des produits affichés pour la page actuelle
	const paginatedProducts = derived(
		[filteredProducts, currentPage, itemsPerPage],
		([$filteredProducts, $currentPage, $itemsPerPage]) => {
			const start = ($currentPage - 1) * $itemsPerPage;
			const end = start + $itemsPerPage;
			return $filteredProducts.slice(start, end);
		}
	);

	// Calcul du nombre total de pages
	const totalPages = derived(
		[filteredProducts, itemsPerPage],
		([$filteredProducts, $itemsPerPage]) => {
			return Math.ceil($filteredProducts.length / $itemsPerPage);
		}
	);
</script>

<div class="flex w-[100%] h-[650px] justify-center">
	<Card.Root class="w-[80vw] mt-5 ccb">
		<Card.Header class="w-[100%]">
			<Card.Title>Produits</Card.Title>
			<Card.Description>Invite your Products to collaborate</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-6 w-[100%]">
			<!-- Barre de recherche -->
			<div class="relative">
				<Search
					class="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground"
				/>
				<Input
					placeholder="Search"
					class="pl-8"
					on:input={(e) => searchQuery.set(e.target.value)}
				/>
			</div>
			<!-- Liste des produits filtrés -->
			{#each $paginatedProducts as product}
				<div class="flex items-center justify-between space-x-4">
					<div class="flex items-center space-x-4">
						<Avatar.Root>
							<Avatar.Image src={product.images[0]} alt={product.name} />
						</Avatar.Root>
						<div>
							<p class="text-sm font-medium leading-none">Name: {product.name}</p>
							<p class="text-sm text-muted-foreground">
								Description: {product.description.length > 50
									? product.description.substring(0, 50) + '...'
									: product.description}
							</p>
							<p class="text-sm text-muted-foreground">Stock: {product.stock}</p>
							<p class="text-sm text-muted-foreground">Prix: {product.price}</p>
						</div>
					</div>
					<Popover.Root>
						<Popover.Trigger asChild let:builder>
							<Button builders={[builder]} variant="outline" class="ml-auto">
								Owner
								<ChevronDown class="ml-2 h-4 w-4 text-muted-foreground" />
							</Button>
						</Popover.Trigger>
						<Popover.Content class="p-0" align="end">
							<Command.Root>
								<Command.Input placeholder="Select new role..." />
								<Command.List>
									<Command.Empty>No roles found.</Command.Empty>
									<Command.Group>
										<Command.Item class="flex flex-col items-start space-y-1 px-4 py-2">
											<p>Viewer</p>
											<p class="text-sm text-muted-foreground">Can view and comment.</p>
										</Command.Item>
										<Command.Item class="flex flex-col items-start space-y-1 px-4 py-2">
											<p>Developer</p>
											<p class="text-sm text-muted-foreground">Can view, comment, and edit.</p>
										</Command.Item>
										<Command.Item class="flex flex-col items-start space-y-1 px-4 py-2">
											<p>Billing</p>
											<p class="text-sm text-muted-foreground">
												Can view, comment and manage billing.
											</p>
										</Command.Item>
										<Command.Item class="flex flex-col items-start space-y-1 px-4 py-2">
											<p>Owner</p>
											<p class="text-sm text-muted-foreground">
												Admin-level access to all resources.
											</p>
										</Command.Item>
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
			{/each}
		</Card.Content>
		<Card.Footer class="w-[100%]">
			<div class="rtb w-[100%]">
				<Button
					on:click={() => currentPage.update((n) => Math.max(n - 1, 1))}
					disabled={$currentPage === 1}
				>
					Previous
				</Button>
				<p>Page {$currentPage} of {$totalPages}</p>
				<Button
					on:click={() => currentPage.update((n) => Math.min(n + 1, $totalPages))}
					disabled={$currentPage === $totalPages}
				>
					Next
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
