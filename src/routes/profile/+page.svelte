<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import type { PageData } from './$types';

	import * as Card from '$shadcn/card';
	import { Button } from '$shadcn/button';

	import { profileSchema } from '$zod/profileSchema';

	export let data: PageData;

	const formProfil = superForm(data.formProfil, {
		validators: zodClient(profileSchema)
	});

	const { form, enhance, message, validate } = formProfil;

	let userId: string = data.session?.user.id;

	console.log(data, 'data');
</script>

<div class="card">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Information sur votre profil</Card.Title>
			<Card.Description
				>Vous ne pouvez pas modifier les informations de votre compte google</Card.Description
			>

			<div class="content-basic rcs mt-5">
				<img src={data.session?.user.image} alt="image du compte" />
				<div class="content-basic-wrapper clc">
					<h1>{data.session?.user.name}</h1>
					<p>{data.session?.user.email}</p>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="clc m-5">
				<h2>Adresses</h2>
				{#if data.addresses && data.addresses.length > 0}
					{#each data.addresses as address}
						<p class="text-sm text-muted-foreground">{address.state}</p>
						<p class="text-sm text-muted-foreground">{address.city}</p>
					{/each}
				{:else}
					<p class="text-gray-600">Aucune adresse présente.</p>
				{/if}
				<Button class="mt-4">
					<a href="/profile/address"> creer une adresse </a>
				</Button>
			</div>

			<div class="clc m-5">
				<h2>Orders</h2>
				{#if data.orders && data.orders.length > 0}
					{#each data.orders as address}
						<p class="text-sm text-muted-foreground">{address.state}</p>
						<p class="text-sm text-muted-foreground">{address.city}</p>
					{/each}
				{:else}
					<p class="text-gray-600">Aucune commande présente.</p>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>

<style lang="scss">
	.card {
		margin-top: 50px;
		margin-right: auto;
		margin-left: auto;
		width: 80vw;
	}

	.content-basic {
		.content-basic-wrapper {
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
