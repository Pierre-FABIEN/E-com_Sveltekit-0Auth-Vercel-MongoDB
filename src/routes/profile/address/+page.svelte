<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
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
		AllCategories: any;
		AllProducts: any;
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
</script>

<div class="container mx-auto p-6">
	<div class="max-w-xl border mx-auto rounded-md p-6">
		<h2 class="text-2xl font-semibold mb-4">Create Address</h2>
		<form method="POST" action="?/createAddress" use:createAddressEnhance class="space-y-4">
			<div class="space-y-2">
				<Form.Field name="street" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Rue</Form.Label>
						<Input {...attrs} type="text" bind:value={$createAddressData.street} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="city" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Ville</Form.Label>
						<Input {...attrs} type="text" bind:value={$createAddressData.city} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="state" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Etat</Form.Label>
						<Input {...attrs} type="text" bind:value={$createAddressData.state} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="zip" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Code postal</Form.Label>
						<Input {...attrs} type="text" bind:value={$createAddressData.zip} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="space-y-2">
				<Form.Field name="country" form={createAddress}>
					<Form.Control let:attrs>
						<Form.Label>Pays</Form.Label>
						<Input {...attrs} type="text" bind:value={$createAddressData.country} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<input type="hidden" name="userId" bind:value={$createAddressData.userId} />

			<Button type="submit" class="w-full">Save changes</Button>
		</form>
	</div>
</div>
