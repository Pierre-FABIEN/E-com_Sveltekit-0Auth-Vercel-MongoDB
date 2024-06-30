<script lang="ts">
	import { t, locale, locales } from '$UITools/Translations/index';
	import * as Select from '$UITools/shadcn/select';
	import { onMount } from 'svelte';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];

	let selectedLangue: string | null = null;

	// Function to handle value change
	function handleValueChange(event: Event) {
		const target = event.target as HTMLInputElement;
		selectedLangue = target.value;
		console.log(`Selected fruit: ${selectedLangue}`);
		document.cookie = `lang=${selectedLangue};`;
		location.reload();
	}

	// Listen to the change event
	onMount(() => {
		const selectInput = document.querySelector('input[name="favoriteFruit"]') as HTMLInputElement;
		if (selectInput) {
			selectInput.addEventListener('change', handleValueChange);
		}

		console.log($locale, 'locale');
		console.log($locales, 'locales');
	});
</script>

<Select.Root portal={null}>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder={$t('data.language')} />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{$t('data.language')}</Select.Label>
			{#each $locales as value}
				<Select.Item {value} label={value}>{value}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="favoriteFruit" />
</Select.Root>
