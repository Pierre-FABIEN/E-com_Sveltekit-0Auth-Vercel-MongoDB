<!-- src/routes/dashboard/produits/+page.svelte -->
<script lang="ts">
	import { superForm, filesProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { schema } from '$lib/schema';

	export let data;

	const { form, enhance, errors } = superForm(data.form, {
		validators: zodClient(schema)
	});

	const files = filesProxy(form, 'images');
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
	<input type="file" multiple name="images" accept="image/png, image/jpeg" bind:files={$files} />
	{#if $errors.images}<span>{$errors.images}</span>{/if}
	<button type="submit">Submit</button>
</form>
