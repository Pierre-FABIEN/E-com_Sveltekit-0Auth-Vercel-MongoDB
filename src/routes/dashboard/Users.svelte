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

	export let Users: Array<{ name: string; email: string; image: string }>;

	// Store pour le texte de recherche
	let searchQuery = writable('');

	// Store pour la page actuelle et le nombre d'éléments par page
	let currentPage = writable(1);
	let itemsPerPage = writable(6);

	// Utilisateurs filtrés en fonction de la recherche
	let filteredUsers = writable(Users);

	// Met à jour la liste des utilisateurs filtrés chaque fois que la recherche change
	searchQuery.subscribe((query) => {
		if (query) {
			filteredUsers.set(
				Users.filter(
					(user) =>
						user.name.toLowerCase().includes(query.toLowerCase()) ||
						user.email.toLowerCase().includes(query.toLowerCase())
				)
			);
		} else {
			filteredUsers.set(Users);
		}
	});

	// Calcul des utilisateurs affichés pour la page actuelle
	const paginatedUsers = derived(
		[filteredUsers, currentPage, itemsPerPage],
		([$filteredUsers, $currentPage, $itemsPerPage]) => {
			const start = ($currentPage - 1) * $itemsPerPage;
			const end = start + $itemsPerPage;
			return $filteredUsers.slice(start, end);
		}
	);

	// Calcul du nombre total de pages
	const totalPages = derived([filteredUsers, itemsPerPage], ([$filteredUsers, $itemsPerPage]) => {
		return Math.ceil($filteredUsers.length / $itemsPerPage);
	});
</script>

<div class="flex w-[100%] h-[650px] justify-center">
	<Card.Root class="w-[80vw] mt-5 ccb">
		<Card.Header class="w-[100%]">
			<Card.Title>Clients</Card.Title>
			<Card.Description>Invite your Users to collaborate</Card.Description>
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
			<!-- Liste des utilisateurs filtrés -->
			{#each $paginatedUsers as user}
				<div class="flex items-center justify-between space-x-4">
					<div class="flex items-center space-x-4">
						<Avatar.Root>
							<Avatar.Image src={user.image} alt={user.name} />
						</Avatar.Root>
						<div>
							<p class="text-sm font-medium leading-none">{user.name}</p>
							<p class="text-sm text-muted-foreground">{user.email}</p>
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
