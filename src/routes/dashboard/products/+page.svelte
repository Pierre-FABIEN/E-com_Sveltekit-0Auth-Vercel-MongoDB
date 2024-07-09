<script lang="ts">
	import TableProduct from '$components/product/TableProduct.svelte';
	export let data;
</script>

<div class="rcs m-5">
	<div class="w-[100%] m-5">
		<TableProduct {data} />
	</div>
</div>
