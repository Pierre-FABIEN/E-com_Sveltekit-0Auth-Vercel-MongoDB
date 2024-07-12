<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import Trash from 'svelte-radix/Trash.svelte';

	import type { PageData } from './$types';

	import * as Card from '$shadcn/card';
	import { Button } from '$shadcn/button';
	import * as AlertDialog from '$shadcn/alert-dialog';

	import { deleteAddressSchema } from '$zod/addressSchema';
	import { showNotification } from '$stores/Data/notificationStore';

	export let data: PageData;

	const deleteAddress = superForm(data.IdeleteAddressSchema, {
		validators: zodClient(deleteAddressSchema),
		id: 'deleteAddress'
	});

	const { enhance: deleteAddressEnhance, message: deleteAddressMessage } = deleteAddress;

	$: if ($deleteAddressMessage) {
		showNotification(
			$deleteAddressMessage,
			$deleteAddressMessage.includes('success') ? 'success' : 'error'
		);
	}
</script>

<div class="card">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Information sur votre profil</Card.Title>
			<Card.Description
				>Vous ne pouvez pas modifier les informations de votre compte google</Card.Description
			>

			<div class="content-basic rcs mt-5">
				<img src={data.session?.user.image} alt="image du compte" />
				<div class="content-basic-wrapper clc">
					<h1>{data.session?.user.name}</h1>
					<p>{data.session?.user.email}</p>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="clc m-5">
				<h2>Adresses</h2>

				{#if data.userDetails?.addresses && data.userDetails?.addresses.length > 0}
					{#each data.userDetails?.addresses as address}
						<div class="border rounded p-2 m-2 min-w-[400px] rcb">
							<div class="">
								<p class="text-sm text-muted-foreground">Rue: {address.street}</p>
								<p class="text-sm text-muted-foreground">Ville: {address.city}</p>
								<p class="text-sm text-muted-foreground">Pays: {address.country}</p>
							</div>
							<div class="w-[50px]">
								<AlertDialog.Root form={deleteAddress}>
									<AlertDialog.Trigger asChild let:builder>
										<Button builders={[builder]} variant="outline" class="m-1 p-1 text-xs">
											<Trash class="h-4 w-8" />
										</Button>
									</AlertDialog.Trigger>

									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
											<AlertDialog.Description>
												This action cannot be undone. This will permanently delete your account and
												remove your data from our servers.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<form method="POST" action="?/deleteAddress" use:deleteAddressEnhance>
												<input type="hidden" name="id" value={address.id} />
												<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
											</form>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>

								<Button class="m-1 p-1 text-xs">
									<a href="/dashboard/address/{address.id}">
										<PencilIcon class="h-4 w-8" />
									</a>
								</Button>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-gray-600">Aucune adresse présente.</p>
				{/if}

				<Button class="mt-4">
					<a href="/profile/address"> creer une adresse </a>
				</Button>
			</div>

			<div class="clc m-5">
				<h2>Orders</h2>
				{#if data.orders && data.orders.length > 0}
					{#each data.orders as address}
						<p class="text-sm text-muted-foreground">{address.state}</p>
						<p class="text-sm text-muted-foreground">{address.city}</p>
					{/each}
				{:else}
					<p class="text-gray-600">Aucune commande présente.</p>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>
