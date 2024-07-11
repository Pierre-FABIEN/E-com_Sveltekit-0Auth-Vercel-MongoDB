<script lang="ts">
	import * as Popover from '$UITools/shadcn/popover/index.js';
	import * as Select from '$UITools/shadcn/select/index.js';
	import Trash from 'svelte-radix/Trash.svelte';

	import {
		cart,
		type OrderItem,
		addToCart,
		removeFromCart,
		updateCartItemQuantity
	} from '$stores/Data/cartStore';
	import { Badge } from '$UITools/shadcn/badge';

	function handleRemoveFromCart(productId: string) {
		removeFromCart(productId);
	}

	function changeQuantity(productId: string, quantity: number) {
		updateCartItemQuantity(productId, quantity);
	}

	let quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1).map((value) => ({
		value,
		label: value.toString()
	}));
</script>

<Popover.Root>
	<Popover.Trigger>
		<button class="m-5 text-gray-600 relative">
			<svg
				class="h-8 w-8"
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
				/>
			</svg>
			<Badge class="absolute bottom-5 left-5">
				{#if $cart && $cart.items}
					{$cart.items.length > 0 ? $cart.items.length : '0'}
				{:else}
					0
				{/if}
			</Badge>
		</button>
	</Popover.Trigger>
	<Popover.Content class="w-[400px]">
		<div class="container mx-auto p-4">
			<h2 class="text-2xl font-bold mb-4">Your Cart</h2>
			{#if $cart && $cart.items}
				{#if $cart.items.length > 0}
					<div class="ccc h-[130px]">
						{#each $cart.items as item (item.id)}
							<div class="p-4 border rounded-lg shadow-sm flex rcb w-[100%]">
								{#if item.product.images && item.product.images[0]}
									<img
										src={item.product.images[0]}
										alt={item.product.name}
										class="w-20 h-20 object-cover mr-4"
									/>
								{/if}
								<div class="flex-1 clb">
									<h3 class="text-lg font-semibold">{item.product.name}</h3>
									<p class="text-gray-600">${item.product.price.toFixed(1)}€</p>
									<Select.Root portal={null}>
										<Select.Trigger class="w-[100px]">
											<Select.Value placeholder={item.quantity.toString()} />
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												<Select.Label>Quantité</Select.Label>
												{#each quantityOptions as option}
													<Select.Item
														value={option.value}
														on:click={() => changeQuantity(item.product.id, option.value)}
														>{option.label}</Select.Item
													>
												{/each}
											</Select.Group>
										</Select.Content>
										<Select.Input name="quantity" />
									</Select.Root>
								</div>
								<div class="text-right crb items-end h-[100%]">
									<p class="text-lg font-semibold">
										{(item.price * item.quantity).toFixed(1)}€
									</p>
									<button
										on:click={() => handleRemoveFromCart(item.product.id)}
										class="text-red-600 hover:text-red-800 mt-2"
									>
										<Trash />
									</button>
								</div>
							</div>
						{/each}
					</div>
					<div class="mt-4 p-4 border-t rounded-none">
						<div class="flex justify-between items-center">
							<span class="text-xl font-semibold">Total:</span>
							<span class="text-xl font-semibold">
								{$cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(1)}€
							</span>
						</div>
					</div>
				{:else}
					<p class="text-gray-600">Your cart is empty.</p>
				{/if}
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
