<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import type { PageData } from './$types';

	import * as Card from '$shadcn/card';
	import { Button } from '$shadcn/button';

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

	const transactionColumns = [
		{ key: 'updatedAt', label: 'Date de mise à jour' },
		{ key: 'status', label: 'Statut' },
		{ key: 'amount', label: 'Montant' }
	];

	console.log(data, 'data from +page.svelte');
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
			<div class="clc w-[100%] my-5">
				<Table
					name="Adresses"
					columns={addressColumns}
					data={data.userDetails.addresses}
					deleteActionUrl="?/deleteAddress"
					newActionUrl="/profile/address"
					enhance={deleteAddressEnhance}
					message={deleteAddressMessage}
				/>
			</div>

			<div class="clc w-[100%] my-5">
				<Table
					name="Transactions"
					columns={transactionColumns}
					data={data.userDetails?.transactions}
				/>
			</div>
		</Card.Content>
	</Card.Root>
</div>
