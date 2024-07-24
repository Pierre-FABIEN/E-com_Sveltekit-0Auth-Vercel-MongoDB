<script lang="ts">
	import Table from '$components/Table.svelte';

	export let data;

	let formattedData = [];

	if (data && data.transactions) {
		formattedData = formatProductData(data.transactions);
	}

	function formatProductData(items: any[]) {
		return items.map((item) => ({
			...item,
			createdAt: formatDate(item.createdAt)
		}));
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} à ${hours}:${minutes}`;
	}

	const TransactionsColumn = [
		{ key: 'status', label: 'Status' },
		{ key: 'createdAt', label: 'Date de création', formatter: formatDate },
		{ key: 'app_user_name', label: 'Nom sur la transaction' },
		{ key: 'app_user_email', label: 'Email sur la transaction' },
		{ key: 'amount', label: 'Prix' }
	];
</script>

<div class="ccc m-5">
	<div class="w-[100%] mt-5">
		<Table name="Transactions" columns={TransactionsColumn} data={formattedData} invoiceActionUrl />
	</div>
</div>
