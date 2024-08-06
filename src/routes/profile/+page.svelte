<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import type { PageData } from './$types';

	import * as Card from '$shadcn/card';

	import { deleteAddressSchema } from '$server/address/Schema/addressSchema';

	import { showNotification } from '$stores/Data/notificationStore';
	import Table from '$components/Table.svelte';

	export let data: PageData;

	const deleteAddress = superForm(data?.IdeleteAddressSchema ?? {}, {
		validators: zodClient(deleteAddressSchema),
		id: 'deleteAddress'
	});

	const { enhance: deleteAddressEnhance, message: deleteAddressMessage } = deleteAddress;
	const formattedData = formatProductData(data?.userDetails?.transactions ?? []);

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
		{ key: 'status', label: 'Statut' },
		{ key: 'amount', label: 'Montant' },
		{ key: 'createdAt', label: 'Date de mise à jour' }
	];

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} à ${hours}:${minutes}`;
	}

	function formatProductData(items: any[]) {
		return items.map((item) => ({
			...item,
			createdAt: formatDate(item.createdAt)
		}));
	}
</script>

<div class="ccc">
	<Card.Root class="w-[80vw]">
		<Card.Header>
			<Card.Title>Information sur votre profil</Card.Title>
			<Card.Description
				>Vous ne pouvez pas modifier les informations de votre compte Google</Card.Description
			>
			<div class="content-basic rcs mt-5">
				{#if data?.session?.user?.image}
					<img src={data.session.user.image} alt={`Image of ${data.session?.user.name}`} />
				{/if}
				<div class="content-basic-wrapper clc ml-5">
					<h1>{data?.session?.user?.name}</h1>
					<p>{data?.session?.user?.email}</p>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="clc w-[100%] my-5">
				<Table
					name="Adresses"
					columns={addressColumns}
					data={data?.userDetails?.addresses ?? []}
					deleteActionUrl="?/deleteAddress"
					editActionUrl="/profile/address/"
					newActionUrl="/profile/address"
					enhance={deleteAddressEnhance}
				/>
			</div>

			<div class="clc w-[100%] my-5">
				<Table
					name="Transactions"
					columns={transactionColumns}
					data={formattedData}
					invoiceActionUrl="profile/"
				/>
			</div>
		</Card.Content>
	</Card.Root>
</div>
