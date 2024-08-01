<script lang="ts">
	import { enter, exit } from './transition';
	import type { PageData } from './$types';
	import Table from '$components/Table.svelte';
	import { showNotification } from '$stores/Data/notificationStore';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { deleteUserSchema } from '$server/user/userSchema';
	import { onNavigate } from '$app/navigation';

	export let data: PageData;
	let path: string | undefined | null;

	onNavigate((navigation) => {
		path = navigation.to?.route.id;
	});

	const userColumns = [
		{ key: 'name', label: 'Nom' },
		{ key: 'email', label: 'Email' },
		{ key: 'role', label: 'Role' }
	];

	const deleteUser = superForm(data.IdeleteUserSchema, {
		validators: zodClient(deleteUserSchema),
		id: 'deleteUser'
	});

	const { enhance: deleteUserEnhance, message: deleteUserMessage } = deleteUser;

	const formattedData = formatProductData(data.allUsers);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} à ${hours}:${minutes}`;
	}

	const usersColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'createdAt', label: 'Date de création', formatter: formatDate }
	];

	function formatProductData(items: any[]) {
		return items.map((item) => ({
			...item,
			createdAt: formatDate(item.createdAt)
		}));
	}

	$: if ($deleteUserMessage) {
		showNotification(
			$deleteUserMessage,
			$deleteUserMessage.includes('success') ? 'success' : 'error'
		);
	}
</script>

<div class="min-h-screen min-w-[100vw] absolute" in:enter={{ path }} out:exit={{ path }}>
	<div class="ccc m-5">
		<div class="w-[100%] mt-5">
			<Table
				name="Utilisateurs"
				columns={userColumns}
				data={formattedData}
				deleteActionUrl="?/deleteUser"
				newActionUrl="/dashboard/users/create"
				editActionUrl="/dashboard/users/"
				enhance={deleteUserEnhance}
			/>
		</div>
	</div>
</div>
