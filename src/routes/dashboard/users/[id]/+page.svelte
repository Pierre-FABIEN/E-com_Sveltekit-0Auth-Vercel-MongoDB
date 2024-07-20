<!-- src/routes/dashboard/users/[id]/+page.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateUserAndAddressSchema } from '$zod/updateUserAndAddressSchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import { goto } from '$app/navigation';

	// Importation des composants nécessaires de Shadcn
	import * as Form from '$shadcn/form';
	import { Input } from '$shadcn/input';
	import { Button } from '$shadcn/button';

	export let data;

	$: console.log(data, 'data');

	if (!data || !data.IupdateUserAndAddressSchema || !data.IupdateUserAndAddressSchema.data) {
		throw new Error('Missing data for the form');
	}

	const updateUserAndAddresses = superForm(data.IupdateUserAndAddressSchema, {
		validators: zodClient(updateUserAndAddressSchema),
		id: 'updateUserAndAddresses',
		dataType: 'json' // Ajout de cette ligne pour gérer les données imbriquées
	});

	const { form, enhance, message } = updateUserAndAddresses;

	let addressSuggestions: string[] = [];
	let selectedAddressIndex: number | null = null;
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

	function handleInput(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		selectedAddressIndex = index;
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fetchAddressSuggestions(input.value);
		}, 1000);
	}

	function selectSuggestion(suggestion, index) {
		const { house_number, road, city, town, village, state, postcode, country } =
			suggestion.components;
		$form.addresses[index].street = `${house_number || ''} ${road || ''}`.trim();
		$form.addresses[index].city = city || town || village || '';
		$form.addresses[index].state = state || '';
		$form.addresses[index].zip = postcode || '';
		$form.addresses[index].country = country || '';
		addressSuggestions = [];
	}

	$: if ($message === 'User and addresses updated successfully') {
		showNotification(message, 'success');
		setTimeout(() => goto('/dashboard/users'), 2000);
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Update User and Addresses</h1>
	<form method="POST" action="?/updateUserAndAddresses" use:enhance class="space-y-4">
		<Form.Field name="role" form={updateUserAndAddresses}>
			<Form.Control let:attrs>
				<Form.Label>Role</Form.Label>
				<Input {...attrs} type="text" bind:value={$form.role} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		{#each $form.addresses as address, index}
			<div class="address-form rounded border p-5" key={index}>
				{#if addressSuggestions.length > 0 && selectedAddressIndex === index}
					<h2>Suggestions:</h2>
					<ul class="rounded border p-2">
						{#each addressSuggestions as suggestion}
							<li class="cursor-pointer" on:click={() => selectSuggestion(suggestion, index)}>
								{suggestion.formatted}
							</li>
						{/each}
					</ul>
				{/if}

				<h2 class="text-2xl font-bold mb-4">{address.recipient}</h2>

				<Form.Field name={`addresses[${index}].recipient`} form={updateUserAndAddresses}>
					<Form.Control let:attrs>
						<Form.Label>Recipient</Form.Label>
						<Input {...attrs} type="text" bind:value={address.recipient} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field name={`addresses[${index}].street`} form={updateUserAndAddresses}>
					<Form.Control let:attrs>
						<Form.Label>Street</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={(event) => handleInput(event, index)}
							bind:value={address.street}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field name={`addresses[${index}].city`} form={updateUserAndAddresses}>
					<Form.Control let:attrs>
						<Form.Label>City</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={(event) => handleInput(event, index)}
							bind:value={address.city}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field name={`addresses[${index}].state`} form={updateUserAndAddresses}>
					<Form.Control let:attrs>
						<Form.Label>State</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={(event) => handleInput(event, index)}
							bind:value={address.state}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field name={`addresses[${index}].zip`} form={updateUserAndAddresses}>
					<Form.Control let:attrs>
						<Form.Label>ZIP Code</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={(event) => handleInput(event, index)}
							bind:value={address.zip}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field name={`addresses[${index}].country`} form={updateUserAndAddresses}>
					<Form.Control let:attrs>
						<Form.Label>Country</Form.Label>
						<Input
							{...attrs}
							type="text"
							on:input={(event) => handleInput(event, index)}
							bind:value={address.country}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<input type="hidden" name={`addresses[${index}].id`} bind:value={address.id} />
			</div>
		{/each}
		<Button type="submit">Save changes</Button>
	</form>
</div>

<style>
	.error {
		color: red;
	}
</style>
