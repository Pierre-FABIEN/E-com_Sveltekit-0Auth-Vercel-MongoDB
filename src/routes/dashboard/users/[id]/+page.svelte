<!-- src/routes/dashboard/users/[id]/+page.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateUserAndAddressSchema } from '$zod/updateUserAndAddressSchema';
	import { showNotification } from '$stores/Data/notificationStore';
	import { enter, exit } from './transition';

	// Importation des composants nécessaires de Shadcn
	import * as Form from '$shadcn/form';
	import * as DropdownMenu from '$shadcn/dropdown-menu';
	import { Input } from '$shadcn/input';
	import { Button } from '$shadcn/button';
	import { goto, onNavigate } from '$app/navigation';

	export let data;
	let path: string | undefined | null;

	onNavigate((navigation) => {
		path = navigation.to?.route.id;
	});

	if (!data || !data.IupdateUserAndAddressSchema || !data.IupdateUserAndAddressSchema.data) {
		throw new Error('Missing data for the form');
	}

	const updateUserAndAddresses = superForm(data.IupdateUserAndAddressSchema, {
		validators: zodClient(updateUserAndAddressSchema),
		id: 'updateUserAndAddresses',
		dataType: 'json',
		onResult: (data) => {
			if (data.result.data.form.message === 'User and addresses updated successfully') {
				showNotification(data.result.data.form.message, 'success');
				setTimeout(() => goto('/dashboard/users'), 0);
			}
		}
	});

	const { form, enhance, message } = updateUserAndAddresses;

	let addressSuggestions: any[] = [];

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

	function selectSuggestion(suggestion: any, index: any) {
		const { house_number, road, city, town, village, state, postcode, country } =
			suggestion.components;
		$form.addresses[index].street = `${house_number || ''} ${road || ''}`.trim();
		$form.addresses[index].city = city || town || village || '';
		$form.addresses[index].state = state || '';
		$form.addresses[index].zip = postcode || '';
		$form.addresses[index].country = country || '';
		addressSuggestions = [];
	}

	const roleOptions = ['admin', 'user'];
</script>

<div class="min-h-screen min-w-[100vw] absolute" in:enter={{ path }} out:exit={{ path }}>
	<div class="container mx-auto p-4">
		<h1 class="text-2xl font-bold mb-4">Update User and Addresses</h1>
		<form method="POST" action="?/updateUserAndAddresses" use:enhance class="space-y-4">
			<Form.Field name="role" form={updateUserAndAddresses}>
				<Form.Control let:attrs>
					<Form.Label>Role</Form.Label>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button variant="outline" builders={[builder]}>
								{$form.role ? $form.role : 'Select Role'}
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56">
							<DropdownMenu.Label>Role</DropdownMenu.Label>
							<DropdownMenu.Separator />
							{#each roleOptions as option}
								<DropdownMenu.Item on:click={() => ($form.role = option)}>
									{option}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="rts">
				{#each $form.addresses as address, index}
					<div class="address-form rounded border m-5 p-5 min-w-[500px]">
						{#if addressSuggestions.length > 0 && selectedAddressIndex === index}
							<h2>Suggestions:</h2>
							<ul class="rounded border p-2">
								{#each addressSuggestions as suggestion}
									<li>
										<button
											type="button"
											class="cursor-pointer"
											on:click={() => selectSuggestion(suggestion, index)}
										>
											{suggestion.formatted}
										</button>
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
			</div>
			<Button type="submit">Save changes</Button>
		</form>
	</div>
</div>
