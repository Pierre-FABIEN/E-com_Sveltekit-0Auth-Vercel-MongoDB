<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import * as Card from '$UITools/shadcn/card';
	import { Button } from '$UITools/shadcn/button';
	import { Input } from '$UITools/shadcn/input';
	import * as Form from '$UITools/shadcn/form';

	import { profileSchema } from '$lib/ZodSchema/profileSchema';

	export let data: PageData;

	onMount(() => {
		console.log(data, 'data de profil ');
	});

	const formProfil = superForm(data.formProfil, {
		validators: zodClient(profileSchema)
	});

	const { form, enhance, message, validate } = formProfil;

	let userId: string = data.session?.user.id;
</script>

<div class="card">
	<Card.Root class="w-full">
		<form method="POST" action="?/create" use:enhance class="space-y-4">
			<Card.Header>
				<Card.Title>Information sur votre profil</Card.Title>
				<Card.Description
					>Vous ne pouvez pas modifier les informations de votre compte google</Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-6">
				<div class="content-basic">
					<img src={data.session?.user.image} alt="image du compte" />
					<div class="content-basic-wrapper">
						<h1>{data.session?.user.name}</h1>
						<p>{data.session?.user.email}</p>
					</div>
				</div>

				<div>
					<Form.Field name="address" form={formProfil}>
						<Form.Control let:attrs>
							<Form.Label>Address</Form.Label>
							<Input
								{...attrs}
								type="text"
								placeholder={data.user?.address}
								bind:value={$form.address}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div>
					<Form.Field name="city" form={formProfil}>
						<Form.Control let:attrs>
							<Form.Label>City</Form.Label>
							<Input {...attrs} type="text" placeholder={data.user?.city} bind:value={$form.city} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div>
					<Form.Field name="postalCode" form={formProfil}>
						<Form.Control let:attrs>
							<Form.Label>Postal Code</Form.Label>
							<Input
								{...attrs}
								type="text"
								placeholder={data.user?.postalCode}
								bind:value={$form.postalCode}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div>
					<Form.Field name="phoneNumber" form={formProfil}>
						<Form.Control let:attrs>
							<Form.Label>Phone</Form.Label>
							<Input
								{...attrs}
								type="phone"
								placeholder={data.user?.phoneNumber}
								bind:value={$form.phoneNumber}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</Card.Content>
			<input type="hidden" name="id" value={userId} />
			<Card.Footer class="justify-end space-x-2">
				<Button type="submit" variant="outline">Submit</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>

<style lang="scss">
	@import '../styles/utils/flex';

	.card {
		margin-top: 50px;
		margin-right: auto;
		margin-left: auto;
		width: 80vw;
	}

	.content-basic {
		@include rcs;
		.content-basic-wrapper {
			@include clc;
			margin-left: 20px;

			h1 {
				font-size: 20px;
			}

			p {
				opacity: 0.5;
			}
		}
	}
</style>
