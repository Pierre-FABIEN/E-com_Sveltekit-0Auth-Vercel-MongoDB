<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { createAddressSchema } from '$zod/addressSchema';

	import * as Form from '$shadcn/form';
	import { Button } from '$shadcn/button';
	import { Input } from '$shadcn/input';

	import { showNotification } from '$stores/Data/notificationStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: {
		IcreateAddressSchema: SuperValidated<Infer<typeof createAddressSchema>>;
		categories: any;
		products: any;
	};

	const createAddress = superForm(data.IcreateAddressSchema, {
		validators: zodClient(createAddressSchema),
		id: 'createAddress',
		resetForm: true
	});

	const {
		form: createAddressData,
		enhance: createAddressEnhance,
		message: createAddressMessage
	} = createAddress;

	console.log(data, 'data');
	console.log($createAddressData, 'createAddressData');

	$: if ($createAddressMessage === 'Address created successfully') {
		goto('/profile');
		showNotification($createAddressMessage, 'success');
	}

	onMount(async () => {
		$createAddressData.userId = data.session.user.id;
	});

	let addressSuggestions: string[] = [];
	let timeoutId: ReturnType<typeof setTimeout>;

	async function fetchAddressSuggestions(query: string) {
		if (query.length < 3) {
			addressSuggestions = [];
			return;
		}

		try {
			const response = await fetch(`/api/open-cage?q=${encodeURIComponent(query)}`);
			const data = await response.json();
			addressSuggestions = data.suggestions;
		} catch (error) {
			console.error('Error fetching address suggestions:', error);
		}
	}

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fetchAddressSuggestions(input.value);
		}, 1000);
	}
	$: console.log(addressSuggestions, 'addressSuggestions');

	function selectSuggestion(suggestion) {
		const { house_number, road, city, town, village, state, postcode, country } =
			suggestion.components;
		$createAddressData.street = `${house_number || ''} ${road || ''}`.trim();
		$createAddressData.city = city || town || village || '';
		$createAddressData.state = state || '';
		$createAddressData.zip = postcode || '';
		$createAddressData.country = country || '';
		addressSuggestions = [];
	}
</script>

<div class="container mx-auto p-6">
	<div class="max-w-xl border mx-auto rounded-md p-6">
		<h2 class="text-2xl font-semibold mb-4">Create Address</h2>

		{#if addressSuggestions.length > 0}
			<h2>Suggestions:</h2>
			<ul class="rounded border p-2">
				{#each addressSuggestions as suggestion}
					<li>
						<button
							class="cursor-pointer"
							on:click={() => selectSuggestion(suggestion)}
							on:keydown={(event) => event.code === 'Enter' && selectSuggestion(suggestion)}
						>
							{suggestion.formatted}
						</button>
					</li>
				{/each}
			</ul>
		{/if}

		<form method="POST" action="?/createAddress" use:createAddressEnhance class="space-y-4">
			<div class="space-y-2">
				<Form.Field name="recipient" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Destinataire</Form.Label>
						<Input {...attrs} type="text" bind:value={$createAddressData.recipient} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="street" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Rue</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={handleInput}
							bind:value={$createAddressData.street}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="city" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Ville</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={handleInput}
							bind:value={$createAddressData.city}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="state" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Région:</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={handleInput}
							bind:value={$createAddressData.state}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="zip" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Code postal</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={handleInput}
							bind:value={$createAddressData.zip}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="country" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Pays</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={handleInput}
							bind:value={$createAddressData.country}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<input type="hidden" name="userId" bind:value={$createAddressData.userId} />

			<Button type="submit" class="w-full">Save changes</Button>
		</form>
	</div>
</div>
