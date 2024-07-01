<script lang="ts">
	import { t, locale, locales, setLocale } from '$UITools/Translations/index';
	import * as Select from '$UITools/shadcn/select';
	import { onMount } from 'svelte';

	let selectedLangue: string | null = null;

	// Function to handle value change
	function handleValueChange(event: Event) {
		const target = event.target as HTMLInputElement;
		selectedLangue = target.value;

		document.cookie = `lang=${selectedLangue};`;

		setLocale(selectedLangue);
	}

	// Listen to the change event
	onMount(() => {
		const selectInput = document.querySelector('input[name="favoriteLang"]') as HTMLInputElement;
		if (selectInput) {
			selectInput.addEventListener('change', handleValueChange);
		}
	});
</script>

<div class="mx-2">
	<Select.Root portal={null}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder={$t('general.language')} />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>{$t('general.language')}</Select.Label>
				{#each $locales as value}
					<Select.Item {value} label={value}>{value}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="favoriteLang" />
	</Select.Root>
</div>
