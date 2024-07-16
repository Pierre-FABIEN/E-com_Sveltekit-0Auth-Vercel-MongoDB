<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import type { PageData } from './$types';

	import * as Card from '$shadcn/card';
	import { Button } from '$shadcn/button';
	import * as AlertDialog from '$shadcn/alert-dialog';

	import { deleteAddressSchema } from '$zod/addressSchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import Table from '$components/Table.svelte';

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

	const addressColumns = [
		{ key: 'recipient', label: 'Destinataire' },
		{ key: 'street', label: 'Rue' },
		{ key: 'city', label: 'Ville' },
		{ key: 'zip', label: 'Code postal' },
		{ key: 'country', label: 'Pays' }
	];

	const orderColumns = [
		{ key: 'updatedAt', label: 'Date de mise à jour' },
		{ key: 'status', label: 'Statut' },
		{ key: 'total', label: 'Total' }
	];

	const transactionColumns = [
		{ key: 'updatedAt', label: 'Date de mise à jour' },
		{ key: 'status', label: 'Statut' },
		{ key: 'amount', label: 'Montant' }
	];
</script>

<div class="ccc">
	<Card.Root class="w-[80vw]">
		<Card.Header>
			<Card.Title>Information sur votre profil</Card.Title>
			<Card.Description
				>Vous ne pouvez pas modifier les informations de votre compte google</Card.Description
			>

			<div class="content-basic rcs mt-5">
				<img src={data.session?.user.image} alt="image du compte" />
				<div class="content-basic-wrapper clc ml-5">
					<h1>{data.session?.user.name}</h1>
					<p>{data.session?.user.email}</p>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="clc w-[100%]">
				<h2>Adresses</h2>
				{#if data.userDetails?.addresses && data.userDetails?.addresses.length > 0}
					<Table
						columns={addressColumns}
						data={data.userDetails.addresses}
						hasActions={true}
						deleteActionUrl="?/deleteAddress"
						enhance={deleteAddressEnhance}
					/>
				{:else}
					<p class="text-gray-600">Aucune adresse présente.</p>
				{/if}

				<Button class="mt-4">
					<a data-sveltekit-preload-data href="/profile/address">Créer une adresse</a>
				</Button>
			</div>

			<div class="clc w-[100%]">
				<h2>Orders</h2>
				{#if data.orders && data.orders.length > 0}
					<Table
						columns={orderColumns}
						data={data.orders}
						hasActions={false}
						enhance={deleteAddressEnhance}
					/>
				{:else}
					<p class="text-gray-600">Aucune commande présente.</p>
				{/if}
			</div>

			<div class="clc w-[100%]">
				<h2>Transactions</h2>
				{#if data.transactions && data.transactions.length > 0}
					<Table columns={transactionColumns} data={data.transactions} hasActions={false} />
				{:else}
					<p class="text-gray-600">Aucune transaction présente.</p>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>
