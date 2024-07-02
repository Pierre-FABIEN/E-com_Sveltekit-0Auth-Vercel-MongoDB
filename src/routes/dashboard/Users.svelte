<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { ChevronDown, Search } from 'lucide-svelte';
	import * as Avatar from '$UITools/shadcn/avatar';
	import { Button } from '$UITools/shadcn/button';
	import * as Card from '$UITools/shadcn/card';
	import * as Command from '$UITools/shadcn/command';
	import * as Popover from '$UITools/shadcn/popover';
	import { Input } from '$UITools/shadcn/input';
	import Separator from '$UITools/shadcn/separator/separator.svelte';

	export let Users: App.User[] = [];
	export let data;

	console.log(data, 'data from users');

	// Store for search query
	let searchQuery = writable<string>('');

	// Store for current page and items per page
	let currentPage = writable<number>(1);
	let itemsPerPage = writable<number>(6);

	// Filtered users based on search query
	let filteredUsers = writable<App.User[]>(Users);

	// Update the filtered users list whenever the search query changes
	searchQuery.subscribe((query: string) => {
		if (query) {
			filteredUsers.set(
				Users.filter(
					(user: App.User) =>
						user.name.toLowerCase().includes(query.toLowerCase()) ||
						user.email.toLowerCase().includes(query.toLowerCase())
				)
			);
		} else {
			filteredUsers.set(Users);
		}
	});

	// Calculate the displayed users for the current page
	const paginatedUsers = derived(
		[filteredUsers, currentPage, itemsPerPage],
		([$filteredUsers, $currentPage, $itemsPerPage]) => {
			const start = ($currentPage - 1) * $itemsPerPage;
			const end = start + $itemsPerPage;
			return $filteredUsers.slice(start, end);
		}
	);

	// Calculate the total number of pages
	const totalPages = derived([filteredUsers, itemsPerPage], ([$filteredUsers, $itemsPerPage]) => {
		return Math.ceil($filteredUsers.length / $itemsPerPage);
	});

	// Handle input change
	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery.set(target.value);
	}
</script>

<div class="flex w-[100%] justify-center">
	<Card.Root class="mt-5 w-[100%] ccb">
		<Card.Header class="w-[100%]">
			<Card.Title>Clients</Card.Title>
			<Card.Description>Invite your Users to collaborate</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-6 w-[100%]">
			<!-- Search bar -->
			<div class="relative">
				<Search
					class="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground"
				/>
				<Input placeholder="Search" class="pl-8" on:input={handleInputChange} />
			</div>
			<!-- Filtered users list -->
			{#each $paginatedUsers as user (user.email)}
				<div class="flex items-center justify-between space-x-4">
					<div class="flex items-top space-x-4">
						<Avatar.Root>
							<Avatar.Image src={user.image} alt={user.name} />
						</Avatar.Root>
						<div>
							<p class="text-sm font-medium leading-none">{user.name}</p>
							<p class="text-sm text-muted-foreground">{user.email}</p>
							<h2>Adresses</h2>
							{#if user.addresses && user.addresses.length > 0}
								{#each user.addresses as address}
									<Separator />
									<p class="text-sm text-muted-foreground">{address.state}</p>
									<p class="text-sm text-muted-foreground">{address.city}</p>
								{/each}
							{/if}
							<h2>Commandes</h2>
							{#if user.orders && user.orders.length > 0}
								{#each user.orders as order (order.createdAt)}
									<Separator />
									<h2>Adresse de la commande</h2>
									<p class="text-sm text-muted-foreground">{order.createdAt}</p>
									<p class="text-sm text-muted-foreground">{order.address.state}</p>
									<p class="text-sm text-muted-foreground">{order.address.street}</p>
									<h2>Produit de la commande</h2>
									{#if order.products && order.products.length > 0}
										{#each order.products as product (product.name)}
											<Separator />
											<p class="text-sm text-muted-foreground">{product.name}</p>
											<p class="text-sm text-muted-foreground">{product.price}</p>
										{/each}
									{/if}
								{/each}
							{/if}
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
