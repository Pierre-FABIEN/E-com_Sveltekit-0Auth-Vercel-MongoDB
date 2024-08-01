<script lang="ts">
	import * as Select from '$shadcn/select/index.js';
	import Trash from 'svelte-radix/Trash.svelte';

	import { cart, removeFromCart, updateCartItemQuantity } from '$stores/Data/cartStore';
	import Button from '$shadcn/button/button.svelte';

	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { OrderSchema } from '$server/orders/orderSchema.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { showNotification } from '$stores/Data/notificationStore.js';
	const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

	let stripe;
	export let data;
	let selectedAddressId: string | null = null;

	const createPayment = superForm(data.IOrderSchema, {
		validators: zodClient(OrderSchema),
		id: 'createPayment',
		resetForm: true
	});

	const {
		form: createPaymentData,
		enhance: createPaymentEnhance,
		message: createPaymentMessage
	} = createPayment;

	onMount(async () => {
		stripe = await loadStripe(stripePublishableKey);
	});

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

	function selectAddress(addressId: string) {
		selectedAddressId = addressId;
	}

	function handleCheckout() {
		if (!selectedAddressId) {
			showNotification('Veuillez sélectionner une adresse', 'error');
		}
	}

	$: $createPaymentData.orderId = data.session.orders.id;
	$: $createPaymentData.addressId = selectedAddressId;
</script>

<div class="ccc">
	<div class="ctc w-[80vw]">
		<div class="container mx-auto p-4 cart w-[100%]">
			<h2 class="text-2xl font-bold mb-4">Your Cart</h2>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem numquam est repellendus odit
				cumque, soluta expedita magni, non vel neque rerum? At voluptatum in iure aliquam beatae
				vero accusamus ex.
			</p>

			<h2 class="text-2xl font-bold mb-4 mt-5">Vos adresses</h2>

			<div class="clc">
				{#if data.addresses.addresses && data.addresses.addresses.length > 0}
					{#each data.addresses.addresses as address}
						<button
							class="cursor-pointer border rounded p-2 m-2 min-w-[400px] rcb {selectedAddressId ===
							address.id
								? 'border-green-400'
								: ''}"
							on:click={() => selectAddress(address.id)}
						>
							<div class="clc">
								<p class="text-sm text-muted-foreground">Destinataire: {address.recipient}</p>
								<p class="text-sm text-muted-foreground">Rue: {address.street}</p>
								<p class="text-sm text-muted-foreground">Ville: {address.city}</p>
								<p class="text-sm text-muted-foreground">Code postal: {address.zip}</p>
								<p class="text-sm text-muted-foreground">Pays: {address.country}</p>
							</div>
						</button>
					{/each}
				{:else}
					<p class="text-gray-600">Aucune adresse présente.</p>
				{/if}
				<Button class="mt-4">
					<a data-sveltekit-preload-data href="/profile/address"> creer une adresse </a>
				</Button>
			</div>
		</div>

		<div class="container mx-auto p-4 cart w-[100%]">
			{#if $cart && $cart.items}
				{#if $cart.items.length > 0}
					<div class="ccc max-h-[80vh]">
						{#each $cart.items as item (item.id)}
							<div class="p-4 border rounded-lg shadow-sm flex rcb w-[100%] mb-2">
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

			<div class="crc w-[100%]">
				<form method="POST" action="?/checkout" use:createPaymentEnhance on:submit={handleCheckout}>
					<input type="hidden" name="orderId" bind:value={$createPaymentData.orderId} />
					<input type="hidden" name="addressId" bind:value={$createPaymentData.addressId} />
					<Button type="submit">Payer</Button>
				</form>
			</div>
		</div>
	</div>
</div>
