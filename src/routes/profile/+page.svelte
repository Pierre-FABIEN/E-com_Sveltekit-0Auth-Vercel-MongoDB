<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import * as Card from '$UITools/shadcn/card';
	import { Label } from '$UITools/shadcn/label';
	import * as Select from '$UITools/shadcn/select';
	import { Button } from '$UITools/shadcn/button';
	import { Textarea } from '$UITools/shadcn/textarea';
	import { Input } from '$UITools/shadcn/input';

	export let data: PageData;

	const areas = [
		{ value: 'team', label: 'Team' },
		{ value: 'billing', label: 'Billing' },
		{ value: 'account', label: 'Account' },
		{ value: 'deployments', label: 'Deployments' },
		{ value: 'support', label: 'Support' }
	];

	const securityLevels = [
		{ value: '1', label: 'Severity 1 (Highest)' },
		{ value: '2', label: 'Severity 2' },
		{ value: '3', label: 'Severity 3' },
		{ value: '4', label: 'Severity 4 (Lowest)' }
	];

	onMount(() => {
		console.log(data);
	});
</script>

<div class="card">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Information sur votre profil</Card.Title>
			<Card.Description>Vous ne pouvez pas modifier les informations compte google</Card.Description
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

			<div class="grid gap-2">
				<Label for="adress">adress</Label>
				<Input id="adress" placeholder="I need help with..." />
			</div>
			<div class="grid gap-2">
				<Label for="city">city</Label>
				<Input id="city" placeholder="I need help with..." />
			</div>
			<div class="grid gap-2">
				<Label for="postalcode">postalcode</Label>
				<Input id="postalcode" placeholder="I need help with..." />
			</div>
			<div class="grid gap-2">
				<Label for="phone">phone</Label>
				<Input id="phone" placeholder="I need help with..." />
			</div>
		</Card.Content>
		<Card.Footer class="justify-between space-x-2">
			<Button variant="ghost">Cancel</Button>
			<Button>Submit</Button>
		</Card.Footer>
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
