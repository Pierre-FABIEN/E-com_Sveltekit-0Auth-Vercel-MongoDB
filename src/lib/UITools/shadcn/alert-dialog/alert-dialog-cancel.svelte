<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { buttonVariants } from '$shadcn/button/index.js';
	import { cn } from '$lib/utils/TailwindUtils.js';

	type $$Props = AlertDialogPrimitive.CancelProps;
	type $$Events = AlertDialogPrimitive.CancelEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<AlertDialogPrimitive.Cancel
	class={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
	{...$$restProps}
	on:click
	on:keydown
	let:builder
>
	<slot {builder} />
</AlertDialogPrimitive.Cancel>
