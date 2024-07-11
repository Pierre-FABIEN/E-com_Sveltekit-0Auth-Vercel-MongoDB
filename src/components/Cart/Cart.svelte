<script lang="ts">
	import * as Popover from '$UITools/shadcn/popover/index.js';

	export let data;

	type OrderItem = {
		id: string;
		product: {
			name: string;
			price: number;
			images: string[];
		};
		quantity: number;
		price: number;
	};

	let items: OrderItem[] = data.session.order.items;

	// Calculer le total
	let total = items.reduce(
		(total: number, item: OrderItem) => total + item.price * item.quantity,
		0
	);
</script>

<Popover.Root>
	<Popover.Trigger>
		<button class="m-5 text-gray-600">
			<svg
				class="h-8 w-8"
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
				/></svg
			>
		</button>
	</Popover.Trigger>
	<Popover.Content class="w-[400px]">
		<div class="container mx-auto p-4">
			<h2 class="text-2xl font-bold mb-4">Your Cart</h2>
			{#if items.length > 0}
				<div class="ccc">
					{#each items as item (item.id)}
						<div class="p-4 border rounded-lg shadow-sm flex items-center w-[100%]">
							<img
								src={item.product.images[0]}
								alt={item.product.name}
								class="w-20 h-20 object-cover mr-4"
							/>
							<div class="flex-1">
								<h3 class="text-lg font-semibold">{item.product.name}</h3>
								<p class="text-gray-600">${item.product.price.toFixed(1)}</p>
								<p class="text-gray-600">Quantity: {item.quantity}</p>
							</div>
							<div class="text-right flex flex-col items-end">
								<p class="text-lg font-semibold">${(item.price * item.quantity).toFixed(1)}</p>

								<div class="p-4">
									<button
										class="flex items-center text-gray-600 mb-2"
										on:click={() => console.log(`Edit ${item.product.name}`)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9" />
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.5 3.5a2.121 2.121 0 113 3L7.5 18H4v-3.5L16.5 3.5z"
											/>
										</svg>
										Edit
									</button>
									<button
										class="flex items-center text-gray-600"
										on:click={() => console.log(`Delete ${item.product.name}`)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
										Delete
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-4 p-4 border-t">
					<div class="flex justify-between items-center">
						<span class="text-xl font-semibold">Total:</span>
						<span class="text-xl font-semibold">${total.toFixed(1)}</span>
					</div>
				</div>
			{:else}
				<p class="text-gray-600">Your cart is empty.</p>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
