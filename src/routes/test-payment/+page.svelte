<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

	let stripe;

	onMount(async () => {
		stripe = await loadStripe(stripePublishableKey);
	});

	async function handleCheckout(orderId) {
		const response = await fetch('/api/create-checkout-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ orderId })
		});

		const { id } = await response.json();

		const { error } = await stripe.redirectToCheckout({
			sessionId: id
		});

		if (error) {
			console.error(error);
		}
	}
</script>

<button on:click={() => handleCheckout('order-id-from-your-database')}> Checkout </button>
